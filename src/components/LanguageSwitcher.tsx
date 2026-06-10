"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "./ui/Dropdown";

const LANGS: [string, string][] = [
  ["en", "English"],
  ["id", "Bahasa Indonesia"],
  ["zh-CN", "中文 (简体)"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["ru", "Русский"],
  ["nl", "Nederlands"],
  ["es", "Español"],
];

function getCookieLang(): string {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return m ? m[1] : "en";
}

// Inject Google Website Translator once (cookie-driven, no UI banner).
function ensureGoogleTranslate() {
  if (document.getElementById("gt-script")) return;
  (window as unknown as { googleTranslateElementInit: () => void }).googleTranslateElementInit = () => {
    const g = (window as unknown as { google?: { translate?: { TranslateElement: new (o: object, el: string) => void } } }).google;
    if (g?.translate)
      new g.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
  };
  const s = document.createElement("script");
  s.id = "gt-script";
  s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(s);
}

export function LanguageSwitcher() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(getCookieLang());
    ensureGoogleTranslate();
  }, []);

  const choose = (code: string) => {
    const host = location.hostname;
    const value = code === "en" ? "/en/en" : `/en/${code}`;
    document.cookie = `googtrans=${value};path=/`;
    document.cookie = `googtrans=${value};path=/;domain=${host}`;
    if (host.split(".").length > 1)
      document.cookie = `googtrans=${value};path=/;domain=.${host}`;
    location.reload();
  };

  const current = LANGS.find((l) => l[0] === lang)?.[1] ?? "English";

  return (
    <>
      <Dropdown
        label={
          <span className="flex items-center gap-1.5">
            <GlobeIcon />
            <span className="notranslate hidden sm:inline">{current}</span>
          </span>
        }
      >
        {(close) => (
          <ul className="max-h-72 overflow-y-auto">
            {LANGS.map(([code, name]) => (
              <li key={code}>
                <button
                  onClick={() => {
                    choose(code);
                    close();
                  }}
                  className={`notranslate w-full rounded-none px-3 py-2 text-left text-sm transition-colors hover:bg-sand-100 ${
                    lang === code ? "text-gold" : "text-ink"
                  }`}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Dropdown>
      <div id="google_translate_element" className="hidden" />
    </>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
