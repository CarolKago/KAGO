-- ═══════════════════════════════════════════════════════════════
-- KAGO ATELIER — Supabase Schema v2 (Additive Migration)
-- Safe to run multiple times — uses IF NOT EXISTS throughout.
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── EXTEND: lookbook_images ────────────────────────────────────
-- Season slug for collection grouping (e.g. 'summer-2026')
ALTER TABLE public.lookbook_images
  ADD COLUMN IF NOT EXISTS season_slug      TEXT,
  ADD COLUMN IF NOT EXISTS occasion         TEXT,
  ADD COLUMN IF NOT EXISTS story            TEXT,
  ADD COLUMN IF NOT EXISTS look_number      INTEGER,
  ADD COLUMN IF NOT EXISTS collection_slug  TEXT;   -- e.g. 'summer-lookbook-2026'

-- ── TABLE: look_images (multi-view per look) ───────────────────
CREATE TABLE IF NOT EXISTS public.look_images (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  look_id       UUID        NOT NULL REFERENCES public.lookbook_images(id) ON DELETE CASCADE,
  image_url     TEXT        NOT NULL,
  view_type     TEXT        DEFAULT 'front'
                            CHECK (view_type IN ('front','back','side','detail','hero')),
  display_order INTEGER     DEFAULT 0,
  alt_text      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS look_images_look_id_idx ON public.look_images(look_id);

ALTER TABLE public.look_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read look images" ON public.look_images
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Auth can manage look images" ON public.look_images
  FOR ALL USING (auth.role() = 'authenticated');

-- ── TABLE: weekly_edits ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weekly_edits (
  id              UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title           TEXT        NOT NULL,
  subtitle        TEXT,
  editorial_note  TEXT,
  week_of         DATE,
  hero_image_url  TEXT,
  published       BOOLEAN     DEFAULT false,
  display_order   INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.weekly_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read published weekly edits" ON public.weekly_edits
  FOR SELECT USING (published = true);

CREATE POLICY IF NOT EXISTS "Auth can manage weekly edits" ON public.weekly_edits
  FOR ALL USING (auth.role() = 'authenticated');

-- ── TABLE: weekly_edit_looks (junction) ────────────────────────
CREATE TABLE IF NOT EXISTS public.weekly_edit_looks (
  edit_id       UUID    NOT NULL REFERENCES public.weekly_edits(id) ON DELETE CASCADE,
  look_id       UUID    NOT NULL REFERENCES public.lookbook_images(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (edit_id, look_id)
);

ALTER TABLE public.weekly_edit_looks ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read weekly edit looks" ON public.weekly_edit_looks
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Auth can manage weekly edit looks" ON public.weekly_edit_looks
  FOR ALL USING (auth.role() = 'authenticated');

-- ── TABLE: site_content (dynamic homepage/section copy) ────────
CREATE TABLE IF NOT EXISTS public.site_content (
  key         TEXT        PRIMARY KEY,
  value       TEXT,
  type        TEXT        DEFAULT 'text',   -- 'text' | 'image' | 'json'
  section     TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read site content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Auth can manage site content" ON public.site_content
  FOR ALL USING (auth.role() = 'authenticated');

-- ── SEED: site_content defaults ────────────────────────────────
INSERT INTO public.site_content (key, value, type, section) VALUES
  ('hero_tagline',      'A private styling atelier for the discerning woman. Curated from the world''s most revered fashion houses.', 'text', 'hero'),
  ('philosophy_quote',  'She does not dress to be seen — she dresses to conquer.', 'text', 'philosophy'),
  ('philosophy_attr',   'KAGO Atelier · London · Est. 2026', 'text', 'philosophy'),
  ('summer_lookbook_title', 'The Summer Edit', 'text', 'summer_lookbook'),
  ('summer_lookbook_subtitle', 'London 2026', 'text', 'summer_lookbook'),
  ('summer_lookbook_intro', 'London in summer calls for clothing that is cool to the touch but never casual in intention. Five looks curated for a woman who moves between worlds with the same assurance.', 'text', 'summer_lookbook')
ON CONFLICT (key) DO NOTHING;

-- ── SEED: summer 2026 weekly edit (fallback) ───────────────────
INSERT INTO public.weekly_edits (title, subtitle, editorial_note, week_of, published, display_order) VALUES
  (
    'The Power Meridian',
    'Chalk-white linen. Absolute authority.',
    'This week''s edit is built around the principle that summer''s most powerful palette is the absence of colour. White, ivory, ecru — chosen with absolute precision.',
    '2026-05-11',
    true,
    1
  )
ON CONFLICT DO NOTHING;
