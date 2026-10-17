import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { db } from "@/server/db";
let instance: ReturnType<typeof createAuth> | undefined;
function createAuth() {
  if (!process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL)
    throw new Error("Authentication is not configured");
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(db(), {
      provider: "postgresql",
      transaction: true,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 14,
      maxPasswordLength: 128,
    },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "user", input: false },
      },
    },
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 60,
      cookieCache: { enabled: false },
    },
    advanced: {
      useSecureCookies: process.env.BETTER_AUTH_URL.startsWith("https://"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
    },
    rateLimit: { enabled: true, window: 60, max: 15 },
  });
}
export function auth() {
  return (instance ??= createAuth());
}
export function authConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.BETTER_AUTH_SECRET &&
    process.env.BETTER_AUTH_URL,
  );
}
