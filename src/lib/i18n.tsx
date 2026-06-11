"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "id";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
];

const en = {
  // nav
  "nav.home": "Home",
  "nav.about": "About",
  "nav.properties": "Properties",
  "nav.blog": "Blog",
  "nav.contact": "Contact",
  "nav.enquire": "Enquire",
  "nav.byType": "By type",
  "nav.byDest": "By destination",
  "nav.allVillas": "All {n} villas",
  "nav.language": "Language",
  "nav.currency": "Currency",
  "nav.enquireWa": "Enquire on WhatsApp",
  "nav.pages": "Villa services",
  "nav.holiday": "Holiday Rentals",
  "nav.longterm": "Long-term Villas",
  "nav.management": "Villa Management",

  // villa management page
  "vm.eyebrow": "For villa owners",
  "vm.title1": "You have the villa. ",
  "vm.title2": "We run it for you.",
  "vm.sub": "End-to-end villa management in Bali since 2014: marketing, bookings, guest care and maintenance, with full financial transparency and a competitive management fee.",
  "vm.cta": "Book a free consultation",
  "vm.cta2": "Send a message",
  "vm.s1t": "Marketing and distribution",
  "vm.s1d": "Professional photography, engaging listings and distribution across 25+ online travel agencies, including Airbnb, Booking.com and Agoda.",
  "vm.s2t": "Bookings and guest care",
  "vm.s2d": "Reservation management and 24/7 guest communication, from enquiry to check-out, in English and Indonesian.",
  "vm.s3t": "Maintenance and housekeeping",
  "vm.s3d": "Our own staff keeps your villa in top shape: cleaning, repairs, pool and garden care, with regular inspections.",
  "vm.s4t": "Reporting and transparency",
  "vm.s4d": "An owner dashboard with monthly reports, market analysis and financial modelling, so you always know how your villa performs.",
  "vm.why": "Why owners choose us",
  "vm.w1": "More than a decade managing villas across Bali and Lombok",
  "vm.w2": "Revenue-focused pricing and market strategies",
  "vm.w3": "Competitive management fee, no hidden costs",
  "vm.w4": "A dedicated local team you can reach any time",

  // hero
  "hero.eyebrow": "Villa rental and management · Bali · est. 2014",
  "hero.title1": "Your private Bali,",
  "hero.title2": "beautifully managed.",
  "hero.sub": "{n}+ handpicked villas, from romantic one-bedroom hideaways to beachfront estates. Booked direct and cared for by a local team that answers in hours.",
  "hero.cta1": "Explore villas",
  "hero.cta2": "Talk to our team",
  "hero.stat1": "Handpicked villas",
  "hero.stat2": "Destinations",
  "hero.stat3": "Years on the ground",
  "hero.stat4": "Best price direct",

  // intro
  "intro.eyebrow": "The difference",
  "intro.t1": "We are the team that ",
  "intro.t2": "actually runs",
  "intro.t3": " the villas, so what you see is what you get.",
  "intro.body": "{legal} has managed private villas across Bali and Lombok since {year}. Every home is visited, photographed and serviced by our own staff, with hotel-grade housekeeping, airport transfers and a concierge a message away.",
  "intro.link": "About us",

  // featured
  "featured.eyebrow": "Editor's picks",
  "featured.title": "Featured villas",
  "featured.viewAll": "View all {n}",
  "common.from": "from",

  // destinations
  "dest.eyebrow": "Where to stay",
  "dest.t1": "Find ",
  "dest.t2": "your",
  "dest.t3": " corner of the island",
  "dest.count": "{n} villas",

  // types
  "types.eyebrow": "The collection",
  "types.title": "Browse by style",
  "types.count": "{n} villas",

  // why
  "why.eyebrow": "Why book direct",
  "why.t1": "Hotel-grade service, the freedom of ",
  "why.t2": "your own",
  "why.t3": " villa.",
  "why.1t": "Best price, direct",
  "why.1d": "No platform mark-up and a 100% best-price guarantee when you book with the manager.",
  "why.2t": "Real, managed homes",
  "why.2d": "Every villa is run by our own staff. Verified photos, honest descriptions.",
  "why.3t": "Concierge included",
  "why.3d": "Airport transfers, private chef, spa, tours and dining, all sorted before you land.",
  "why.4t": "Replies in hours",
  "why.4d": "An English-speaking local team on WhatsApp, ready whenever you are.",

  // how
  "how.eyebrow": "How it works",
  "how.t1": "Booking, the ",
  "how.t2": "easy",
  "how.t3": " way",
  "how.sub": "No endless tabs. Tell us what you want, and we'll curate it for you.",
  "how.cta": "Start on WhatsApp",
  "how.1t": "Tell us the brief",
  "how.1d": "Your dates, group size, vibe and budget. One message is enough.",
  "how.2t": "Get curated options",
  "how.2d": "We send a tailored shortlist with real photos and honest prices.",
  "how.3t": "Book direct and relax",
  "how.3d": "Secure your villa, and let concierge handle the rest before you arrive.",

  // footer
  "footer.eyebrow": "Start the conversation",
  "footer.t1": "Let's find ",
  "footer.t2": "your",
  "footer.t3": " villa.",
  "footer.sub": "Tell us your dates, your group and the vibe you're after. Our Bali team replies within hours with handpicked options.",
  "footer.wa": "Chat on WhatsApp",
  "footer.enquiry": "Send an enquiry",
  "footer.types": "Villa types",
  "footer.dest": "Destinations",
  "footer.company": "Company",
  "footer.touch": "Get in touch",
  "footer.about": "About us",
  "footer.all": "All villas",
  "footer.longterm": "Long-term villas",
  "footer.journal": "Journal",
  "footer.contact": "Contact",
  "footer.blurb": "{legal}, boutique villa rental and management across Bali since {year}.",
  "footer.rights": "All rights reserved.",

  // filters
  "filters.search": "Search",
  "filters.searchPh": "Name, area, feature...",
  "filters.type": "Type",
  "filters.allTypes": "All types",
  "filters.dest": "Destination",
  "filters.allAreas": "All areas",
  "filters.bedrooms": "Bedrooms",
  "filters.any": "Any",
  "filters.nBeds": "{n}+ bedrooms",
  "filters.sort": "Sort",
  "filters.sortFeatured": "Featured",
  "filters.sortPriceAsc": "Price: low to high",
  "filters.sortPriceDesc": "Price: high to low",
  "filters.sortName": "Name A-Z",
  "filters.villas": "villas",
  "filters.clear": "Clear all",

  // properties listing
  "list.eyebrow": "{n} villas across Bali",
  "list.title": "Every villa, handpicked",
  "list.titleArea": "Villas in {x}",
  "list.empty": "No villas match those filters.",
  "list.clear": "Clear filters",
  "list.prev": "Prev",
  "list.next": "Next",

  // longterm
  "lt.eyebrow": "Monthly and yearly stays",
  "lt.title1": "Long-term ",
  "lt.title2": "villas",
  "lt.sub": "A curated collection of villas for monthly and long-stay rentals across Bali. Tell us your dates and budget, and we'll match you with the right home.",
  "lt.cta": "Ask about long stays",

  // detail
  "detail.home": "Home",
  "detail.villas": "Villas",
  "detail.about": "About this villa",
  "detail.features": "Features and amenities",
  "detail.bedrooms": "Bedrooms",
  "detail.bathrooms": "Bathrooms",
  "detail.area": "Area",
  "detail.type": "Type",
  "detail.also": "You may also like",
  "detail.all": "All villas",
  "detail.call": "Or call {phone}. We reply within hours.",

  // inquiry form
  "inq.wa": "Enquire on WhatsApp",
  "inq.or": "or send a request",
  "inq.name": "Full name",
  "inq.email": "Email",
  "inq.phone": "Phone / WA",
  "inq.guests": "Guests",
  "inq.notes": "Anything we should know?",
  "inq.submit": "Request availability",
  "inq.sending": "Sending...",
  "inq.thanks": "Thank you!",
  "inq.thanksBody": "We've received your enquiry for {name}. Our team will reply shortly.",
  "inq.continue": "Continue on WhatsApp",
  "inq.error": "Something went wrong. Please try WhatsApp above.",
  "inq.checkin": "Check-in",
  "inq.checkout": "Check-out",

  // contact
  "contact.eyebrow": "Contact",
  "contact.title": "Let's plan your stay.",
  "contact.sub": "Tell us your dates and what you're after. Our Bali team will reply within hours with a handpicked shortlist.",
  "contact.office": "Office",
  "contact.address": "Address",
  "contact.formTitle": "Send us a message",
  "contact.message": "How can we help?",
  "contact.send": "Send message",
  "contact.sent": "Message sent",
  "contact.sentBody": "Thanks for reaching out. We'll be in touch shortly.",

  // about
  "about.eyebrow": "Since {year}",
  "about.title": "A Bali villa company run by people who live here.",
  "about.body": "{legal} began in {year} with a simple idea: give villa guests the reliability of a hotel without giving up the privacy of their own home. Today our team manages {n} private villas, resorts and bungalows across Bali and Lombok.",
  "about.believe": "What we believe",
  "about.v1t": "Owned, not aggregated",
  "about.v1d": "We don't resell listings. We manage these villas ourselves: staffing, cleaning, maintenance and guest care.",
  "about.v2t": "Hotel service, villa freedom",
  "about.v2d": "Daily housekeeping, airport pick-up, private chef and concierge. The comfort of a resort in your own home.",
  "about.v3t": "Honest by default",
  "about.v3d": "Real photos, transparent pricing, and a 100% best-price guarantee when you book direct.",
  "about.v4t": "A local team",
  "about.v4d": "An English-speaking crew on the ground in Bali, reachable on WhatsApp and quick to reply.",
  "about.s1": "Villas under management",
  "about.s2": "Years on the island",
  "about.s3": "Best-price guarantee",
  "about.own": "Own a villa? We'll run it like our own.",
  "about.talk": "Talk to us",
  "about.browse": "Browse villas",

  // blog
  "blog.eyebrow": "Journal",
  "blog.title": "Bali, by the people who live here.",
  "blog.read": "Read article",
  "blog.back": "Journal",
  "blog.ready": "Ready to experience it yourself?",
  "blog.readyBody": "Browse {n} private villas across Bali.",
  "blog.explore": "Explore villas",
  "blog.more": "More from the journal",

  // gallery
  "gallery.more": "+{n} photos",
  "gallery.viewAll": "View all {n} photos",

  // price
  "price.onRequest": "On request",
  "price.night": "night",
  "price.month": "month",

  // 404
  "nf.title": "This page slipped away.",
  "nf.sub": "The villa or page you're looking for isn't here.",
  "nf.home": "Back home",
  "nf.browse": "Browse villas",
};

