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
      const prompt = `Search for universities based on the query: "${query}". Return a JSON array of 5 universities with their name, location, country, type (Public/Private), and a one-sentence classification category. 
      Output strictly valid JSON.`;

      let result;
      let usedModel = "gemini-2.5-flash";

      try {
        const model = this.genAI.getGenerativeModel({ model: usedModel });
        result = await model.generateContent(prompt);
      } catch (flashError: any) {
        // If Rate Limit (429), do NOT try fallback (it shares quota usually)
        if (flashError.message?.includes("429") || flashError.message?.includes("Quota")) {
          throw new Error("Global repository is busy (Rate Limit). Please wait 30-60 seconds and try again.");
        }

        console.warn("Gemini 2.5 Flash failed, falling back to Gemini 2.0 Flash...", flashError);
        usedModel = "gemini-2.0-flash";
        const model = this.genAI.getGenerativeModel({ model: usedModel });
        result = await model.generateContent(prompt);
      }

      console.log(`Success with model: ${usedModel}`);
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Where is "${universityName}"? Return strictly valid JSON with:
      - address: (string, short address)
      - coordinates: { lat: (number), lng: (number) }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n?|```/g, '').trim();
      const data = JSON.parse(text);

      let mapUrl = null;
      if (data.coordinates?.lat && data.coordinates?.lng) {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${data.coordinates.lat},${data.coordinates.lng}`;
      } else if (data.address) {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
      }

      return {
        text: data.address || "Address unavailable",
        mapUrl: mapUrl
      };
    } catch (e: any) {
      if (e.message?.includes("429") || e.message?.includes("Quota")) {
        console.warn("Map Info Rate Limit");
        return { text: "Location unavailable (Rate Limit)", mapUrl: null };
      }
      console.error("Map Info Error", e);
      return { text: "Location unavailable", mapUrl: null };
    }
  }
}
