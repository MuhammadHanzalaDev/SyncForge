import fastify from "fastify";
import "dotenv/config";
import routes from "./routes";
import mainPlugin from "@/plugins/index";

export async function buildApp() {
  const app = fastify();

  // Error Handler
  await app.register(mainPlugin);

  await app.register(routes, { prefix: "/api/v1" });

  return app;
}
