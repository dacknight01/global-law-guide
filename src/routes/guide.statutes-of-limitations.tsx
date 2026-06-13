import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import { DISCLAIMER } from "@/lib/dlaw-filters";

const URL = "https://global-law-guide.lovable.app/guide/statutes-of-limitations";
const TITLE = "Statute of Limitations Guide: Legal Deadlines Explained — D-Law";
const DESCRIPTION =
  "Plain-language guide to statutes of limitations: how long you have to sue or be charged for debt, contracts, injury, and common crimes.";

export const Route = createFileRoute("/guide/statutes-of-limitations")({
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
          headline: "Statute of Limitations Guide: Legal Deadlines Explained",
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "D-Law" },
          publisher: { "@type": "Organization", name: "D-Law" },
          url: URL,
        }),
      },
    ],
  }),
  component: StatutesGuide,
});

type Row = { action: string; typical: string; notes: string };

const CIVIL: Row[] = [
  { action: "Written contract dispute", typical: "3–6 years", notes: "Starts when the contract is broken, not signed." },
  { action: "Oral / verbal contract", typical: "2–4 years", notes: "Shorter and harder to prove than written contracts." },
  { action: "Credit card / consumer debt", typical: "3–6 years", notes: "Making a payment can restart the clock in many places." },
  { action: "Personal injury (e.g. car accident)", typical: "1–3 years", notes: "Usually runs from the date of the injury." },
  { action: "Medical malpractice", typical: "1–3 years", notes: "Often runs from when you discovered the harm, not the procedure." },
  { action: "Property damage", typical: "2–6 years", notes: "From the date the damage happened." },
  { action: "Defamation (libel / slander)", typical: "1–2 years", notes: "From the date of publication or statement." },
  { action: "Wrongful termination / workplace claim", typical: "180 days – 3 years", notes: "Many require an agency complaint first — deadlines are short." },
];

const CRIMINAL: Row[] = [
  { action: "Minor offenses / misdemeanors", typical: "1–3 years", notes: "Small theft, simple assault, traffic crimes." },
  { action: "Most felonies", typical: "3–7 years", notes: "Fraud, burglary, non-violent serious crimes." },
  { action: "Serious violent felonies", typical: "10+ years or none", notes: "Many jurisdictions have no deadline for rape or kidnapping." },
  { action: "Murder", typical: "No limit", notes: "Almost everywhere, murder can be charged at any time." },
  { action: "Tax fraud / evasion", typical: "3–6 years", notes: "Often runs from the date the return was filed." },
];

function Table({ rows, caption }: { rows: Row[]; caption: string }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-semibold">Type of action</th>
            <th className="px-3 py-2 font-semibold">Typical deadline</th>
            <th className="px-3 py-2 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-card" : "bg-background"}>
              <td className="px-3 py-2 font-medium">{r.action}</td>
              <td className="px-3 py-2 whitespace-nowrap text-primary">{r.typical}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatutesGuide() {
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
              <Clock className="h-3 w-3" /> Guide
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Legal deadlines
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Statute of Limitations: how long you have to sue or be charged
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            A statute of limitations is a legal deadline. Once it passes, a lawsuit can be
            thrown out or a prosecutor can no longer file charges — even if everyone agrees
            the underlying facts are true. This is a plain-language summary of the deadlines
            most ordinary people run into.
          </p>

          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-2">What it actually means</h2>
            <p className="text-sm leading-relaxed text-foreground">
              Think of it as a timer that starts when something happens — a crash, a missed
              payment, an unpaid invoice, a crime. If you (or the government) wait too long
              to act, the right to bring a case quietly disappears. Defendants can ask the
              court to dismiss any case filed after the deadline, and judges usually agree.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Common civil deadlines</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Civil cases are between people, companies, or organisations (not the state).
              The clock usually starts on the date the harm happened or the contract was
              broken.
            </p>
            <Table rows={CIVIL} caption="Typical civil statute of limitations" />
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Common criminal deadlines</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Criminal deadlines limit how long the government has to file charges. They
              vary widely by country and by the seriousness of the offense.
            </p>
            <Table rows={CRIMINAL} caption="Typical criminal statute of limitations" />
          </section>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              When the clock can pause or restart
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Discovery rule:</strong> for hidden injuries (medical errors, fraud), the clock often starts when you found out — not when it happened.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Minors:</strong> the deadline is usually paused until the person turns 18.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Defendant out of reach:</strong> if the other side leaves the jurisdiction or hides, the clock can pause.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Partial payment or written acknowledgment:</strong> on a debt, this can reset the clock to zero.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span><strong>Government claims:</strong> suing a public body often requires a written notice within months, long before the main deadline.</span></li>
            </ul>
          </section>

          <section className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Practical next steps
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Write down the exact date the event happened and any related dates (last payment, last contact).</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Assume the shortest plausible deadline and act early — don't wait until the final week.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>Check the statute for your specific country, state, or province — the numbers above are typical, not universal.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>If a debt collector contacts you about a very old debt, do not promise to pay anything before checking whether the deadline has already passed.</span></li>
              <li className="flex gap-2"><span className="text-primary mt-1">•</span><span>For anything serious — injury, criminal exposure, large money — talk to a licensed lawyer or a free legal aid clinic before the deadline gets close.</span></li>
            </ul>
          </section>

          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Deadlines vary by jurisdiction and by the exact facts of your case. This page
              is a simplified summary, not legal advice. {DISCLAIMER}
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
