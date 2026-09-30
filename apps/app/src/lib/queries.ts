import type { SupabaseClient } from "@supabase/supabase-js";
import type { Booking, Client } from "./types";

export type BookingRow = Booking & { client: Pick<Client, "id" | "full_name" | "email" | "language"> | null; service: { name: string } | null };

export async function bookingsBetween(sb: SupabaseClient, from: Date, to: Date, statuses = ["confirmed", "completed", "no_show"]) {
  const { data } = await sb
    .from("bookings")
    .select("*, client:clients(id, full_name, email, language), service:services(name)")
    .gte("starts_at", from.toISOString())
    .lt("starts_at", to.toISOString())
    .in("status", statuses)
    .order("starts_at");
  return (data ?? []) as BookingRow[];
}

/** Session number per booking = its position among the client's non-cancelled bookings. */
export async function sessionNumbers(sb: SupabaseClient, clientIds: string[]) {
  if (!clientIds.length) return new Map<string, number>();
  const { data } = await sb
    .from("bookings")
    .select("id, client_id, starts_at")
    .in("client_id", clientIds)
    .in("status", ["confirmed", "completed", "no_show"])
    .order("starts_at");
  const count = new Map<string, number>();
  const out = new Map<string, number>();
  for (const b of data ?? []) {
    const n = (count.get(b.client_id) ?? 0) + 1;
    count.set(b.client_id, n);
    out.set(b.id, n);
  }
  return out;
}
