import Stripe from "stripe";
import { publicClient, SERVER_SECRET } from "./supabase/server";

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

export const PAY_METHODS = ["blik", "card", "p24"] as const;
export type PayMethod = (typeof PAY_METHODS)[number];

export type PaymentInfo = {
  stripe_account_id: string | null;
  charges_enabled: boolean;
  payment_intent: string | null;
  payment_status: "unpaid" | "paid" | "refunded";
  status: string;
  is_demo: boolean;
};

export async function paymentInfo(bookingId: string): Promise<PaymentInfo | null> {
  const { data } = await publicClient().rpc("server_payment_info2", { p_secret: SERVER_SECRET(), p_id: bookingId });
  return ((Array.isArray(data) ? data[0] : data) as PaymentInfo) ?? null;
}

export class PaymentsNotReady extends Error {}

/** The method the client actually paid with (Checkout lets them switch away from what they picked on our form). */
export async function actualMethod(paymentIntent: unknown, fallback: string, stripeAccount?: string) {
  const s = stripe();
  const id = typeof paymentIntent === "string" ? paymentIntent : (paymentIntent as { id?: string } | null)?.id;
  if (!s || !id?.startsWith("pi_")) return fallback;
  try {
    const pi = await s.paymentIntents.retrieve(id, { expand: ["latest_charge"] }, stripeAccount ? { stripeAccount } : undefined);
    const type = (pi.latest_charge as { payment_method_details?: { type?: string } } | null)?.payment_method_details?.type;
    return type === "blik" ? "blik" : type === "p24" ? "p24" : type === "card" ? "card" : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Where a booking's money goes. Always the therapist's own connected Stripe account (a direct charge,
 * 0% Sessio fee) — Sessio never holds client money. The only exception is the demo practice, which uses
 * the platform's test account. A real practice that hasn't connected Stripe can't take online payment yet.
 */
export function chargeAccount(info: PaymentInfo | null): string | undefined {
  if (info?.stripe_account_id && info.charges_enabled) return info.stripe_account_id;
  if (info?.is_demo) return undefined;
  throw new PaymentsNotReady("This practice hasn't connected Stripe yet.");
}

/** Refund a Stripe payment when a client cancels inside the free window. Returns true if refunded. */
export async function refundBooking(bookingId: string) {
  const s = stripe();
  const info = await paymentInfo(bookingId);
  if (!s || !info || info.payment_status !== "paid" || !info.payment_intent?.startsWith("pi_")) return false;
  try {
    await s.refunds.create(
      { payment_intent: info.payment_intent, reason: "requested_by_customer", metadata: { booking_id: bookingId } },
      info.stripe_account_id ? { stripeAccount: info.stripe_account_id } : undefined,
    );
  } catch (e) {
    // the payment may live on the platform account if the therapist connected Stripe after it was taken
    if (!info.stripe_account_id) throw e;
    await s.refunds.create({ payment_intent: info.payment_intent, reason: "requested_by_customer", metadata: { booking_id: bookingId } });
  }
  await publicClient().rpc("server_mark_refunded", { p_secret: SERVER_SECRET(), p_id: bookingId });
  return true;
}
