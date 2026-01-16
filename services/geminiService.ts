
import { GoogleGenAI, Type } from "@google/genai";
import { University, UniversityDetails, GroundingSource, ProgramDetails, Program } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || "";

export class GeminiService {
  private static ai = new GoogleGenAI({ apiKey: API_KEY });

  static async searchUniversities(query: string): Promise<University[]> {
    if (!API_KEY) {
      console.error("CRITICAL ERROR: VITE_GEMINI_API_KEY is missing. Please check your Netlify Environment Variables.");
      throw new Error("API Key missing");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash-001",
        contents: `Search for universities based on the query: "${query}". Return a JSON array of 5 universities with their name, location, country, type (Public/Private), and a one-sentence classification category.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                country: { type: Type.STRING },
                type: { type: Type.STRING },
                classification: { type: Type.STRING },
                description: { type: Type.STRING },
                website: { type: Type.STRING }
              },
              required: ["name", "location", "country", "type", "classification"]
            }
          },
          tools: [{ googleSearch: {} }]
        }
      });
      console.log("Gemini Raw Response:", response);

      const rawText = typeof response.text === 'function' ? response.text() : response.text;
      console.log("Extracted Text:", rawText);

      return JSON.parse(rawText || "[]").map((u: any, idx: number) => ({
        ...u,
        id: `${Date.now()}-${idx}`
      }));
    } catch (error: any) {
      console.error("Gemini Search Failed:", error);
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        console.warn("Attempting to list available models...");
        try {
          // @ts-ignore
          const models = await this.ai.models.list();
          console.log("=== AVAILABLE MODELS ===", models);
        } catch (e) {
          console.error("Failed to list models:", e);
        }
      }
      return [];
    }


  }

  static async getUniversityDetails(universityName: string): Promise<UniversityDetails | null> {
    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: `Provide deep insights for the university "${universityName}". Include its full description, website, world ranking (if available), and a list of 6-8 popular programs across different faculties with degree type, duration, and tuition estimate. Also include classification categories like "Ivy League", "Research Intensive", "Art-focused", etc.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            location: { type: Type.STRING },
            country: { type: Type.STRING },
            type: { type: Type.STRING },
            worldRanking: { type: Type.NUMBER },
            description: { type: Type.STRING },
            website: { type: Type.STRING },
            classification: { type: Type.STRING },
            programs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  faculty: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  tuitionEstimate: { type: Type.STRING }
                }
              }
            }
          }
        },
        tools: [{ googleSearch: {} }]
      }
    });

    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Reference",
        uri: chunk.web?.uri
      })).filter((s: any) => s.uri) || [];

    try {
      const data = JSON.parse(response.text || "{}");
      return {
        ...data,
        id: universityName,
        sources
      };
    } catch (e) {
      console.error("Failed to parse university details", e);
      return null;
    }
  }

  static async getProgramDetails(universityName: string, program: Program): Promise<ProgramDetails | null> {
    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: `Analyze the "${program.name}" program at "${universityName}". Provide a detailed overview, 5-6 core curriculum modules, 4-5 career prospects, and 3-4 standard admission requirements.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            curriculum: { type: Type.ARRAY, items: { type: Type.STRING } },
            careerProspects: { type: Type.ARRAY, items: { type: Type.STRING } },
            admissionRequirements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    try {
      const details = JSON.parse(response.text || "{}");
      return {
        ...program,
        ...details
      };
    } catch (e) {
      console.error("Failed to parse program details", e);
      return null;
    }
  }

  static async getMapsInfo(universityName: string, userLocation?: { lat: number; lng: number }) {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    }

    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash-8b",
      contents: `Where exactly is ${universityName} located? Give me a brief address and mention nearby landmarks.`,
      config
    });

    const mapSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.maps?.uri)
      .filter((uri: string) => uri) || [];

    return {
      text: response.text,
      mapUrl: mapSources[0] || null
    };
  }
}
