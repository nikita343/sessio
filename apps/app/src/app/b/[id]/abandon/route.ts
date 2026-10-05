import { NextResponse, type NextRequest } from "next/server";
import { publicClient } from "@/lib/supabase/server";

/** The client pressed Back on Stripe: release the held slot at once and return to the booking page. */
export async function GET(request: NextRequest, ctx: RouteContext<"/b/[id]/abandon">) {
  const { id } = await ctx.params;
  const url = new URL(request.url);
  const token = url.searchParams.get("t") ?? "";
  const lang = url.searchParams.get("lang") ?? "pl";
  const slug = url.searchParams.get("s") ?? "";
  if (/^[0-9a-f-]{36}$/.test(id) && /^[0-9a-f-]{36}$/.test(token)) {
    const { data } = await publicClient().rpc("get_booking", { p_id: id, p_token: token });
    const b = Array.isArray(data) ? data[0] : data;
    if (b && b.status === "pending_payment" && b.payment_status !== "paid") {
      await publicClient().rpc("cancel_booking_by_client", { p_id: id, p_token: token });
    }
  }
  const back = /^[a-z0-9-]{1,80}$/.test(slug) ? `/${slug}?lang=${lang}` : "/";
  return NextResponse.redirect(new URL(back, url.origin));
}
