import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/server/auth/authorize";
import { db } from "@/server/db";
import { MessageActions } from "@/features/admin/message-actions";
export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; archived?: string }>;
}) {
  if (!(await currentAdmin())) redirect("/admin/login");
  const query = await searchParams;
  const page = Math.max(
    1,
    Math.min(10000, Number.parseInt(query.page || "1") || 1),
  );
  const archived = query.archived === "true";
  const where = { archived };
  const [messages, count] = await Promise.all([
    db().contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    }),
    db().contactMessage.count({ where }),
  ]);
  return (
    <main id="main" className="container admin-page">
      <Link href="/admin" className="text-link">
        ← Content dashboard
      </Link>
      <div className="admin-header">
        <div>
          <h1>{archived ? "Archived messages" : "Your conversations"}</h1>
          <p>
            {count} messages · Page {page}
          </p>
        </div>
        <Link
          className="button button-outline"
          href={`/admin/messages?archived=${!archived}`}
        >
          {archived ? "Inbox" : "View archive"}
        </Link>
      </div>
      {!messages.length && (
        <div className="empty-state">
          <h3>No messages here yet.</h3>
          <p>New contact submissions will appear in your inbox.</p>
        </div>
      )}
      {messages.map((m) => (
        <article className="inbox-card" key={m.id}>
          <h2>
            {m.subject}
            {!m.read && <span className="badge published">Unread</span>}
          </h2>
          <p className="inbox-meta">
            {m.name} · <a href={`mailto:${m.email}`}>{m.email}</a> ·{" "}
            {m.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}{" "}
            IST
          </p>
          <p className="inbox-body">{m.message}</p>
          <span className="field-help">
            Email notification: {m.notificationStatus}. This message is saved in
            your inbox.
          </span>
          <MessageActions id={m.id} read={m.read} archived={m.archived} />
        </article>
      ))}
      <nav className="pagination" aria-label="Message pages">
        {page > 1 ? (
          <Link href={`/admin/messages?page=${page - 1}&archived=${archived}`}>
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        {page * 20 < count && (
          <Link href={`/admin/messages?page=${page + 1}&archived=${archived}`}>
            Next →
          </Link>
        )}
      </nav>
    </main>
  );
}
