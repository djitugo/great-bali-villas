"use client";

import { Reveal } from "@/components/Reveal";
import { CheckIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const CONTENT = {
  en: {
    eyebrow: "Choose your package",
    title: "Two ways to partner",
    note: "Note: tax reporting is not included. All villa-related tax obligations remain the owner's responsibility; assistance with local tax reporting is available on request with a valid NPWPD. Basic requirements: villa operation licences (IMB/PBG, SLF, NIB, NPWPD and Pondok Wisata if any), excellent photography, complete property staff (housekeeper, pool and gardener), and standard amenities and facilities.",
    enquire: "Enquire",
    feeNote: "of gross revenue, before OTA commission",
    packages: [
      {
        name: "Exclusive Marketing",
        fee: "10%",
        period: "6-month contract",
        best: "For owners focused on revenue growth while handling operations independently.",
        incl: ["Channel manager set-up", "Property management software (PMS)", "Reservation management", "OTA management & distribution", "Pricing strategy", "Digital marketing strategy", "Booking list report"],
        featured: false,
      },
      {
        name: "Full Management",
        fee: "20%",
        period: "1-year contract",
        best: "Perfect for owners wanting stress-free, end-to-end villa care.",
        incl: ["Everything in Exclusive Marketing", "Property care & maintenance", "Property set-up & operations", "Guest hospitality & concierge", "HR: recruitment, training, contracts", "Review monitoring & management", "Financial reports (P&L, expenses)", "Google Business set-up"],
        featured: true,
      },
    ],
  },
  id: {
    eyebrow: "Pilih paket Anda",
    title: "Dua cara bermitra",
    note: "Catatan: pelaporan pajak tidak termasuk. Seluruh kewajiban pajak terkait vila tetap menjadi tanggung jawab pemilik; bantuan pelaporan pajak daerah tersedia atas permintaan dengan NPWPD yang valid. Persyaratan dasar: izin operasional vila (IMB/PBG, SLF, NIB, NPWPD, dan Pondok Wisata bila ada), fotografi yang baik, staf properti lengkap (housekeeper, kolam, dan tukang kebun), serta amenitas dan fasilitas standar.",
    enquire: "Tanya",
    feeNote: "dari pendapatan kotor, sebelum komisi OTA",
    packages: [
      {
        name: "Exclusive Marketing",
        fee: "10%",
        period: "Kontrak 6 bulan",
        best: "Untuk pemilik yang fokus pada pertumbuhan pendapatan sambil mengelola operasional secara mandiri.",
        incl: ["Penyiapan channel manager", "Property management software (PMS)", "Pengelolaan reservasi", "Pengelolaan & distribusi OTA", "Strategi harga", "Strategi pemasaran digital", "Laporan daftar pemesanan"],
        featured: false,
      },
      {
        name: "Full Management",
        fee: "20%",
        period: "Kontrak 1 tahun",
        best: "Cocok untuk pemilik yang ingin perawatan vila menyeluruh tanpa repot.",
        incl: ["Semua di paket Exclusive Marketing", "Perawatan & pemeliharaan properti", "Penyiapan & operasional properti", "Layanan tamu & concierge", "HR: rekrutmen, pelatihan, kontrak", "Pemantauan & pengelolaan ulasan", "Laporan keuangan (L/R, biaya)", "Penyiapan Google Business"],
        featured: true,
      },
    ],
  },
};

export function VmPackages() {
  const { lang } = useI18n();
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <section className="border-t border-ink/10 bg-sand">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted">{c.eyebrow}</p>
          <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
        </Reveal>
        <div className="grid gap-px border border-ink/10 bg-ink/10 lg:grid-cols-2">
          {c.packages.map((pkg) => (
            <Reveal key={pkg.name}>
              <div className={`flex h-full flex-col p-8 lg:p-10 ${pkg.featured ? "bg-ink text-cream" : "bg-cream"}`}>
                <h3 className="font-display text-2xl">{pkg.name}</h3>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-5xl">{pkg.fee}</span>
                  <span className={`text-xs ${pkg.featured ? "text-cream/60" : "text-muted"}`}>{c.feeNote}</span>
                </div>
                <p className={`eyebrow mt-3 ${pkg.featured ? "text-cream/60" : "text-muted"}`}>{pkg.period}</p>
                <p className={`mt-4 text-sm leading-relaxed ${pkg.featured ? "text-cream/75" : "text-muted"}`}>{pkg.best}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {pkg.incl.map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${pkg.featured ? "text-cream/70" : "text-ink"}`} />
                      <span className={pkg.featured ? "text-cream/85" : ""}>{x}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`${SITE.whatsappCtaHref}?text=${encodeURIComponent(`Hi Great Bali Villas! I'm interested in the ${pkg.name} package for my villa.`)}`}
                  target="_blank"
                  rel="noopener"
                  className={`mt-8 ${pkg.featured ? "btn btn-light" : "btn btn-dark"}`}
                >
                  {c.enquire}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{c.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
