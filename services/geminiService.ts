
import { GoogleGenAI } from "@google/genai";
import { MatchUpdate } from "../types";

export const getLiveMatchData = async (query: string): Promise<MatchUpdate> => {
  // Use the API key exclusively from process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a high-speed sports data reporter. Search for the latest LIVE scores for: ${query}. 
      
      If this is a generic request for World Cup or major matches, focus on the most high-profile ongoing international matches (like World Cup Qualifiers, Euro, Copa America, or major league finals).
      
      For each match found, format it exactly like this:
      [TEAM A] vs [TEAM B]
      Score: [Score A] - [Score B]
      Status: [e.g. 75', Half-time, Full-time]
      Summary: [Brief 1-sentence key event]
      
      Use bold for team names and scores. Ensure the information is the absolute latest available from the web.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const content = response.text || "No live match data found at the moment.";
    // Cast groundingChunks to avoid type compatibility errors between the SDK and local types
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[]) || [];

    return {
      content,
      sources,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};