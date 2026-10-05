import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { loadPublic } from "@/lib/public";
import { fmtDate, pickLang, t } from "@/lib/i18n";
import { money } from "@/lib/format";
import { PublicShell } from "@/components/public-shell";
import { CheckoutForm } from "./checkout-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Confirm your session", robots: { index: false } };

export default async function Book(props: PageProps<"/[slug]/book">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const data = await loadPublic(slug);
  if (!data || !data.service) notFound();
  const { therapist: th, service } = data;
  const start = typeof sp.start === "string" ? sp.start : "";
  const valid = data.days.some((d) => d.slots.some((s) => s.start === start && s.free));
  const lang = pickLang(sp.lang, (await headers()).get("accept-language"), th.languages);
  if (!valid) redirect(`/${slug}?lang=${lang}&taken=1`);
  const d = t(lang);
  const end = new Date(new Date(start).getTime() + service.duration_min * 60_000).toISOString();
  const day = fmtDate(start, th.timezone, lang, { weekday: "short", day: "numeric", month: "short" });
  const hm = (iso: string) => fmtDate(iso, th.timezone, lang, { hour: "2-digit", minute: "2-digit", hour12: false });
  const when = `${day} · ${hm(start)}–${hm(end)}`;
  const price = money(service.price_minor, th.currency);
  // signed-in clients don't retype their details; the booking lands in their account
  const { data: auth } = await (await createClient()).auth.getUser();
  const account = auth.user?.email
    ? { name: String(auth.user.user_metadata?.full_name ?? auth.user.user_metadata?.name ?? ""), email: auth.user.email }
    : null;

  return (
    <PublicShell lang={lang} path={`/${slug}/book`} back={{ href: `/${slug}?lang=${lang}`, label: d.back }}>
      <div className="mx-auto flex max-w-[460px] flex-col gap-6 pt-6">
        <h1 className="t-display-l !text-[40px]">{d.confirmTitle}</h1>
        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-card)]">
          {[
            [d.with, th.full_name],
            [d.when, when],
            [d.price, price],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span className="t-body-s text-stone">{k}</span>
              <span className="t-label-m text-right">{v}</span>
            </div>
          ))}
        </div>
        <CheckoutForm
          slug={slug}
          lang={lang}
          start={start}
          serviceId={service.id}
          formats={th.formats}
          address={th.address}
          price={price}
          therapist={th.full_name}
          cancellationHours={th.cancellation_hours}
          summary={`${service.name} with ${th.full_name} — ${when}`}
          account={account}
        />
      </div>
    </PublicShell>
  );
}
