import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/dlaw-logo.png";
import { TEMPLATES, getTemplate } from "@/lib/dlaw-templates";
import { supabase } from "@/integrations/supabase/client";
import { createThread } from "@/lib/threads.functions";

const PENDING_KEY = "dlaw:pending";
const BASE_URL = "https://global-law-guide.lovable.app";

import type { LegalTemplate } from "@/lib/dlaw-templates";

export const Route = createFileRoute("/templates/$slug")({
  loader: ({ params }): LegalTemplate => {
    const t = getTemplate(params.slug);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData, params }) => {
    const t = loaderData ?? getTemplate(params.slug);
    const title = t ? `${t.title} — D-Law AI Template` : "Legal Template — D-Law AI";
    const desc =
      t?.summary ??
      "Structured legal document template — neutral, plain-language starter.";
    const url = `${BASE_URL}/templates/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: t
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: t.title,
                description: t.summary,
                step: t.sections.map((s, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  name: s.heading,
                  text: s.body,
                })),
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Template not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That template doesn't exist. Browse the full library instead.
        </p>
        <div className="mt-6">
          <Link
            to="/templates"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            All templates
          </Link>
        </div>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This template didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  ),
  component: TemplateDetail,
});

function TemplateDetail() {
  const t: LegalTemplate = Route.useLoaderData();
  const navigate = useNavigate();
  const create = useServerFn(createThread);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setAuthed(!!data.user);
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function tailorWithAI() {
    const message = t.prompt;
    if (!authed) {
      try {
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({ text: message, category: t.category }),
        );
      } catch {
        // ignore
      }
      toast.message("Sign in to tailor this template", {
        description: "We'll bring the template prompt along after you sign in.",
      });
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    try {
      const thread = await create();
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ text: message, category: t.category }),
      );
      navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start a conversation");
      setSubmitting(false);
    }
  }

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
          <Link to="/templates" className="text-muted-foreground hover:text-foreground">
            All templates
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Ask D-Law AI
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-2 pb-20">
        <Link
          to="/templates"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All templates
        </Link>

        <section className="mt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> {t.category}
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-3 text-muted-foreground">{t.summary}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            When to use
          </div>
          <p className="mt-1 text-sm">{t.whenToUse}</p>
          <div className="mt-4">
            <Button onClick={tailorWithAI} disabled={submitting}>
              <Sparkles className="h-4 w-4" /> Tailor with D-Law AI
            </Button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Structure</h2>
          <ol className="mt-4 space-y-4">
            {t.sections.map((s) => (
              <li key={s.heading} className="rounded-xl border border-border bg-card p-4">
                <div className="font-medium">{s.heading}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {t.notes.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Notes & local variations</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {t.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related templates</h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEMPLATES.filter((x) => x.slug !== t.slug)
              .slice(0, 4)
              .map((x) => (
                <Link
                  key={x.slug}
                  to="/templates/$slug"
                  params={{ slug: x.slug }}
                  className="rounded-lg border border-border bg-card hover:bg-accent transition p-3 text-sm"
                >
                  <div className="text-xs text-muted-foreground mb-1">{x.category}</div>
                  {x.title}
                </Link>
              ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          D-Law provides legal information for educational purposes only. Templates are
          starting points — they do not replace professional legal advice.
        </p>
      </main>
    </div>
  );
}
