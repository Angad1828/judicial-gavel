import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Scale, FileText, Clock, Users, ChevronRight } from "lucide-react";
import { CASES, type CaseRecord, type CaseStatus } from "@/data/cases";
import { LegalEyeMark } from "@/components/brand/LegalEyeMark";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Case Records — Legal Eye" },
      {
        name: "description",
        content:
          "Browse the Legal Eye case archive: court records, parties, case histories and structured case intelligence for every matter.",
      },
      { property: "og:title", content: "Case Records — Legal Eye" },
      {
        property: "og:description",
        content: "Court records, parties, histories and case intelligence in one legal archive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Records,
});

const STATUS_TONE: Record<CaseStatus, string> = {
  Active: "text-olive border-olive/40",
  Reserved: "text-brass border-brass/40",
  Appeal: "text-parchment border-border",
  Disposed: "text-muted-foreground border-border",
};

function Records() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(CASES[0]!.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CASES;
    return CASES.filter((c) =>
      [c.id, c.title, c.court, c.subject].some((f) => f.toLowerCase().includes(q)),
    );
  }, [query]);

  const selected = CASES.find((c) => c.id === selectedId)!;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <Link to="/" className="focus-legal flex items-center gap-2.5">
            <LegalEyeMark className="h-6 w-6 text-brass" />
            <span className="font-display text-base tracking-wide">
              LEGAL <span className="text-brass">EYE</span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-7 md:flex">
            {["Records", "Courts", "Authorities", "Archive"].map((item, i) => (
              <span
                key={item}
                className={`cursor-default text-xs tracking-wide transition-colors ${
                  i === 0 ? "text-parchment" : "text-muted-foreground hover:text-parchment"
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search case records"
                placeholder="Search matters, courts, case numbers"
                className="focus-legal w-56 border-b border-input bg-transparent py-1.5 pl-6 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-brass-dim focus:border-brass lg:w-72"
              />
            </div>
            <span className="flex h-8 w-8 items-center justify-center border border-border font-display text-xs text-brass">
              SI
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* Docket list */}
        <section aria-label="Case docket">
          <div className="flex items-baseline justify-between">
            <h1 className="font-display text-2xl">Case Records</h1>
            <span className="label-legal">{filtered.length} matters</span>
          </div>
          <div className="mt-5 h-px w-full rule-brass" />

          <ul className="mt-5 space-y-px">
            {filtered.map((c) => {
              const active = c.id === selectedId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    aria-current={active ? "true" : undefined}
                    className={`focus-legal group block w-full border-l-2 px-4 py-4 text-left transition-colors ${
                      active
                        ? "border-brass bg-surface"
                        : "border-transparent hover:border-brass-dim hover:bg-surface/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-brass-dim">{c.id}</span>
                      <span
                        className={`border px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase ${STATUS_TONE[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-2.5 font-display text-[15px] leading-snug text-parchment">{c.title}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{c.court}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                      <Clock className="h-3 w-3" /> Updated {c.updated}
                    </p>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-10 text-sm text-muted-foreground">No matter answers that search.</li>
            )}
          </ul>
        </section>

        <CaseFile record={selected} />
      </div>
    </div>
  );
}

function CaseFile({ record }: { record: CaseRecord }) {
  return (
    <section key={record.id} className="animate-rise-in space-y-10" aria-label="Case file">
      <header className="chamber-panel grain p-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-[11px] tracking-[0.16em] text-brass">{record.id}</span>
          <span className="h-3 w-px bg-border" />
          <span className="label-legal">{record.subject}</span>
        </div>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.6rem,2.6vw,2.35rem)] leading-tight text-parchment">
          {record.title}
        </h2>
        <div className="mt-7 h-px w-full rule-brass" />
        <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {[
            ["Court", record.court],
            ["Bench", record.bench],
            ["Filed", record.filed],
            ["Status", record.status],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="label-legal">{label}</dt>
              <dd className="mt-2 text-sm text-parchment">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="space-y-10">
          {/* Case intelligence */}
          <article className="border border-border">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <Scale className="h-4 w-4 text-brass" />
                <h3 className="text-sm tracking-[0.12em] uppercase">Case Intelligence</h3>
              </div>
              <span className="label-legal">Derived from record</span>
            </div>
            <div className="space-y-8 p-6">
              <div>
                <p className="label-legal">Summary of the matter</p>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-parchment/90">{record.summary}</p>
              </div>
              <div className="h-px w-full bg-border" />
              <div>
                <p className="label-legal">Issues before the court</p>
                <ol className="mt-4 space-y-3">
                  {record.issues.map((issue, i) => (
                    <li key={issue} className="flex gap-4 text-sm leading-relaxed text-parchment/85">
                      <span className="font-mono text-[11px] leading-6 text-brass-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="h-px w-full bg-border" />
              <div>
                <p className="label-legal">Authorities referred</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {record.authorities.map((a) => (
                    <li
                      key={a}
                      className="border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brass-dim hover:text-parchment"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          {/* History */}
          <article>
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-brass" />
              <h3 className="text-sm tracking-[0.12em] uppercase">Case History</h3>
            </div>
            <ol className="mt-6 border-l border-border pl-6">
              {record.history.map((e) => (
                <li key={e.date} className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[1.6rem] top-1.5 h-1.5 w-1.5 rounded-full bg-brass-dim" />
                  <p className="font-mono text-[11px] tracking-[0.12em] text-brass-dim">{e.date}</p>
                  <p className="mt-1.5 font-display text-base text-parchment">{e.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>
                </li>
              ))}
            </ol>
          </article>
        </div>

        {/* Parties */}
        <aside className="space-y-8">
          <div className="border border-border p-6">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-brass" />
              <h3 className="text-sm tracking-[0.12em] uppercase">Parties</h3>
            </div>
            <ul className="mt-5 space-y-5">
              {record.parties.map((p) => (
                <li key={p.name}>
                  <p className="label-legal">{p.role}</p>
                  <p className="mt-1.5 text-sm text-parchment">{p.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border p-6">
            <p className="label-legal">Record actions</p>
            <ul className="mt-4 space-y-1">
              {["Open full docket", "Export case brief", "Add note to file"].map((action) => (
                <li key={action}>
                  <button className="focus-legal group flex w-full items-center justify-between py-2 text-sm text-muted-foreground transition-colors hover:text-brass">
                    {action}
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
