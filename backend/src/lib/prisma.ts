import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../config/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 10,
});

pool.on("error", (err) => {
  console.error("Unexpected idle client error:", err);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export async function assertDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

export default prisma;
