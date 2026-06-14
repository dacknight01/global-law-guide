
CREATE OR REPLACE FUNCTION public.search_law_cards(
  _country text DEFAULT 'global',
  _category text DEFAULT 'all',
  _query text DEFAULT NULL,
  _lim int DEFAULT 12
)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  country text,
  category text,
  summary text
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT c.id, c.slug, c.title, c.country, c.category, c.summary
  FROM public.law_cards c
  WHERE (_country = 'global' OR c.country = _country)
    AND (_category = 'all' OR c.category = _category)
    AND (
      _query IS NULL OR length(btrim(_query)) = 0
      OR c.title ILIKE '%' || _query || '%'
      OR c.summary ILIKE '%' || _query || '%'
      OR c.search_terms ILIKE '%' || _query || '%'
    )
  ORDER BY c.created_at DESC
  LIMIT GREATEST(1, LEAST(_lim, 30));
$$;

GRANT EXECUTE ON FUNCTION public.search_law_cards(text, text, text, int) TO anon, authenticated, service_role;
