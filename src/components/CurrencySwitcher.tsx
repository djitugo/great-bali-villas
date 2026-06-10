"use client";

import { Dropdown } from "./ui/Dropdown";
import { useCurrency } from "@/lib/currency-context";
import { CURRENCIES } from "@/lib/format";

const LABELS: Record<string, string> = {
  IDR: "Indonesian Rupiah",
  USD: "US Dollar",
  EUR: "Euro",
  AUD: "Australian Dollar",
};

export function CurrencySwitcher() {
  const { currency, setCurrency, list } = useCurrency();

  return (
    <Dropdown label={<span className="tabular-nums">{currency}</span>}>
      {(close) => (
        <ul>
          {list.map((c) => (
            <li key={c}>
              <button
                onClick={() => {
                  setCurrency(c);
                  close();
                }}
                className={`flex w-full items-center justify-between gap-4 rounded-none px-3 py-2 text-left text-sm transition-colors hover:bg-sand-100 ${
                  currency === c ? "text-gold" : "text-ink"
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
