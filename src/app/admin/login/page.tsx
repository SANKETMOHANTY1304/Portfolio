import { redirect } from "next/navigation";
import { currentAdmin } from "@/server/auth/authorize";
import { authConfigured } from "@/server/auth";
import { Login } from "@/features/admin/login";
export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <main id="main" className="container">
      <Login configured={authConfigured()} />
    </main>
  );
}
