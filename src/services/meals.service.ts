import { FastifyInstance } from "fastify";
import { allMeals, createMeal } from "../repo/meals.repo";
import { CreateMealFood, MealType } from "../types";

export class MealsService {
  constructor(private readonly app: FastifyInstance) {}

  public async setMeal(
    userId: string,
    mealType: MealType,
    data: CreateMealFood[]
  ): Promise<Awaited<ReturnType<typeof createMeal>>> {
    return createMeal(userId, mealType, data);
  }

  public async getMeals(userId:string){
    return await allMeals(userId);
  }
}
