import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { enGB, pl, uk } from "date-fns/locale";

export const LANGS: Record<string, string> = { pl: "Polish", uk: "Ukrainian", en: "English", ru: "Russian", de: "German" };
export const FORMAT_LABEL = { online: "Online", in_person: "In person" } as const;

export function money(minor: number, currency = "PLN") {
  const v = minor / 100;
  const n = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);
  return currency === "PLN" ? `${n} zł` : `${n} ${currency}`;
}

const DATE_LOCALE = { pl, uk, en: enGB } as const;

/** Format an instant in the therapist's timezone. Pass `lang` for localized month/day names (defaults to English). */
export function inTz(iso: string | Date, tz: string, pattern: string, lang?: "pl" | "uk" | "en") {
  return format(new TZDate(new Date(iso).getTime(), tz), pattern, lang ? { locale: DATE_LOCALE[lang] } : undefined);
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("") || "·"
  );
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function shortName(name: string) {
  const [f, l] = name.trim().split(/\s+/);
  return l ? `${f} ${l[0]}.` : f ?? name;
}

export function tzLabel(tz: string) {
  if (tz === "Europe/Warsaw") {
    // CET in winter, CEST in summer
    const abbr = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value;
    return `Warsaw (${abbr === "CEST" || abbr === "GMT+2" ? "CEST" : "CET"})`;
  }
  return tz.replace("_", " ");
}

export function timeAgo(iso: string, lang: "pl" | "uk" | "en" = "en") {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (lang !== "en") {
    const rtf = new Intl.RelativeTimeFormat(lang === "pl" ? "pl" : "uk", { numeric: "auto" });
    if (s < 60) return lang === "pl" ? "przed chwilą" : "щойно";
    if (s < 3600) return rtf.format(-Math.floor(s / 60), "minute");
    if (s < 86400) return rtf.format(-Math.floor(s / 3600), "hour");
    return rtf.format(-Math.floor(s / 86400), "day");
  }
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 172800) return "yesterday";
  return `${Math.floor(s / 86400)} days ago`;
}
