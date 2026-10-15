"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "./supabase/server";
import { parseIcs } from "./ics";
import { isDemoEmail } from "./onboarding";
import { pick, uiLang } from "./ui-lang";
import { ONB_T } from "./ui/onboarding";
import type { Therapist } from "./types";

/* ---------- parsing ---------- */

const EMAIL = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/i;
const LANGS = new Set(["pl", "uk", "ua", "en"]);

export type ImportRow = {
  name: string;
  email: string;
  phone: string | null;
  language: "pl" | "uk" | "en";
  status: "new" | "exists" | "check";
  source: "list" | "calendar";
  /** sessions found for this person in the calendar file */
  sessions: number;
};

export type ImportState = {
  rows?: ImportRow[];
  sessions?: number;
  skippedSessions?: number;
  error?: string;
  /** set when nothing usable was found */
  empty?: boolean;
};

function normLang(v: string | null | undefined): "pl" | "uk" | "en" {
  const s = (v ?? "").toLowerCase();
  if (s === "uk" || s === "ua") return "uk";
  if (s === "en") return "en";
  return "pl";
}

/** "Marta Nowak, marta@wp.pl, 600 123 456, UA" → one person. Order of the fields does not matter. */
function parseLine(raw: string) {
  let line = raw;
  let email: string | null = null;
  // "Name <email>" — take the address out first so the rest is the name
  const angle = line.match(/<\s*([^>\s]+@[^>\s]+)\s*>/);
  if (angle) {
    email = angle[1].toLowerCase();
    line = line.replace(angle[0], " ");
  }
  const parts = line
    .split(/[,;\t]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length && !email) return null;
  let phone: string | null = null;
  let lang: string | null = null;
  const nameParts: string[] = [];
  for (const p of parts) {
    const low = p.toLowerCase();
    if (!email && p.includes("@")) {
      // "Marta Nowak marta@wp.pl" — the address may share a field with the name
      const tokens = p.split(/\s+/);
      email = tokens.find((t) => t.includes("@"))!.toLowerCase().replace(/^<|>$/g, "");
      nameParts.push(...tokens.filter((t) => !t.includes("@")));
    } else if (!phone && /^[+\d][\d\s().-]{6,}$/.test(p)) phone = p.replace(/\s+/g, " ");
    else if (!lang && LANGS.has(low)) lang = low;
    else nameParts.push(p);
  }
  const name = nameParts.join(" ").replace(/\s+/g, " ").trim();
  if (!email && !name) return null;
  return { name: name || (email ? email.split("@")[0] : ""), email: email ?? "", phone, language: normLang(lang), valid: Boolean(email && EMAIL.test(email)) };
}

type Parsed = {
  people: Map<string, { name: string; email: string; phone: string | null; language: "pl" | "uk" | "en"; source: "list" | "calendar"; valid: boolean }>;
  sessions: { email: string; start: Date; end: Date; summary: string; inPerson: boolean }[];
  skippedSessions: number;
};

