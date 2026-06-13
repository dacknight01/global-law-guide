import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { countryByCode, categoryByCode, DISCLAIMER } from "@/lib/dlaw-filters";
import {
  getCardBySlug,
  getRelatedCards,
  type FullCard,
} from "@/lib/law-cards.functions";
import { LawCard } from "@/components/dlaw/LawCard";

export const Route = createFileRoute("/card/$slug")({
  ssr: false,
  loader: async ({ params }) => {
    const card = await getCardBySlug({ data: { slug: params.slug } });
    if (!card) throw notFound();
    return { card };
  },
  head: ({ params, loaderData }) => {
    const card = (loaderData as { card: FullCard } | undefined)?.card;
    const title = card ? `${card.title} — D-Law` : "Law card — D-Law";
    const baseDesc = card?.summary ?? "Plain-language legal information from D-Law.";
    const desc =
      baseDesc.length < 50
        ? `${baseDesc} Plain-language legal information from D-Law.`.slice(0, 160)
        : baseDesc.slice(0, 160);
    const url = `https://global-law-guide.lovable.app/card/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: card
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: card.title,
                description: card.summary,
                author: { "@type": "Organization", name: "D-Law" },
                publisher: { "@type": "Organization", name: "D-Law" },
                url,
              }),
            },
          ]
        : [],
    };
  },
  component: CardPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-xl font-bold">Card not found</h1>
        <Link to="/" className="mt-3 inline-block text-primary underline">
          Back to feed
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold">Couldn't load this card</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>

          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            aria-label="Retry loading this law card"
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    );
  },
});

function renderBullets(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
  if (lines.length <= 1) return <p className="text-sm leading-relaxed">{text}</p>;
  return (
    <ul className="space-y-2 text-sm leading-relaxed">
      {lines.map((l, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-primary mt-1">•</span>
          <span>{l}</span>
        </li>
      ))}
    </ul>
  );
}

function CardPage() {
  const { card } = Route.useLoaderData();
  const country = countryByCode(card.country);
  const category = categoryByCode(card.category);

  const fetchRelated = useServerFn(getRelatedCards);
  const { data: related } = useQuery({
    queryKey: ["related", card.slug, card.category],
    queryFn: () =>
      fetchRelated({ data: { category: card.category, excludeSlug: card.slug } }),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Feed
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <article>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {country.flag} {country.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {category.emoji} {category.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{card.title}</h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {card.summary}
          </p>

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              What this means
            </h2>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line text-sm leading-relaxed">
              {card.full_explanation}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Your rights
            </h2>
            {renderBullets(card.rights)}
          </section>

          <section className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              What to do
            </h2>
            {renderBullets(card.what_to_do)}
          </section>

          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              This is a simplified, AI-generated explanation and may not reflect official
              legal text. {DISCLAIMER}
            </span>
          </div>
        </article>

        {related && related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-3">Related</h2>
            <div className="space-y-4">
              {related.map((c) => (
                <LawCard key={c.id} card={c} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
