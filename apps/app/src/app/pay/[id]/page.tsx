import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { publicClient } from "@/lib/supabase/server";
import { markPaid } from "@/lib/confirm";
import { money } from "@/lib/format";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Pay", robots: { index: false } };

type B = { id: string; payment_status: string; price_minor: number; currency: string; therapist_name: string; therapist_slug: string };

/**
 * Test-mode payment screen, used when no Stripe key is configured.
 * Mirrors the BLIK flow so the whole booking journey can be demoed end to end.
 */
export default async function Pay(props: PageProps<"/pay/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const token = String(sp.t ?? "");
  const method = String(sp.m ?? "blik");
  const lang = String(sp.lang ?? "en");
  const { data } = await publicClient().rpc("get_booking", { p_id: id, p_token: token });
  const b = (Array.isArray(data) ? data[0] : data) as B | undefined;
  if (!b) notFound();
  const done = `/b/${id}?t=${token}&lang=${lang}`;
  if (b.payment_status === "paid") redirect(done);

  async function pay(form: FormData) {
    "use server";
    const code = String(form.get("code") ?? "");
    if (method === "blik" && !/^\d{6}$/.test(code)) redirect(`/pay/${id}?t=${token}&m=${method}&lang=${lang}&e=1`);
    await markPaid(id, `test_${method}_${Date.now()}`, method === "p24" ? "Przelewy24" : method.toUpperCase());
    redirect(done);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-paper px-5">
      <div className="w-full max-w-[380px] rounded-[24px] bg-surface p-7 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between">
          <Logo size={22} />
          <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-clay">Test mode</span>
        </div>
        <p className="t-body-s mt-6 text-stone">Pay {b.therapist_name}</p>
        <p className="font-display text-[40px] font-medium tracking-[-0.05em]">{money(b.price_minor, b.currency)}</p>
        <form action={pay} className="mt-5 flex flex-col gap-3">
          {method === "blik" ? (
            <>
              <label htmlFor="code" className="t-label-m">
                BLIK code
              </label>
              <input
                id="code"
                name="code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                placeholder="000 000"
                className="h-14 rounded-[12px] border border-line-strong text-center font-display text-[26px] tracking-[0.3em] outline-none focus:border-sage"
              />
              {sp.e && <p className="t-caption text-warn">Enter the 6 digits from your bank app.</p>}
              <p className="t-caption text-stone">Any 6 digits work in test mode.</p>
            </>
          ) : (
            <p className="t-body-s text-stone">{method === "card" ? "Card payment" : "Przelewy24 bank transfer"} — simulated in test mode.</p>
          )}
          <button className="t-label-m mt-2 h-12 rounded-full bg-sage text-white hover:bg-sage-hover">Confirm payment</button>
          <a href={`/${b.therapist_slug}`} className="t-label-m text-center text-stone hover:text-ink">
            Cancel
          </a>
        </form>
      </div>
    </main>
  );
}
