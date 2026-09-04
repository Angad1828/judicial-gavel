/**
 * Master choreography for the LEGAL EYE opening sequence.
 *
 * These beats restore the ORIGINAL startup timeline: black screen → gavel
 * appears raised and settles → wind-up → two strikes inside one continuous
 * CSS keyframe → wordmark born from the second impact → gavel recedes →
 * brand settles → handoff. Every number is a millisecond offset from
 * sequence start so CSS, React state and the impact sound share one clock.
 */

export const TIMELINE = {
  /** courtroom haze begins bleeding out of darkness */
  hazeIn: 200,
  /** gavel appears raised and settles into its striking stance */
  gavelIn: 900,
  /** first impact (inside the continuous strike animation) */
  strikeOne: 2050,
  /** second, more decisive impact */
  strikeTwo: 2680,
  /** wordmark pops in, tied to strike two */
  brandIn: 2760,
  /** gavel recedes, brand rests alone */
  settle: 3400,
  /** intro hands over to the application shell */
  handoff: 5000,
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

/** The gavel's single continuous strike animation: starts at gavelIn, ends as it recedes. */
export const GAVEL_ANIM_MS = 2800;
/** Impact points as fractions of GAVEL_ANIM_MS — keep in sync with @keyframes gavel-strike. */
export const IMPACT_ONE_FRACTION = (TIMELINE.strikeOne - TIMELINE.gavelIn) / GAVEL_ANIM_MS;
export const IMPACT_TWO_FRACTION = (TIMELINE.strikeTwo - TIMELINE.gavelIn) / GAVEL_ANIM_MS;
