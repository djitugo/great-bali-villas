export const SITE = {
  name: "Great Bali Villas",
  legalName: "PT. Great Bali Hebat",
  tagline: "Your private Bali, beautifully managed.",
  since: 2014,
  description:
    "Handpicked private villas across Bali, from romantic one-bedroom hideaways to beachfront estates. Boutique villa rental and management with hotel-grade service since 2014.",
  email: "info@greatbalivillas.com",
  phoneOffice: "+62 361 3352158",
  phoneOfficeHref: "tel:+623613352158",
  whatsapp: "+62 821-4647-5705",
  whatsappHref: "https://wa.me/6282146475705",
  address: "Jln Bukit Sari Utara No.88X, Padangsambian Kaja, Denpasar Barat, Bali 80117",
  mapsQuery: "Great Bali Villas Denpasar Barat Bali",
  social: {
    instagram: "https://instagram.com/greatbalivillas.official",
    facebook: "https://facebook.com/greatbalivillas",
    tiktok: "https://tiktok.com/@greatbalivillas",
    whatsapp: "https://wa.me/6282146475705",
  },
  partners: ["Airbnb", "Booking.com", "Agoda", "Expedia", "Traveloka", "Tiket.com"],
  stats: {
    villas: "400+",
    years: new Date().getFullYear() - 2014,
    areas: "15+",
  },
};

export const NAV: {
  key: "home" | "about" | "properties" | "blog" | "contact";
  href: string;
  dropdown?: boolean;
}[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "properties", href: "/properties", dropdown: true },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
];

export const HERO_AREAS = ["Seminyak", "Ubud", "Canggu", "Jimbaran", "Uluwatu", "Nusa Dua"];

// Iconic Bali destinations for the home hero slideshow (HD stock, re-hosted on our CDN).
const CDN = "https://bhwpyermrhoprtwgybtz.supabase.co/storage/v1/object/public/property-images";
export const HERO_IMAGES = [
  `${CDN}/hero/tanah-lot.webp`,
  `${CDN}/hero/kelingking.webp`,
  `${CDN}/hero/lempuyang.webp`,
  `${CDN}/hero/uluwatu.webp`,
  `${CDN}/hero/tegallalang.webp`,
  `${CDN}/hero/handara.webp`,
];
