import { redirect } from "next/navigation";
import { requireUser } from "./supabase/server";
import type { Therapist } from "./types";

/** Loads the signed-in therapist or bounces to login / onboarding. */
export async function getTherapist(opts: { allowUnpublished?: boolean } = {}) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  const { data } = await supabase.from("therapists").select("*").eq("id", user.id).single<Therapist>();
  if (!data) redirect("/login");
  if (!opts.allowUnpublished && !data.slug) redirect("/onboarding");
  return { supabase, user, therapist: data };
}

export function appHost() {
  const u = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";
  return u.replace(/^https?:\/\//, "");
}
