import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type BtnVariant = "primary" | "secondary" | "ghost" | "dark" | "danger";
const BTN: Record<BtnVariant, string> = {
  primary: "bg-sage text-white hover:bg-sage-hover disabled:bg-sage/50",
  secondary: "border border-line-strong bg-surface text-ink hover:border-ink/30",
  ghost: "text-ink hover:bg-sunken",
  dark: "bg-ink text-white hover:bg-ink/90",
  danger: "border border-line-strong bg-surface text-warn hover:border-warn/40",
};
const SIZE = { sm: "h-8 px-3.5 text-[13px]", md: "h-10 px-5 text-sm", lg: "h-12 px-6 text-[15px]" };

export function btn(variant: BtnVariant = "primary", size: keyof typeof SIZE = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.007em] transition-colors disabled:cursor-not-allowed ${BTN[variant]} ${SIZE[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: BtnVariant; size?: keyof typeof SIZE }) {
  return <button {...props} className={btn(variant, size, className)} />;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant; size?: keyof typeof SIZE }) {
  return <Link {...props} className={btn(variant, size, className)} />;
}

type Tone = "sage" | "clay" | "lavender" | "sky" | "stone" | "warn" | "ink";
const TONE: Record<Tone, string> = {
  sage: "bg-sage-soft text-sage",
  clay: "bg-clay-soft text-clay",
  lavender: "bg-lavender-soft text-[#5b5299]",
  sky: "bg-[#e3eef4] text-[#3d6a80]",
  stone: "bg-sunken text-stone",
  warn: "bg-[#f6e3dc] text-warn",
  ink: "bg-ink text-white",
};
export function Badge({ tone = "stone", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-[11px] font-medium uppercase tracking-[0.03em] ${TONE[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div {...props} className={`rounded-[16px] border border-line bg-surface ${className}`} />;
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: ReactNode; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="t-label-m text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="t-caption text-stone">{hint}</p>}
    </div>
  );
}

export const inputCls =
  "h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-sage focus:ring-3 focus:ring-sage/10";
export const textareaCls =
  "w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-sage focus:ring-3 focus:ring-sage/10";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${textareaCls} ${props.className ?? ""}`} />;
}

export function Avatar({ name, photo, size = 32, tone = "clay" }: { name: string; photo?: string | null; size?: number; tone?: "clay" | "sage" | "lavender" }) {
  const t = { clay: "bg-clay-soft text-clay", sage: "bg-sage-soft text-sage", lavender: "bg-lavender-soft text-[#5b5299]" }[tone];
  if (photo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-medium ${t}`} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {letters || "·"}
    </span>
  );
}

export function PageHeader({ eyebrow, title, actions }: { eyebrow?: ReactNode; title: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        {eyebrow && <p className="t-caption text-stone">{eyebrow}</p>}
        <h1 className="t-heading-m">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[16px] border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="t-title-m">{title}</p>
      {body && <p className="t-body-s max-w-sm text-stone">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
