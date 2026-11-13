import { prisma } from "../lib/prisma";
import { FoodAnalysis } from "../types";

export async function searchFoodByName(food: string) {
  const name = food.trim();

  if (!name) return null;

  //try take the exactly food registered in the database
  const foundFirst = await prisma.foods.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  return foundFirst;
}

export async function getByCode(code:number) {
  return prisma.foods.findUnique({
    where:{
      taco_code:code
    }
  });
}
export async function allFoods() {
  return prisma.foods.findMany();
}