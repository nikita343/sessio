import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { markPaid } from "@/lib/confirm";
import { publicClient, SERVER_SECRET } from "@/lib/supabase/server";

/**
 * One endpoint for both Stripe webhook destinations:
 *  - "Your account" events (the demo practice, which uses the platform account) — STRIPE_WEBHOOK_SECRET
 *  - "Connected accounts" events (therapists' own Stripe accounts) — STRIPE_CONNECT_WEBHOOK_SECRET
 */
export async function POST(req: Request) {
  const s = stripe();
  const secrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_CONNECT_WEBHOOK_SECRET].filter(Boolean) as string[];
  if (!s || secrets.length === 0) return NextResponse.json({ ok: false }, { status: 400 });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  let event: Stripe.Event | null = null;
  for (const secret of secrets) {
    try {
      event = s.webhooks.constructEvent(body, sig, secret);
      break;
    } catch {
      /* try the next destination's secret */
    }
  }
  if (!event) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.payment_status === "paid" && session.metadata?.booking_id) {
        await markPaid(session.metadata.booking_id, String(session.payment_intent ?? session.id), session.metadata.method ?? "card");
      }
      break;
    }
    case "checkout.session.expired": {
      // the client abandoned payment: free the slot straight away instead of waiting for the hold to lapse
      const session = event.data.object;
      if (session.metadata?.booking_id) {
        await publicClient().rpc("server_release_hold", { p_secret: SERVER_SECRET(), p_id: session.metadata.booking_id });
      }
      break;
    }
    case "account.updated": {
      const account = event.data.object;
      await publicClient().rpc("server_stripe_account_update", {
        p_secret: SERVER_SECRET(),
        p_account: account.id,
        p_enabled: Boolean(account.charges_enabled),
      });
      break;
    }
  }
  return NextResponse.json({ received: true });
}
