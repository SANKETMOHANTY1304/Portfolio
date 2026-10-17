import { auth, authConfigured } from "@/server/auth";
import { checkOrigin, errorResponse } from "@/server/http";
import { clientKey, consumeLimit } from "@/server/services/rate-limit";
const allowed = new Set(["sign-in/email", "sign-out", "get-session"]);
async function handle(request: Request) {
  try {
    const path = new URL(request.url).pathname.replace("/api/auth/", "");
    if (!allowed.has(path))
      return Response.json({ error: "Not found" }, { status: 404 });
    if (!authConfigured())
      return Response.json(
        { error: "Sign-in is not configured yet." },
        { status: 503 },
      );
    if (request.method === "POST") {
      checkOrigin(request);
      if (!(await consumeLimit(`auth:${clientKey(request)}`, 10, 900)))
        return Response.json(
          { error: "Too many attempts. Try again later." },
          { status: 429 },
        );
    }
    return auth().handler(request);
  } catch (error) {
    return errorResponse(error);
  }
}
export { handle as GET, handle as POST };
