import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { databaseConfig } from "./database-config";
const globalDb = globalThis as unknown as { portfolioDb?: PrismaClient };
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  if (!globalDb.portfolioDb)
    globalDb.portfolioDb = new PrismaClient({
      adapter: new PrismaPg({
        ...databaseConfig(process.env.DATABASE_URL),
        max: 5,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
      }),
    });
  return globalDb.portfolioDb;
}
