import { publicClient } from "./supabase/server";

export type PublicBooking = {
  id: string;
  status: "pending_payment" | "confirmed" | "cancelled" | "completed" | "no_show";
  payment_status: "unpaid" | "paid" | "refunded";
  starts_at: string;
  ends_at: string;
  format: "online" | "in_person";
  price_minor: number;
  currency: string;
  room_name: string | null;
  client_name: string;
  client_email: string;
  therapist_name: string;
  therapist_slug: string;
  therapist_title: string;
  therapist_photo: string | null;
  therapist_address: string | null;
  timezone: string;
  service_name: string | null;
  cancellation_hours: number;
  hold_expires_at: string | null;
};

export async function getPublicBooking(id: string, token: string) {
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f-]{36}$/.test(token)) return null;
  const { data } = await publicClient().rpc("get_booking", { p_id: id, p_token: token });
  return ((Array.isArray(data) ? data[0] : data) as PublicBooking) ?? null;
}
