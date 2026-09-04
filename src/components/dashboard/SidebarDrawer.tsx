import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Archive, ChevronDown, Lock, Pin, Scale, X } from "lucide-react";
import type { CaseCategory, CaseRecord } from "@/data/cases";
import { CASE_CATEGORIES, STATUS_TONE, isConfidential, isOpenMatter } from "@/data/cases";
import { useCases } from "@/lib/case-store";
import { LegalEyeMark } from "@/components/brand/LegalEyeMark";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Raised when a category in The Bar is picked. */
  onSelectCategory: (category: CaseCategory) => void;
  /** Category currently filtering the dashboard, if any. */
  activeCategory: CaseCategory | null;
}

function DrawerCaseRow({ record, onNavigate }: { record: CaseRecord; onNavigate: () => void }) {
  const confidential = isConfidential(record);
  return (
    <li>
      <Link
        to="/records"
        search={{ case: record.id }}
        onClick={onNavigate}
        className={`focus-legal group flex w-full items-start gap-3 border-l-2 px-3 py-2.5 text-left transition-colors ${
          confidential
            ? "border-burgundy/60 hover:bg-burgundy/[0.06]"
            : "border-transparent hover:border-brass-dim hover:bg-surface/70"
        }`}
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.14em] text-brass-dim">{record.id}</span>
            {confidential && <Lock className="h-2.5 w-2.5 shrink-0 text-burgundy" />}
          </span>
          <span className="mt-1 line-clamp-2 font-display text-[13px] leading-snug text-parchment group-hover:text-[color:color-mix(in_oklab,var(--parchment)_90%,var(--brass))]">
            {record.title}
          </span>
          <span className="mt-1 block truncate text-[11px] text-muted-foreground">{record.court}</span>
        </span>
        <span
          className={`mt-0.5 shrink-0 border px-1.5 py-0.5 text-[9px] tracking-[0.1em] uppercase ${STATUS_TONE[record.status]}`}
        >
          {record.status}
        </span>
      </Link>
    </li>
  );
}

function SidebarSection({
  icon: Icon,
  title,
  count,
  defaultOpen = false,
  children,
}: {
  icon: typeof Pin;
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-t border-border pt-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-legal flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left transition-colors hover:bg-surface/40"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-brass-dim" />
          <span className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{title}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-brass-dim">{String(count).padStart(2, "0")}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-brass-dim transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          {children}
        </div>
      </div>
    </section>
  );
}

function BarCategoryRow({
  category,
  count,
  active,
  onSelect,
}: {
  category: CaseCategory;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={`focus-legal flex w-full items-center justify-between gap-2 border-l-2 px-3 py-1.5 text-left text-[12px] transition-colors ${
          active
            ? "border-brass bg-surface/60 text-parchment"
            : "border-transparent text-muted-foreground hover:border-brass-dim hover:bg-surface/40 hover:text-parchment"
        }`}
      >
        <span>{category}</span>
        <span className="font-mono text-[10px] text-brass-dim">{String(count).padStart(2, "0")}</span>
      </button>
    </li>
  );
}

export function SidebarDrawer({ open, onClose, onSelectCategory, activeCategory }: SidebarDrawerProps) {
  const cases = useCases();
  const closeRef = useRef<HTMLButtonElement>(null);

  const pinned = useMemo(() => cases.filter((c) => c.pinned && isOpenMatter(c)), [cases]);
  const archived = useMemo(() => cases.filter((c) => c.archived || c.status === "Disposed"), [cases]);
  const barCounts = useMemo(() => {
    const counts = new Map<CaseCategory, number>(CASE_CATEGORIES.map((c) => [c, 0]));
    for (const c of cases) {
      if (c.category) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    }
    return counts;
  }, [cases]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Only lock body scroll in the mobile drawer mode; on desktop the panel pushes content.
    const lockScroll = window.matchMedia("(max-width: 767px)").matches;
    if (lockScroll) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const pickCategory = (category: CaseCategory) => {
    onSelectCategory(category);
    // Close the drawer on mobile so the filtered dashboard is visible.
    if (window.matchMedia("(max-width: 767px)").matches) onClose();
  };

  return (
    <>
      {/* Scrim — mobile drawer mode only; desktop uses the push layout. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        aria-label="Case intelligence panel — pinned matters, case categories and archive"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-background grain shadow-2xl shadow-black/40 transition-transform duration-300 ease-out md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link to="/dashboard" onClick={onClose} className="focus-legal flex items-center gap-2.5">
            <LegalEyeMark className="h-6 w-6 text-brass" />
            <span className="font-display text-base tracking-wide">
              LEGAL <span className="text-brass">EYE</span>
            </span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="focus-legal flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-brass-dim hover:text-parchment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <p className="px-3 pt-5 text-[10px] tracking-[0.18em] text-muted-foreground/60 uppercase">
            Case intelligence
          </p>

          {/* Pinned cases */}
          <SidebarSection icon={Pin} title="Pinned Cases" count={pinned.length} defaultOpen>
            {pinned.length > 0 ? (
              <ul className="mt-3 space-y-1">
                {pinned.map((record) => (
                  <DrawerCaseRow key={record.id} record={record} onNavigate={onClose} />
                ))}
              </ul>
            ) : (
              <p className="mt-4 px-3 text-xs leading-relaxed text-muted-foreground/80">
                No pinned cases yet. Pin a matter from its case card or record for one-tap access here.
              </p>
            )}
          </SidebarSection>

          {/* The Bar — case-type browser */}
          <SidebarSection icon={Scale} title="The Bar" count={CASE_CATEGORIES.length}>
            <ul className="mt-3 space-y-0.5">
              {CASE_CATEGORIES.map((category) => (
                <BarCategoryRow
                  key={category}
                  category={category}
                  count={barCounts.get(category) ?? 0}
                  active={activeCategory === category}
                  onSelect={() => pickCategory(category)}
                />
              ))}
            </ul>
          </SidebarSection>

          {/* Archive — positioned lower, with clear breathing space */}
          <div className="mt-12">
            <SidebarSection icon={Archive} title="Archived Cases" count={archived.length}>
              {archived.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {archived.map((record) => (
                    <DrawerCaseRow key={record.id} record={record} onNavigate={onClose} />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 px-3 text-xs leading-relaxed text-muted-foreground/80">
                  Completed cases will appear here when a matter is closed.
                </p>
              )}
            </SidebarSection>
          </div>
        </div>

        <div className="border-t border-border px-5 py-3">
          <p className="text-[10px] tracking-[0.14em] text-muted-foreground/70 uppercase">
            Legal Eye · Case Archive
          </p>
        </div>
      </aside>
    </>
  );
}