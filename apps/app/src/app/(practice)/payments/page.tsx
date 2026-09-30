import type { Metadata } from "next";
import Link from "next/link";
import { getTherapist } from "@/lib/therapist";
import { inTz, money } from "@/lib/format";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Payments" };

export default async function Payments() {
  const { supabase, therapist: th } = await getTherapist();
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
  const connected = Boolean(th.stripe_account_id);

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
        <Card className="flex flex-col gap-1 p-5">
          <p className="t-overline text-stone">Payouts</p>
          <p className="t-label-m">{connected ? "Stripe connected — paid out to your bank daily" : "Test mode — connect Stripe to receive real payments"}</p>
          <p className="t-caption text-stone">BLIK, card and Przelewy24. Sessio takes 0% commission; Stripe&rsquo;s own fee applies.</p>
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
                <span className="t-caption hidden text-stone md:block">{r.stripe_payment_intent_id?.startsWith("test_") ? "test payment" : r.stripe_payment_intent_id ? "Stripe" : "marked paid"}</span>
                {r.status === "cancelled" ? <Badge tone="clay">Cancelled · refund due</Badge> : <Badge tone={r.payment_status === "paid" ? "sage" : "stone"}>{r.payment_status}</Badge>}
                <span className="t-label-m w-24 text-right">{money(r.price_minor, r.currency)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
