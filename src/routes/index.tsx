import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search, ShieldCheck, Globe2 } from "lucide-react";

import logo from "@/assets/dlaw-logo.png";
import { Filters } from "@/components/dlaw/Filters";
import { LawCard, LawCardSkeleton } from "@/components/dlaw/LawCard";
import { DEFAULT_CATEGORY, DEFAULT_COUNTRY, DISCLAIMER } from "@/lib/dlaw-filters";
import { getFeed } from "@/lib/law-cards.functions";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "D-Law — Global Law Guide: scroll laws like a feed" },
      {
        name: "description",
        content:
          "D-Law is an independent educational feed of plain-language law cards. Browse housing, work, police, family and more by country.",
      },
      { property: "og:title", content: "D-Law — Global Law Guide" },
      {
        property: "og:description",
        content: "Scrollable, plain-language law cards by country and category.",
      },
      { property: "og:url", content: "https://global-law-guide.lovable.app/" },
      { name: "twitter:title", content: "D-Law — Global Law Guide" },
      {
        name: "twitter:description",
        content: "Scrollable, plain-language law cards by country and category.",
      },
    ],
    links: [{ rel: "canonical", href: "https://global-law-guide.lovable.app/" }],
  }),
  component: Feed,
});

function Feed() {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const fetchFeed = useServerFn(getFeed);
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["feed", country, category, activeQuery],
    queryFn: () =>
      fetchFeed({
        data: { country, category, query: activeQuery || undefined, limit: 12 },
      }),
    staleTime: 60_000,
  });

  useEffect(() => {
    document.documentElement.classList.add("dark-supported");
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="D-Law" width={32} height={32} className="rounded-lg" />
              <div>
                <div className="font-bold leading-tight">D-Law</div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  Global Law Guide
                </div>
              </div>
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              <Globe2 className="h-3 w-3" /> Educational only
            </span>
          </div>
          <form onSubmit={submitSearch} className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search laws e.g. 'tenant rights Nigeria'"
              aria-label="Search laws"
              maxLength={200}
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <Filters
            country={country}
            category={category}
            onCountryChange={setCountry}
            onCategoryChange={setCategory}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        <h1 className="sr-only">D-Law — Global Law Guide feed</h1>
        {activeQuery && (
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Results for "<span className="text-foreground font-medium">{activeQuery}</span>"
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveQuery("");
                setSearchInput("");
              }}
              className="text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            Couldn't load the feed.{" "}
            <button onClick={() => refetch()} className="underline font-medium">
              Retry
            </button>
          </div>
        )}

        <div className="space-y-4">
          {isFetching && !data
            ? Array.from({ length: 4 }).map((_, i) => <LawCardSkeleton key={i} />)
            : (data ?? []).map((card) => <LawCard key={card.id} card={card} />)}
        </div>

        {!isFetching && data && data.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No cards yet for this filter. Try another country or category.
          </div>
        )}

        <footer className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Information only — not legal advice.</span>
          </div>
          <p className="max-w-md mx-auto">{DISCLAIMER}</p>
        </footer>
      </main>
    </div>
  );
}
