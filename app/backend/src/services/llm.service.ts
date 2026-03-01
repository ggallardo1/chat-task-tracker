import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const callLLM = async (messages: any[], tools: any[]) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        //const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
        const chat = model.startChat({
            history: messages.slice(0, -1).map(m => ({
                role: m.role === "user" ? "user" : "model",
                parts: m.parts
            })),
            tools: tools
        });

        const lastMessage = messages[messages.length - 1].parts[0].text;
        const result = await chat.sendMessage(lastMessage);
    
        return result.response;
    } catch (error: any) {
        console.error("Gemini Details:", error.message);
        return {
        text: () => "AI is currently unavailable. Check backend logs.",
        candidates: []
        };
    }
};
