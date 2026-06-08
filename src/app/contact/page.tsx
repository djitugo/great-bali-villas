import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { WhatsappIcon, PhoneIcon, MailIcon, PinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Great Bali Villas team — WhatsApp, phone or email. We reply within hours.",
};

export default function ContactPage() {
  const contacts = [
    { icon: WhatsappIcon, label: "WhatsApp", value: SITE.whatsapp, href: SITE.whatsappHref },
    { icon: PhoneIcon, label: "Office", value: SITE.phoneOffice, href: SITE.phoneOfficeHref },
    { icon: MailIcon, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: PinIcon, label: "Office", value: SITE.address, href: `https://maps.google.com/?q=${encodeURIComponent(SITE.mapsQuery)}` },
  ];

  return (
    <section className="bg-sand pt-32 lg:pt-44">
      <div className="container-x pb-20 lg:pb-28">
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-muted">Contact</p>
          <h1 className="max-w-3xl font-display text-5xl tracking-tight lg:text-7xl">
            Let&apos;s plan your stay.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Tell us your dates and what you&apos;re after — our Bali team will reply within hours with
            a handpicked shortlist.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="space-y-3">
              {contacts.map((c) => (
                <Reveal key={c.label + c.value}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener"
                    className="flex items-start gap-4 rounded-2xl border border-sand-200 bg-cream p-5 transition-colors hover:border-sand-300"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-jungle text-cream">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-widest text-muted">{c.label}</span>
                      <span className="mt-0.5 block font-medium text-ink">{c.value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-sand-200 bg-cream p-7 lg:p-9">
                <h2 className="mb-5 font-display text-2xl">Send us a message</h2>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
