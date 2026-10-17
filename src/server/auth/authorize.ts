import "server-only";
import { headers } from "next/headers";
import { auth, authConfigured } from "@/server/auth";
import { db } from "@/server/db";
export async function currentAdmin() {
  if (!authConfigured()) return null;
  const session = await auth().api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db().user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true },
  });
  return user?.role === "admin" ? user : null;
}
export async function requireAdmin() {
  const user = await currentAdmin();
  if (!user) throw new Response("Unauthorized", { status: 401 });
  return user;
}
