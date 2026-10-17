import "dotenv/config";
import assert from "node:assert/strict";
import { verifyPassword } from "better-auth/crypto";
import { auth } from "../src/server/auth";
import { db } from "../src/server/db";

// Run with: node --conditions=react-server --import tsx scripts/verify-auth.ts
// Prints only check names. Never logs credentials, cookies, tokens, or raw errors.
let stage = "configured-admin";
let sessionToken: string | undefined;
async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  assert.ok(email && password && process.env.BETTER_AUTH_URL);
  const user = await db().user.findUnique({
    where: { email },
    include: { accounts: true },
  });
  assert.equal(user?.role, "admin");
  const account = user.accounts.find((a) => a.providerId === "credential");
  assert.ok(account?.password && account.password !== password);
  assert.ok(await verifyPassword({ hash: account.password, password }));
  console.log("PASS: admin role and Better Auth password hash");

  const base = new URL("/api/auth/", process.env.BETTER_AUTH_URL);
  const request = (path: string, body?: object, cookie?: string) =>
    new Request(new URL(path, base), {
      method: body ? "POST" : "GET",
      headers: {
        origin: base.origin,
        "content-type": "application/json",
        "x-forwarded-for": "127.0.0.1",
        ...(cookie ? { cookie } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  stage = "anonymous-session";
  const anonymous = await auth().handler(request("get-session"));
  assert.equal(anonymous.status, 200);
  assert.equal(await anonymous.json(), null);
  console.log("PASS: anonymous requests have no session");

  stage = "sign-in";
  const signIn = await auth().handler(
    request("sign-in/email", { email, password }),
  );
  assert.equal(signIn.status, 200);
  const payload = await signIn.json();
  sessionToken = payload.token;
  assert.ok(sessionToken);
  const cookies = signIn.headers.getSetCookie();
  const sessionCookie = cookies.find((value) =>
    value.includes("session_token="),
  );
  assert.ok(
    sessionCookie &&
      /httponly/i.test(sessionCookie) &&
      /samesite=lax/i.test(sessionCookie),
  );
  if (base.protocol === "https:") assert.match(sessionCookie, /;\s*secure/i);
  const cookie = cookies.map((value) => value.split(";")[0]).join("; ");
  console.log("PASS: credential sign-in and protected session cookie");

  stage = "persisted-session";
  const sessionResponse = await auth().handler(
    request("get-session", undefined, cookie),
  );
  assert.equal(sessionResponse.status, 200);
  const session = await sessionResponse.json();
  assert.equal(session.user.id, user.id);
  assert.equal(session.user.role, "admin");
  assert.ok(await db().session.findUnique({ where: { token: sessionToken } }));
  console.log("PASS: session persisted in Supabase and resolves to admin");

  stage = "registration-disabled";
  const registration = await auth().handler(
    request("sign-up/email", { email, password, name: "Verification" }),
  );
  assert.ok(registration.status >= 400 && registration.status < 500);
  console.log("PASS: public registration disabled");

  stage = "sign-out";
  const signOut = await auth().handler(request("sign-out", {}, cookie));
  assert.equal(signOut.status, 200);
  assert.equal(
    await db().session.findUnique({ where: { token: sessionToken } }),
    null,
  );
  const expired = await auth().handler(
    request("get-session", undefined, cookie),
  );
  assert.equal(await expired.json(), null);
  console.log("PASS: sign-out deletes session and invalidates cookie");
}
main()
  .catch(() => {
    console.error(`FAIL: ${stage}. Sensitive error details withheld.`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (sessionToken)
      await db().session.deleteMany({ where: { token: sessionToken } });
    await db().$disconnect();
  });
