import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIResponse = async (message: string, history: { text: string; isUser: boolean }[]) => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { 
        role: "user", 
        parts: [{ text: "You are FarmKit AI, a helpful agricultural assistant for farmers in Malawi. Provide practical, localized advice. Keep responses concise and helpful." }] 
      },
      ...history.map((m) => ({
        role: m.isUser ? "user" : "model",
        parts: [{ text: m.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ],
  });

  return response.text;
};
