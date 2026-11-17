import { formatMealDate } from "../lib/meal-date";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { CreateMealFood, MealType } from "../types";

function addNutrients(total: Record<string, Prisma.InputJsonValue>, value: Prisma.JsonValue): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "number") {
      total[key] = (typeof total[key] === "number" ? total[key] : 0) + item;
    } else if (item && typeof item === "object" && !Array.isArray(item)) {
      const nested: Record<string, Prisma.InputJsonValue> =
        total[key] && typeof total[key] === "object" && !Array.isArray(total[key])
          ? { ...total[key] as Record<string, Prisma.InputJsonValue> }
          : {};
      addNutrients(nested, item);
      total[key] = nested;
    }
  }
}


export async function createMeal(
  userId: string,
  mealType: MealType,
  foods: CreateMealFood[],
) {
  const nutrients: Record<string, Prisma.InputJsonValue> = {};

  for (const food of foods) {
    addNutrients(nutrients, food.nutrients);
  }

  return prisma.meals.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },

      created_at: formatMealDate(new Date()),
      meal_type: mealType,
      calories_kcal: foods.reduce((sum, food) => sum + food.calories_kcal, 0),
      carbohydrates_g: foods.reduce(
        (sum, food) => sum + food.carbohydrates_g,
        0,
      ),
      protein_g: foods.reduce((sum, food) => sum + food.protein_g, 0),
      fat_g: foods.reduce((sum, food) => sum + food.fat_g, 0),
      fiber_g: foods.reduce((sum, food) => sum + food.fiber_g, 0),
      nutrients,

      meal_food: {
        create: foods.map((food) => ({
          food_id: food.food_id,
          name: food.name,
          weight_g: food.weight_g,
          calories_kcal: food.calories_kcal,
          carbohydrates_g: food.carbohydrates_g,
          protein_g: food.protein_g,
          fat_g: food.fat_g,
          fiber_g: food.fiber_g,
          nutrients: food.nutrients === null ? Prisma.JsonNull : food.nutrients,
        })),
      },
    },

    include: {
      meal_food: true,
    },
  });
}

export async function allMeals(userId: string) {
  console.log("Testando conexão com o banco...");
  await prisma.$queryRaw`SELECT 1`;
  console.log("Conexão OK. Buscando refeições...");

  const meals = await prisma.meals.findMany({
    where: {
      user_id: userId,
    },
    include: {
      meal_food: true,
    },
  });

  console.log("Refeições carregadas:", meals.length);
  return meals;
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
