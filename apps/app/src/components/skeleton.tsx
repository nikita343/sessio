import type { CSSProperties, ReactNode } from "react";

/*
 * Loading skeletons. Pure server components (no state, no effects) so they can be
 * prerendered as the instant loading state of each route's `loading.tsx`.
 * The shimmer lives in globals.css (`.skeleton`), and falls back to a slow pulse
 * under `prefers-reduced-motion`.
 */

type Tone = "default" | "dark";

/** A shimmering placeholder block. Rounded 8px unless `className` sets its own `rounded-*`. */
export function Skeleton({ className = "", tone = "default", style }: { className?: string; tone?: Tone; style?: CSSProperties }) {
  const radius = /(^|\s)!?rounded/.test(className) ? "" : "rounded-[8px]";
  return <div aria-hidden="true" style={style} className={`skeleton ${tone === "dark" ? "skeleton-dark" : ""} ${radius} ${className}`} />;
}

/**
 * Line box heights match the type ramp in globals.css so a placeholder line takes
 * exactly the space the real text will, and the bar sits centred in it like x-height text.
 */
const LINE = {
  caption: ["h-4", "h-2.5"],
  overline: ["h-4", "h-2.5"],
  label: ["h-5", "h-3"],
  "body-s": ["h-5", "h-3"],
  "body-m": ["h-6", "h-3.5"],
  "body-l": ["h-[27px]", "h-4"],
  title: ["h-6", "h-4"],
  heading: ["t-heading-m h-[1.14em]", "h-[0.62em]"],
  display: ["t-display-l h-[1.1em]", "h-[0.62em]"],
} as const;
export type LineVariant = keyof typeof LINE;

/** One line of placeholder text. Width goes on `className` (defaults to full width). */
export function SkeletonLine({ variant = "body-s", className = "w-full", tone }: { variant?: LineVariant; className?: string; tone?: Tone }) {
  const [box, bar] = LINE[variant];
  return (
    <div aria-hidden="true" className={`flex shrink-0 items-center ${box} ${className}`}>
      <Skeleton tone={tone} className={`w-full ${bar} ${variant === "heading" || variant === "display" ? "rounded-[10px]" : "rounded-full"}`} />
    </div>
  );
}

/** A paragraph of `lines` placeholder lines; the last one is shorter. */
export function SkeletonText({
  lines = 3,
  variant = "body-s",
  className = "",
  last = "w-3/5",
  tone,
}: {
  lines?: number;
  variant?: LineVariant;
  className?: string;
  last?: string;
  tone?: Tone;
}) {
  return (
    <div aria-hidden="true" className={`flex flex-col ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine key={i} variant={variant} tone={tone} className={i === lines - 1 && lines > 1 ? last : "w-full"} />
      ))}
    </div>
  );
}

/** Round placeholder for an `<Avatar>` of the same size. */
export function SkeletonAvatar({ size = 32, tone, className = "" }: { size?: number; tone?: Tone; className?: string }) {
  return <Skeleton tone={tone} className={`shrink-0 rounded-full ${className}`} style={{ width: size, height: size }} />;
}

/** Pill placeholder matching `btn(_, size)` heights. Width goes on `className`. */
export function SkeletonButton({ size = "md", className = "w-28", tone }: { size?: "sm" | "md" | "lg"; className?: string; tone?: Tone }) {
  const h = { sm: "h-8", md: "h-10", lg: "h-12" }[size];
  return <Skeleton tone={tone} className={`shrink-0 rounded-full ${h} ${className}`} />;
}

/** Placeholder for `<Badge>` (11px uppercase pill). */
export function SkeletonBadge({ className = "w-14" }: { className?: string }) {
  return <Skeleton className={`h-[22px] shrink-0 rounded-full ${className}`} />;
}

/** Mirrors `<PageHeader>` from ui.tsx: optional eyebrow, heading, and right-aligned action pills. */
export function SkeletonHeader({
  eyebrow = "w-40",
  title = "w-48",
  actions = [],
  titleClassName = "",
}: {
  /** width class for the eyebrow line, or `false` for none */
  eyebrow?: string | false;
  title?: string;
  /** one width class per action button */
  actions?: string[];
  titleClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        {eyebrow && <SkeletonLine variant="caption" className={eyebrow} />}
        <SkeletonLine variant="heading" className={`${title} ${titleClassName}`} />
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((w, i) => (
            <SkeletonButton key={i} className={w} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Accessible wrapper for a loading screen: announces a single "Ładowanie…" to screen
 * readers and marks the region busy; every placeholder inside is aria-hidden.
 */
export function SkeletonScreen({ children, className = "", label = "Ładowanie…" }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
