
-- Drop legacy chat tables
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.threads CASCADE;
DROP FUNCTION IF EXISTS public.touch_thread_updated_at() CASCADE;

-- Law cards: public, AI-generated and cached
CREATE TABLE public.law_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  country text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  full_explanation text NOT NULL,
  rights text NOT NULL,
  what_to_do text NOT NULL,
  search_terms text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX law_cards_country_category_idx ON public.law_cards (country, category, created_at DESC);
CREATE INDEX law_cards_created_idx ON public.law_cards (created_at DESC);

GRANT SELECT ON public.law_cards TO anon, authenticated;
GRANT ALL ON public.law_cards TO service_role;

ALTER TABLE public.law_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read law cards"
  ON public.law_cards FOR SELECT
  TO anon, authenticated
  USING (true);
