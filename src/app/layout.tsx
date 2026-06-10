import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Loader } from "@/components/Loader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { SITE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greatbalivillas.com"),
  title: {
    default: `${SITE.name} | Private Villa Rental in Bali`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Bali villas",
    "private villa Bali",
    "villa rental Seminyak",
    "Ubud villa",
    "Canggu villa",
    "honeymoon villa Bali",
  ],
  openGraph: {
    type: "website",
    title: `${SITE.name} | Private Villa Rental in Bali`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>
          <Loader />
          <SmoothScroll />
          <SiteHeader />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
