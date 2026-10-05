"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "./supabase/server";
import { birthFromPesel, validPesel } from "./art28";

/** Therapist saves a client's Art. 28 identity details. */
export async function saveClientIdentity(form: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  const id = String(form.get("client_id") ?? "");
  const s = (k: string, max = 200) => {
    const v = String(form.get(k) ?? "").trim().slice(0, max);
    return v || null;
  };
  const pesel = s("pesel", 11)?.replace(/\s/g, "") ?? null;
  if (pesel && !validPesel(pesel)) redirect(`/clients/${id}?id_err=pesel#art28`);
  const birth = s("birth_date", 10) ?? (pesel ? birthFromPesel(pesel) : null);
  await supabase
    .from("clients")
    .update({
      full_name: s("full_name", 120) ?? undefined,
      birth_date: birth,
      pesel,
      id_document: s("id_document", 40),
      address: s("address", 200),
      guardian_name: s("guardian_name", 120),
      guardian_contact: s("guardian_contact", 120),
      identity_updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("therapist_id", user.id);
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}?id_saved=1#art28`);
}
