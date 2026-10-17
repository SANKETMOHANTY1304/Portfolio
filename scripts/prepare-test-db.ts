import { execFileSync } from "node:child_process";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
import { db } from "../src/server/db";
import { seedPortfolio } from "../src/content/portfolio";
async function main() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url || !new URL(url).pathname.endsWith("_test"))
    throw new Error("Use a dedicated TEST_DATABASE_URL ending in _test.");
  if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD)
    throw new Error("Set test admin credentials.");
  process.env.DATABASE_URL = url;
  process.env.DIRECT_URL = url;
  execFileSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { stdio: "inherit", env: process.env },
  );
  execFileSync(
    process.execPath,
    ["node_modules/tsx/dist/cli.mjs", "prisma/seed.ts"],
    { stdio: "inherit", env: process.env },
  );
  const email = process.env.E2E_ADMIN_EMAIL.toLowerCase();
  // This fixture is restricted to an explicit disposable _test database.
  await db().profile.update({
    where: { id: "owner" },
    data: {
      focusTitle: seedPortfolio.profile.focusTitle,
      specializations: seedPortfolio.profile.specializations,
    },
  });
  await db().project.deleteMany({
    where: { slug: { startsWith: "e2e-project-" } },
  });
  await db().contactMessage.deleteMany({
    where: { email: "visitor@example.com" },
  });
  await db().rateLimit.deleteMany();
  const existing = await db().user.findUnique({ where: { email } });
  const password = await hashPassword(process.env.E2E_ADMIN_PASSWORD);
  if (existing) {
    await db().$transaction([
      db().account.updateMany({
        where: { userId: existing.id, providerId: "credential" },
        data: { password },
      }),
      db().session.deleteMany({ where: { userId: existing.id } }),
    ]);
  } else {
    const id = randomUUID();
    await db().user.create({
      data: {
        id,
        name: "Test administrator",
        email,
        emailVerified: true,
        role: "admin",
        accounts: {
          create: {
            id: randomUUID(),
            providerId: "credential",
            accountId: id,
            password,
          },
        },
      },
    });
  }
  console.log("Isolated test fixture ready.");
}
main()
  .catch(() => {
    console.error("Test database preparation failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db().$disconnect();
  });
