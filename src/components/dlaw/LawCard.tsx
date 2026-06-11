import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { countryByCode, categoryByCode, DISCLAIMER } from "@/lib/dlaw-filters";
import type { FeedCard } from "@/lib/law-cards.functions";

export function LawCard({ card }: { card: FeedCard }) {
  const country = countryByCode(card.country);
  const category = categoryByCode(card.category);
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {country.flag} {country.name}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {category.emoji} {category.name}
        </span>
      </div>
      <h2 className="text-xl font-bold leading-snug text-foreground">{card.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.summary}</p>
      <div className="mt-4 flex items-center justify-between">
        <Link
          to="/card/$slug"
          params={{ slug: card.slug }}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Read full explanation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </p>
    </article>
  );
}

export function LawCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 rounded-full bg-muted" />
        <div className="h-5 w-24 rounded-full bg-muted" />
      </div>
      <div className="h-6 w-3/4 rounded bg-muted mb-2" />
      <div className="h-6 w-1/2 rounded bg-muted mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}
