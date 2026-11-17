import { FastifyInstance } from "fastify";
import { allMeals, createMeal, findMeal } from "../repo/meals.repo";
import { CreateMealFood, MealType } from "../types";

export { formatMealDate } from "../lib/meal-date";

export class MealsService {
  constructor(private readonly app: FastifyInstance) { }

  public async setMeal(
    userId: string,
    mealType: MealType,
    data: CreateMealFood[]
  ) {
    return createMeal(userId, mealType, data);
  }

  public async getMeals(userId: string) {
    return allMeals(userId);
  }

  public async getMealById(mealId: string) {
    return findMeal(mealId);
  }

}
