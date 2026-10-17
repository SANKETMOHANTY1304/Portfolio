import "server-only";
import { unstable_cache } from "next/cache";
import { fallbackPortfolio } from "@/content/portfolio";
import { publishedPortfolio } from "@/lib/content-schema";
import { readPortfolio } from "@/server/repositories/content";
const getDatabasePortfolio = unstable_cache(
  async () => publishedPortfolio(await readPortfolio()),
  ["public-portfolio-db-v1"],
  { tags: ["portfolio"], revalidate: 60 },
);
export async function getPortfolio() {
  return process.env.DATABASE_URL ? getDatabasePortfolio() : fallbackPortfolio;
}
