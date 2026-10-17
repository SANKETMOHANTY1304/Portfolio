import { createHash } from "node:crypto";
import { db } from "@/server/db";
export function clientKey(request: Request) {
  const address = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")
    : process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")
      : "shared";
  return createHash("sha256")
    .update(address?.split(",")[0]?.trim() || "shared")
    .digest("hex");
}
export async function consumeLimit(
  key: string,
  maximum: number,
  seconds: number,
) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + seconds * 1000);
  const rows = await db().$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("id", "count", "expiresAt") VALUES (${key}, 1, ${expiresAt})
    ON CONFLICT ("id") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN 1 ELSE LEAST("RateLimit"."count" + 1, ${maximum + 1}) END,
      "expiresAt" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN ${expiresAt} ELSE "RateLimit"."expiresAt" END
    RETURNING "count"`;
  return rows[0].count <= maximum;
}
