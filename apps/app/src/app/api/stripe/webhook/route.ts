import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markPaid } from "@/lib/confirm";

export async function POST(req: Request) {
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !secret) return NextResponse.json({ ok: false }, { status: 400 });
  const body = await req.text();
  let event;
  try {
    event = s.webhooks.constructEvent(body, req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid" && session.metadata?.booking_id) {
      await markPaid(session.metadata.booking_id, String(session.payment_intent ?? session.id), session.metadata.method ?? "card");
    }
  }
  return NextResponse.json({ received: true });
}
