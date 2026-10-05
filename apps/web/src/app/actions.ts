"use server";

import { supabase } from "@/lib/supabase";

export type WaitlistState = { status: "idle" | "ok" | "error"; message?: string };

export async function joinWaitlist(_prev: WaitlistState, form: FormData): Promise<WaitlistState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const source = String(form.get("source") ?? "landing");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", message: "That email doesn't look right." };
  }
  const { error } = await supabase().from("waitlist").insert({ email, source });
  if (error && error.code !== "23505") {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  return {
    status: "ok",
    message: source.startsWith("webinar:") ? "You're registered. The link arrives the day before." : "You're on the list. We'll write when your spot opens.",
  };
}
