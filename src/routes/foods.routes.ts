import { FastifyInstance } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import { identifyFood } from "../services/gemini.service";

export async function FoodRoutes(app: FastifyInstance) {
  //Food routes with image analyzer and nutrients counter

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
      foods: {
        name: string;
        weight: number;
      }[];
    };
  }>("/nutrients", (request, reply) => {
    const foods  = request.body.foods;
    

    return reply.code(200).send({message:"ok"})
  });
}
