-- Great Bali Villas — initial schema.
-- NOTE: this Supabase project is SHARED with other apps. All tables are
-- namespaced with the `gbv_` prefix to avoid collisions.

create extension if not exists "pgcrypto";

-- ---------- gbv_properties ----------
create table if not exists public.gbv_properties (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  kind        text not null default 'rental',
  name        text not null,
  source_url  text,
  price_text  text,
  price       bigint,
  currency    text default 'IDR',
  period      text,
  type        text,
  bedrooms    int,
  bathrooms   int,
  area        text,
  area_raw    text,
  city        text,
  state       text,
  zip         text,
  country     text,
  address     text,
  description text,
  features    text[] default '{}',
  images      text[] default '{}',
  featured    boolean default false,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists gbv_properties_type_idx on public.gbv_properties (type);
create index if not exists gbv_properties_area_idx on public.gbv_properties (area);
create index if not exists gbv_properties_price_idx on public.gbv_properties (price);
create index if not exists gbv_properties_bedrooms_idx on public.gbv_properties (bedrooms);

-- ---------- gbv_blog_posts ----------
create table if not exists public.gbv_blog_posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  excerpt    text,
  date       date,
  cover      text,
  body       text[] default '{}',
  published  boolean default true,
  created_at timestamptz default now()
);

-- ---------- gbv_inquiries (leads) ----------
create table if not exists public.gbv_inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  checkin       date,
  checkout      date,
  guests        int,
  message       text,
  property_name text,
  property_slug text,
  status        text default 'new',
  created_at    timestamptz default now()
);

-- ---------- RLS ----------
alter table public.gbv_properties enable row level security;
alter table public.gbv_blog_posts enable row level security;
alter table public.gbv_inquiries  enable row level security;

drop policy if exists "gbv_properties public read" on public.gbv_properties;
create policy "gbv_properties public read" on public.gbv_properties
  for select using (published = true);

drop policy if exists "gbv_blog public read" on public.gbv_blog_posts;
create policy "gbv_blog public read" on public.gbv_blog_posts
  for select using (published = true);

drop policy if exists "gbv_inquiries public insert" on public.gbv_inquiries;
create policy "gbv_inquiries public insert" on public.gbv_inquiries
  for insert with check (true);
