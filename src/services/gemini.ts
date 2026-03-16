import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateResponse = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are JARVIS, a private AI assistant. Be concise, professional, and helpful.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to Brain. Please check logs.";
  }
};

export const chatWithJarvis = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are JARVIS, a private AI assistant. You have access to local tools and private data. Maintain a professional, 'Butler-like' persona.",
      },
    });
    
    // Note: sendMessage only accepts the message string in this SDK version
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Brain synchronization failed.";
  }
};
