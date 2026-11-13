import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { FoodAnalysis, FoodAnalysisSchema } from "../types";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false,
  apiVersion: "v1beta",
});

// Configuração de modelos e tentativas
const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash"];
const MAX_RETRIES = 3;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Identifica erros temporários da API
function isRetryable(error: unknown): boolean {
  const err = error as {
    status?: number | string;
    code?: number | string;
    message?: string;
  };

  const status = Number(err?.status ?? err?.code);

  return (
    [429, 500, 502, 503, 504].includes(status) ||
    /\b(429|500|502|503|504)\b|high demand|overloaded|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(
      err?.message ?? ""
    )
  );
}

export async function identifyFood(
  image: Buffer,
  mimeType: string,
): Promise<FoodAnalysis> {
  let lastError: unknown;

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await ai.interactions.create({
          model,

          input: [
            {
              type: "text",
              text: `
              Identifique exclusivamente os alimentos visíveis na imagem e retorne uma lista objetiva contendo o nome de cada alimento em português e uma estimativa de seu peso visível em gramas.

              **Regras:**
              1. **Precisão:** Identifique os alimentos da forma mais específica possível, desde que suas características visuais permitam essa identificação. Por exemplo, prefira "contrafilé" ou "picanha" em vez de apenas "bife", e "batata inglesa" em vez de apenas "batata frita".
              2. **Simplicidade:** Para alimentos comuns, utilize nomes curtos e diretos, como "arroz", "feijão", "tomate" ou "frango". Não acrescente descrições desnecessárias.
              3. **Fidelidade visual:** Não invente alimentos, ingredientes, cortes ou variedades que não possam ser identificados visualmente. Não especifique características quando não houver evidências suficientes na imagem.
              4. **Peso:** Informe o peso aproximado, em gramas, de cada alimento visível.
              5. **Objetividade:** Retorne somente os nomes dos alimentos e seus respectivos pesos, sem explicações, comentários ou informações adicionais.
              6. quando for carnes bovinas preciso que especifique o corte, sem generalizacao como bife bovino, e sim contrafile ou coixao mole por exemplo
              7. para alimentos processado me indique a materia-prima base, ao inves de simplesmente batata frita coloque batata por exemplo, se for inglesa trocar para batata inglesa
              
              - arroz: 100 g
              - feijão: 80 g
              - contrafilé: 150 g
              - tomate: 30 g

              Os nomes e pesos apresentados são apenas exemplos. A resposta deve considerar exclusivamente os alimentos realmente visíveis na imagem analisada.
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

        return FoodAnalysisSchema.parse(
          JSON.parse(response.output_text)
        );

      } catch (error) {
        if (!isRetryable(error)) {
          throw error;
        }

        lastError = error;

        console.warn(
          `[Gemini] ${model} falhou. Tentativa ${attempt}/${MAX_RETRIES}`
        );

        if (attempt < MAX_RETRIES) {
          const delay =
            1000 * 2 ** (attempt - 1) +
            Math.random() * 500;

          await sleep(delay);
        }
      }
    }

    console.warn(
      `[Gemini] ${model} indisponível. Tentando próximo modelo...`
    );
  }

  throw lastError ?? new Error("All Gemini models failed");
}