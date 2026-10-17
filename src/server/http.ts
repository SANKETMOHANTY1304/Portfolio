import { z } from "zod";
export function checkOrigin(request: Request) {
  const expected =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin;
  if (request.headers.get("origin") !== new URL(expected).origin)
    throw new Response("Forbidden", { status: 403 });
}
export async function readJson(
  request: Request,
  limit = 128_000,
): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Response("Unsupported media type", { status: 415 });
  const reader = request.body?.getReader();
  if (!reader) throw new Response("Invalid request", { status: 400 });
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new Response("Request too large", { status: 413 });
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Response("Invalid JSON", { status: 400 });
  }
}
export function errorResponse(error: unknown) {
  if (error instanceof Response)
    return Response.json(
      {
        error:
          error.status === 401
            ? "Please sign in to continue."
            : "Unable to process this request.",
      },
      { status: error.status },
    );
  if (error instanceof z.ZodError)
    return Response.json(
      {
        error: "Please check the highlighted fields.",
        issues: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  console.error(
    JSON.stringify({
      event: "request_failed",
      kind: error instanceof Error ? error.name : "UnknownError",
    }),
  );
  return Response.json(
    {
      error: "This service is temporarily unavailable. Please try again later.",
    },
    { status: 503 },
  );
}
