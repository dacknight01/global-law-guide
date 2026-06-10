import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ArrowRight } from "lucide-react";

import { TEMPLATES } from "@/lib/dlaw-templates";
import logo from "@/assets/dlaw-logo.png";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Legal Document Templates — D-Law AI" },
      {
        name: "description",
        content:
          "Free, neutral legal document templates: immigration recommendation letters, contract termination letters, NDAs, leases, wills, power of attorney, GDPR DPAs and more. Structured starters you can tailor with D-Law AI.",
      },
      { property: "og:title", content: "Legal Document Templates — D-Law AI" },
      {
        property: "og:description",
        content:
          "Plain-language templates for the most common legal documents — immigration letters, contract termination, NDAs, leases, wills, GDPR DPAs.",
      },
      { property: "og:url", content: "https://global-law-guide.lovable.app/templates" },
      { name: "twitter:title", content: "Legal Document Templates — D-Law AI" },
      {
        name: "twitter:description",
        content: "Structured legal document starters for common tasks worldwide.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://global-law-guide.lovable.app/templates" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Legal Document Templates",
          url: "https://global-law-guide.lovable.app/templates",
          description:
            "Library of common legal document templates with structured outlines.",
          hasPart: TEMPLATES.map((t) => ({
            "@type": "CreativeWork",
            name: t.title,
            url: `https://global-law-guide.lovable.app/templates/${t.slug}`,
            about: t.category,
          })),
        }),
      },
    ],
  }),
  component: TemplatesIndex,
});

function TemplatesIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      <header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="D-Law AI" width={36} height={36} className="rounded-lg" />
          <div>
            <div className="font-semibold leading-tight">D-Law AI</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Global legal info</div>
          </div>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/templates" className="font-medium">Templates</Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground">Ask D-Law AI</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 pb-20">
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> Structured starters · neutral · plain language
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            Legal document templates
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Outlines for the most common legal documents — immigration letters, contract
            terminations, NDAs, leases, wills, powers of attorney, and GDPR data
            processing agreements. Use the structure as a starting point, then tailor
            with D-Law AI for your country.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              to="/templates/$slug"
              params={{ slug: t.slug }}
              className="group rounded-xl border border-border bg-card p-4 hover:bg-accent transition"
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.category}
              </div>
              <div className="mt-1 font-semibold flex items-center gap-1">
                {t.title}
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.summary}</p>
            </Link>
          ))}
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          D-Law provides legal information for educational purposes only. Templates are
          starting points — they do not replace professional legal advice.
        </p>
      </main>
    </div>
  );
}
