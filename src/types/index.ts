import { z } from "zod";
import type { Prisma } from "../generated/prisma/client";

export const FoodAnalysisSchema = z.object({
  foods: z.array(
    z.object({
      name: z.string(),
      weight: z.number(),
    })
  ),
});

export type FoodAnalysis = z.infer<typeof FoodAnalysisSchema>;

export type MealFood = {
  food_id: number;
  name: string;
  weight_g: number;
  calories_kcal: number;
  carbohydrates_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  nutrients: Prisma.JsonValue;
};

export enum MealType {
  BREAKFAST = "cafe_da_manha",
  LUNCH = "almoco",
  SNACK = "lanche",
  DINNER = "jantar",
  SUPPER = "ceia",
}

export type CreateMealFood = Pick<
  MealFood,
  | "food_id"
  | "name"
  | "weight_g"
  | "calories_kcal"
  | "carbohydrates_g"
  | "protein_g"
  | "fat_g"
  | "fiber_g"
  | "nutrients"
>;
