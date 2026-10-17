"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2, Loader2, Copy, Check } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/content-schema";
import { Button } from "@/components/ui/button";
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState("");
  return (
    <>
      <button
        className="copy-email"
        aria-label="Copy email address"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setState("Copied");
            setTimeout(() => setState(""), 2000);
          } catch {
            setState("Select the email to copy it.");
          }
        }}
      >
        {state === "Copied" ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <span className="sr-only" role="status">
        {state}
      </span>
    </>
  );
}
export function ContactForm() {
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  async function submit(data: ContactInput) {
    setResult(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Unable to send your message.");
      setResult("success");
      reset();
    } catch (e) {
      setResult("error");
      setMessage(
        e instanceof Error
          ? e.message
          : "Unable to send your message. Please email me directly.",
      );
    }
  }
  return (
    <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-two">
        {(["name", "email"] as const).map((field) => (
          <div className="field" key={field}>
            <label htmlFor={`contact-${field}`}>
              {field === "name" ? "Your name" : "Email address"}
            </label>
            <input
              id={`contact-${field}`}
              type={field === "email" ? "email" : "text"}
              autoComplete={field}
              placeholder={field === "name" ? "Full name" : "you@company.com"}
              maxLength={field === "name" ? 100 : 254}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
              {...register(field)}
            />
            {errors[field] && (
              <span id={`${field}-error`} className="field-error">
                {errors[field]?.message}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="field">
        <label htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          placeholder="What's on your mind?"
          maxLength={150}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby="subject-error"
          {...register("subject")}
        />
        <span className="field-error" id="subject-error">
          {errors.subject?.message}
        </span>
      </div>
      <div className="field">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell me about your idea, role, or project…"
          maxLength={5000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby="message-error"
          {...register("message")}
        />
        <span className="field-error" id="message-error">
          {errors.message?.message}
        </span>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          autoComplete="off"
          tabIndex={-1}
          {...register("website")}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="spin" size={17} /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowUpRight size={17} />
          </>
        )}
      </Button>
      <p className="form-note">Your message goes directly to my inbox.</p>
      {result === "success" && (
        <p className="form-success" role="status">
          <CheckCircle2 size={18} /> Message received. Thanks for reaching out!
        </p>
      )}
      {result === "error" && (
        <p className="field-error" role="alert">
          {message} You can also use the email link.
        </p>
      )}
    </form>
  );
}
