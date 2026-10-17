import { db } from "@/server/db";
import { checkOrigin, errorResponse, readJson } from "@/server/http";
import { acceptContact, notifyContact } from "@/server/services/contact";
import { clientKey, consumeLimit } from "@/server/services/rate-limit";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = await readJson(request, 16000);
    const result = await acceptContact(input, {
      allowed: async () =>
        (await consumeLimit(`contact:${clientKey(request)}`, 5, 900)) &&
        (await consumeLimit("contact:global", 100, 3600)),
      save: ({ website: _, ...data }) =>
        db().contactMessage.create({ data, select: { id: true } }),
      notify: notifyContact,
      mark: async (id, sent) => {
        await db().contactMessage.update({
          where: { id },
          data: { notificationStatus: sent ? "sent" : "failed" },
        });
      },
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Response && error.status === 429)
      return Response.json(
        { error: "Too many messages. Please try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    return errorResponse(error);
  }
}
