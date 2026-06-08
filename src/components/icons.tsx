type P = { className?: string };
const base = (className?: string) => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const BedIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 7v11M3 13h18v5M21 13v-1a3 3 0 0 0-3-3H10v4M7 11.5a1.5 1.5 0 1 0 0-.01" />
  </svg>
);

export const BathIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M4 12V6.5A2.5 2.5 0 0 1 6.5 4a2.3 2.3 0 0 1 2 1M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2ZM6 18l-1 2M19 18l1 2M8 7h2" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const PoolIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M2 16c2 0 2 1.5 4 1.5S10 16 12 16s2 1.5 4 1.5S20 16 22 16M2 20c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 14V5a2 2 0 0 1 4 0M8 9h4" />
  </svg>
);

export const WifiIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01" />
  </svg>
);

export const ArrowIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const StarIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="m12 2 2.9 6.2 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.3l1.2-6.6L2.5 9.1l6.6-.9L12 2Z" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const WhatsappIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M.5 23.5l1.6-5.9A11.4 11.4 0 1 1 12 23.4a11.4 11.4 0 0 1-5.5-1.4L.5 23.5Zm6.3-3.7.4.2a9.5 9.5 0 1 0-3.2-3.2l.2.4-1 3.5 3.6-.9Zm11.4-5.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.1-.3.2-.5 0a7.7 7.7 0 0 1-3.8-3.3c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2 3 4.8 4.2 1.8.8 2.5.8 3.4.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z" />
  </svg>
);

export const PhoneIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const SparkleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2c.4 4.6 2.4 6.6 7 7-4.6.4-6.6 2.4-7 7-.4-4.6-2.4-6.6-7-7 4.6-.4 6.6-2.4 7-7Z" />
  </svg>
);
