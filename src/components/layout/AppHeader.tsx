import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { LegalEyeMark } from "@/components/brand/LegalEyeMark";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";

export type AppSection = "dashboard" | "records" | "upload" | "profile";

const NAV: Array<{ to: "/dashboard" | "/records" | "/upload"; label: string; section: AppSection }> = [
  { to: "/dashboard", label: "Dashboard", section: "dashboard" },
  { to: "/records", label: "Case Records", section: "records" },
  { to: "/upload", label: "Upload Case", section: "upload" },
];

interface AppHeaderProps {
  current: AppSection;
  onMenu?: () => void;
}

export function AppHeader({ current, onMenu }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open sidebar — pinned cases, case categories and archive"
            className="focus-legal -ml-1 flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-brass-dim hover:text-parchment"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <Link to="/dashboard" className="focus-legal flex items-center gap-2.5">
          <LegalEyeMark className="h-6 w-6 text-brass" />
          <span className="font-display text-base tracking-wide">
            LEGAL <span className="text-brass">EYE</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-6 md:flex lg:ml-6">
          {NAV.map((item) => {
            const active = item.section === current;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`focus-legal relative text-xs tracking-[0.14em] uppercase transition-colors ${
                  active ? "text-parchment" : "text-muted-foreground hover:text-parchment"
                }`}
              >
                {item.label}
                {active && <span className="absolute -bottom-2.5 left-0 h-px w-full rule-brass" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
