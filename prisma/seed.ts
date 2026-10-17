import "dotenv/config";
import { seedPortfolio } from "../src/content/portfolio";
import { db } from "../src/server/db";
import { saveRecord } from "../src/server/repositories/content";
import type { Entity } from "../src/lib/content-schema";
async function main() {
  // Run once per installation; existing installations are untouched.
  const p = db();
  if (await p.profile.findUnique({ where: { id: "owner" } })) {
    console.log(
      "Existing portfolio detected; seed skipped. Content was not overwritten.",
    );
    return;
  }
  // Profile is saved last, so an interrupted first seed can be safely rerun with stable IDs.
  for (const entity of [
    "settings",
    "projects",
    "experience",
    "skills",
    "certifications",
    "education",
    "achievements",
    "social",
  ] as Entity[]) {
    const value = seedPortfolio[entity];
    for (const record of Array.isArray(value) ? value : [value])
      await saveRecord(entity, record);
  }
  await saveRecord("profile", seedPortfolio.profile);
  console.log("Initial portfolio content seeded.");
}
main()
  .catch(() => {
    console.error("Seed failed. Check database connectivity and migrations.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db().$disconnect();
  });
