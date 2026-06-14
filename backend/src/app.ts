import fastify from "fastify";
import "dotenv/config";
import routes from "./routes";
import mainPlugin from "@/plugins/index";

export async function buildApp() {
  const app = fastify();

  // Error Handler
  app.register(mainPlugin);

  app.register(routes, { prefix: "/api/v1" });
  app.get("/test", async () => {
    return { message: "Hello World" };
  });

  return app;
}
