import { redirect } from "next/navigation";
import { currentAdmin } from "@/server/auth/authorize";
import { readPortfolio } from "@/server/repositories/content";
import { db } from "@/server/db";
import { Workspace } from "@/features/admin/workspace";
export default async function AdminPage() {
  if (!(await currentAdmin())) redirect("/admin/login");
  const [data, unread] = await Promise.all([
    readPortfolio(),
    db().contactMessage.count({ where: { read: false, archived: false } }),
  ]);
  return (
    <main id="main" className="container admin-page">
      <Workspace data={data} unread={unread} />
    </main>
  );
}
