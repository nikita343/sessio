import { TZDate } from "@date-fns/tz";
import { publicClient } from "./supabase/server";
import { buildDays } from "./slots";
import type { Availability, Service, Therapist } from "./types";
import type { Lang } from "./i18n";
import { localized } from "./profile";

/**
 * A small, free directory of Sessio practices that chose to be listed (therapists.listed).
 * Clients answer a few questions; we filter on hard needs (language, format, who it's for,
 * budget) and rank on the rest (topics, time of day). No commission, no paid placement.
 */

export type When = "morning" | "afternoon" | "evening" | "any";
export type Who = "me" | "couple" | "teen";
export type Fmt = "online" | "in_person" | "any";

export type Answers = { topics: string[]; who: Who; lang: string; fmt: Fmt; when: When; budget: number | null };

export const WHO_TO_KEY: Record<Who, string> = { me: "adults", couple: "couples", teen: "teens" };

export function parseAnswers(sp: Record<string, string | string[] | undefined>): Answers | null {
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  if (!one("go")) return null;
  const who = (["me", "couple", "teen"].includes(one("who")) ? one("who") : "me") as Who;
  const fmt = (["online", "in_person", "any"].includes(one("fmt")) ? one("fmt") : "any") as Fmt;
  const when = (["morning", "afternoon", "evening", "any"].includes(one("when")) ? one("when") : "any") as When;
  const b = Number(one("budget"));
  return {
    topics: one("topics").split(",").filter(Boolean).slice(0, 6),
    who,
    lang: ["pl", "uk", "en", "ru", "de"].includes(one("lang")) ? one("lang") : "pl",
    fmt,
    when,
    budget: Number.isFinite(b) && b > 0 ? b : null,
  };
}

const inWindow = (iso: string, tz: string, when: When) => {
  if (when === "any") return true;
  const h = new TZDate(new Date(iso).getTime(), tz).getHours();
  return when === "morning" ? h < 12 : when === "afternoon" ? h >= 12 && h < 17 : h >= 17;
};

export type Match = {
  therapist: Therapist;
  service: Service;
  topics: string[]; // overlap with what the client picked
  nextFit: string | null; // first free slot in the preferred time of day
  nextAny: string | null;
  speaksLang: boolean;
  score: number;
  strong: boolean; // passes every hard filter
};

export async function loadDirectory(a: Answers, lang: Lang): Promise<Match[]> {
  const sb = publicClient();
  const { data: rows } = await sb.from("therapists").select("*").eq("published", true).eq("listed", true).limit(60);
  const therapists = (rows ?? []) as Therapist[];
  const from = new Date();
  const to = new Date(Date.now() + 22 * 86400_000);
  const out = await Promise.all(
    therapists.map(async (raw): Promise<Match | null> => {
      if (!raw.slug) return null;
      const th: Therapist = { ...raw, ...localized({ title: raw.title, city: raw.city, bio: raw.bio }, raw.profile_i18n, lang) };
      const [{ data: services }, { data: availability }, { data: busy }] = await Promise.all([
        sb.from("services").select("*").eq("therapist_id", raw.id).eq("active", true).order("sort").limit(1),
        sb.rpc("public_availability", { p_slug: raw.slug }),
        sb.rpc("busy_slots", { p_slug: raw.slug, p_from: from.toISOString(), p_to: to.toISOString() }),
      ]);
      const service = services?.[0] as Service | undefined;
      if (!service) return null;
      const days = buildDays({
        availability: (availability as Availability[]) ?? [],
        busy: (busy as { starts_at: string; ends_at: string }[]) ?? [],
        durationMin: service.duration_min,
        tz: raw.timezone,
      });
      const free = days.flatMap((d) => d.slots.filter((s) => s.free));
      const nextAny = free[0]?.start ?? null;
      const nextFit = free.find((s) => inWindow(s.start, raw.timezone, a.when))?.start ?? null;

      const speaksLang = (raw.languages ?? []).includes(a.lang);
      const fmtOk = a.fmt === "any" || (raw.formats ?? []).includes(a.fmt);
      const works = raw.works_with?.length ? raw.works_with : ["adults"];
      const whoOk = works.includes(WHO_TO_KEY[a.who]) || (a.who === "me" && works.includes("young_adults"));
      const budgetOk = a.budget === null || service.price_minor / 100 <= a.budget;
      const topics = a.topics.filter((t) => (raw.specialties ?? []).includes(t));

      const strong = speaksLang && fmtOk && whoOk && budgetOk;
      const score =
        (strong ? 100 : 0) + topics.length * 12 + (nextFit ? 10 : 0) + (speaksLang ? 6 : 0) + (fmtOk ? 4 : 0) + (budgetOk ? 3 : 0) + Math.min(10, raw.practising_since ? new Date().getFullYear() - raw.practising_since : 0) * 0.3;
      return { therapist: th, service, topics, nextFit, nextAny, speaksLang, score, strong };
    }),
  );
  return out.filter((m): m is Match => !!m).sort((x, y) => y.score - x.score);
}
