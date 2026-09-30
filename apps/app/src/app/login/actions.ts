"use server";

import { redirect } from "next/navigation";
import { createClient, publicClient, SERVER_SECRET } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string };

function safeNext(v: FormDataEntryValue | null) {
  const s = String(v ?? "");
  return s.startsWith("/") && !s.startsWith("//") ? s : "/dashboard";
}

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "That email and password don't match." };
  redirect(safeNext(form.get("next")));
}

export async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const full_name = String(form.get("full_name") ?? "").trim();
  if (password.length < 8) return { error: "Use at least 8 characters for the password." };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  });
  if (error) return { error: error.message };
  if (!data.session) return { info: "Check your inbox — we sent a link to confirm your email." };
  redirect("/onboarding");
}

export async function signInDemo() {
  // Refresh the sample practice so "today" always has sessions (at most every 3 hours).
  await publicClient().rpc("server_reset_demo", { p_secret: SERVER_SECRET(), p_force: false });
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: process.env.DEMO_EMAIL ?? "demo@usesessio.com",
    password: process.env.DEMO_PASSWORD ?? "",
  });
  if (error) redirect("/login?error=demo");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
