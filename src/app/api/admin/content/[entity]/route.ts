import { revalidatePath, revalidateTag } from "next/cache";
import { schemas, type Entity } from "@/lib/content-schema";
import { requireAdmin } from "@/server/auth/authorize";
import { checkOrigin, errorResponse, readJson } from "@/server/http";
import { deleteRecord, saveRecord } from "@/server/repositories/content";
import { z } from "zod";
function parseEntity(name: string): Entity {
  if (!(name in schemas) || !Object.hasOwn(schemas, name))
    throw new Response("Not found", { status: 404 });
  return name as Entity;
}
function invalidate() {
  revalidateTag("portfolio", "max");
  revalidatePath("/", "layout");
}
export async function POST(
  request: Request,
  ctx: { params: Promise<{ entity: string }> },
) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const entity = parseEntity((await ctx.params).entity);
    const record = await saveRecord(entity, await readJson(request));
    invalidate();
    return Response.json({ id: record.id });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ entity: string }> },
) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const entity = parseEntity((await ctx.params).entity);
    const { id } = z
      .object({ id: z.string().min(1).max(100) })
      .parse(await readJson(request));
    await deleteRecord(entity, id);
    invalidate();
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
