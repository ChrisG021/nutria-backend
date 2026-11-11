import { z } from "zod";

export const FoodAnalysisSchema = z.object({
  foods: z.array(
    z.object({
      name: z.string(),
      weight: z.number(),
    })
  ),
});

export type FoodAnalysis = z.infer<typeof FoodAnalysisSchema>;
