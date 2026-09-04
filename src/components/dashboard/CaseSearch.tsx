import { Search } from "lucide-react";

interface CaseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaseSearch({ value, onChange }: CaseSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brass-dim" />
      <label htmlFor="case-search" className="sr-only">
        Search your legal records
      </label>
      <input
        id="case-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by case name, reference, party, court or matter…"
        autoComplete="off"
        spellCheck={false}
        className="focus-legal h-16 w-full border border-border bg-surface/45 py-4 pl-13 pr-5 font-display text-[15px] tracking-wide text-parchment outline-none transition-all duration-300 placeholder:font-sans placeholder:text-sm placeholder:font-light placeholder:text-muted-foreground/60 hover:border-brass-dim focus:border-brass focus:bg-surface/70 focus:shadow-[0_0_0_1px_color-mix(in_oklab,var(--brass)_35%,transparent),0_18px_44px_-24px_oklch(0_0_0/0.85)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="focus-legal absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-brass"
        >
          Clear
        </button>
      )}
    </div>
  );
}
