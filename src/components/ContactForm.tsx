"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const { t } = useI18n();
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
      <div className="border border-ink/10 bg-cream p-8 text-center">
        <p className="font-display text-2xl">{t("contact.sent")}</p>
        <p className="mt-2 text-muted">{t("contact.sentBody")}</p>
      </div>
    );

  const input =
    "w-full border border-ink/10 bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input required value={form.name} onChange={set("name")} placeholder={t("inq.name")} className={input} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required type="email" value={form.email} onChange={set("email")} placeholder={t("inq.email")} className={input} />
        <input value={form.phone} onChange={set("phone")} placeholder={t("inq.phone")} className={input} />
      </div>
      <textarea required rows={5} value={form.message} onChange={set("message")} placeholder={t("contact.message")} className={`${input} resize-none`} />
      <button type="submit" disabled={status === "sending"} className="btn btn-dark w-full disabled:opacity-60">
        {status === "sending" ? t("inq.sending") : t("contact.send")}
      </button>
      {status === "error" && <p className="text-center text-sm text-clay">{t("inq.error")}</p>}
    </form>
  );
}
