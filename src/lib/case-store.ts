/**
 * Frontend-only case store.
 *
 * Seeded with the sample archive; matters created in the app are kept in
 * localStorage so the prototype behaves like a real product without
 * implying a backend. Every read goes through this module, so swapping in a
 * real API later means replacing `load`/`persist` only.
 */

import { useCallback, useSyncExternalStore } from "react";
import { CASES, type CaseRecord } from "@/data/cases";

const STORAGE_KEY = "legal-eye.cases.v1";

let cache: CaseRecord[] | null = null;
const listeners = new Set<() => void>();

function load(): CaseRecord[] {
  if (cache) return cache;
  if (typeof window === "undefined") return CASES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const added = raw ? (JSON.parse(raw) as CaseRecord[]) : [];
    cache = [...added, ...CASES];
  } catch {
    cache = CASES;
  }
  return cache;
}

function persist(next: CaseRecord[]) {
  cache = next;
  if (typeof window !== "undefined") {
    const seeded = new Set(CASES.map((c) => c.id));
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next.filter((c) => !seeded.has(c.id))),
      );
    } catch {
      /* storage unavailable — session-only */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCases(): CaseRecord[] {
  return useSyncExternalStore(
    subscribe,
    load,
    () => CASES,
  );
}

export function useCaseActions() {
  const addCase = useCallback((record: CaseRecord) => {
    persist([record, ...load().filter((c) => c.id !== record.id)]);
  }, []);

  const togglePinned = useCallback((id: string) => {
    persist(load().map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  return { addCase, togglePinned };
}

export interface NewCaseInput {
  id: string;
  title: string;
  court: string;
  bench: string;
  status: CaseRecord["status"];
  filed: string;
  subject: string;
  petitioner: string;
  respondent: string;
  summary: string;
  confidential: boolean;
  fileName?: string;
}

export function toCaseRecord(input: NewCaseInput): CaseRecord {
  return {
    id: input.id.trim().toUpperCase(),
    title: input.title.trim(),
    court: input.court.trim(),
    bench: input.bench.trim() || "To be assigned",
    status: input.status,
    filed: input.filed.trim() || "Not recorded",
    updated: "just now",
    subject: input.subject.trim() || "General",
    confidential: input.confidential,
    parties: [
      { role: "Petitioner", name: input.petitioner.trim() || "Not recorded" },
      { role: "Respondent", name: input.respondent.trim() || "Not recorded" },
    ],
    history: [
      {
        date: input.filed.trim() || "Today",
        title: "Record created",
        note: input.fileName ? `Case file attached: ${input.fileName}` : "Entered into the archive.",
      },
    ],
    summary: input.summary.trim() || "No summary recorded for this matter yet.",
    issues: [],
    authorities: [],
  };
}

/** Placeholder identity until an authentication service exists. */
export const CURRENT_USER = { name: "S. Iyer", initials: "SI" };
