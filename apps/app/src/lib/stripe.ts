import Stripe from "stripe";

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

export const PAY_METHODS = ["blik", "card", "p24"] as const;
export type PayMethod = (typeof PAY_METHODS)[number];
