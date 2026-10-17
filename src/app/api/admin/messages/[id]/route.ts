import { z } from "zod";
import { requireAdmin } from "@/server/auth/authorize";
import { checkOrigin, readJson, errorResponse } from "@/server/http";
import { db } from "@/server/db";
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const { id } = await ctx.params;
    const data = z
      .object({
        read: z.boolean().optional(),
        archived: z.boolean().optional(),
      })
      .strict()
      .parse(await readJson(request));
    await db().contactMessage.update({ where: { id }, data });
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const { id } = await ctx.params;
    await db().contactMessage.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
