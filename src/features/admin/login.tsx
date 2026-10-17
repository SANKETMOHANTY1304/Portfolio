"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
export function Login({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <div className="login-panel">
      <LockKeyhole size={25} className="mb-5 text-blue-400" />
      <p className="eyebrow">PRIVATE WORKSPACE</p>
      <h1>Welcome back.</h1>
      <p>Sign in to manage your portfolio and messages.</p>
      {!configured ? (
        <div className="admin-notice">
          Admin sign-in becomes available after database and authentication
          setup. Follow the setup and provisioning steps in README.md.
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            setError("");
            const data = new FormData(e.currentTarget);
            try {
              const result = await authClient.signIn.email({
                email: String(data.get("email")),
                password: String(data.get("password")),
                rememberMe: false,
              });
              if (result.error)
                setError(
                  "Sign-in failed. Check your credentials or try again later.",
                );
              else {
                router.replace("/admin");
                router.refresh();
              }
            } catch {
              setError("Sign-in is temporarily unavailable.");
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={14}
              maxLength={128}
            />
          </div>
          <Button disabled={pending}>
            {pending ? (
              <Loader2 className="spin" size={16} />
            ) : (
              <LockKeyhole size={16} />
            )}{" "}
            Sign in
          </Button>
          {error && (
            <p className="field-error mt-4" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
