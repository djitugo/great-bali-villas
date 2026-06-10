"use client";

import { Dropdown } from "./ui/Dropdown";
import { useCurrency } from "@/lib/currency-context";
import { CURRENCIES } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

const LABELS: Record<string, string> = {
  IDR: "Indonesian Rupiah",
  USD: "US Dollar",
  EUR: "Euro",
  AUD: "Australian Dollar",
};

export function CurrencySwitcher() {
  const { currency, setCurrency, list } = useCurrency();
  const { t } = useI18n();

  return (
    <Dropdown
      title={t("nav.currency")}
      label={<span className="text-[11px] font-semibold uppercase tracking-[0.14em] tabular-nums">{currency}</span>}
    >
      {(close) => (
        <ul>
          {list.map((c) => (
            <li key={c}>
              <button
                onClick={() => {
                  setCurrency(c);
                  close();
                }}
                className={`flex w-full items-center justify-between gap-6 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-sand-100 ${
                  currency === c ? "font-semibold" : ""
                }`}
              >
                <span>{LABELS[c]}</span>
                <span className="text-muted">{CURRENCIES[c].symbol} {c}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
