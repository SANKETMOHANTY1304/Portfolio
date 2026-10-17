import { contactSchema, type ContactInput } from "@/lib/content-schema";
type Dependencies = {
  allowed: () => Promise<boolean>;
  save: (data: ContactInput) => Promise<{ id: string }>;
  notify: (data: ContactInput, id: string) => Promise<boolean>;
  mark: (id: string, sent: boolean) => Promise<void>;
};
export async function acceptContact(input: unknown, deps: Dependencies) {
  const data = contactSchema.parse(input);
  if (data.website) return { ok: true };
  if (!(await deps.allowed()))
    throw new Response("Too many requests", { status: 429 });
  const saved = await deps.save(data);
  let sent = false;
  try {
    sent = await deps.notify(data, saved.id);
  } catch {
    /* A stored message remains available in the inbox. */
  }
  try {
    await deps.mark(saved.id, sent);
  } catch {
    console.error(
      JSON.stringify({
        event: "notification_status_update_failed",
        id: saved.id,
      }),
    );
  }
  return { ok: true };
}
export async function notifyContact(data: ContactInput, id: string) {
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) return false;
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact-${id}`,
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `Portfolio: ${data.subject}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  return result.ok;
}
