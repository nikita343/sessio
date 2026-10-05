import { cookies } from "next/headers";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPublicBooking } from "@/lib/booking-public";
import { actualMethod, stripe, refundBooking } from "@/lib/stripe";
import { markPaid } from "@/lib/confirm";
import { publicClient } from "@/lib/supabase/server";
import { fmtDate, pickLang, t } from "@/lib/i18n";
import { money } from "@/lib/format";
import { PublicShell } from "@/components/public-shell";
import { JoinButton } from "./join";
import { GoogleButton } from "@/components/google-button";
import { createClient } from "@/lib/supabase/server";
import { pt } from "@/lib/portal";

export const metadata: Metadata = { title: "Your session", robots: { index: false } };

const PAST = {
  pl: { title: "Sesja odbyła się", receipt: "Potwierdzenie płatności", service: "Usługa", therapist: "Terapeuta", amount: "Kwota", method: "Metoda", number: "Numer", invoice: "Rachunek lub fakturę wystawia terapeuta — napisz do niego przez stronę lub portal klienta.", again: "Zarezerwuj kolejną sesję" },
  en: { title: "Session held", receipt: "Payment confirmation", service: "Service", therapist: "Therapist", amount: "Amount", method: "Method", number: "Number", invoice: "Your therapist issues receipts and invoices — ask them through their page or your client portal.", again: "Book another session" },
  uk: { title: "Сесія відбулася", receipt: "Підтвердження оплати", service: "Послуга", therapist: "Терапевт", amount: "Сума", method: "Спосіб", number: "Номер", invoice: "Рахунок або фактуру видає терапевт — напишіть йому через сторінку або портал клієнта.", again: "Забронювати наступну сесію" },
} as const;

