/**
 * Frontend-only case store.
 *
 * Seeded with the sample archive; matters created in the app are kept in
 * localStorage so the prototype behaves like a real product without
 * implying a backend. Edits made to seeded matters (status, classification,
 * pinning, …) are stored as overrides so they survive a reload. Every read
 * goes through this module, so swapping in a real API later means replacing
 * `load`/`persist` only.
 */

import { useCallback, useSyncExternalStore } from "react";
import { CASES, type CaseClassification, type CaseRecord } from "@/data/cases";

const STORAGE_KEY = "legal-eye.cases.v1";

let cache: CaseRecord[] | null = null;
const listeners = new Set<() => void>();

const seededById = new Map(CASES.map((c) => [c.id, c]));

/**
 * Older localStorage payloads predate `classification` (they used a
 * `confidential` boolean) — migrate them in place on load.
 */
function normalize(record: CaseRecord): CaseRecord {
  const legacy = record as CaseRecord & { confidential?: boolean };
  const { classification, confidential, ...rest } = legacy;
  return {
    ...rest,
    classification: classification ?? (confidential ? "confidential" : "general"),
  };
}

function load(): CaseRecord[] {
  if (cache) return cache;
  if (typeof window === "undefined") return CASES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as CaseRecord[]) : [];
    const added = stored.filter((c) => !seededById.has(c.id)).map(normalize);
    const overrides = new Map(stored.filter((c) => seededById.has(c.id)).map((c) => [c.id, normalize(c)]));
    cache = [...added, ...CASES.map((c) => overrides.get(c.id) ?? c)];
  } catch {
    cache = CASES;
  }
  return cache;
}

function persist(next: CaseRecord[]) {
  cache = next;
  if (typeof window !== "undefined") {
    // Store in-app additions plus any seeded matter that has diverged from its
    // seed — enough to persist edits without duplicating the whole archive.
    const stored = next.filter((c) => {
      const seed = seededById.get(c.id);
      if (!seed) return true;
      return JSON.stringify(c) !== JSON.stringify(seed);
    });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
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
  return useSyncExternalStore(subscribe, load, () => CASES);
}

export function useCaseActions() {
  const addCase = useCallback((record: CaseRecord) => {
    persist([record, ...load().filter((c) => c.id !== record.id)]);
  }, []);

  const togglePinned = useCallback((id: string) => {
    persist(load().map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  /** Single source of truth for edits — every UI reads from the same store. */
  const updateCase = useCallback((id: string, patch: Partial<CaseRecord>) => {
    persist(load().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  return { addCase, togglePinned, updateCase };
}

export interface NewCaseInput {
  id: string;
  title: string;
  court: string;
  bench: string;
  status: CaseRecord["status"];
  classification: CaseClassification;
  filed: string;
  subject: string;
  petitioner: string;
  respondent: string;
  summary: string;
  fileName?: string;
}

export function toCaseRecord(input: NewCaseInput): CaseRecord {
  return {
    id: input.id.trim().toUpperCase(),
    title: input.title.trim(),
    court: input.court.trim(),
    bench: input.bench.trim() || "To be assigned",
    status: input.status,
    classification: input.classification,
    filed: input.filed.trim() || "Not recorded",
    updated: "just now",
    subject: input.subject.trim() || "General",
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