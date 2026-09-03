/**
 * Master choreography for the LEGAL EYE opening sequence.
 * Every number below is a millisecond offset from sequence start, so CSS,
 * React state and the impact sound all read from one source of truth.
 */

export const TIMELINE = {
  /** courtroom haze begins bleeding out of darkness */
  hazeIn: 200,
  /** gavel enters frame, raised and settling */
  gavelIn: 900,
  /** first strike: anticipation → acceleration → impact */
  strikeOne: 2100,
  /** second, more decisive strike */
  strikeTwo: 3150,
  /** wordmark emerges from the darkness */
  brandIn: 3900,
  /** courtroom recedes, brand settles */
  settle: 5200,
  /** intro hands over to the application shell */
  handoff: 6200,
} as const;

export type IntroPhase =
  | "dark"
  | "haze"
  | "gavel"
  | "strike-one"
  | "strike-two"
  | "brand"
  | "settle"
  | "done";

/** Duration of the descending swing, shared by CSS transition + impact sound. */
export const SWING_MS = 320;
/** Duration of the rebound after contact. */
export const REBOUND_MS = 520;
