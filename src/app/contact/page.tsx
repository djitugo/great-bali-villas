import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";
import { WhatsappIcon, PhoneIcon, MailIcon, PinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Great Bali Villas team via WhatsApp, phone or email. We reply within hours.",
};

const CONTACTS = [
  { icon: WhatsappIcon, k: "footer.wa" as const, value: SITE.whatsapp, href: SITE.whatsappHref },
  { icon: PhoneIcon, k: "contact.office" as const, value: SITE.phoneOffice, href: SITE.phoneOfficeHref },
  { icon: MailIcon, k: "inq.email" as const, value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: PinIcon, k: "contact.address" as const, value: SITE.address, href: `https://maps.google.com/?q=${encodeURIComponent(SITE.mapsQuery)}` },
];

export default function ContactPage() {
  return (
    <section className="bg-sand pt-32 lg:pt-44">
      <div className="container-x pb-20 lg:pb-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted"><T k="contact.eyebrow" /></p>
          <h1 className="max-w-3xl font-display text-5xl tracking-tight lg:text-7xl">
            <T k="contact.title" />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted"><T k="contact.sub" /></p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="space-y-3">
              {CONTACTS.map((c) => (
                <Reveal key={c.k + c.value}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener"
                    className="flex items-start gap-4 border border-ink/10 bg-cream p-5 transition-colors hover:border-ink/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-cream">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="eyebrow block text-muted"><T k={c.k} /></span>
                      <span className="mt-1 block font-medium text-ink">{c.value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="border border-ink/10 bg-cream p-7 lg:p-9">
                <h2 className="mb-5 font-display text-2xl"><T k="contact.formTitle" /></h2>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
