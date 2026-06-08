-- Great Bali Villas — initial schema
-- Run in Supabase SQL editor or via `supabase db push` / management API.

create extension if not exists "pgcrypto";

-- ---------- properties ----------
create table if not exists public.properties (
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

create index if not exists properties_type_idx on public.properties (type);
create index if not exists properties_area_idx on public.properties (area);
create index if not exists properties_price_idx on public.properties (price);
create index if not exists properties_bedrooms_idx on public.properties (bedrooms);

-- ---------- blog posts ----------
create table if not exists public.blog_posts (
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

-- ---------- inquiries (leads) ----------
create table if not exists public.inquiries (
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
alter table public.properties  enable row level security;
alter table public.blog_posts  enable row level security;
alter table public.inquiries   enable row level security;

-- public read for published catalogue
drop policy if exists "properties public read" on public.properties;
create policy "properties public read" on public.properties
  for select using (published = true);

drop policy if exists "blog public read" on public.blog_posts;
create policy "blog public read" on public.blog_posts
  for select using (published = true);

-- anyone can submit a lead; only service role can read them
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert" on public.inquiries
  for insert with check (true);
