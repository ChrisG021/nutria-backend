import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { FoodAnalysis, FoodAnalysisSchema } from "../types";
import "dotenv/config";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false,
  apiVersion: "v1beta",
});

export async function identifyFood(
  image: Buffer,
  mimeType: string,
): Promise<FoodAnalysis> {
  //Prompt to analyzer food image
  const response = await ai.interactions.create({
    model: "gemini-3.5-flash",

    input: [
      {
        type: "text",
        text: `
          Identifique os alimentos visíveis na imagem.
          Retorne os nomes em português de maneira sucinta e direta ex:arroz,frango grelhado, etc  e a possivel peso visivel em gramas.
          Não invente alimentos ou ingredientes invisíveis.
          Se não houver alimentos, retorne uma lista vazia.
        `,
      },
      {
        type: "image",
        data: image.toString("base64"),
        mime_type: mimeType,
      },
    ],

    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(FoodAnalysisSchema),
    },
  });

  if (!response.output_text) {
    throw new Error("Empty response from Gemini");
  }

  return FoodAnalysisSchema.parse(JSON.parse(response.output_text));
}
