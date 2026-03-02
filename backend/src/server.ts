import { buildApp } from "./app";
import { env } from "./config/env";

async function start() {
  const app = await buildApp();

  try {
    const port = Number(env.PORT);
    await app.listen({ port: port });
    console.log(`Server running on port: ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
