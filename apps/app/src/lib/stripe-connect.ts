"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTherapist } from "./therapist";
import { stripe } from "./stripe";

function app() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";
}

/**
 * Connect Stripe: creates the therapist's own Stripe account (full Stripe dashboard, Stripe fees paid by the
 * account, Sessio takes nothing) and sends them through Stripe's hosted onboarding.
 */
export async function connectStripe() {
  const s = stripe();
  if (!s) redirect("/payments?stripe=unavailable");
  const { supabase, user, therapist: th } = await getTherapist();
  if (user.email === (process.env.DEMO_EMAIL ?? "demo@usesessio.com")) redirect("/payments");
  let accountId = th.stripe_account_id;
  if (!accountId) {
    const account = await s.accounts.create({
      country: "PL",
      email: user.email ?? undefined,
      business_profile: { mcc: "8099", product_description: "Psychological consultations and psychotherapy sessions", name: th.full_name || undefined },
      controller: {
        stripe_dashboard: { type: "full" },
        fees: { payer: "account" },
        losses: { payments: "stripe" },
        requirement_collection: "stripe",
      },
      capabilities: { card_payments: { requested: true }, blik_payments: { requested: true }, p24_payments: { requested: true } },
      metadata: { therapist_id: th.id },
    });
    accountId = account.id;
    await supabase.from("therapists").update({ stripe_account_id: accountId, stripe_charges_enabled: false }).eq("id", th.id);
  }
  const link = await s.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    refresh_url: `${app()}/payments?stripe=retry`,
    return_url: `${app()}/payments?stripe=return`,
  });
  redirect(link.url);
}

/** After onboarding (or any time): read the account's status straight from Stripe. */
export async function refreshStripe() {
  const s = stripe();
  const { supabase, therapist: th } = await getTherapist();
  if (!s || !th.stripe_account_id) return;
  const a = await s.accounts.retrieve(th.stripe_account_id);
  await supabase.from("therapists").update({ stripe_charges_enabled: Boolean(a.charges_enabled) }).eq("id", th.id);
  revalidatePath("/payments");
}
