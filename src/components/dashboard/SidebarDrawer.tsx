import { useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  FileUp,
  FolderOpen,
  LayoutDashboard,
  Lock,
  Pin,
  X,
} from "lucide-react";
import type { CaseRecord } from "@/data/cases";
import { STATUS_TONE, isOpenMatter } from "@/data/cases";
import { useCases } from "@/lib/case-store";
import { LegalEyeMark } from "@/components/brand/LegalEyeMark";
import type { AppSection } from "@/components/layout/AppHeader";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  current: AppSection;
}

function DrawerCaseRow({ record, onNavigate }: { record: CaseRecord; onNavigate: () => void }) {
  const confidential = Boolean(record.confidential);
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

function SectionHeader({
  icon: Icon,
  title,
  count,
  note,
}: {
  icon: typeof Pin;
  title: string;
  count: number;
  note: string;
}) {
  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-center justify-between gap-2 px-3">
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-brass-dim" />
          <span className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{title}</span>
        </span>
        <span className="font-mono text-[10px] text-brass-dim">{String(count).padStart(2, "0")}</span>
      </div>
      <p className="mt-1 px-3 text-[11px] text-muted-foreground/70">{note}</p>
      <div className="mt-3 h-px w-full rule-brass" />
    </div>
  );
}

export function SidebarDrawer({ open, onClose, current }: SidebarDrawerProps) {
  const cases = useCases();
  const closeRef = useRef<HTMLButtonElement>(null);

  const pinned = useMemo(() => cases.filter((c) => c.pinned && isOpenMatter(c)), [cases]);
  const archived = useMemo(() => cases.filter((c) => c.archived), [cases]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const navItems: Array<{ to: "/dashboard" | "/records" | "/upload"; label: string; icon: typeof FolderOpen; section: AppSection }> = [
    { to: "/dashboard", label: "Lawyer's Dashboard", icon: LayoutDashboard, section: "dashboard" },
    { to: "/records", label: "Case Records", icon: FolderOpen, section: "records" },
    { to: "/upload", label: "Upload Case", icon: FileUp, section: "upload" },
  ];

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Archive drawer — pinned and completed cases"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(24rem,100vw)] flex-col border-r border-border bg-background grain transition-transform duration-300 ease-out ${
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
            aria-label="Close drawer"
            className="focus-legal flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-brass-dim hover:text-parchment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {/* Primary navigation */}
          <nav aria-label="Case management" className="pt-5">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.section === current;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`focus-legal flex items-center gap-3 border-l-2 px-3 py-2.5 text-[13px] transition-colors ${
                        active
                          ? "border-brass bg-surface text-parchment"
                          : "border-transparent text-muted-foreground hover:border-brass-dim hover:bg-surface/60 hover:text-parchment"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-brass" : "text-brass-dim"}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Pinned cases */}
          <SectionHeader
            icon={Pin}
            title="Pinned Cases"
            count={pinned.length}
            note="Matters kept within reach."
          />
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

          {/* Completed / archived */}
          <SectionHeader
            icon={Archive}
            title="Archived Cases"
            count={archived.length}
            note="Completed matters — retained for reference, not deleted."
          />
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
