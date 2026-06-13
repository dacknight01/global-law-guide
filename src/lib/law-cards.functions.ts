import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COUNTRIES, CATEGORIES } from "@/lib/dlaw-filters";

const VALID_COUNTRIES = new Set(COUNTRIES.map((c) => c.code));
const VALID_CATEGORIES = new Set(CATEGORIES.map((c) => c.code));

const feedInputSchema = z.object({
  country: z
    .string()
    .max(40)
    .default("global")
    .refine((v) => VALID_COUNTRIES.has(v), "Unknown country"),
  category: z
    .string()
    .max(40)
    .default("all")
    .refine((v) => VALID_CATEGORIES.has(v), "Unknown category"),
  query: z.string().max(200).optional(),
  limit: z.number().int().min(1).max(30).default(12),
});

export type FeedCard = {
  id: string;
  slug: string;
  title: string;
  country: string;
  category: string;
  summary: string;
};

export type FullCard = FeedCard & {
  full_explanation: string;
  rights: string;
  what_to_do: string;
};

const CACHE_THRESHOLD = 6;

export const getFeed = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => feedInputSchema.parse(data))
  .handler(async ({ data }): Promise<FeedCard[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const buildQuery = () => {
      let q = supabaseAdmin
        .from("law_cards")
        .select("id, slug, title, country, category, summary")
        .order("created_at", { ascending: false })
        .limit(data.limit);
      if (data.country !== "global") q = q.eq("country", data.country);
      if (data.category !== "all") q = q.eq("category", data.category);
      if (data.query && data.query.trim()) {
        // Strip PostgREST filter syntax-significant chars to prevent filter injection.
        const needle = data.query
          .trim()
          .toLowerCase()
          .replace(/[,()%*\\:"']/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 100);
        if (needle) {
          q = q.or(
            `title.ilike.%${needle}%,summary.ilike.%${needle}%,search_terms.ilike.%${needle}%`,
          );
        }
      }
      return q;
    };

    const { data: existing, error } = await buildQuery();
    if (error) {
      console.error("[getFeed] db error:", error);
      throw new Error("Service temporarily unavailable.");
    }

    const needsMore = (existing?.length ?? 0) < CACHE_THRESHOLD;
    if (!needsMore) return existing as FeedCard[];

    // Generate + insert
    const { generateLawCards, slugify } = await import("@/lib/law-cards.server");
    try {
      const generated = await generateLawCards({
        countryCode: data.country,
        categoryCode: data.category,
        query: data.query,
        count: 10,
      });

      const rows = generated.map((c) => ({
        slug: slugify(c.title),
        title: c.title.slice(0, 200),
        country: data.country,
        category: data.category,
        summary: c.summary.slice(0, 600),
        full_explanation: c.full_explanation,
        rights: c.rights,
        what_to_do: c.what_to_do,
        search_terms: c.search_terms.slice(0, 400),
      }));

      await supabaseAdmin.from("law_cards").insert(rows);
    } catch (e) {
      console.error("law card generation failed", e);
      if (existing && existing.length > 0) return existing as FeedCard[];
      throw new Error(
        "Couldn't load law cards right now. Please try again in a moment.",
      );
    }

    const { data: refreshed, error: err2 } = await buildQuery();
    if (err2) {
      console.error("[getFeed] db error:", err2);
      throw new Error("Service temporarily unavailable.");
    }
    return (refreshed ?? []) as FeedCard[];
  });

export const getCardBySlug = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().max(120) }).parse(data))
  .handler(async ({ data }): Promise<FullCard | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("law_cards")
      .select("id, slug, title, country, category, summary, full_explanation, rights, what_to_do")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) {
      console.error("[getCardBySlug] db error:", error);
      throw new Error("Service temporarily unavailable.");
    }
    return (row as FullCard | null) ?? null;
  });

export const getRelatedCards = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ category: z.string().max(40), excludeSlug: z.string().max(120) }).parse(data),
  )
  .handler(async ({ data }): Promise<FeedCard[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("law_cards")
      .select("id, slug, title, country, category, summary")
      .eq("category", data.category)
      .neq("slug", data.excludeSlug)
      .order("created_at", { ascending: false })
      .limit(4);
    if (error) {
      console.error("[getRelatedCards] db error:", error);
      throw new Error("Service temporarily unavailable.");
    }
    return (rows ?? []) as FeedCard[];
  });