const id: typeof en = {
  "nav.home": "Beranda",
  "nav.about": "Tentang",
  "nav.properties": "Properti",
  "nav.blog": "Blog",
  "nav.contact": "Kontak",
  "nav.enquire": "Hubungi Kami",
  "nav.byType": "Berdasarkan tipe",
  "nav.byDest": "Berdasarkan destinasi",
  "nav.allVillas": "Semua {n} vila",
  "nav.language": "Bahasa",
  "nav.currency": "Mata uang",
  "nav.enquireWa": "Tanya via WhatsApp",
  "nav.pages": "Layanan vila",
  "nav.holiday": "Sewa Liburan",
  "nav.longterm": "Vila Jangka Panjang",
  "nav.management": "Pengelolaan Vila",

  "vm.eyebrow": "Untuk pemilik vila",
  "vm.title1": "Anda punya vilanya. ",
  "vm.title2": "Kami yang mengelola.",
  "vm.sub": "Pengelolaan vila menyeluruh di Bali sejak 2014: pemasaran, reservasi, layanan tamu, dan perawatan, dengan transparansi keuangan penuh serta biaya pengelolaan yang kompetitif.",
  "vm.cta": "Konsultasi gratis sekarang",
  "vm.cta2": "Kirim pesan",
  "vm.s1t": "Pemasaran dan distribusi",
  "vm.s1d": "Fotografi profesional, listing yang menarik, dan distribusi ke 25+ online travel agency, termasuk Airbnb, Booking.com, dan Agoda.",
  "vm.s2t": "Reservasi dan layanan tamu",
  "vm.s2d": "Pengelolaan pemesanan dan komunikasi tamu 24/7, dari pertanyaan awal hingga check-out, dalam bahasa Inggris dan Indonesia.",
  "vm.s3t": "Perawatan dan housekeeping",
  "vm.s3d": "Staf kami sendiri yang menjaga kondisi vila Anda: kebersihan, perbaikan, perawatan kolam dan taman, dengan inspeksi berkala.",
  "vm.s4t": "Laporan dan transparansi",
  "vm.s4d": "Dashboard pemilik dengan laporan bulanan, analisis pasar, dan proyeksi keuangan, sehingga Anda selalu tahu performa vila Anda.",
  "vm.why": "Kenapa pemilik memilih kami",
  "vm.w1": "Lebih dari satu dekade mengelola vila di Bali dan Lombok",
  "vm.w2": "Strategi harga dan pemasaran yang fokus pada pendapatan",
  "vm.w3": "Biaya pengelolaan kompetitif, tanpa biaya tersembunyi",
  "vm.w4": "Tim lokal khusus yang bisa Anda hubungi kapan saja",

  "hero.eyebrow": "Sewa dan pengelolaan vila · Bali · sejak 2014",
  "hero.title1": "Bali pribadi Anda,",
  "hero.title2": "dikelola sepenuh hati.",
  "hero.sub": "Lebih dari {n} vila pilihan, mulai dari vila satu kamar yang romantis hingga estate tepi pantai. Pesan langsung, ditangani tim lokal yang membalas dalam hitungan jam.",
  "hero.cta1": "Jelajahi vila",
  "hero.cta2": "Hubungi tim kami",
  "hero.stat1": "Vila pilihan",
  "hero.stat2": "Destinasi",
  "hero.stat3": "Tahun beroperasi",
  "hero.stat4": "Harga terbaik langsung",

  "intro.eyebrow": "Yang membedakan",
  "intro.t1": "Kami tim yang ",
  "intro.t2": "benar-benar mengelola",
  "intro.t3": " vilanya, jadi apa yang Anda lihat itulah yang Anda dapatkan.",
  "intro.body": "{legal} mengelola vila privat di Bali dan Lombok sejak {year}. Setiap vila kami kunjungi, foto, dan rawat sendiri, lengkap dengan housekeeping standar hotel, antar-jemput bandara, serta concierge yang siap dihubungi kapan saja.",
  "intro.link": "Tentang kami",

  "featured.eyebrow": "Pilihan kami",
  "featured.title": "Vila unggulan",
  "featured.viewAll": "Lihat semua {n}",
  "common.from": "mulai",

  "dest.eyebrow": "Pilih lokasi",
  "dest.t1": "Temukan sudut pulau ",
  "dest.t2": "favorit",
  "dest.t3": " Anda",
  "dest.count": "{n} vila",

  "types.eyebrow": "Koleksi kami",
  "types.title": "Telusuri berdasarkan tipe",
  "types.count": "{n} vila",

  "why.eyebrow": "Kenapa pesan langsung",
  "why.t1": "Layanan standar hotel, dengan kebebasan ",
  "why.t2": "vila pribadi",
  "why.t3": " Anda.",
  "why.1t": "Harga terbaik, langsung",
  "why.1d": "Tanpa markup platform, dengan jaminan harga terbaik 100% saat memesan langsung ke pengelola.",
  "why.2t": "Vila asli, dikelola sendiri",
  "why.2d": "Setiap vila dijalankan oleh staf kami sendiri. Foto terverifikasi, deskripsi apa adanya.",
  "why.3t": "Sudah termasuk concierge",
  "why.3d": "Antar-jemput bandara, private chef, spa, tur, dan reservasi kuliner kami siapkan sebelum Anda tiba.",
  "why.4t": "Balasan cepat",
  "why.4d": "Tim lokal yang fasih berbahasa Inggris di WhatsApp, siap membantu kapan pun Anda butuh.",

  "how.eyebrow": "Cara kerjanya",
  "how.t1": "Memesan dengan cara yang ",
  "how.t2": "mudah",
  "how.t3": "",
  "how.sub": "Tidak perlu membuka puluhan tab. Sampaikan kebutuhan Anda, kami yang kurasikan.",
  "how.cta": "Mulai lewat WhatsApp",
  "how.1t": "Sampaikan kebutuhan Anda",
  "how.1d": "Tanggal menginap, jumlah tamu, suasana yang dicari, dan budget. Satu pesan saja cukup.",
  "how.2t": "Terima pilihan terkurasi",
  "how.2d": "Kami kirimkan daftar pilihan yang sesuai, dengan foto asli dan harga transparan.",
  "how.3t": "Pesan langsung, lalu santai",
  "how.3d": "Amankan vila Anda, dan biarkan concierge kami mengurus sisanya sebelum Anda tiba.",

  "footer.eyebrow": "Mulai percakapan",
  "footer.t1": "Mari temukan vila ",
  "footer.t2": "Anda",
  "footer.t3": ".",
  "footer.sub": "Sampaikan tanggal, jumlah tamu, dan suasana yang Anda cari. Tim kami di Bali akan membalas dalam hitungan jam dengan pilihan vila terbaik.",
  "footer.wa": "Chat via WhatsApp",
  "footer.enquiry": "Kirim pertanyaan",
  "footer.types": "Tipe vila",
  "footer.dest": "Destinasi",
  "footer.company": "Perusahaan",
  "footer.touch": "Kontak kami",
  "footer.about": "Tentang kami",
  "footer.all": "Semua vila",
  "footer.longterm": "Vila jangka panjang",
  "footer.journal": "Jurnal",
  "footer.contact": "Kontak",
  "footer.blurb": "{legal}, layanan sewa dan pengelolaan vila butik di Bali sejak {year}.",
  "footer.rights": "Hak cipta dilindungi.",

  "filters.search": "Cari",
  "filters.searchPh": "Nama, area, fasilitas...",
  "filters.type": "Tipe",
  "filters.allTypes": "Semua tipe",
  "filters.dest": "Destinasi",
  "filters.allAreas": "Semua area",
  "filters.bedrooms": "Kamar tidur",
  "filters.any": "Semua",
  "filters.nBeds": "{n}+ kamar",
  "filters.sort": "Urutkan",
  "filters.sortFeatured": "Unggulan",
  "filters.sortPriceAsc": "Harga: terendah",
  "filters.sortPriceDesc": "Harga: tertinggi",
  "filters.sortName": "Nama A-Z",
  "filters.villas": "vila",
  "filters.clear": "Reset",

  "list.eyebrow": "{n} vila di seluruh Bali",
  "list.title": "Semua vila, dipilih dengan cermat",
  "list.titleArea": "Vila di {x}",
  "list.empty": "Tidak ada vila yang cocok dengan filter ini.",
  "list.clear": "Reset filter",
  "list.prev": "Sebelumnya",
  "list.next": "Berikutnya",

  "lt.eyebrow": "Sewa bulanan dan tahunan",
  "lt.title1": "Vila ",
  "lt.title2": "jangka panjang",
  "lt.sub": "Koleksi vila pilihan untuk sewa bulanan dan jangka panjang di Bali. Sampaikan periode dan budget Anda, kami carikan vila yang tepat.",
  "lt.cta": "Tanya sewa jangka panjang",

  "detail.home": "Beranda",
  "detail.villas": "Vila",
  "detail.about": "Tentang vila ini",
  "detail.features": "Fasilitas",
  "detail.bedrooms": "Kamar tidur",
  "detail.bathrooms": "Kamar mandi",
  "detail.area": "Area",
  "detail.type": "Tipe",
  "detail.also": "Vila serupa",
  "detail.all": "Semua vila",
  "detail.call": "Atau telepon {phone}. Kami balas dalam hitungan jam.",

  "inq.wa": "Tanya via WhatsApp",
  "inq.or": "atau kirim permintaan",
  "inq.name": "Nama lengkap",
  "inq.email": "Email",
  "inq.phone": "Telepon / WA",
  "inq.guests": "Jumlah tamu",
  "inq.notes": "Ada permintaan khusus?",
  "inq.submit": "Cek ketersediaan",
  "inq.sending": "Mengirim...",
  "inq.thanks": "Terima kasih!",
  "inq.thanksBody": "Pertanyaan Anda untuk {name} sudah kami terima. Tim kami akan segera membalas.",
  "inq.continue": "Lanjutkan di WhatsApp",
  "inq.error": "Terjadi kendala. Silakan coba lewat WhatsApp di atas.",
  "inq.checkin": "Check-in",
  "inq.checkout": "Check-out",

  "contact.eyebrow": "Kontak",
  "contact.title": "Mari rencanakan liburan Anda.",
  "contact.sub": "Sampaikan tanggal dan kebutuhan Anda. Tim kami di Bali akan membalas dalam hitungan jam dengan daftar pilihan terbaik.",
  "contact.office": "Kantor",
  "contact.address": "Alamat",
  "contact.formTitle": "Kirim pesan kepada kami",
  "contact.message": "Apa yang bisa kami bantu?",
  "contact.send": "Kirim pesan",
  "contact.sent": "Pesan terkirim",
  "contact.sentBody": "Terima kasih sudah menghubungi kami. Kami akan segera membalas.",

  "about.eyebrow": "Sejak {year}",
  "about.title": "Perusahaan vila Bali yang dijalankan oleh orang-orang yang tinggal di sini.",
  "about.body": "{legal} berdiri pada {year} dengan ide sederhana: memberi tamu vila kepastian layanan sekelas hotel tanpa kehilangan privasi rumah sendiri. Kini tim kami mengelola {n} vila privat, resor, dan bungalow di Bali dan Lombok.",
  "about.believe": "Nilai yang kami pegang",
  "about.v1t": "Dikelola, bukan sekadar listing",
  "about.v1d": "Kami tidak menjual ulang listing. Vila-vila ini kami kelola sendiri: staf, kebersihan, perawatan, dan layanan tamu.",
  "about.v2t": "Layanan hotel, kebebasan vila",
  "about.v2d": "Housekeeping harian, penjemputan bandara, private chef, dan concierge. Kenyamanan resor di rumah Anda sendiri.",
  "about.v3t": "Jujur apa adanya",
  "about.v3d": "Foto asli, harga transparan, dan jaminan harga terbaik 100% saat memesan langsung.",
  "about.v4t": "Tim lokal",
  "about.v4d": "Tim di Bali yang fasih berbahasa Inggris, mudah dihubungi lewat WhatsApp, dan cepat membalas.",
  "about.s1": "Vila dalam pengelolaan",
  "about.s2": "Tahun di Bali",
  "about.s3": "Jaminan harga terbaik",
  "about.own": "Punya vila? Kami kelola seperti milik sendiri.",
  "about.talk": "Hubungi kami",
  "about.browse": "Lihat vila",

  "blog.eyebrow": "Jurnal",
  "blog.title": "Bali, dari kacamata orang yang tinggal di sini.",
  "blog.read": "Baca artikel",
  "blog.back": "Jurnal",
  "blog.ready": "Siap merasakannya sendiri?",
  "blog.readyBody": "Jelajahi {n} vila privat di seluruh Bali.",
  "blog.explore": "Jelajahi vila",
  "blog.more": "Artikel lainnya",

  "gallery.more": "+{n} foto",
  "gallery.viewAll": "Lihat semua {n} foto",

  "price.onRequest": "Hubungi kami",
  "price.night": "malam",
  "price.month": "bulan",

  "nf.title": "Halaman tidak ditemukan.",
  "nf.sub": "Vila atau halaman yang Anda cari tidak ada di sini.",
  "nf.home": "Kembali ke beranda",
  "nf.browse": "Lihat vila",
};

const dict: Record<Lang, typeof en> = { en, id };

export type DictKey = keyof typeof en;
type Vars = Record<string, string | number>;

function interpolate(s: string, vars?: Vars) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey, vars?: Vars) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("gbv-lang") as Lang | null;
    if (saved === "en" || saved === "id") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("gbv-lang", l);
  };

  const t = (k: DictKey, vars?: Vars) => interpolate(dict[lang][k] ?? dict.en[k] ?? k, vars);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Translated text island, usable from server components. */
export function T({ k, vars }: { k: DictKey; vars?: Vars }) {
  const { t } = useI18n();
  return <>{t(k, vars)}</>;
}
