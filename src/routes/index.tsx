import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Scale, Languages } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import logo from "@/assets/dlaw-logo.png";
import {
  SelectorsBar,
  resolveCountry,
  type SelectorsValue,
} from "@/components/dlaw/SelectorsBar";
import { DEFAULT_CATEGORY, DEFAULT_COUNTRY } from "@/lib/dlaw-options";
import { createThread } from "@/lib/threads.functions";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "D-Law AI — Global Legal Information Assistant" },
      {
        name: "description",
        content:
          "Ask D-Law AI about laws in any of 195 countries. Pick a country and legal category, then get clear, neutral legal information in plain language.",
      },
    ],
  }),
  component: Landing,
});

const PENDING_KEY = "dlaw:pending";

const SUGGESTIONS = [
  { country: "Germany", category: "Traffic & Road Law", text: "What are the penalties for drunk driving?" },
  { country: "United States", category: "Property & Real Estate Law", text: "Explain tenant rights for renters." },
  { country: "Japan", category: "Family Law", text: "How does inheritance work?" },
  { country: "European Union", category: "Data Privacy Law", text: "Summarize GDPR for small businesses." },
];

function Landing() {
  const navigate = useNavigate();
  const create = useServerFn(createThread);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [sel, setSel] = useState<SelectorsValue>({
    country: DEFAULT_COUNTRY,
    customCountry: "",
    category: DEFAULT_CATEGORY,
  });
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setAuthed(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function ask(prefill?: { country?: string; category?: string; text?: string }) {
    const country = prefill?.country ?? resolveCountry(sel);
    const category = prefill?.category ?? sel.category;
    const message = (prefill?.text ?? text).trim();

    if (!message) {
      toast.error("Type your legal question first.");
      textRef.current?.focus();
      return;
    }

    if (!authed) {
      try {
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({ country, category, text: message }),
        );
      } catch {
        // ignore storage errors
      }
      toast.message("Sign in to ask D-Law AI", {
        description: "We'll bring your question along after you sign in.",
      });
      navigate({ to: "/auth" });
      return;
    }

    setSubmitting(true);
    try {
      const t = await create();
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ country, category, text: message }),
      );
      navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
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
        <nav className="flex items-center gap-2">
          {authed ? (
            <Button asChild variant="ghost">
              <Link to="/chat/$threadId" params={{ threadId: "new" }} onClick={(e) => { e.preventDefault(); navigate({ to: "/" }); }}>
                My chats
              </Link>
            </Button>
          ) : null}
          {authed === false && (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-20">
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" /> 195 countries · neutral · plain language
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            Ask about any law, anywhere.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Pick a country and legal category, then ask your question. D-Law AI gives clear,
            structured legal information — not legal advice.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <SelectorsBar value={sel} onChange={setSel} className="mb-3" />
          <Textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. What are the visa requirements for remote workers?"
            rows={3}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                ask();
              }
            }}
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Information only — not legal advice
            </div>
            <Button onClick={() => ask()} disabled={submitting}>
              {authed === false ? "Sign in & ask" : "Ask D-Law AI"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="mt-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Try an example
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.text}
                onClick={() => {
                  setSel({ country: s.country, customCountry: "", category: s.category });
                  setText(s.text);
                  setTimeout(() => textRef.current?.focus(), 0);
                }}
                className="text-left rounded-lg border border-border bg-card hover:bg-accent transition p-3 text-sm"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {s.country} · {s.category}
                </div>
                {s.text}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Globe, title: "195 countries", body: "Common, civil, mixed and Sharia-based systems." },
            { icon: Scale, title: "Structured answers", body: "Summary, key rules, exceptions and references." },
            { icon: Languages, title: "Plain language", body: "Designed for non-lawyers. ELI12 mode supported." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-2 font-medium">{title}</div>
              <div className="text-sm text-muted-foreground">{body}</div>
            </div>
          ))}
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          D-Law provides legal information for educational purposes only. This does not replace
          professional legal advice.
        </p>
      </main>
    </div>
  );
}
