import { createFileRoute } from "@tanstack/react-router";
import { COUNTRIES, CATEGORIES } from "@/lib/dlaw-filters";

// Cycles through (country, category) combos and generates a fresh batch of
// law cards every time it's called. Old cards are never deleted.
export const Route = createFileRoute("/api/public/hooks/generate-cards")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { generateLawCards, slugify } = await import("@/lib/law-cards.server");

          // Pick a random non-"all"/non-"global" pair, plus occasional global.
          const countries = COUNTRIES.map((c) => c.code);
          const categories = CATEGORIES.filter((c) => c.code !== "all").map((c) => c.code);
          const country = countries[Math.floor(Math.random() * countries.length)];
          const category = categories[Math.floor(Math.random() * categories.length)];

          const generated = await generateLawCards({
            countryCode: country,
            categoryCode: category,
            count: 10,
          });

          const rows = generated.map((c) => ({
            slug: slugify(c.title),
            title: c.title.slice(0, 200),
            country,
            category,
            summary: c.summary.slice(0, 600),
            full_explanation: c.full_explanation,
            rights: c.rights,
            what_to_do: c.what_to_do,
            search_terms: c.search_terms.slice(0, 400),
          }));

          if (rows.length === 0) {
            return new Response(
              JSON.stringify({ ok: true, inserted: 0, country, category, note: "no valid cards" }),
              { headers: { "Content-Type": "application/json" } },
            );
          }

          const { error } = await supabaseAdmin.from("law_cards").insert(rows);
          if (error) {
            console.error("[generate-cards] insert error:", error);
            return new Response(
              JSON.stringify({ ok: false, error: error.message }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }


          return new Response(
            JSON.stringify({ ok: true, inserted: rows.length, country, category }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (e) {
          console.error("[generate-cards] failed:", e);
          return new Response(
            JSON.stringify({ ok: false, error: "generation failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
