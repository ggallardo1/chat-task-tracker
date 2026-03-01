import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the version globally if possible, or omit the second arg in getGenerativeModel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const callLLM = async (messages: any[], tools: any[]) => {
  try {
    // FIX: Use the most standard identifier. 
    // If 'latest' fails, 'gemini-1.5-flash' is the fallback.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "user" ? "user" : "model", // SDK expects 'model', not 'assistant'
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
