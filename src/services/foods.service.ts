import type { FastifyInstance } from "fastify";
import type { Prisma } from "../generated/prisma/client";
import { allFoods, getByCode, searchFoodByName } from "../repo/foods.repo";
import type { FoodAnalysis } from "../types";

const foodMetadata = new Set([
  "catalogo",
  "referencia",
  "nome_normalizado",
  "variantes_origem",
  "porcao_referencia_g",
  "nome_referencia_original",
  "referencia_representativa",
  "registro_nutricional_original_id",
]);

function scaleNutrients(
  value: Prisma.JsonValue,
  factor: number,
): Prisma.JsonValue {
  if (typeof value === "number") return value * factor;
  if (Array.isArray(value))
    return value.map((item) => scaleNutrients(item, factor));
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).filter(([key]) => !foodMetadata.has(key)).map(([key, item]) => [
        key,
        scaleNutrients(item ?? null, factor),
      ]),
    );
  }
  return value;
}

class FoodService {
  constructor(private readonly app: FastifyInstance) {}

  public getFoods() {
    return allFoods();
  }

  public getFoodByCode(code: number) {
    return getByCode(code);
  }

  public async getNutrientsPerMeal(foods: FoodAnalysis["foods"]) {
    const results = await Promise.all(
      foods.map(async ({ name, weight }) => {
        const candidate = await searchFoodByName(name);
        if (!candidate) return undefined;

        const factor = weight / 100;
        return {
          food_id: candidate.taco_code,
          name: candidate.name,
          weight_g: weight,
          calories_kcal: Number(candidate.calories_kcal) * factor,
          carbohydrates_g: Number(candidate.carbohydrates_g) * factor,
          fat_g: Number(candidate.fat_g) * factor,
          protein_g: Number(candidate.protein_g) * factor,
          fiber_g: Number(candidate.fiber_g) * factor,
          nutrients: scaleNutrients(candidate.nutrients, factor),
        };
      }),
    );

    return results.filter((food) => food !== undefined);
  }
}

export default FoodService;
