"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "./supabase/server";
import { pick, uiLang } from "./ui-lang";
import { PRACTICE_ERR_T, type PracticeErr } from "./ui/booking";

const RESERVED = new Set([
  "login", "auth", "dashboard", "calendar", "clients", "notes", "payments", "booking-page", "settings", "onboarding",
  "inbox", "room", "b", "api", "admin", "app", "www", "help", "privacy", "terms", "demo", "sessio",
]);

const Schema = z.object({
  // messages are PracticeErr keys, resolved to the UI language in savePractice
  full_name: z.string().trim().min(2, "name"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9][a-z0-9-]{2,40}$/, "slug"),
  title: z.string().trim().max(80, "title"),
  city: z.string().trim().max(60, "city"),
  bio: z.string().trim().max(600, "bio"),
  address: z.string().trim().max(160, "address").optional(),
  languages: z.array(z.string()).min(1, "languages"),
  formats: z.array(z.enum(["online", "in_person"])).min(1, "formats"),
  service_name: z.string().trim().min(2, "service").max(60, "service"),
  price: z.coerce.number({ message: "price" }).min(0, "price").max(5000, "price"),
  duration: z.coerce.number({ message: "duration" }).int("duration").min(15, "duration").max(240, "duration"),
  hours: z.array(z.object({ weekday: z.number().int().min(1).max(7), start: z.string(), end: z.string() })),
});

export type PracticeState = { error?: string; saved?: boolean };

export async function savePractice(_: PracticeState, form: FormData): Promise<PracticeState> {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  const t = pick(PRACTICE_ERR_T, await uiLang());
  const err = (k: string | undefined) => (k && k in t ? t[k as PracticeErr] : t.check);

  let hours: unknown = [];
  try {
    hours = JSON.parse(String(form.get("hours") ?? "[]"));
  } catch {}
  const parsed = Schema.safeParse({
    full_name: form.get("full_name"),
    slug: form.get("slug"),
    title: form.get("title") ?? "",
    city: form.get("city") ?? "",
    bio: form.get("bio") ?? "",
    address: form.get("address") ?? "",
    languages: form.getAll("languages"),
    formats: form.getAll("formats"),
    service_name: form.get("service_name") ?? "Sesja indywidualna",
    price: form.get("price"),
    duration: form.get("duration"),
    hours,
  });
  if (!parsed.success) return { error: err(parsed.error.issues[0]?.message) };
  const v = parsed.data;
  if (RESERVED.has(v.slug)) return { error: t.reserved };
  if (!v.hours.length) return { error: t.noDays };
  for (const h of v.hours) if (h.end <= h.start) return { error: t.endAfterStart };

  const { error: tErr } = await supabase
    .from("therapists")
    .update({
      full_name: v.full_name,
      slug: v.slug,
      title: v.title,
      city: v.city,
      bio: v.bio,
      address: v.formats.includes("in_person") ? v.address || null : null,
      languages: v.languages,
      formats: v.formats,
      published: true,
    })
    .eq("id", user.id);
  if (tErr) return { error: tErr.code === "23505" ? t.taken : tErr.message };

  const serviceId = String(form.get("service_id") ?? "");
  const service = { therapist_id: user.id, name: v.service_name, price_minor: Math.round(v.price * 100), duration_min: v.duration, active: true };
  if (serviceId) await supabase.from("services").update(service).eq("id", serviceId);
  else await supabase.from("services").insert(service);

  await supabase.from("availability").delete().eq("therapist_id", user.id);
  await supabase
    .from("availability")
    .insert(v.hours.map((h) => ({ therapist_id: user.id, weekday: h.weekday, start_time: h.start, end_time: h.end })));

  revalidatePath("/", "layout");
  if (form.get("from") === "onboarding") redirect("/dashboard?welcome=1");
  return { saved: true };
}

/** The therapist's own additional terms, appended to the client agreement (one term per line). */
export async function saveAgreementNotes(form: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  // the shared demo practice is public, so its agreement stays the plain template
  if (user.email === (process.env.DEMO_EMAIL ?? "demo@usesessio.com")) redirect("/settings?saved=agreement");
  const notes = String(form.get("agreement_notes") ?? "").trim().slice(0, 3000);
  await supabase.from("therapists").update({ agreement_notes: notes || null }).eq("id", user.id);
  revalidatePath("/settings");
  redirect("/settings?saved=agreement");
}

/** Rich public profile: what you help with, how you work, education, first session, translations. */
export async function saveProfileDetails(form: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  if (user.email === (process.env.DEMO_EMAIL ?? "demo@usesessio.com")) redirect("/booking-page?saved=profile");
  const { SPECIALTIES, APPROACHES, WORKS_WITH } = await import("./profile");
  const pick = (name: string, allowed: Record<string, unknown>) => form.getAll(name).map(String).filter((k) => k in allowed).slice(0, 20);
  const text = (name: string, max: number) => {
    const v = String(form.get(name) ?? "").trim().slice(0, max);
    return v || null;
  };
  const since = Number(form.get("practising_since"));
  const i18n: Record<string, Record<string, string>> = {};
  for (const l of ["pl", "en", "uk"]) {
    const entry: Record<string, string> = {};
    for (const f of ["title", "bio", "about", "first_session"]) {
      const v = String(form.get(`tr_${l}_${f}`) ?? "").trim().slice(0, f === "about" ? 3000 : 800);
      if (v) entry[f] = v;
    }
    if (Object.keys(entry).length) i18n[l] = entry;
  }
  await supabase
    .from("therapists")
    .update({
      specialties: pick("specialties", SPECIALTIES),
      approaches: pick("approaches", APPROACHES),
      works_with: pick("works_with", WORKS_WITH),
      about: text("about", 3000),
      first_session: text("first_session", 1200),
      education: text("education", 2000),
      memberships: text("memberships", 1000),
      register_number: text("register_number", 40),
      practice_name: text("practice_name", 160),
      listed: form.get("listed") === "on",
      practising_since: since >= 1960 && since <= new Date().getFullYear() ? since : null,
      profile_i18n: i18n,
    })
    .eq("id", user.id);
  revalidatePath("/booking-page");
  redirect("/booking-page?saved=profile#profile");
}
