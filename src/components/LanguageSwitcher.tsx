"use client";

import { Dropdown } from "./ui/Dropdown";
import { useI18n, LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const current = LANGS.find((l) => l.code === lang);

  return (
    <Dropdown
      title={t("nav.language")}
      label={
        <span className="flex items-center gap-1.5">
          <GlobeIcon />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{current?.code}</span>
        </span>
      }
    >
      {(close) => (
        <ul>
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                onClick={() => {
                  setLang(l.code);
                  close();
                }}
                className={`flex w-full items-center justify-between gap-6 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-sand-100 ${
                  lang === l.code ? "font-semibold" : ""
                }`}
              >
                {l.label}
                {lang === l.code && <CheckMark />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
