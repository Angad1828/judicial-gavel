/** Legal Eye insignia: a judicial eye formed from scale beams and an iris. */
export function LegalEyeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Legal Eye insignia"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      <path d="M4 24c6.5-8.5 13-12.75 20-12.75S37.5 15.5 44 24c-6.5 8.5-13 12.75-20 12.75S10.5 32.5 4 24Z" />
      <circle cx="24" cy="24" r="5.25" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
      <path d="M24 8.5v3.2M12.5 18.5h23" strokeWidth="1" opacity="0.8" />
      <path d="M12.5 18.5 9 25h7l-3.5-6.5ZM35.5 18.5 32 25h7l-3.5-6.5Z" strokeWidth="0.9" opacity="0.75" />
    </svg>
  );
}
