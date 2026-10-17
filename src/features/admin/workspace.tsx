"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Pencil,
  Plus,
  Trash2,
  X,
  Loader2,
  LogOut,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  schemas,
  type Entity,
  type Portfolio,
  type Project,
} from "@/lib/content-schema";
import { authClient } from "@/lib/auth-client";
import {
  fields,
  entityLabels,
  emptyRecord,
  type Field,
} from "@/features/admin/fields";
type RecordValue = Record<string, unknown>;
function titleOf(record: RecordValue) {
  return String(
    record.title ||
      record.name ||
      record.company ||
      record.degree ||
      record.label ||
      "Portfolio settings",
  );
}
export function ConfirmDelete({
  title,
  onConfirm,
}: {
  title: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Delete ${title}`}>
          <Trash2 size={15} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="confirm-dialog">
          <Dialog.Title>Delete this item?</Dialog.Title>
          <Dialog.Description>
            “{title}” will be permanently removed. This cannot be undone.
          </Dialog.Description>
          <div className="editor-actions">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={pending}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={async () => {
                setPending(true);
                try {
                  await onConfirm();
                  setOpen(false);
                } finally {
                  setPending(false);
                }
              }}
            >
              Delete permanently
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function AssetUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [state, setState] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <div className="field-upload">
      <label className="field-help">
        Upload PNG, JPEG, WebP, or PDF (5 MB max)
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          disabled={pending}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 5_000_000) {
              setState("Choose a file smaller than 5 MB.");
              return;
            }
            setPending(true);
            setState("Uploading…");
            try {
              const bytes = new Uint8Array(await file.arrayBuffer());
              let binary = "";
              for (let i = 0; i < bytes.length; i += 8192)
                binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
              const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: file.type,
                  content: btoa(binary),
                }),
              });
              const result = await res.json();
              if (!res.ok) throw new Error(result.error);
              onUpload(result.url);
              setState("Uploaded. Save the record to apply it.");
            } catch (err) {
              setState(err instanceof Error ? err.message : "Upload failed.");
            } finally {
              setPending(false);
              e.target.value = "";
            }
          }}
        />
      </label>
      <span className="field-help" role="status">
        {state}
      </span>
    </div>
  );
}
function EditorField({
  field,
  value,
  onChange,
  error,
  projects,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  projects: Project[];
}) {
  const id = `edit-${field.name}`;
  if (field.type === "checkbox")
    return (
      <label className="field-checkbox" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        {field.label}
      </label>
    );
  if (field.type === "sections" || field.type === "images") {
    const rows = (value || []) as Record<string, string>[];
    const keys = field.type === "sections" ? ["title", "body"] : ["url", "alt"];
    return (
      <fieldset className="field">
        <legend>{field.label}</legend>
        {rows.map((row, i) => (
          <div className="nested-field" key={i}>
            <div className="nested-field-top">
              <strong>
                {field.type === "sections" ? "Section" : "Image"} {i + 1}
              </strong>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Move item ${i + 1} up`}
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...rows];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Move item ${i + 1} down`}
                  disabled={i === rows.length - 1}
                  onClick={() => {
                    const next = [...rows];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    onChange(next);
                  }}
                >
                  <ArrowDown size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove item ${i + 1}`}
                  onClick={() =>
                    onChange(rows.filter((_, index) => index !== i))
                  }
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
            {keys.map((key) => (
              <div className="field" key={key}>
                <label htmlFor={`${id}-${i}-${key}`}>
                  {key === "body"
                    ? "Content"
                    : key === "alt"
                      ? "Image description"
                      : key === "url"
                        ? "Image URL"
                        : "Section title"}
                </label>
                {key === "body" ? (
                  <textarea
                    id={`${id}-${i}-${key}`}
                    rows={5}
                    value={row[key] || ""}
                    onChange={(e) =>
                      onChange(
                        rows.map((r, index) =>
                          index === i ? { ...r, [key]: e.target.value } : r,
                        ),
                      )
                    }
                  />
                ) : (
                  <input
                    id={`${id}-${i}-${key}`}
                    value={row[key] || ""}
                    onChange={(e) =>
                      onChange(
                        rows.map((r, index) =>
                          index === i ? { ...r, [key]: e.target.value } : r,
                        ),
                      )
                    }
                  />
                )}
                {key === "url" && (
                  <AssetUpload
                    onUpload={(url) =>
                      onChange(
                        rows.map((r, index) =>
                          index === i ? { ...r, url } : r,
                        ),
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([...rows, Object.fromEntries(keys.map((k) => [k, ""]))])
          }
        >
          <Plus size={14} /> Add{" "}
          {field.type === "sections" ? "section" : "image"}
        </Button>
        {error && <span className="field-error">{error}</span>}
      </fieldset>
    );
  }
  if (field.type === "projects")
    return (
      <fieldset className="field">
        <legend>{field.label}</legend>
        {projects.map((project) => (
          <label className="field-checkbox" key={project.id}>
            <input
              type="checkbox"
              checked={((value as string[]) || []).includes(project.id!)}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? [...((value as string[]) || []), project.id]
                    : (value as string[]).filter((id) => id !== project.id),
                )
              }
            />
            {project.title}
          </label>
        ))}
      </fieldset>
    );
  return (
    <div className="field">
      <label htmlFor={id}>{field.label}</label>
      {field.type === "select" ? (
        <select
          id={id}
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : field.type === "textarea" || field.type === "list" ? (
        <textarea
          id={id}
          rows={field.type === "list" ? 4 : 3}
          value={
            field.type === "list"
              ? ((value as string[]) || []).join("\n")
              : String(value || "")
          }
          onChange={(e) =>
            onChange(
              field.type === "list"
                ? e.target.value.split("\n")
                : e.target.value,
            )
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : "text"}
          min={field.type === "number" ? 0 : undefined}
          value={String(value ?? "")}
          onChange={(e) =>
            onChange(
              field.type === "number" ? Number(e.target.value) : e.target.value,
            )
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {field.type === "asset" && <AssetUpload onUpload={onChange} />}
      {field.type === "list" && (
        <span className="field-help">One item per line.</span>
      )}
      {field.help && <span className="field-help">{field.help}</span>}
      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
export function Workspace({
  data,
  unread,
}: {
  data: Portfolio;
  unread: number;
}) {
  const [entity, setEntity] = useState<Entity>("projects");
  const [editing, setEditing] = useState<RecordValue | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const value = data[entity];
  const records = (Array.isArray(value)
    ? value
    : [value]) as unknown as RecordValue[];
  const singleton = entity === "profile" || entity === "settings";
  async function mutate(method: string, body: unknown) {
    const response = await fetch(`/api/admin/content/${entity}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      if (payload.issues)
        setErrors(
          Object.fromEntries(
            payload.issues.map((issue: { path: string; message: string }) => [
              issue.path.split(".")[0],
              issue.message,
            ]),
          ),
        );
      throw new Error(payload.error);
    }
    router.refresh();
  }
  return (
    <>
      <div className="admin-header">
        <div>
          <p className="eyebrow">PORTFOLIO / ADMIN</p>
          <h1>Your work, well presented.</h1>
          <p>Manage your content, credentials, and conversations.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await authClient.signOut();
            router.replace("/admin/login");
            router.refresh();
          }}
        >
          <LogOut size={14} /> Sign out
        </Button>
      </div>
      <div className="admin-stats">
        {[
          ["Projects", data.projects.length],
          [
            "Published projects",
            data.projects.filter((p) => p.published).length,
          ],
          ["Experience records", data.experience.length],
          ["Certifications", data.certifications.length],
          ["Unread messages", unread],
        ].map(([label, count]) => (
          <div className="admin-stat" key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="admin-layout">
        <nav className="admin-tabs" aria-label="Content management">
          {(Object.keys(entityLabels) as Entity[]).map((key) => (
            <button
              key={key}
              aria-pressed={entity === key}
              onClick={() => {
                setEntity(key);
                setNotice("");
              }}
            >
              {entityLabels[key]}
            </button>
          ))}
          <Link href="/admin/messages">Contact inbox ↗</Link>
          <Link href="/">View portfolio ↗</Link>
        </nav>
        <section>
          <div className="admin-toolbar">
            <h2>{entityLabels[entity]}</h2>
            {!singleton && (
              <Button
                size="sm"
                onClick={() => {
                  setEditing(emptyRecord(entity));
                  setErrors({});
                  setNotice("");
                }}
              >
                <Plus size={15} /> Add{" "}
                {entity === "projects" ? "project" : "record"}
              </Button>
            )}
          </div>
          {notice && (
            <p role="status" className="notice">
              {notice}
            </p>
          )}
          {!records.length && (
            <div className="empty-state">
              <h3>Ready for your next addition.</h3>
              <p>Create a draft, then publish when the details are verified.</p>
            </div>
          )}
          {records.map((record, i) => (
            <article key={String(record.id || i)} className="admin-record">
              <div>
                <h3>{titleOf(record)}</h3>
                <small>
                  {singleton
                    ? "Always visible"
                    : `Order ${record.displayOrder ?? 0}`}
                </small>
                {!singleton && (
                  <span
                    className={`badge ${record.published ? "published" : ""}`}
                  >
                    {record.published ? "Published" : "Draft"}
                  </span>
                )}
              </div>
              <div className="record-actions">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${titleOf(record)}`}
                  onClick={() => {
                    setEditing(structuredClone(record));
                    setErrors({});
                    setNotice("");
                  }}
                >
                  <Pencil size={15} />
                </Button>
                {!singleton && (
                  <ConfirmDelete
                    title={titleOf(record)}
                    onConfirm={async () => {
                      try {
                        await mutate("DELETE", { id: record.id });
                        setNotice("Record deleted.");
                      } catch (e) {
                        setNotice(
                          e instanceof Error ? e.message : "Delete failed.",
                        );
                      }
                    }}
                  />
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
      <Dialog.Root
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open && !pending) setEditing(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="editor-dialog">
            <Dialog.Title>
              {editing?.id ? "Edit" : "Add"}{" "}
              {entityLabels[entity].toLowerCase()}
            </Dialog.Title>
            <Dialog.Description className="editor-description">
              Save your changes below. Published records appear on the public
              portfolio.
            </Dialog.Description>
            <Dialog.Close asChild>
              <Button
                className="dialog-close"
                variant="ghost"
                size="icon"
                aria-label="Close editor"
                disabled={pending}
              >
                <X size={18} />
              </Button>
            </Dialog.Close>
            {editing && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErrors({});
                  const clean = { ...editing };
                  fields[entity]
                    .filter((f) => f.type === "list")
                    .forEach((f) => {
                      clean[f.name] = ((clean[f.name] as string[]) || [])
                        .map((s) => s.trim())
                        .filter(Boolean);
                    });
                  const parsed = schemas[entity].safeParse(clean);
                  if (!parsed.success) {
                    setErrors(
                      Object.fromEntries(
                        parsed.error.issues.map((i) => [
                          String(i.path[0]),
                          i.message,
                        ]),
                      ),
                    );
                    return;
                  }
                  setPending(true);
                  try {
                    await mutate("POST", parsed.data);
                    setEditing(null);
                    setNotice("Changes saved.");
                  } catch (e) {
                    setErrors((prev) => ({
                      ...prev,
                      form: e instanceof Error ? e.message : "Save failed.",
                    }));
                  } finally {
                    setPending(false);
                  }
                }}
              >
                {fields[entity].map((field) => (
                  <EditorField
                    key={field.name}
                    field={field}
                    value={editing[field.name]}
                    onChange={(value) =>
                      setEditing((prev) => ({ ...prev, [field.name]: value }))
                    }
                    error={errors[field.name]}
                    projects={data.projects}
                  />
                ))}
                {Object.keys(errors).length > 0 && (
                  <p className="field-error" role="alert">
                    {errors.form ||
                      "Please correct the highlighted fields before saving."}
                  </p>
                )}
                <div className="editor-actions">
                  <Dialog.Close asChild>
                    <Button variant="outline" type="button" disabled={pending}>
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button disabled={pending} type="submit">
                    {pending && <Loader2 className="spin" size={16} />}Save
                    changes
                  </Button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
