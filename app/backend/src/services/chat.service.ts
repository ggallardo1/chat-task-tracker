import { hashMessage } from "../lib/hash";
import { messageRepo } from "../repositories/message.repository";
import { taskRepo } from "../repositories/task.repository";
import { commandExecutor } from "./command.handler";
import { callLLM } from "./llm.service";

import { Tool } from "@google/generative-ai";

// 1. Define Argument Interfaces to fix TS2339
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
        // ... rest of your tool declarations ...
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

  // 2. Use Type Casting to satisfy the compiler
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

  // S2: Finalize idempotency record
  await messageRepo.save(messageHash, userMessage);

  return { reply: `Successfully executed: ${name.replace('_', ' ')}` };
}
