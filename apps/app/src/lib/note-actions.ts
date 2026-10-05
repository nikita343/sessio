"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "./supabase/server";

export async function saveNote(id: string, patch: { body?: string; working?: string }) {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false };
  const { data: n } = await supabase.from("notes").select("fields, status").eq("id", id).single();
  if (!n || n.status === "signed") return { ok: false };
  const update: Record<string, unknown> = {};
  if (patch.body !== undefined) update.body = patch.body;
  if (patch.working !== undefined) update.fields = { ...(n.fields ?? {}), working: patch.working };
  await supabase.from("notes").update(update).eq("id", id);
  return { ok: true };
}

export async function signNote(id: string, body: string, working: string) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  if (!body.trim()) return { ok: false, error: "Wpis jest pusty. / The record is empty." };
  const { data: n } = await supabase.from("notes").select("fields, status, booking_id").eq("id", id).single();
  if (!n || n.status === "signed") return { ok: false, error: "Wpis jest już podpisany. / Already signed." };
  await supabase
    .from("notes")
    .update({ body, fields: { ...(n.fields ?? {}), working }, status: "signed", signed_at: new Date().toISOString() })
    .eq("id", id);
  if (n.booking_id) await supabase.from("bookings").update({ status: "completed" }).eq("id", n.booking_id).eq("status", "confirmed");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function discardNote(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("notes").delete().eq("id", id).eq("status", "draft");
  revalidatePath("/notes");
  redirect("/notes");
}
