/**
 * Frontend-only user/session store.
 *
 * Mirrors the case-store pattern: one module holds the signed-in user, reads
 * go through `useUser()`, and the session is persisted in localStorage so a
 * refresh keeps the logged-in state while `signOut()` clears it for good.
 * When a real authentication service arrives, replace `readSession` /
 * `commitSession` with API-backed calls — the hooks and consumers stay.
 */

import { useSyncExternalStore } from "react";

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  role: string;
  phone: string;
}

const SESSION_KEY = "legal-eye.session.v1";

/** Neutral prototype identity — the login screen is the only sign-in path. */
export const DEFAULT_USER: UserProfile = {
  name: "S. Iyer",
  initials: "SI",
  email: "s.iyer@chambers.in",
  role: "Lawyer",
  phone: "",
};

let sessionCache: UserProfile | null | undefined; // undefined = not yet read
const listeners = new Set<() => void>();

function readSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  if (sessionCache !== undefined) return sessionCache;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    sessionCache = raw ? { ...DEFAULT_USER, ...(JSON.parse(raw) as Partial<UserProfile>) } : null;
  } catch {
    sessionCache = null;
  }
  return sessionCache;
}

function commitSession(user: UserProfile | null) {
  sessionCache = user;
  if (typeof window !== "undefined") {
    try {
      if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(SESSION_KEY);
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

/** Non-hook read for route guards (beforeLoad runs outside components). */
export function getSession(): UserProfile | null {
  return readSession();
}

export function useUser(): UserProfile | null {
  return useSyncExternalStore(subscribe, readSession, () => null);
}

/** Start a session. Merged over the prototype identity so partial logins work. */
export function signIn(overrides?: Partial<UserProfile>) {
  commitSession({ ...DEFAULT_USER, ...overrides });
}

/** End the session — protected routes redirect to the login screen. */
export function signOut() {
  commitSession(null);
}

export function updateUser(patch: Partial<UserProfile>) {
  const current = readSession();
  if (!current) return;
  commitSession({ ...current, ...patch });
}