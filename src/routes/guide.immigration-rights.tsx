import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, IdCard } from "lucide-react";
import { DISCLAIMER } from "@/lib/dlaw-filters";

const URL = "https://global-law-guide.lovable.app/guide/immigration-rights";
const TITLE = "Immigration Red Card: Know Your Rights — D-Law";
const DESCRIPTION =
  "Plain-language guide to the immigration 'red card' — your rights during ICE or law enforcement encounters at home, in public, and in a vehicle.";

export const Route = createFileRoute("/guide/immigration-rights")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Immigration Red Card: Know Your Rights",
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "D-Law" },
          publisher: { "@type": "Organization", name: "D-Law" },
          url: URL,
        }),
      },
    ],
  }),
  component: ImmigrationRightsGuide,
});

type Scenario = { where: string; say: string; dont: string };

const SCENARIOS: Scenario[] = [
  {
    where: "At your door (home)",
    say: "I do not consent to your entry. Please slide any warrant under the door.",
    dont: "Don't open the door without a judge-signed warrant naming you or your home.",
  },
  {
    where: "On the street / in public",
    say: "Am I free to go? I choose to remain silent. I want a lawyer.",
    dont: "Don't run, don't lie, and don't show fake or another person's documents.",
  },
  {
    where: "In a car",
    say: "I do not consent to a search. I am exercising my right to remain silent.",
    dont: "Don't reach for documents until asked. Keep hands visible on the wheel.",
  },
  {
    where: "At work",
    say: "I want to speak to a lawyer before answering any questions.",
    dont: "Don't sign anything you don't fully understand, especially voluntary departure forms.",
  },
];

function ImmigrationRightsGuide() {
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
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <IdCard className="h-3 w-3" /> Red Card
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Know your rights
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            The Immigration "Red Card": your rights in any encounter
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            A "red card" is a small printed card people carry to assert their constitutional
            rights if immigration or police officers stop them. The rights on the card apply
            to everyone physically present — regardless of immigration status. This page is
            the long-form version: what to say, what to hand over, and what not to do.
          </p>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              The four core rights
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Right to remain silent.</strong> You don't have to answer questions about where you were born, your status, or how you entered.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Right to refuse a search.</strong> Officers need a warrant or your consent to search your home, bag, phone, or car. Saying "I do not consent" is not a crime.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Right to a lawyer.</strong> If detained, repeat: "I want to speak to a lawyer." Don't sign anything until one is present.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Right to leave if not detained.</strong> Ask: "Am I free to go?" If yes, walk away calmly.</span></li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Warrants — what counts</h2>
            <p className="text-sm leading-relaxed text-foreground">
              An <strong>administrative warrant</strong> from ICE (Form I-200 or I-205) does
              NOT give officers the right to enter your home. Only a <strong>judicial
              warrant</strong> — signed by a judge and naming the person or place to be
              searched — does. Ask any officer at your door to slide the warrant under the
              door or hold it to a window so you can read who signed it.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Scripts by situation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The exact words matter. Saying nothing can be misread; saying too much can
              waive your rights. Use these phrases.
            </p>
            <div className="mt-4 grid gap-3">
              {SCENARIOS.map((s) => (
                <div key={s.where} className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-semibold">{s.where}</div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-primary">Say:</span>{" "}
                    <span className="text-foreground">{s.say}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium text-destructive">Don't:</span>{" "}
                    <span className="text-muted-foreground">{s.dont}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              If you are detained
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Stay calm. Don't resist physically, even if you believe the stop is unlawful.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Do not sign anything — especially a "voluntary departure" or stipulated removal — without a lawyer.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Memorise one emergency phone number. Phones get taken; memory doesn't.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Ask for the officer's name, agency, and badge number, and write them down later.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>You have the right to contact your country's consulate.</span></li>
            </ul>
          </section>

          <section className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Prepare in advance
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Carry a physical red card; print one in your language from a trusted legal-aid group.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Keep important documents (passport, birth certificates, lawyer's number) with a trusted person.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Make a family plan: who picks up the children, who handles bills, who calls the lawyer.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Never carry false documents — that's a separate, serious crime.</span></li>
            </ul>
          </section>

          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Rules vary by country and by the exact facts of your situation. This page is a
              simplified summary, not legal advice. {DISCLAIMER}
            </span>
          </div>
        </article>

        <footer className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            ← Back to the law feed
          </Link>
        </footer>
      </main>
    </div>
  );
}
