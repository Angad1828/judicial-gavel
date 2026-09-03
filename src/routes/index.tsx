import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { LoginPanel } from "@/components/auth/LoginPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Legal Eye — Legal Records & Case Intelligence" },
      {
        name: "description",
        content:
          "Legal Eye is a legal records platform for cases, court histories and case intelligence — summaries, issues and timelines drawn from the record.",
      },
      { property: "og:title", content: "Legal Eye — Legal Records & Case Intelligence" },
      {
        property: "og:description",
        content:
          "A premium legal records archive with an intelligence layer over cases, histories and court documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Entry,
});

function Entry() {
  const [introDone, setIntroDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  // The intro is a client-side cinematic; skip it during SSR/prerender.
  useEffect(() => setMounted(true), []);

  return (
    <>
      <LoginPanel />
      {mounted && !introDone && <CinematicIntro onComplete={() => setIntroDone(true)} />}
    </>
  );
}
