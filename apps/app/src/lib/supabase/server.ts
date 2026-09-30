import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** Supabase client bound to the signed-in therapist's session (RLS applies). */
export async function createClient() {
  const store = await cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // called from a Server Component — the proxy refreshes the session instead
        }
      },
    },
  });
}

/** Anonymous client for public pages (booking page, confirmation, room). */
export function publicClient() {
  return createPlainClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const SERVER_SECRET = () => process.env.SESSIO_SERVER_SECRET ?? "";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}
