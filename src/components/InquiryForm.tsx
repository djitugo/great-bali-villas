"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { WhatsappIcon } from "./icons";

export function InquiryForm({ propertyName, propertySlug }: { propertyName: string; propertySlug: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
    guests: "2",
    message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const waText = encodeURIComponent(
    `Hi Great Bali Villas! I'm interested in "${propertyName}".\n` +
      (form.checkin ? `Check-in: ${form.checkin}\n` : "") +
      (form.checkout ? `Check-out: ${form.checkout}\n` : "") +
      `Guests: ${form.guests}\n` +
      (form.message ? `\n${form.message}` : "")
  );
  const waHref = `${SITE.whatsappHref}?text=${waText}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, propertyName, propertySlug }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-none border border-sand-200 bg-cream p-6 text-center">
        <p className="font-display text-2xl">Thank you!</p>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve received your enquiry for {propertyName}. Our team will reply shortly.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="mt-5 btn btn-dark w-full"
        >
          <WhatsappIcon className="h-5 w-5" /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        className="btn btn-dark w-full"
      >
        <WhatsappIcon className="h-5 w-5" /> Enquire on WhatsApp
      </a>
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-sand-200" />
        <span className="text-xs uppercase tracking-widest text-muted">or send a request</span>
        <span className="h-px flex-1 bg-sand-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input required value={form.checkin} onChange={set("checkin")} type="date" aria-label="Check-in" className={inputCls} />
        <input required value={form.checkout} onChange={set("checkout")} type="date" aria-label="Check-out" className={inputCls} />
      </div>
      <input required value={form.name} onChange={set("name")} placeholder="Full name" className={inputCls} />
      <div className="grid grid-cols-2 gap-3">
        <input required value={form.email} onChange={set("email")} type="email" placeholder="Email" className={inputCls} />
        <input value={form.phone} onChange={set("phone")} placeholder="Phone / WA" className={inputCls} />
      </div>
      <input value={form.guests} onChange={set("guests")} type="number" min={1} placeholder="Guests" className={inputCls} />
      <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Anything we should know?" className={`${inputCls} resize-none`} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-dark w-full disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request availability"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-clay">
          Something went wrong. Please try WhatsApp above.
        </p>
      )}
    </form>
  );
}

const inputCls =
  "w-full rounded-none border border-sand-200 bg-sand px-4 py-3 text-sm outline-none transition-colors focus:border-ink";
