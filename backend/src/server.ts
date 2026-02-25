import { buildApp } from "./app";

async function start() {
  const app = buildApp();

  try {
    const port = Number(process.env.PORT || 5000);
    await app.listen({ port: port });
    console.log(`Server running on port: ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
