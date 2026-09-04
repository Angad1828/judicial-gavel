import { useEffect, useMemo, useRef, useState } from "react";
import courtroom from "@/assets/courtroom.jpg";
import gavelImg from "@/assets/gavel.png";
import blockImg from "@/assets/block.png";
import { GAVEL_ANIM_MS, TIMELINE, type IntroPhase } from "@/lib/intro-timeline";
import { playGavelThud } from "@/lib/gavel-sound";
import { LegalEyeMark } from "@/components/brand/LegalEyeMark";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const ORDER: Array<[IntroPhase, number]> = [
  ["haze", TIMELINE.hazeIn],
  ["gavel", TIMELINE.gavelIn],
  ["strike-one", TIMELINE.strikeOne],
  ["strike-two", TIMELINE.strikeTwo],
  ["brand", TIMELINE.brandIn],
  ["settle", TIMELINE.settle],
  ["done", TIMELINE.handoff],
];

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("dark");
  const [impact, setImpact] = useState(0);
  const complete = useRef(onComplete);
  complete.current = onComplete;

  const reduced = useMemo(prefersReducedMotion, []);

  useEffect(() => {
    if (reduced) {
      setPhase("settle");
      const t = window.setTimeout(() => complete.current(), 900);
      return () => window.clearTimeout(t);
    }

    // The gavel runs one continuous keyframe animation; the phase timers only
    // mark the beats — impacts fire exactly on the animation's contact frames.
    const timers = ORDER.map(([next, at]) =>
      window.setTimeout(() => {
        setPhase(next);
        if (next === "strike-one" || next === "strike-two") {
          playGavelThud(next === "strike-two" ? 1 : 0.82);
          setImpact((n) => n + 1);
        }
        if (next === "done") complete.current();
      }, at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const gavelIn = phase !== "dark" && phase !== "haze";
  const brandVisible = phase === "brand" || phase === "settle" || phase === "done";
  const receding = phase === "settle" || phase === "done";

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-background grain"
      aria-hidden="true"
      style={{ opacity: phase === "done" ? 0 : 1, transition: "opacity 900ms ease" }}
    >
      {/* Courtroom, emerging through haze */}
      <div
        className="absolute inset-0"
        style={{
          opacity: phase === "dark" ? 0 : receding ? 0.18 : 0.62,
          transition: "opacity 2200ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <img
          src={courtroom}
          alt=""
          width={1920}
          height={1088}
          className="h-full w-full object-cover"
          style={{
            filter: "saturate(0.55) contrast(0.92) blur(3px) brightness(0.72)",
            animation: "haze-drift 14s ease-out both",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_18%,oklch(0.1_0.01_60/0.85)_78%)]" />
      </div>

      {/* Camera shake wrapper */}
      <div
        key={impact}
        className="absolute inset-0"
        style={impact ? { animation: "shake-impact 520ms cubic-bezier(0.2,0.8,0.3,1)" } : undefined}
      >
        {/* Gavel stage */}
        <div
          className="absolute left-1/2 top-1/2 w-[min(78vw,640px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: gavelIn && !receding ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${receding ? 0.94 : 1})`,
            transition: "opacity 400ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* warm pool of light grounding the scene */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_46%_78%,color-mix(in_oklab,var(--brass)_16%,transparent),transparent_62%)]" />
          <div className="relative aspect-[4/3]">
            {/* contact shadow */}
            <div
              className="absolute bottom-[16%] left-[26%] h-[6%] w-[34%] rounded-[50%] bg-black/70 blur-xl"
              style={{
                transform: `scaleX(${impact ? 1.15 : 1})`,
                transition: "transform 220ms ease",
              }}
            />
            <img
              src={blockImg}
              alt=""
              width={768}
              height={512}
              className="absolute bottom-[8%] left-[20%] w-[36%] drop-shadow-[0_18px_28px_rgba(0,0,0,0.6)]"
              style={impact ? { animation: "block-recoil 260ms ease-out" } : undefined}
              key={`block-${impact}`}
            />
            {/* The original choreography: one continuous keyframe animation,
                rotating about the pivot at the handle end so the head arcs
                down onto the plate — appear → raise → strike ×2 → rebound. */}
            <div
              className="absolute inset-0"
              style={{
                transformOrigin: "78% 22%",
                animation: gavelIn
                  ? `gavel-strike ${GAVEL_ANIM_MS}ms linear both`
                  : undefined,
                transform: gavelIn ? undefined : "rotate(-30deg)",
              }}
            >
              <img
                src={gavelImg}
                alt=""
                width={1024}
                height={1024}
                className="w-full drop-shadow-[0_30px_45px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* impact bloom + dust */}
            {impact > 0 && (
              <div key={`fx-${impact}`} className="pointer-events-none absolute bottom-[14%] left-[36%]">
                <span
                  className="absolute block h-24 w-24 -translate-x-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, var(--brass) 55%, transparent), transparent 68%)",
                    animation: "bloom-pulse 620ms ease-out both",
                  }}
                />
                {[-34, -14, 10, 28, 46].map((dx, i) => (
                  <span
                    key={dx}
                    className="absolute block h-1 w-1 rounded-full bg-parchment/50"
                    style={
                      {
                        "--dx": `${dx}px`,
                        animation: `dust-rise ${900 + i * 120}ms ease-out both`,
                        animationDelay: `${i * 40}ms`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Brand reveal */}
        <div
          className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-6 text-center"
          style={{
            opacity: brandVisible ? 1 : 0,
            transform: `translateY(${brandVisible ? "-50%" : "-44%"})`,
            transition: "opacity 1100ms ease, transform 1100ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <LegalEyeMark className="mb-6 h-10 w-10 text-brass" />
          <div className="relative overflow-hidden">
            <h1 className="font-display text-[clamp(2.5rem,9vw,5.5rem)] leading-none tracking-[-0.02em] text-parchment">
              LEGAL <span className="text-brass">EYE</span>
            </h1>
            {brandVisible && (
              <span
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,oklch(0.95_0.05_85/0.55),transparent)]"
                style={{ animation: "sheen-sweep 1500ms 350ms ease-out both" }}
              />
            )}
          </div>
          <div className="mt-6 h-px w-40 rule-brass" />
          <p className="label-legal mt-5">Legal Records · Case History · Intelligence</p>
        </div>
      </div>
    </div>
  );
}
