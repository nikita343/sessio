"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "./supabase/server";

const RESERVED = new Set([
  "login", "auth", "dashboard", "calendar", "clients", "notes", "payments", "booking-page", "settings", "onboarding",
  "inbox", "room", "b", "api", "admin", "app", "www", "help", "privacy", "terms", "demo", "sessio",
]);

const Schema = z.object({
  full_name: z.string().trim().min(2, "Add your name"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9][a-z0-9-]{2,40}$/, "Use 3–40 lowercase letters, numbers or dashes"),
  title: z.string().trim().max(80),
  city: z.string().trim().max(60),
  bio: z.string().trim().max(600),
  address: z.string().trim().max(160).optional(),
  languages: z.array(z.string()).min(1, "Pick at least one language"),
  formats: z.array(z.enum(["online", "in_person"])).min(1, "Pick at least one format"),
  service_name: z.string().trim().min(2).max(60),
  price: z.coerce.number().min(0).max(5000),
  duration: z.coerce.number().int().min(15).max(240),
  hours: z.array(z.object({ weekday: z.number().int().min(1).max(7), start: z.string(), end: z.string() })),
});

export type PracticeState = { error?: string; saved?: boolean };

export async function savePractice(_: PracticeState, form: FormData): Promise<PracticeState> {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");

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
    service_name: form.get("service_name") ?? "Individual session",
    price: form.get("price"),
    duration: form.get("duration"),
    hours,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  const v = parsed.data;
  if (RESERVED.has(v.slug)) return { error: "That link is reserved — try another." };
  if (!v.hours.length) return { error: "Add at least one working day." };
  for (const h of v.hours) if (h.end <= h.start) return { error: "Each working day needs an end time after its start time." };

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
  if (tErr) return { error: tErr.code === "23505" ? "Someone already uses that link — try another." : tErr.message };

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
