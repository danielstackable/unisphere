import { GoogleGenerativeAI } from "@google/generative-ai";
import { University, UniversityDetails, GroundingSource, ProgramDetails, Program } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || "";

export class GeminiService {
  private static genAI = new GoogleGenerativeAI(API_KEY);

  static async searchUniversities(query: string): Promise<University[]> {
    console.log("Using Standard SDK: @google/generative-ai");
    if (!API_KEY) {
      console.error("CRITICAL ERROR: VITE_GEMINI_API_KEY is missing.");
      throw new Error("API Key missing");
    }

    try {
      // Use the standard model alias
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Search for universities based on the query: "${query}". Return a JSON array of 5 universities with their name, location, country, type (Public/Private), and a one-sentence classification category. 
      Output strictly valid JSON.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      let text = response.text();
      console.log("Extracted Text:", text);

      // Clean markdown code blocks if present
      text = text.replace(/```json\n?|```/g, '').trim();

      if (!text) throw new Error("Empty response from AI");

      try {
        const parsed = JSON.parse(text);
        return parsed.map((u: any, idx: number) => ({
          ...u,
          id: `${Date.now()}-${idx}`
        }));
      } catch (e) {
        console.error("Parse Error", e);
        throw new Error(`Failed to parse: ${text.substring(0, 50)}...`);
      }

    } catch (error: any) {
      console.error("Gemini Search Failed:", error);
      throw error;
    }
  }

  static async getUniversityDetails(universityName: string): Promise<UniversityDetails | null> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Provide deep insights for the university "${universityName}". Include description, website, worldRanking (number), and programs (array of objects with name, degree, faculty, duration, tuitionEstimate).
      Output strictly valid JSON.`;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text().replace(/```json\n?|```/g, '').trim());

      return {
        ...data,
        id: universityName,
        sources: [] // Grounding not supported in standard tier easily, returning empty for now
      };
    } catch (e) {
      console.error("Failed to get details", e);
      return null;
    }
  }

  static async getProgramDetails(universityName: string, program: Program): Promise<ProgramDetails | null> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Analyze "${program.name}" at "${universityName}". Return JSON with overview, curriculum (array), careerProspects (array), admissionRequirements (array).`;

      const result = await model.generateContent(prompt);
      const details = JSON.parse(result.response.text().replace(/```json\n?|```/g, '').trim());

      return {
        ...program,
        ...details
      };
    } catch (e) {
      console.error("Failed to get program details", e);
      return null;
    }
  }

  static async getMapsInfo(universityName: string, userLocation?: { lat: number; lng: number }) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // No 8b available usually, stick to flash
      const result = await model.generateContent(`Where is ${universityName}? Return a short address string.`);
      return {
        text: result.response.text(),
        mapUrl: null
      };
    } catch (e) {
      return { text: "Location unavailable", mapUrl: null };
    }
  }
}
