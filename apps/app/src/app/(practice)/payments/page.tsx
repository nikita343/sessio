import type { Metadata } from "next";
import Link from "next/link";
import { getTherapist } from "@/lib/therapist";
import { inTz, money } from "@/lib/format";
import { Badge, Button, Card, Empty, PageHeader } from "@/components/ui";
import { stripe } from "@/lib/stripe";
import { connectStripe, refreshStripe } from "@/lib/stripe-connect";

export const metadata: Metadata = { title: "Payments" };

export default async function Payments(props: PageProps<"/payments">) {
  const sp = await props.searchParams;
  let { supabase, user, therapist: th } = await getTherapist();
  // coming back from Stripe onboarding: pick up the new status straight away
  if (sp.stripe === "return" && th.stripe_account_id && !th.stripe_charges_enabled) {
    await refreshStripe();
    ({ supabase, user, therapist: th } = await getTherapist());
  }
  const live = Boolean(stripe());
  const isDemo = user.email === (process.env.DEMO_EMAIL ?? "demo@usesessio.com");
  const { data } = await supabase
    .from("bookings")
    .select("id, starts_at, price_minor, currency, payment_status, status, stripe_payment_intent_id, client:clients(id, full_name)")
    .in("payment_status", ["paid", "refunded"])
    .order("starts_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as unknown as {
    id: string;
    starts_at: string;
    price_minor: number;
    currency: string;
    payment_status: string;
    status: string;
    stripe_payment_intent_id: string | null;
    client: { id: string; full_name: string } | null;
  }[];
  const month = inTz(new Date(), th.timezone, "yyyy-MM");
  const thisMonth = rows.filter((r) => inTz(r.starts_at, th.timezone, "yyyy-MM") === month && r.payment_status === "paid").reduce((s, r) => s + r.price_minor, 0);
  const total = rows.filter((r) => r.payment_status === "paid").reduce((s, r) => s + r.price_minor, 0);
  const connected = Boolean(th.stripe_account_id && th.stripe_charges_enabled);
  const started = Boolean(th.stripe_account_id) && !connected;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payments" />
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="p-5">
          <p className="t-overline text-stone">This month</p>
          <p className="mt-1 font-display text-[28px] font-medium tracking-[-0.045em]">{money(thisMonth, th.currency)}</p>
        </Card>
        <Card className="p-5">
          <p className="t-overline text-stone">All time</p>
          <p className="mt-1 font-display text-[28px] font-medium tracking-[-0.045em]">{money(total, th.currency)}</p>
        </Card>
        <Card className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="t-overline text-stone">Payouts</p>
            {connected ? <Badge tone="sage">Connected</Badge> : started ? <Badge tone="clay">Finish setup</Badge> : <Badge tone="stone">Not connected</Badge>}
          </div>
          <p className="t-label-m">
            {connected
              ? "Clients pay into your own Stripe account; payouts go to your bank."
              : started
                ? "Stripe needs a few more details before you can take payments."
                : "Connect your Stripe account so clients pay you directly. Until then, your booking page can’t take paid bookings."}
          </p>
          <p className="t-caption text-stone">BLIK, card and Przelewy24. Sessio takes 0% commission; Stripe&rsquo;s own fee applies.</p>
          {live && isDemo && <p className="t-caption rounded-lg bg-sunken px-3 py-2 text-stone">Demo practice: payments go to Sessio&rsquo;s Stripe test account. Your own practice connects its own Stripe here.</p>}
          {live && !isDemo && (
            <div className="mt-1 flex flex-wrap gap-2">
              {connected ? (
                <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer" className="t-label-m inline-flex h-9 items-center rounded-full border border-line-strong px-4 hover:border-ink/30">
                  Open Stripe dashboard ↗
                </a>
              ) : (
                <form action={connectStripe}>
                  <Button size="sm">{started ? "Continue Stripe setup" : "Connect Stripe"}</Button>
                </form>
              )}
            </div>
          )}
          {!live && <p className="t-caption text-stone">Payments run on the built-in test screen until Stripe keys are added.</p>}
        </Card>
      </div>
      {rows.length === 0 ? (
        <Empty title="No payments yet" body="Clients prepay when they book. Payments land here and in your own Stripe account." />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
                <div className="min-w-[160px] flex-1">
                  <Link href={`/clients/${r.client?.id}`} className="t-label-m hover:underline">
                    {r.client?.full_name}
                  </Link>
                  <p className="t-caption text-stone">Session {inTz(r.starts_at, th.timezone, "EEE d MMM, HH:mm")}</p>
                </div>
                <span className="t-caption hidden text-stone md:block">{r.stripe_payment_intent_id?.startsWith("test_") ? "test payment" : r.stripe_payment_intent_id?.startsWith("pi_") ? "Stripe" : r.stripe_payment_intent_id ? "Stripe" : "marked paid"}</span>
                {r.payment_status === "refunded" ? <Badge tone="stone">Refunded</Badge> : r.status === "cancelled" ? <Badge tone="clay">Cancelled · refund due</Badge> : <Badge tone={r.payment_status === "paid" ? "sage" : "stone"}>{r.payment_status}</Badge>}
                <span className="t-label-m w-24 text-right">{money(r.price_minor, r.currency)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
