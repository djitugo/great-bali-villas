"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { useI18n, type DictKey } from "@/lib/i18n";
import { WhatsappIcon } from "./icons";

// Owner lead form for villa management. Sends straight to our WhatsApp with
// every field pre-filled, so a lead can never be lost to a backend outage.
const FIELDS = [
  { k: "name", label: "vm.fName", type: "text", required: true },
  { k: "email", label: "vm.fEmail", type: "email", required: true },
  { k: "phone", label: "vm.fPhone", type: "tel", required: true },
  { k: "address", label: "vm.fAddress", type: "text", required: true },
] as const;

type Form = Record<"name" | "email" | "phone" | "address" | "note", string>;

export function VmOwnerForm() {
  const { t } = useI18n();
  const [f, setF] = useState<Form>({ name: "", email: "", phone: "", address: "", note: "" });
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      "Hi Great Bali Villas! I'd like a free villa management consultation.\n\n" +
      `Name: ${f.name}\nEmail: ${f.email}\nPhone / WhatsApp: ${f.phone}\nProperty address: ${f.address}` +
      (f.note ? `\n\nProperty details: ${f.note}` : "");
    window.open(`${SITE.whatsappHref}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        {FIELDS.map((x) => (
          <label key={x.k} className="flex flex-col">
            <span className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-cream/50">
              {t(x.label as DictKey)}
            </span>
            <input
              required={x.required}
              type={x.type}
              value={f[x.k]}
              onChange={set(x.k)}
              className={inputCls}
            />
          </label>
        ))}
      </div>
      <label className="flex flex-col">
        <span className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-cream/50">
          {t("vm.fNote")}
        </span>
        <textarea value={f.note} onChange={set("note")} rows={4} className={`${inputCls} resize-none`} />
      </label>
      <button type="submit" className="btn btn-light w-full">
        <WhatsappIcon className="h-4 w-4" /> {t("vm.fSend")}
      </button>
      <p className="text-center text-xs text-cream/50">{t("vm.fHint")}</p>
    </form>
  );
}

const inputCls =
  "w-full border border-cream/15 bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-cream";
