import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { db } from "../src/server/db";
async function main() {
  const email = z.email().parse(process.env.ADMIN_EMAIL).toLowerCase();
  const password = z
    .string()
    .min(14)
    .max(128)
    .parse(process.env.ADMIN_PASSWORD);
  const p = db();
  if (await p.user.findUnique({ where: { email } }))
    throw new Error(
      "Account already exists; use the documented recovery process.",
    );
  const id = randomUUID();
  const hashed = await hashPassword(password);
  await p.user.create({
    data: {
      id,
      name: "Portfolio administrator",
      email,
      emailVerified: true,
      role: "admin",
      accounts: {
        create: {
          id: randomUUID(),
          providerId: "credential",
          accountId: id,
          password: hashed,
        },
      },
    },
  });
  console.log(
    "Administrator provisioned. Remove ADMIN_PASSWORD from your environment.",
  );
}
main()
  .catch(() => {
    console.error(
      "Provisioning failed. Verify a new ADMIN_EMAIL, a 14–128 character ADMIN_PASSWORD, and database access.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await db().$disconnect();
  });