function parseInput(text: string, ics: string, th: Therapist, ownEmail: string | undefined): Parsed {
  const people: Parsed["people"] = new Map();
  for (const raw of text.split(/\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const p = parseLine(line);
    if (!p) continue;
    const key = p.valid ? p.email : `invalid:${line}`;
    if (!people.has(key)) people.set(key, { ...p, source: "list" });
  }
  const sessions: Parsed["sessions"] = [];
  let skippedSessions = 0;
  if (ics.trim()) {
    const from = new Date(Date.now() + 15 * 60_000);
    const to = new Date(Date.now() + 56 * 86400_000);
    const own = (ownEmail ?? "").toLowerCase();
    for (const ev of parseIcs(ics, th.timezone, { from, to })) {
      const att = ev.attendees.find((a) => a.email !== own && a.email !== ev.organizer) ?? ev.attendees.find((a) => a.email !== own);
      if (!att || !EMAIL.test(att.email)) {
        skippedSessions++;
        continue;
      }
      const existing = people.get(att.email);
      if (!existing) people.set(att.email, { name: att.name || ev.summary || att.email.split("@")[0], email: att.email, phone: null, language: "pl", source: "calendar", valid: true });
      else if (!existing.name && att.name) existing.name = att.name;
      const inPerson = /gabinet|office|stacjonar|ul\.|street/i.test(ev.description + " " + ev.summary) && !/meet\.|zoom|teams|http/i.test(ev.description);
      sessions.push({ email: att.email, start: ev.start, end: ev.end, summary: ev.summary, inPerson });
    }
  }
  return { people, sessions, skippedSessions };
}

async function buildState(form: FormData): Promise<{ state: ImportState; parsed: Parsed; supabase: Awaited<ReturnType<typeof requireUser>>["supabase"]; th: Therapist; user: NonNullable<Awaited<ReturnType<typeof requireUser>>["user"]> }> {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  const { data: th } = await supabase.from("therapists").select("*").eq("id", user.id).single<Therapist>();
  if (!th) redirect("/login");
  const text = String(form.get("text") ?? "").slice(0, 50_000);
  const ics = String(form.get("ics") ?? "").slice(0, 2_000_000);
  const parsed = parseInput(text, ics, th, user.email);
  const emails = [...parsed.people.values()].filter((p) => p.valid).map((p) => p.email);
  const existing = new Set<string>();
  if (emails.length) {
    const { data } = await supabase.from("clients").select("email").in("email", emails);
    for (const c of data ?? []) existing.add(String(c.email).toLowerCase());
  }
  const sessionsBy = new Map<string, number>();
  for (const s of parsed.sessions) sessionsBy.set(s.email, (sessionsBy.get(s.email) ?? 0) + 1);
  const rows: ImportRow[] = [...parsed.people.values()].map((p) => ({
    name: p.name,
    email: p.email,
    phone: p.phone,
    language: p.language,
    status: !p.valid ? "check" : existing.has(p.email) ? "exists" : "new",
    source: p.source,
    sessions: sessionsBy.get(p.email) ?? 0,
  }));
  return { state: { rows, sessions: parsed.sessions.length, skippedSessions: parsed.skippedSessions, empty: rows.length === 0 && parsed.sessions.length === 0 }, parsed, supabase, th, user };
}

/* ---------- actions ---------- */

export async function previewImport(_: ImportState, form: FormData): Promise<ImportState> {
  const { state } = await buildState(form);
  return state;
}

export async function commitImport(_: ImportState, form: FormData): Promise<ImportState> {
  const t = pick(ONB_T, await uiLang());
  const { state, parsed, supabase, th, user } = await buildState(form);
  const rows = (state.rows ?? []).filter((r) => r.status !== "check");
  if (!rows.length && !parsed.sessions.length) return { ...state, error: t.nothingFound };

  // clients: insert the new ones, keep the existing ones untouched
  const fresh = rows.filter((r) => r.status === "new");
  if (fresh.length) {
    const { error } = await supabase.from("clients").insert(fresh.map((r) => ({ therapist_id: user.id, full_name: r.name, email: r.email, phone: r.phone, language: r.language })));
    if (error && error.code !== "23505") return { ...state, error: t.importError };
  }

  // sessions from the calendar file
  if (parsed.sessions.length) {
    const emails = [...new Set(parsed.sessions.map((s) => s.email))];
    const [{ data: clients }, { data: svcs }] = await Promise.all([
      supabase.from("clients").select("id, email").in("email", emails),
      supabase.from("services").select("*").eq("active", true).order("sort").limit(1),
    ]);
    const svc = svcs?.[0];
    const byEmail = new Map((clients ?? []).map((c) => [String(c.email).toLowerCase(), c.id as string]));
    if (svc) {
      for (const s of parsed.sessions) {
        const clientId = byEmail.get(s.email);
        if (!clientId) continue;
        // one at a time so a clash with an existing booking (no_double_booking) skips just that session
        await supabase.from("bookings").insert({
          therapist_id: user.id,
          service_id: svc.id,
          client_id: clientId,
          starts_at: s.start.toISOString(),
          ends_at: s.end.toISOString(),
          format: s.inPerson && th.formats.includes("in_person") ? "in_person" : "online",
          status: "confirmed",
          payment_status: "unpaid",
          price_minor: svc.price_minor,
          currency: th.currency,
          room_name: crypto.randomUUID().replace(/-/g, ""),
        });
      }
    }
  }
  revalidatePath("/", "layout");
  redirect("/onboarding/note");
}

/** Step 3: a practice note on a hidden sample client, so the real editor can be used end to end. */
export async function startPracticeNote() {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  const lang = await uiLang();
  const t = pick(ONB_T, lang);
  let { data: sample } = await supabase.from("clients").select("id").eq("sample", true).limit(1).maybeSingle();
  if (!sample) {
    const { data } = await supabase
      .from("clients")
      .insert({ therapist_id: user.id, full_name: t.practiceClient, email: `practice+${user.id.slice(0, 8)}@sample.usesessio.com`, language: lang, sample: true })
      .select("id")
      .single();
    sample = data;
  }
  if (!sample) redirect("/onboarding/note?error=1");
  const { data: draft } = await supabase.from("notes").select("id").eq("client_id", sample.id).eq("status", "draft").limit(1).maybeSingle();
  let id = draft?.id as string | undefined;
  if (!id) {
    const { data: created } = await supabase.from("notes").insert({ therapist_id: user.id, client_id: sample.id, booking_id: null, session_number: 1 }).select("id").single();
    id = created?.id;
  }
  if (!id) redirect("/onboarding/note?error=1");
  redirect(`/notes/${id}?practice=1`);
}

export async function dismissChecklist() {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  if (!isDemoEmail(user.email)) {
    const { data: th } = await supabase.from("therapists").select("onboarding").eq("id", user.id).single();
    await supabase
      .from("therapists")
      .update({ onboarding: { ...((th?.onboarding as Record<string, unknown>) ?? {}), dismissed_at: new Date().toISOString() } })
      .eq("id", user.id);
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function restartChecklist() {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  if (!isDemoEmail(user.email)) {
    const { data: th } = await supabase.from("therapists").select("onboarding").eq("id", user.id).single();
    const next = { ...((th?.onboarding as Record<string, unknown>) ?? {}) };
    delete next.dismissed_at;
    await supabase.from("therapists").update({ onboarding: next }).eq("id", user.id);
  }
  revalidatePath("/", "layout");
  redirect("/onboarding");
}
