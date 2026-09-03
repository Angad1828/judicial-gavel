import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import courtroom from "@/assets/courtroom.jpg";
import { LegalEyeMark } from "@/components/brand/LegalEyeMark";

export function LoginPanel() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Prototype only: no authentication service exists in this project.
    setPending(true);
    window.setTimeout(() => navigate({ to: "/records" }), 650);
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
      {/* Chamber side */}
      <section className="relative hidden overflow-hidden border-r border-border lg:block grain">
        <img
          src={courtroom}
          alt="A dim courtroom seen through haze, with a judge's bench and seated figures"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(0.5) brightness(0.55) contrast(0.95)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.12_0.01_60/0.65),oklch(0.12_0.01_60/0.92))]" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <LegalEyeMark className="h-7 w-7 text-brass" />
            <span className="font-display text-lg tracking-wide text-parchment">
              LEGAL <span className="text-brass">EYE</span>
            </span>
          </div>

          <div className="max-w-lg">
            <p className="label-legal">Est. Record System</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.08] text-parchment">
              The record of a matter, read in the time it takes to read a headnote.
            </h2>
            <div className="mt-8 h-px w-32 rule-brass" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Legal Eye holds cases, histories and court records in one archive, and puts a
              legal intelligence layer over them — summaries, issues, timelines and parties,
              drawn from the record itself.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-8 border-t border-border pt-8">
            {[
              ["Matters", "1,284"],
              ["Courts", "37"],
              ["Records indexed", "96,510"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="label-legal">{label}</dt>
                <dd className="mt-2 font-display text-2xl text-parchment">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Authentication side */}
      <section className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm animate-rise-in">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <LegalEyeMark className="h-7 w-7 text-brass" />
            <span className="font-display text-lg tracking-wide">
              LEGAL <span className="text-brass">EYE</span>
            </span>
          </div>

          <p className="label-legal">Secure access</p>
          <h1 className="mt-3 font-display text-3xl">Enter the archive</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Credentials are issued by your chamber administrator.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="label-legal block">
                Registered email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                defaultValue="s.iyer@chambers.in"
                className="focus-legal w-full border-b border-input bg-transparent pb-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-brass-dim focus:border-brass"
                placeholder="name@chambers.in"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className="label-legal block">
                  Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="focus-legal inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-brass"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                defaultValue="prototype"
                className="focus-legal w-full border-b border-input bg-transparent pb-2 text-sm text-foreground outline-none transition-colors hover:border-brass-dim focus:border-brass"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="focus-legal h-3.5 w-3.5 appearance-none border border-input bg-transparent transition-colors checked:border-brass checked:bg-brass"
                />
                Remember this device
              </label>
              <a href="#" className="focus-legal text-xs text-muted-foreground underline-offset-4 hover:text-brass hover:underline">
                Recover access
              </a>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="focus-legal group flex w-full items-center justify-between border border-brass/60 bg-brass/10 px-5 py-3.5 text-sm font-medium tracking-wide text-parchment transition-all hover:bg-brass hover:text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Opening the archive…" : "Sign in"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-10 h-px w-full rule-brass" />
          <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
            Prototype build — authentication is illustrative. No credentials are transmitted or
            stored.
          </p>
        </div>
      </section>
    </main>
  );
}
