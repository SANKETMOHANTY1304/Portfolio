"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/features/admin/workspace";
export function MessageActions({
  id,
  read,
  archived,
}: {
  id: string;
  read: boolean;
  archived: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function mutate(method: string, body?: unknown) {
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error("Unable to update this message.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <div className="inbox-actions">
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => mutate("PATCH", { read: !read })}
        >
          Mark {read ? "unread" : "read"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => mutate("PATCH", { archived: !archived })}
        >
          {archived ? "Restore to inbox" : "Archive"}
        </Button>
        <ConfirmDelete
          title="this message"
          onConfirm={() => mutate("DELETE")}
        />
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
