import { cn } from "@/lib/cn";

/** Heart-house brand mark, single color (currentColor). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* heart */}
      <path
        d="M32 55C32 55 7 40.5 7 23.5C7 14.9 13.6 9 21 9c5.1 0 9.2 2.9 11 7 1.8-4.1 5.9-7 11-7 7.4 0 14 5.9 14 14.5C57 40.5 32 55 32 55Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      {/* house/roof + checkmark inside */}
      <path
        d="M22 33.5 32 24l10 9.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 36.5l4.5 4.5L41 30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <LogoMark className="h-8 w-8 shrink-0 text-gold" />
      {variant === "full" && (
        <span className="font-display text-[1.35rem] leading-none tracking-tight">
          <span className="font-semibold">great</span>
          <span className="text-muted"> balivillas</span>
        </span>
      )}
    </span>
  );
}
