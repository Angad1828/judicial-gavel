import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CaseSearch } from "@/components/dashboard/CaseSearch";
import { CaseStats } from "@/components/dashboard/CaseStats";
import { AddCaseTile, CaseCard } from "@/components/dashboard/CaseCard";
import { SidebarDrawer } from "@/components/dashboard/SidebarDrawer";
import { useCases, CURRENT_USER } from "@/lib/case-store";
import { isOpenMatter } from "@/data/cases";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Lawyer's Dashboard — Legal Eye" },
      {
        name: "description",
        content:
          "Your Legal Eye command centre: search the case archive, review open matters and open pinned or completed records.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const cases = useCases();
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openMatters = useMemo(() => cases.filter(isOpenMatter), [cases]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return openMatters;
    return openMatters.filter((c) =>
      [
        c.id,
        c.title,
        c.court,
        c.subject,
        c.status,
        ...c.parties.map((p) => p.name),
      ].some((field) => field.toLowerCase().includes(q)),
    );
  }, [query, openMatters]);

  const courts = useMemo(() => new Set(openMatters.map((c) => c.court)).size, [openMatters]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader current="dashboard" onMenu={() => setDrawerOpen(true)} />
      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} current="dashboard" />

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        {/* Page title */}
        <div className="pt-10 sm:pt-14">
          <p className="label-legal">Legal Eye · Case Manager</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-none tracking-[-0.01em] text-parchment">
              Lawyer's Dashboard
            </h1>
            <p className="pb-1 font-mono text-[11px] tracking-[0.14em] text-brass-dim">
              {String(cases.length).padStart(3, "0")} matters on file
            </p>
          </div>
          <div className="mt-5 h-px w-full rule-brass" />
        </div>

        {/* Welcome */}
        <section aria-label="Welcome" className="mt-8">
          <h2 className="font-display text-xl text-parchment sm:text-2xl">
            Welcome back, <span className="text-brass">{CURRENT_USER.name}</span>.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            You have {openMatters.length} open {openMatters.length === 1 ? "matter" : "matters"} across {courts}{" "}
            {courts === 1 ? "court" : "courts"}. Search the archive below, or open the drawer to reach pinned and
            completed cases.
          </p>
        </section>

        {/* Search */}
        <section aria-label="Search cases" className="mt-9">
          <CaseSearch value={query} onChange={setQuery} />
        </section>

        {/* Overview */}
        <div className="mt-8">
          <CaseStats cases={cases} />
        </div>

        {/* Case records */}
        <section aria-label="Case records" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-4">
              <h2 className="font-display text-2xl text-parchment">Active matters</h2>
              {query.trim() ? (
                <span className="text-xs text-muted-foreground">
                  {filtered.length} of {openMatters.length} match your search
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {openMatters.length} on file
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="focus-legal inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-brass-dim uppercase transition-colors hover:text-brass"
            >
              Pinned & archived <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 h-px w-full bg-border" />

          {filtered.length > 0 ? (
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((record) => (
                <CaseCard key={record.id} record={record} />
              ))}
              {!query.trim() && <AddCaseTile />}
            </div>
          ) : (
            <div className="mt-7 border border-dashed border-border px-6 py-14 text-center">
              <p className="font-display text-lg text-parchment">No open matter answers that search.</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {query.trim() && (
                  <>
                    The reference may belong to a completed matter — check the{" "}
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(true)}
                      className="focus-legal text-brass underline-offset-4 hover:underline"
                    >
                      archive drawer
                    </button>
                    .
                  </>
                )}
              </p>
            </div>
          )}
        </section>

        {/* Mobile quick action */}
        <div className="mt-10 flex items-center justify-center md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="focus-legal inline-flex items-center gap-2 border border-border bg-surface/60 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-brass-dim hover:text-parchment"
          >
            <Menu className="h-3.5 w-3.5" />
            Pinned cases & archive
          </button>
        </div>
      </main>
    </div>
  );
}
