import { publicClient, SERVER_SECRET } from "./supabase/server";
import { stripe, chargeAccount, paymentInfo, type PayMethod } from "./stripe";
import type { Lang } from "./i18n";

/**
 * Creates a Stripe Checkout session for a held booking and returns its URL.
 * The therapist's own connected account takes the payment when it is set up (direct charge, no Sessio fee);
 * otherwise the platform account does (the demo practice).
 */
export async function startCheckout(o: {
  bookingId: string;
  token: string;
  method: PayMethod;
  lang: Lang;
  email: string;
  summary: string;
  priceMinor: number;
  currency: string;
  slug: string;
  app: string;
}) {
  const s = stripe();
  if (!s) return null;
  const account = chargeAccount(await paymentInfo(o.bookingId));
  const back = `${o.app}/b/${o.bookingId}?t=${o.token}&lang=${o.lang}`;
  const session = await s.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: [o.method],
      customer_email: o.email,
      locale: o.lang === "uk" ? "auto" : o.lang,
      line_items: [{ quantity: 1, price_data: { currency: o.currency.toLowerCase(), unit_amount: o.priceMinor, product_data: { name: o.summary } } }],
      metadata: { booking_id: o.bookingId, method: o.method },
      payment_intent_data: { metadata: { booking_id: o.bookingId, method: o.method }, description: o.summary },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${back}${account ? `&acct=${account}` : ""}&session_id={CHECKOUT_SESSION_ID}`,
      // Back on Stripe releases the held slot straight away
      cancel_url: `${o.app}/b/${o.bookingId}/abandon?t=${o.token}&lang=${o.lang}&s=${encodeURIComponent(o.slug)}`,
    },
    account ? { stripeAccount: account } : undefined,
  );
  await publicClient().rpc("server_set_checkout", { p_secret: SERVER_SECRET(), p_id: o.bookingId, p_session: session.id });
  return session.url;
}
