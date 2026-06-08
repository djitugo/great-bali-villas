# Great Bali Villas

Modern redesign of [greatbalivillas.com](https://greatbalivillas.com) — a boutique Bali villa
rental & management company. Built to drive enquiries and showcase the full villa catalogue.

## Stack

- **Next.js 16** (App Router, SSG) + **TypeScript**
- **Tailwind CSS v4** — monochrome (black & white) design system
- **Framer Motion** — page transitions, loader, scroll reveals
- **Lenis** — desktop-only smooth scrolling
- **Supabase** — image CDN (Storage) + Postgres (properties, blog, inquiries)
- **Vercel** — hosting

## Content

- **875 villas** + **11 journal articles** scraped from the legacy WordPress/Houzez site.
- All gallery images compressed to WebP and re-hosted on Supabase Storage (`property-images` bucket).
- Property data is bundled as static JSON (`src/data/*.json`) and rendered with SSG;
  Supabase is the system of record for new listings + inquiries.

## Features

- Fully responsive (functional hamburger + full-screen mobile menu)
- Unique first-load loader + distinct per-route page transition
- Properties mega-dropdown (by type + destination), language switcher, currency switcher
- Filterable catalogue (type / destination / bedrooms / price / search / sort) with pagination
- Villa detail pages with lightbox gallery + WhatsApp / form enquiry
- SEO: per-page metadata, sitemap (all villas), robots

## Scripts (`/scripts`)

| Script | Purpose |
| --- | --- |
| `scrape.mjs` | Scrape all `/property` + `/longterm` listings -> `src/data/properties.json` |
| `images.mjs` | Download -> compress (WebP) -> upload galleries to Supabase Storage |
| `scrape-blog.mjs` | Scrape journal posts -> `src/data/blog.json` |
| `seed.mjs` | Seed Supabase `properties` / `blog_posts` from the JSON |

## Supabase

Schema lives in `supabase/migrations/0001_init.sql`. Apply it, then run:

```bash
SUPABASE_SERVICE_KEY=... node scripts/seed.mjs
```

## Environment

Copy `.env.example` -> `.env.local` and fill in Supabase URL + keys.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (prerenders ~896 pages)
```
