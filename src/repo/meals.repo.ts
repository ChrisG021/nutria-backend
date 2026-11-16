import { prisma } from "../lib/prisma";
import { CreateMealFood, MealFood, MealType } from "../types";


export async function createMeal(
  userId: string,
  mealType: MealType,
  foods: CreateMealFood[]
) {
  return prisma.meals.create({
    data: {
      user_id: userId,
      meal_type: mealType,

      meal_food: {
        create: foods.map((food) => ({
          food_id: food.food_id,
          name: food.name,
          weight_g: food.weight_g,
          calories_kcal: food.calories_kcal,
          carbohydrates_g: food.carbohydrates_g,
          protein_g: food.protein_g,
          fat_g: food.fat_g,
        })),
      },
    },

    include: {
      meal_food: true,
    },
  });
}

export async function allMeals(userId: string) {
  return prisma.meals.findMany({
    where: {
      user_id: userId,
    },
    include: {
      meal_food: true,
    },
  });
}

export async function  findMeal(id:string){
return prisma.meals.findUnique({
      where: {
        id: id,
      },
      include: {
        meal_food: true,
      },
    })
}