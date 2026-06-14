import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://global-law-guide.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let cardEntries = "";
        try {
          const { data: cards } = await supabaseAdmin
            .from("law_cards")
            .select("slug, created_at")
            .order("created_at", { ascending: false })
            .limit(1000);
          cardEntries = (cards ?? [])
            .map(
              (c) =>
                `  <url>\n    <loc>${BASE_URL}/card/${c.slug}</loc>\n    <lastmod>${new Date(c.created_at).toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
            )
            .join("\n");
        } catch (e) {
          console.error("[sitemap] failed to load cards", e);
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guide/statutes-of-limitations</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guide/immigration-rights</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${cardEntries}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
