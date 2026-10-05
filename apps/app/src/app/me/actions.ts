"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, publicClient, SERVER_SECRET } from "@/lib/supabase/server";
import { DEMO_CLIENT_EMAIL, demoClientPassword } from "@/lib/portal";
import { refundBooking } from "@/lib/stripe";

function safeNext(v: FormDataEntryValue | null, fallback = "/me") {
  const s = String(v ?? "");
  return s.startsWith("/") && !s.startsWith("//") ? s : fallback;
}

export async function setLang(form: FormData) {
  const lang = String(form.get("lang"));
  if (["pl", "uk", "en"].includes(lang)) (await cookies()).set("sessio_lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  redirect(safeNext(form.get("back")));
}

export async function signOutClient() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/me/login");
}

export async function signInDemoClient() {
  // keep the sample practice fresh so "today" always has Marta's live session
  await publicClient().rpc("server_reset_demo", { p_secret: SERVER_SECRET(), p_force: false });
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: DEMO_CLIENT_EMAIL, password: demoClientPassword(SERVER_SECRET()) });
  if (error) redirect("/me/login?error=demo");
  redirect("/me");
}

export async function sendMessage(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  const body = String(form.get("body") ?? "").trim();
  if (!slug || !body) redirect(`/me/messages?with=${encodeURIComponent(slug)}`);
  const supabase = await createClient();
  await supabase.rpc("send_my_message", { p_slug: slug, p_body: body });
  revalidatePath("/me/messages");
  redirect(`/me/messages?with=${encodeURIComponent(slug)}#end`);
}

export async function moveSession(form: FormData) {
  const id = String(form.get("id") ?? "");
  const start = String(form.get("start") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.rpc("reschedule_my_session", { p_id: id, p_starts_at: start });
  if (error) redirect(`/me/sessions/${id}/move?err=1`);
  revalidatePath("/me");
  redirect(`/me?moved=${id}`);
}

export async function cancelSession(form: FormData) {
  const id = String(form.get("id") ?? "");
  const token = String(form.get("token") ?? "");
  // the client owns the manage token (it is returned only to them by my_sessions)
  const { data: ok } = await publicClient().rpc("cancel_booking_by_client", { p_id: id, p_token: token });
  if (ok) await refundBooking(id).catch((e) => console.error("refund failed", e));
  revalidatePath("/me");
  redirect("/me");
}
