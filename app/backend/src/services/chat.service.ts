import { hashMessage } from "../lib/hash";
import { messageRepo } from "../repositories/message.repository";
import { taskRepo } from "../repositories/task.repository";
import { commandExecutor } from "./command.handler";
import { callLLM } from "./llm.service";

import { Tool } from "@google/generative-ai";

interface CreateTasksArgs {
    titles: string[];
}

interface CompleteTasksArgs {
    ids: string[];
}

interface AppendDetailArgs {
    taskId: string;
    content: string;
}

export async function handleChat(userMessage: string) {
    const messageHash = hashMessage(userMessage);

    // S2: Idempotency Check
    const existing = await messageRepo.findByHash(messageHash);
    if (existing) {
        return { reply: "Duplicate message ignored (idempotent)." };
    }

    // S3 & S4: Small task-set assumption & context
    const tasks = await taskRepo.list();
    const formattedTasks = tasks
        .map((t: any) => `ID: ${t.id} | Status: ${t.status} | Title: ${t.title}`)
        .join("\n");

    const messages = [
        {
        role: "user",
        parts: [{
            text: `You are an AI task assistant. 
            Current tasks:\n${formattedTasks}\n
            User message: ${userMessage}`
        }]
        }
    ];

    const tools: Tool[] = [
        {
            functionDeclarations: [
                {
                name: "create_tasks",
                description: "Create one or multiple tasks",
                parameters: {
                    type: "object" as any, // Cast strings to 'any' if the SDK is picky about 'object' vs 'string'
                    properties: {
                    titles: {
                        type: "array" as any,
                        items: { type: "string" as any }
                    }
                    },
                    required: ["titles"]
                }
                },
                {
                    name: "append_detail",
                    description: "Add notes, specific items, or details to an existing task. Use this when the user says 'For the [task]...', 'Add a note to...', or provides more info about a task in the list.",
                    parameters: {
                    type: "object" as any,
                    properties: {
                        taskId: { type: "string" as any, description: "The ID from the current task list" },
                        content: { type: "string" as any, description: "The detail text to append" }
                    },
                    required: ["taskId", "content"]
                    }
                },
                {
                    name: "complete_tasks",
                    description: "Mark tasks as done. Match based on the provided task list.",
                    parameters: {
                    type: "object" as any,
                    properties: { ids: { type: "array" as any, items: { type: "string" as any } } },
                    required: ["ids"]
                    }
                },
            ]
        }
    ];

    const response = await callLLM(messages, tools);

    // Extract function call
    const functionCall = response.candidates?.[0]?.content?.parts?.find(
        (p: any) => p.functionCall
    )?.functionCall;

    if (!functionCall) {
        // Use a fallback check for the text() function
        const replyText = typeof response.text === 'function' 
            ? response.text() 
            : "I'm not sure how to help with that.";
        return { reply: replyText };
    }

    const { name, args } = functionCall;

    switch (name) {
        case "create_tasks": {
            const { titles } = args as unknown as CreateTasksArgs;
            await commandExecutor.createTasks(titles);
            break;
        }

        case "complete_tasks": {
            const { ids } = args as unknown as CompleteTasksArgs;
            await commandExecutor.completeTasks(ids);
            break;
        }

        case "append_detail": {
            const { taskId, content } = args as unknown as AppendDetailArgs;
            await commandExecutor.appendDetail(taskId, content, messageHash);
            break;
        }
        
        default:
        return { reply: "Unknown action requested." };
    }

    await messageRepo.save(messageHash, userMessage);

    return { reply: `Successfully executed: ${name.replace('_', ' ')}` };
}
