"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TZDate } from "@date-fns/tz";
import { requireUser } from "./supabase/server";

async function ctx() {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function setBookingStatus(form: FormData) {
  const { supabase, user } = await ctx();
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!["cancelled", "completed", "no_show", "confirmed"].includes(status)) return;
  const { data: b } = await supabase.from("bookings").update({ status }).eq("id", id).select("*, client:clients(full_name)").single();
  if (b && status === "cancelled") {
    await supabase.from("activity").insert({
      therapist_id: user.id,
      kind: "cancelled",
      summary: `You cancelled ${b.client?.full_name ?? "a client"}'s session${b.payment_status === "paid" ? " — refund the payment in Payments" : ""}`,
      ref_id: id,
    });
  }
  revalidatePath("/", "layout");
}

export type AddState = { error?: string; ok?: boolean };

export async function addSession(_: AddState, form: FormData): Promise<AddState> {
  const { supabase, user } = await ctx();
  const { data: th } = await supabase.from("therapists").select("timezone, currency").eq("id", user.id).single();
  const { data: svc } = await supabase.from("services").select("*").eq("therapist_id", user.id).eq("active", true).limit(1).single();
  if (!th || !svc) return { error: "Set up your session on the Booking page first." };

  let clientId = String(form.get("client_id") ?? "");
  if (!clientId) {
    const full_name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    if (!full_name || !email.includes("@")) return { error: "Pick a client or add a name and email." };
    const { data: c, error } = await supabase
      .from("clients")
      .upsert({ therapist_id: user.id, full_name, email }, { onConflict: "therapist_id,email" })
      .select("id")
      .single();
    if (error || !c) return { error: "Could not save the client." };
    clientId = c.id;
  }
  const [y, m, d] = String(form.get("date")).split("-").map(Number);
  const [hh, mm] = String(form.get("time")).split(":").map(Number);
  if (!y || hh === undefined) return { error: "Pick a date and time." };
  const start = new TZDate(y, m - 1, d, hh, mm, th.timezone);
  const minutes = Number(form.get("duration") ?? svc.duration_min) || svc.duration_min;
  const paid = form.get("paid") === "on";
  const { error } = await supabase.from("bookings").insert({
    therapist_id: user.id,
    service_id: svc.id,
    client_id: clientId,
    starts_at: new Date(start.getTime()).toISOString(),
    ends_at: new Date(start.getTime() + minutes * 60_000).toISOString(),
    format: String(form.get("format") ?? "online"),
    status: "confirmed",
    payment_status: paid ? "paid" : "unpaid",
    price_minor: svc.price_minor,
    currency: th.currency,
    room_name: crypto.randomUUID().replace(/-/g, ""),
  });
  if (error) return { error: error.message.includes("no_double_booking") ? "You already have a session at that time." : error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
