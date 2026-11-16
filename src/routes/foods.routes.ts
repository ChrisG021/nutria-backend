import { FastifyInstance } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import { identifyFood } from "../services/gemini.service";
import FoodService from "../services/foods.service";
import { MealsService } from "../services/meals.service";
import { MealType } from "../types";

export async function FoodRoutes(app: FastifyInstance) {
  //Food routes with image analyzer and nutrients counter
  const service = new FoodService(app);
  const mealsServices = new MealsService(app);
  app.get("/", async (request, reply) => {
    const result = await service.getFoods();

    return reply.code(200).send({ result });
  });

  app.get<{ Params: { code: string } }>("/:code", async (request, reply) => {
    const code = Number(request.params.code);

    if (!Number.isInteger(code) || code <= 0) {
      return reply.code(400).send({ error: "Invalid food code" });
    }

    const result = await service.getFoodByCode(code);

    if (!result) {
      return reply.code(404).send({ error: "Food not found" });
    }

    return reply.code(200).send({ result });
  });

  app.post("/analyzer", async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({
        error: "No image uploaded",
      });
    }
    const image = await file.toBuffer();

    const detectedType = await fileTypeFromBuffer(image);

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
      return reply.status(415).send({
        error: "Unsupported file type",
      });
    }

    console.log("\x1b[32m", "IMAGEM ENVIADA PARA O GEMINI", "\x1b[0m");
    const analysis = await identifyFood(image, detectedType.mime);

    return {
      message: "Image uploaded",
      size: image.length,
      analysis,
    };
  });

  app.post<{
    Body: {
      userId: string;
      mealType: MealType;
      foods: {
        name: string;
        weight: number;
      }[];
    };
  }>("/nutrients", async (request, reply) => {
    const { userId, mealType, foods } = request.body;

    const result = await service.getNutrientsPerMeal(foods);

    const meal = await mealsServices.setMeal(
      userId,
      mealType,
      result
    );

    return reply.code(200).send({
      meal,
    });
  });
}