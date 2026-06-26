import { buildApp } from "./app";
import { env } from "./config/env";
import { assertDbConnection } from "./lib/prisma";

async function start() {
  const app = await buildApp();

  try {
    const port = Number(env.PORT);
    await assertDbConnection();
    await app.listen({ port: port, host: "0.0.0.0" });
    console.log(`Server running on port: ${port}`);
  } catch (err) {
    console.error("CRASHED:", err);
    process.exit(1);
  }
}

start();
