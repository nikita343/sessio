import type { SupabaseClient } from "@supabase/supabase-js";
import type { Therapist } from "./types";

export const CHECKLIST_TOTAL = 4;

export type Checklist = {
  page: boolean;
  clients: boolean;
  note: boolean;
  stripe: boolean;
  clientsCount: number;
  upcoming: number;
  done: number;
  total: number;
  complete: boolean;
  dismissed: boolean;
  /** show the card on the dashboard and keep the sidebar folded */
  show: boolean;
};

/**
 * The "Pierwsze kroki" checklist is derived from data, not stored: a page exists when the slug does,
 * clients when at least one non-sample client exists, a note when any note is signed (the practice
 * note counts), payments when Stripe Connect has charges enabled. Only "dismissed" is persisted.
 */
export async function getChecklist(supabase: SupabaseClient, th: Therapist): Promise<Checklist> {
  const now = new Date().toISOString();
  const [{ count: clientsCount }, { count: upcoming }, { count: signed }] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("sample", false),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed").gte("starts_at", now),
    supabase.from("notes").select("id", { count: "exact", head: true }).eq("status", "signed"),
  ]);
  const page = Boolean(th.slug && th.published);
  const clients = (clientsCount ?? 0) > 0;
  const note = (signed ?? 0) > 0;
  const stripe = Boolean(th.stripe_account_id && th.stripe_charges_enabled);
  const done = [page, clients, note, stripe].filter(Boolean).length;
  const dismissed = Boolean(th.onboarding?.dismissed_at);
  const complete = done === CHECKLIST_TOTAL;
  return { page, clients, note, stripe, clientsCount: clientsCount ?? 0, upcoming: upcoming ?? 0, done, total: CHECKLIST_TOTAL, complete, dismissed, show: !complete && !dismissed };
}

export function isDemoEmail(email: string | undefined | null) {
  return email === (process.env.DEMO_EMAIL ?? "demo@usesessio.com");
}
