import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { FoodRoutes } from "./routes/foods.routes";

//Initialized app with your depedencies,routes and settings
export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(fastifyCors, {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  await app.register(fastifyMultipart,{
    limits:{
        fileSize:10 * 1024 * 1024,
    }
  })

  //++++++++++++++++++++ ROTAS ++++++++++++++++++++++
  app.register(FoodRoutes,{prefix:"foods"});

  app.get("/health", async () => {
    return {
      status: "healthful",
    };
  });
  
  return app;

}