export default async function BookingStatus(props: PageProps<"/b/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const token = String(sp.t ?? "");
  let b = await getPublicBooking(id, token);
  if (!b) notFound();

  // Returning from Stripe Checkout: confirm straight away instead of waiting for the webhook.
  if (b.payment_status !== "paid" && typeof sp.session_id === "string") {
    const s = stripe();
    if (s) {
      const acct = typeof sp.acct === "string" && sp.acct.startsWith("acct_") ? sp.acct : undefined;
      const session = await s.checkout.sessions.retrieve(sp.session_id, undefined, acct ? { stripeAccount: acct } : undefined);
      if (session.payment_status === "paid" && session.metadata?.booking_id === id) {
        await markPaid(id, String(session.payment_intent ?? session.id), await actualMethod(session.payment_intent, session.metadata?.method ?? "card", acct));
        b = (await getPublicBooking(id, token))!;
      }
    }
  }

  const lang = pickLang(sp.lang, (await cookies()).get("sessio_lang")?.value);
  const d = t(lang);
  const whenLong = fmtDate(b.starts_at, b.timezone, lang, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false });
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "";

  async function cancel() {
    "use server";
    const { data: ok } = await publicClient().rpc("cancel_booking_by_client", { p_id: id, p_token: token });
    if (ok) await refundBooking(id).catch((e) => console.error("refund failed", e));
    redirect(`/b/${id}?t=${token}&lang=${lang}`);
  }

  const { data: auth } = await (await createClient()).auth.getUser();
  const signedIn = !!auth.user;
  const pd = pt(lang);
  const canCancel = b.status === "confirmed" && new Date(b.starts_at).getTime() - Date.now() > b.cancellation_hours * 3600_000;
  const { data: paidVia } = await publicClient().rpc("get_booking_paid_via", { p_id: id, p_token: token });
  const past = b.status === "completed" || new Date(b.ends_at).getTime() < Date.now();
  const method = (paidVia as string | null) ?? (sp.m ? String(sp.m) : "");

  return (
    <PublicShell lang={lang} path={`/b/${id}`}>
      <div className="mx-auto flex max-w-[460px] flex-col gap-6 pt-8">
        {b.status === "cancelled" ? (
          <>
            <h1 className="t-display-l !text-[44px]">{d.cancelled}</h1>
            {b.payment_status === "refunded" && (
              <p className="t-body-m rounded-[16px] bg-sage-soft px-4 py-3 text-sage">
                {lang === "pl"
                  ? `Zwrot ${money(b.price_minor, b.currency)} jest w drodze. Na kartę trafia zwykle w 5–10 dni roboczych.`
                  : lang === "uk"
                    ? `Повернення ${money(b.price_minor, b.currency)} вже в дорозі. На картку воно зазвичай надходить за 5–10 робочих днів.`
                    : `Your refund of ${money(b.price_minor, b.currency)} is on its way. It usually reaches your card in 5–10 business days.`}
              </p>
            )}
            <a href={`/${b.therapist_slug}?lang=${lang}`} className="t-label-m flex h-12 items-center justify-center rounded-full bg-sage text-white">
              {d.pickTime}
            </a>
          </>
        ) : b.payment_status !== "paid" ? (
          <>
            <h1 className="t-display-l !text-[44px]">{d.pending}</h1>
            <p className="t-body-m text-stone">{d.pendingBody}</p>
            <a href={`/pay/${id}?t=${token}&m=blik&lang=${lang}`} className="t-label-m flex h-12 items-center justify-center rounded-full bg-sage text-white">
              {d.finishPay}
            </a>
          </>
        ) : past ? (
          <>
            <h1 className="t-display-l !text-[44px]">{PAST[lang].title}</h1>
            <p className="t-body-l text-stone">
              <span className="inline-block first-letter:uppercase">{whenLong}</span> · {b.therapist_name}
            </p>
            <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-card)]">
              <p className="t-overline text-stone">{PAST[lang].receipt}</p>
              <dl className="flex flex-col divide-y divide-line">
                {[
                  [PAST[lang].service, b.service_name ?? "—"],
                  [PAST[lang].therapist, b.therapist_name],
                  [PAST[lang].amount, money(b.price_minor, b.currency)],
                  [PAST[lang].method, method || "Stripe"],
                  [PAST[lang].number, `#${b.id.slice(0, 8).toUpperCase()}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="t-body-s text-stone">{k}</dt>
                    <dd className="t-label-m text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-caption text-stone">{PAST[lang].invoice}</p>
            </div>
            <a href={`/${b.therapist_slug}?lang=${lang}`} className="t-label-m flex h-12 items-center justify-center rounded-full bg-sage text-white">
              {PAST[lang].again}
            </a>
          </>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-full bg-sage-soft text-sage" aria-hidden>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col gap-3">
              <h1 className="t-display-xl !text-[56px]">{d.booked}</h1>
              <p className="t-body-l text-stone">
                <span className="first-letter:uppercase">{d.bookedBody(whenLong, b.therapist_name)}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-card)]">
              {b.format === "online" ? (
                <>
                  <p className="t-overline text-stone">{d.yourRoom}</p>
                  <p className="t-body-s">{d.roomBody}</p>
                  <JoinButton href={`/room/${b.room_name}?t=${token}`} startsAt={b.starts_at} label={d.join} />
                </>
              ) : (
                <p className="t-body-s">{d.inPersonAt(b.therapist_address ?? "")}</p>
              )}
              <a href={`${app}/b/${id}/ics?t=${token}`} className="t-label-m flex h-11 items-center justify-center rounded-full border border-line-strong">
                {d.addCal}
              </a>
              {canCancel && (
                <form action={cancel}>
                  <button className="t-label-m h-11 w-full rounded-full text-stone hover:text-warn">{d.cancel}</button>
                </form>
              )}
            </div>
            <p className="t-caption text-stone">
              {d.receipt(money(b.price_minor, b.currency), method || "Stripe")} · #{b.id.slice(0, 8).toUpperCase()}
            </p>
            {signedIn ? (
              <a href="/me" className="t-label-m flex h-11 items-center justify-center rounded-full border border-line-strong bg-surface hover:border-ink/30">
                {pd.openAccount} →
              </a>
            ) : (
              <div className="flex flex-col gap-3 rounded-[20px] border border-dashed border-line-strong p-5">
                <p className="t-title-m">{pd.saveTitle}</p>
                <p className="t-body-s text-stone">{pd.saveBody}</p>
                <GoogleButton next="/me" label={pd.google} />
              </div>
            )}
          </>
        )}
      </div>
    </PublicShell>
  );
}
