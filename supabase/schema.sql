-- ═══════════════════════════════════════════════════════════════
-- KAGO ATELIER — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TABLE: lookbook_images ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lookbook_images (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT        NOT NULL,
  brand         TEXT,
  piece         TEXT,
  price         TEXT,
  image_url     TEXT        NOT NULL,
  category      TEXT        DEFAULT 'editorial'
                            CHECK (category IN ('editorial','power','evening','archive','other')),
  featured      BOOLEAN     DEFAULT false,
  published     BOOLEAN     DEFAULT true,
  display_order INTEGER     DEFAULT 0,
  ph_class      TEXT        DEFAULT 'ph-b',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: bookings ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name    TEXT        NOT NULL,
  client_email   TEXT        NOT NULL,
  client_phone   TEXT,
  service        TEXT        NOT NULL,
  preferred_date DATE,
  budget         TEXT,
  message        TEXT,
  status         TEXT        DEFAULT 'new'
                             CHECK (status IN ('new','contacted','confirmed','completed','cancelled')),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: subscribers ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscribers (
  id              UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  email           TEXT        NOT NULL UNIQUE,
  name            TEXT,
  role_industry   TEXT,
  active          BOOLEAN     DEFAULT true,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: contacts ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  read       BOOLEAN     DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TRIGGERS: updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lookbook_images_updated_at
  BEFORE UPDATE ON public.lookbook_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────
ALTER TABLE public.lookbook_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts         ENABLE ROW LEVEL SECURITY;

-- lookbook_images: public can read published, auth can write
CREATE POLICY "Public can read published lookbook" ON public.lookbook_images
  FOR SELECT USING (published = true);

CREATE POLICY "Auth can manage lookbook" ON public.lookbook_images
  FOR ALL USING (auth.role() = 'authenticated');

-- bookings: anyone can insert, only auth can read/update
CREATE POLICY "Anyone can book" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth can manage bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- subscribers: anyone can subscribe, auth can manage
CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth can manage subscribers" ON public.subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- contacts: anyone can submit, auth can read
CREATE POLICY "Anyone can contact" ON public.contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth can manage contacts" ON public.contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- ── STORAGE BUCKET ────────────────────────────────────────────
-- Run this after creating the bucket manually in:
-- Supabase Dashboard → Storage → New Bucket
-- Bucket name: kago-gallery  (enable Public)
--
-- Then set these storage policies:
INSERT INTO storage.buckets (id, name, public)
VALUES ('kago-gallery', 'kago-gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'kago-gallery');

CREATE POLICY "Auth can upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'kago-gallery' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Auth can delete gallery images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'kago-gallery' AND
    auth.role() = 'authenticated'
  );

-- ── SAMPLE DATA ───────────────────────────────────────────────
-- Optional: seed with placeholder looks (no images, uses ph_class for placeholders)
INSERT INTO public.lookbook_images (title, brand, piece, price, image_url, category, featured, display_order, ph_class) VALUES
  ('The Cashmere Power Suit', 'Loro Piana', 'Cashmere Tailored Suit', 'From £8,400', '', 'power', true, 1, 'ph-a'),
  ('The Refined Neutral', 'Brunello Cucinelli', 'Linen Blazer & Trousers', 'From £5,200', '', 'editorial', true, 2, 'ph-b'),
  ('The Sculpted Femme', 'Alexander McQueen', 'Fitted Blazer & Sheath Dress', 'From £4,800', '', 'editorial', true, 3, 'ph-c'),
  ('The Power Silhouette', 'Saint Laurent', 'Le Smoking Tuxedo', 'From £6,000', '', 'evening', true, 4, 'ph-d'),
  ('Understated Heritage', 'Ralph Lauren', 'Purple Label Equestrian Tweed', 'From £3,800', '', 'power', false, 5, 'ph-e'),
  ('The New Look Reborn', 'Dior Vintage', 'Bar Jacket & Pencil Skirt', 'Upon Request', '', 'archive', false, 6, 'ph-f')
ON CONFLICT DO NOTHING;
