import { createHash } from "node:crypto";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/authorize";
import { checkOrigin, errorResponse, readJson } from "@/server/http";
export async function POST(request: Request) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const {
      CLOUDINARY_CLOUD_NAME: cloud,
      CLOUDINARY_API_KEY: key,
      CLOUDINARY_API_SECRET: secret,
    } = process.env;
    if (!cloud || !key || !secret)
      return Response.json(
        { error: "Configure Cloudinary to enable uploads." },
        { status: 503 },
      );
    const data = z
      .object({
        content: z.string().max(7_000_000),
        type: z.enum([
          "image/png",
          "image/jpeg",
          "image/webp",
          "application/pdf",
        ]),
      })
      .parse(await readJson(request, 7_100_000));
    const bytes = Buffer.from(data.content, "base64");
    if (bytes.length > 5_000_000 || bytes.length < 12)
      throw new Response("Invalid file", { status: 400 });
    const valid =
      data.type === "application/pdf"
        ? bytes.subarray(0, 5).toString() === "%PDF-"
        : data.type === "image/png"
          ? bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : data.type === "image/jpeg"
            ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            : bytes.subarray(0, 4).toString() === "RIFF" &&
              bytes.subarray(8, 12).toString() === "WEBP";
    if (!valid) throw new Response("Invalid file", { status: 400 });
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "sanket-portfolio";
    const signature = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
      .digest("hex");
    const form = new FormData();
    form.set(
      "file",
      new Blob([new Uint8Array(bytes)], { type: data.type }),
      data.type === "application/pdf" ? "document.pdf" : "image",
    );
    form.set("folder", folder);
    form.set("timestamp", String(timestamp));
    form.set("api_key", key);
    form.set("signature", signature);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/auto/upload`,
      { method: "POST", body: form, signal: AbortSignal.timeout(15000) },
    );
    if (!response.ok) throw new Error("Storage upload failed");
    const result = z
      .object({
        secure_url: z.url(),
        public_id: z.string(),
        bytes: z.number(),
        format: z.string().optional(),
      })
      .parse(await response.json());
    return Response.json({
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      format: result.format,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
