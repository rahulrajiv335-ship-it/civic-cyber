
import { GoogleGenAI, Type } from "@google/genai";
import { IssueType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AIAnalysisResult {
  issueType: IssueType;
  description: string;
  severity: number;
  tags: string[];
}

export const analyzeCivicIssue = async (base64Image: string): Promise<AIAnalysisResult> => {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze this photo of a civic issue. Identify the type of problem, describe it for a maintenance worker, and rate its severity from 1 to 5 (1 being minor, 5 being critical/dangerous).",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          issueType: {
            type: Type.STRING,
            description: "The category: pothole, garbage, water leak, streetlight, drainage, or other",
          },
          description: {
            type: Type.STRING,
            description: "A concise description of the problem detected",
          },
          severity: {
            type: Type.NUMBER,
            description: "Severity score from 1 to 5",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Relevant keywords like 'hazardous', 'obstruction', etc.",
          }
        },
        required: ["issueType", "description", "severity"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text);
};
