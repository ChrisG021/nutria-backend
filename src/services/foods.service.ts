import { FastifyInstance } from "fastify";
import { FoodAnalysis } from "../types";
import { allFoods, getByCode, searchFoodByName } from "../repo/foods.repo";
import { foods } from "../generated/prisma/client";

class FoodService {
  constructor(private readonly app: FastifyInstance) {}

  private async searchSimilarFood(food: string) {
    const candidate = await searchFoodByName(food);
    if (!candidate) {
      console.log("Alimento não encontrado");
      return;
    }

    return candidate;
  }

  public getFoods() {
    return allFoods();
  }

  public getFoodByCode(code:number) {
    return getByCode(code);
  }

  public async getNutrientsPerMeal(foods: FoodAnalysis["foods"]) {
    const results = await Promise.all(
      foods.map(async (food) => {
        const candidate = await this.searchSimilarFood(food.name);
        if (!candidate) return;

        const macroNutrients = {
          calories: (Number(candidate.calories_kcal) * food.weight) / 100,
          carbohydrates:
            (Number(candidate.carbohydrates_g) * food.weight) / 100,
          fats: (Number(candidate.fat_g) * food.weight) / 100,
          proteins: (Number(candidate.protein_g) * food.weight) / 100,
        };

        return {
          name: candidate.name,
          weight: food.weight,
          macroNutrients,
        };
      }),
    );

    return results;
  }
}

export default FoodService;
