type Tone = "default" | "inverse" | "onSage";

const TONES: Record<Tone, { curve: string; dot: string; word: string }> = {
  default: { curve: "#3F6B5E", dot: "#B8B0E0", word: "#1C2530" },
  inverse: { curve: "#C9DFD1", dot: "#D8D3EE", word: "#FFFFFF" },
  onSage: { curve: "#FFFFFF", dot: "#D8D3EE", word: "#FFFFFF" },
};

/** "Held" mark — a lavender dot (the client) resting on a sage curve (the practice). */
export function Mark({ size = 24, tone = "default" }: { size?: number; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="15" r="6.5" fill={t.dot} />
      <path d="M11 23a13 13 0 0 0 26 0" stroke={t.curve} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 24, tone = "default" }: { size?: number; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <span className="inline-flex items-center gap-1.5" aria-label="Sessio">
      <Mark size={size} tone={tone} />
      <span
        className="font-display font-semibold"
        style={{ color: t.word, fontSize: size * 0.83, letterSpacing: "-0.04em", lineHeight: 1 }}
      >
        sessio
      </span>
    </span>
  );
}
