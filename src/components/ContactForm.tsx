"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, propertyName: "General enquiry" }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div className="rounded-none border border-sand-200 bg-cream p-8 text-center">
        <p className="font-display text-2xl">Message sent</p>
        <p className="mt-2 text-muted">Thanks for reaching out — we&apos;ll be in touch shortly.</p>
      </div>
    );

  const input = "w-full rounded-none border border-sand-200 bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input required value={form.name} onChange={set("name")} placeholder="Full name" className={input} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required type="email" value={form.email} onChange={set("email")} placeholder="Email" className={input} />
        <input value={form.phone} onChange={set("phone")} placeholder="Phone / WhatsApp" className={input} />
      </div>
      <textarea required rows={5} value={form.message} onChange={set("message")} placeholder="How can we help?" className={`${input} resize-none`} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-dark w-full disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && <p className="text-center text-sm text-clay">Something went wrong. Please try WhatsApp.</p>}
    </form>
  );
}
