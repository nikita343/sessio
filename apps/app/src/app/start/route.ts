import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** "Open your practice" after Google sign-in: make sure the account has a practice, then continue setup. */
export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login?mode=signup", origin));
  await supabase.rpc("ensure_therapist");
  const { data } = await supabase.from("therapists").select("slug").eq("id", user.id).maybeSingle();
  return NextResponse.redirect(new URL(data?.slug ? "/dashboard" : "/onboarding", origin));
}
