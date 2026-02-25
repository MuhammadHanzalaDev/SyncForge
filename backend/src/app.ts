import fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes";
import errorHandler from "./plugins/errorHandler.plugin";
import { ApiError } from "@/utils/Error";

export function buildApp() {
  const app = fastify();

  // Error Handler
  app.register(errorHandler);

  app.get("/test", async (request, reply) => {
    throw new ApiError("Testing Error Message", 499);
  });

  app.register(routes, { prefix: "/api/v1" });


  return app;
}
