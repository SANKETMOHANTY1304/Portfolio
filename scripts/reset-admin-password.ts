import "dotenv/config";
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
  const user = await db().user.findUnique({ where: { email } });
  if (user?.role !== "admin") throw new Error("Administrator not found");
  const hashed = await hashPassword(password);
  await db().$transaction([
    db().account.updateMany({
      where: { userId: user.id, providerId: "credential" },
      data: { password: hashed },
    }),
    db().session.deleteMany({ where: { userId: user.id } }),
  ]);
  console.log(
    "Password reset. All existing sessions were revoked. Remove ADMIN_PASSWORD from your environment.",
  );
}
main()
  .catch(() => {
    console.error(
      "Password reset failed. Verify administrator email, a 14–128 character password, and database access.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await db().$disconnect();
  });
