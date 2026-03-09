import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `You are FarmKit AI, a highly specialized agricultural assistant for farmers in Malawi. 
Your goal is to provide practical, localized, and actionable advice.

RESPONSE STRUCTURE GUIDELINES:
1. **Clarity First**: Use clear headings and short paragraphs.
2. **Actionable Steps**: Always provide numbered lists for processes (e.g., planting, pest control).
3. **Bullet Formatting**: Use bullet points for lists of requirements, tools, or symptoms.
4. **Localized Context**: Mention Malawian context where relevant (e.g., specific regions, MK currency, local crop varieties like MH18 maize).
5. **Formatting**: Use bold text for key terms and warnings.

Example Structure:
### [Topic Title]
[Brief overview paragraph]

**Key Requirements:**
* Item 1
* Item 2

**Action Steps:**
1. Step one...
2. Step two...

**Expert Tip:** [A short piece of localized wisdom]`;

export const generateAIResponse = async (message: string, history: { text: string; isUser: boolean }[]) => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    contents: [
      ...history.map((m) => ({
        role: m.isUser ? "user" : "model",
        parts: [{ text: m.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ],
  });

  return response.text;
};
