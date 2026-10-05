import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Avatar, Badge } from "@/components/ui";
import { JoinButton } from "@/app/b/[id]/join";
import { fmtDate, type Lang } from "@/lib/i18n";
import { money, firstName } from "@/lib/format";
import { portalLang, pt, requireClient, type MySession, type MyThread } from "@/lib/portal";
import { cancelSession } from "./actions";
import { TZDate } from "@date-fns/tz";
import { loadPublic } from "@/lib/public";
import { CONT_T } from "@/lib/ui/continuity";

export const metadata: Metadata = { title: "Your sessions", robots: { index: false } };

function status(s: MySession, d: ReturnType<typeof pt>) {
  if (s.status === "cancelled") return <Badge tone="stone">{d.cancelled}</Badge>;
  if (s.status === "no_show") return <Badge tone="clay">{d.noShow}</Badge>;
  if (s.payment_status === "refunded") return <Badge tone="stone">{d.refunded}</Badge>;
  if (s.payment_status !== "paid") return <Badge tone="warn">{d.awaitingPay}</Badge>;
  if (s.status === "completed") return <Badge tone="stone">{d.done}</Badge>;
  return <Badge tone="sage">{d.paid(s.paid_via ?? "Stripe")}</Badge>;
}

function canChange(s: MySession) {
  return s.status === "confirmed" && new Date(s.starts_at).getTime() - Date.now() > s.cancellation_hours * 3600_000;
}

function Actions({ s, d, lang, big = false }: { s: MySession; d: ReturnType<typeof pt>; lang: Lang; big?: boolean }) {
  const h = big ? "h-11" : "h-9";
  if (s.status === "pending_payment")
    return (
      <a href={`/pay/${s.id}?t=${s.manage_token}&m=blik&lang=${lang}`} className={`t-label-m inline-flex ${h} items-center justify-center rounded-full bg-sage px-5 text-white hover:bg-sage-hover`}>
        {d.finishPay}
      </a>
    );
  const change = canChange(s);
  return (
    <div className={`flex flex-wrap items-center gap-2 ${big ? "" : "justify-end"}`}>
      {big && s.format === "online" && s.room_name && (
        <div className="w-full sm:w-auto sm:min-w-[220px]">
          <JoinButton href={`/room/${s.room_name}?t=${s.manage_token}`} startsAt={s.starts_at} label={d.join} />
        </div>
      )}
      <a href={`/b/${s.id}/ics?t=${s.manage_token}`} className={`t-label-m inline-flex ${h} items-center rounded-full border border-line-strong bg-surface px-4 hover:border-ink/30`}>
        {d.addCal}
      </a>
      {change && (
        <Link href={`/me/sessions/${s.id}/move`} className={`t-label-m inline-flex ${h} items-center rounded-full border border-line-strong bg-surface px-4 hover:border-ink/30`}>
          {d.move}
        </Link>
      )}
      {change && (
        <details className="group relative">
          <summary className={`t-label-m inline-flex ${h} cursor-pointer list-none items-center rounded-full px-3 text-stone hover:text-warn [&::-webkit-details-marker]:hidden`}>{d.cancel}</summary>
          <form action={cancelSession} className="absolute right-0 z-20 mt-2 w-[220px] rounded-[14px] border border-line bg-surface p-3 shadow-[var(--shadow-float)]">
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="token" value={s.manage_token} />
            <button className="t-label-m h-10 w-full rounded-full bg-[#f6e3dc] text-warn hover:bg-[#f1d3c8]">{d.cancelConfirm}</button>
          </form>
        </details>
      )}
    </div>
  );
}

export default async function MySessions(props: PageProps<"/me">) {
  const sp = await props.searchParams;
  const { supabase, profile } = await requireClient("/me");
  const lang = await portalLang(sp.lang);
  const d = pt(lang);
  const [{ data: sData }, { data: tData }] = await Promise.all([supabase.rpc("my_sessions"), supabase.rpc("my_threads")]);
  const sessions = (sData ?? []) as MySession[];
  const therapists = (tData ?? []) as MyThread[];
  const now = Date.now();
  const upcoming = sessions.filter((s) => ["confirmed", "pending_payment"].includes(s.status) && new Date(s.ends_at).getTime() > now);
  const past = sessions.filter((s) => !upcoming.includes(s)).reverse();
  const next = upcoming[0];
  const rest = upcoming.slice(1);
  const name = firstName(profile.full_name || sessions[0]?.client_name || "");
  const c = CONT_T[lang];

  // Mindly-style continuity: session numbers, the client's usual weekday + time with each therapist,
  // and the next free dates at that time (booked one at a time, paid per session — no subscription).
  const live = sessions.filter((s) => s.status !== "cancelled");
  const numberOf = new Map<string, number>();
  const bySlug = new Map<string, MySession[]>();
  for (const s of live) {
    const list = bySlug.get(s.therapist_slug) ?? [];
    list.push(s);
    bySlug.set(s.therapist_slug, list);
    numberOf.set(s.id, list.length);
  }
  const local = (s: MySession) => {
    const d = new TZDate(new Date(s.starts_at).getTime(), s.timezone);
    return { wd: (d.getDay() + 6) % 7, hm: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` };
  };
  const continuity = await Promise.all(
    therapists.map(async (t) => {
      const list = bySlug.get(t.therapist_slug) ?? [];
      const held = list.filter((s) => s.status === "completed" || (s.payment_status === "paid" && new Date(s.ends_at).getTime() < now)).length;
      const counts = new Map<string, number>();
      for (const s of list) {
        const k = `${local(s).wd}|${local(s).hm}`;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      // most frequent weekday+time; ties go to the most recently booked pattern
      const lastIdx = new Map<string, number>();
      list.forEach((s, i) => lastIdx.set(`${local(s).wd}|${local(s).hm}`, i));
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || (lastIdx.get(b[0]) ?? 0) - (lastIdx.get(a[0]) ?? 0))[0]?.[0];
      if (!top) return { slug: t.therapist_slug, held, standing: null, free: [] as string[], tz: "Europe/Warsaw" };
      const [wd, hm] = top.split("|");
      const tz = list[0].timezone;
      const after = Math.max(now, ...list.filter((s) => s.status === "confirmed").map((s) => new Date(s.starts_at).getTime()));
      const pub = await loadPublic(t.therapist_slug);
      const free = (pub?.days ?? [])
        .flatMap((d) => d.slots)
        .filter((sl) => sl.free && new Date(sl.start).getTime() > after)
        .filter((sl) => {
          const d = new TZDate(new Date(sl.start).getTime(), tz);
          return (d.getDay() + 6) % 7 === Number(wd) && `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` === hm;
        })
        .slice(0, 3)
        .map((sl) => sl.start);
      return { slug: t.therapist_slug, held, standing: { wd: Number(wd), hm }, free, tz };
    }),
  );
  const contBy = new Map(continuity.map((x) => [x.slug, x]));

  const dateParts = (s: MySession) => ({
    wd: fmtDate(s.starts_at, s.timezone, lang, { weekday: "long" }),
    day: fmtDate(s.starts_at, s.timezone, lang, { day: "numeric" }),
    mon: fmtDate(s.starts_at, s.timezone, lang, { month: "long" }),
    hm: `${fmtDate(s.starts_at, s.timezone, lang, { hour: "2-digit", minute: "2-digit", hour12: false })}–${fmtDate(s.ends_at, s.timezone, lang, { hour: "2-digit", minute: "2-digit", hour12: false })}`,
    short: fmtDate(s.starts_at, s.timezone, lang, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }),
  });
  const deadline = (s: MySession) =>
    fmtDate(new Date(new Date(s.starts_at).getTime() - s.cancellation_hours * 3600_000).toISOString(), s.timezone, lang, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <PortalShell lang={lang} profile={profile} current="sessions" path="/me">
      <div className="flex flex-col gap-1 pt-6 md:pt-10">
        <h1 className="t-display-l !text-[clamp(34px,5vw,48px)]">{d.hi(name)}</h1>
        <p className="t-body-m text-stone">{d.portal}</p>
      </div>

      {typeof sp.moved === "string" && <p className="t-body-s mt-6 rounded-[14px] bg-sage-soft px-4 py-3 text-sage">{d.moved}</p>}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* next session */}
          {next ? (
            (() => {
              const p = dateParts(next);
              return (
                <section aria-label={d.nextUp} className="overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-card)]">
                  <div className="flex flex-col gap-6 p-5 sm:flex-row sm:p-7">
                    <div className="flex shrink-0 flex-row items-center gap-4 sm:w-[132px] sm:flex-col sm:items-start sm:gap-1">
                      <p className="t-overline text-sage">{d.nextUp}</p>
                      <p className="font-display text-[56px] font-medium leading-none tracking-[-0.05em]">{p.day}</p>
                      <p className="t-body-s text-stone first-letter:uppercase">
                        {p.wd}
                        <br className="hidden sm:block" /> {p.mon}
                      </p>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[26px] font-medium tracking-[-0.04em]">{p.hm}</span>
                        {status(next, d)}
                        {numberOf.get(next.id) && <span className="t-caption text-stone">{c.sessionNo(numberOf.get(next.id)!)}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar name={next.therapist_name} photo={next.therapist_photo} size={44} />
                        <div className="min-w-0">
                          <p className="t-title-m">{next.therapist_name}</p>
                          <p className="t-body-s truncate text-stone">
                            {[next.service_name, next.format === "online" ? d.online : d.inPerson(next.therapist_address ?? "")].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      </div>
                      <Actions s={next} d={d} lang={lang} big />
                      <p className="t-caption text-stone">{canChange(next) ? d.freeUntil(deadline(next)) : next.status === "confirmed" ? d.lockedChange(next.cancellation_hours) : ""}</p>
                    </div>
                  </div>
                </section>
              );
            })()
          ) : (
            therapists.length === 0 ? (
              <section className="overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-card)]">
                <div className="flex flex-col gap-5 p-6 sm:p-8">
                  <p className="t-overline text-sage">{d.noUpcoming}</p>
                  <h2 className="t-heading-s">{c.findTitle}</h2>
                  <p className="t-body-m max-w-[560px] text-stone">{c.findBody}</p>
                  <ul className="flex flex-col gap-2">
                    {c.findPoints.map((x) => (
                      <li key={x} className="t-body-s flex items-center gap-2.5">
                        <span aria-hidden className="grid size-5 place-items-center rounded-full bg-sage-soft text-[11px] text-sage">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <Link href="/find" className="t-label-m inline-flex h-12 w-fit items-center rounded-full bg-sage px-6 text-white hover:bg-sage-hover">
                    {c.findCta} →
                  </Link>
                </div>
                <p className="t-body-s border-t border-line bg-paper/60 px-6 py-4 text-stone sm:px-8">{c.haveLink}</p>
              </section>
            ) : (
              <section className="rounded-[24px] bg-surface p-7 shadow-[var(--shadow-card)]">
                <p className="t-title-m">{d.noUpcoming}</p>
                <p className="t-body-s mt-1 max-w-[520px] text-stone">{d.noUpcomingBody}</p>
                <a href={`/${therapists[0].therapist_slug}?lang=${lang}`} className="t-label-m mt-4 inline-flex h-11 items-center rounded-full bg-sage px-5 text-white hover:bg-sage-hover">
                  {d.bookAgain} · {therapists[0].therapist_name}
                </a>
              </section>
            )
          )}

          {/* other upcoming */}
          {rest.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="t-overline text-stone">{d.upcoming}</h2>
              <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
                {rest.map((s) => (
                  <li key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={s.therapist_name} photo={s.therapist_photo} size={36} />
                      <div className="min-w-0">
                        <p className="t-label-m first-letter:uppercase">{dateParts(s).short}</p>
                        <p className="t-caption truncate text-stone">
                          {s.therapist_name} · {s.format === "online" ? "Online" : s.therapist_address}
                        </p>
                      </div>
                      <span className="ml-1 hidden sm:inline">{status(s, d)}</span>
                    </div>
                    <Actions s={s} d={d} lang={lang} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* past */}
          <section className="flex flex-col gap-3">
            <h2 className="t-overline text-stone">{d.past}</h2>
            {past.length === 0 ? (
              <p className="t-body-s text-stone">{d.noPast}</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
                {past.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="t-label-m first-letter:uppercase">{dateParts(s).short}</p>
                      <p className="t-caption truncate text-stone">{s.therapist_name}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden sm:inline">{status(s, d)}</span>
                      <span className="t-label-m">{money(s.price_minor, s.currency)}</span>
                      {s.payment_status === "paid" && (
                        <a href={`/b/${s.id}?t=${s.manage_token}&lang=${lang}`} className="t-caption text-stone underline underline-offset-2 hover:text-ink">
                          {d.receipt}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* therapists */}
        <aside className="flex flex-col gap-3">
          {therapists.length > 0 && <h2 className="t-overline text-stone">{d.yourTherapists}</h2>}
          {therapists.map((t) => {
            const k = contBy.get(t.therapist_slug);
            const short = (iso: string) => fmtDate(iso, k?.tz ?? "Europe/Warsaw", lang, { weekday: "short", day: "numeric", month: "short" });
            return (
            <div key={t.therapist_slug} className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <Avatar name={t.therapist_name} photo={t.therapist_photo} size={44} />
                <div className="min-w-0">
                  <p className="t-title-m">{t.therapist_name}</p>
                  <p className="t-caption text-stone">{k && k.held > 0 ? c.sessionsTogether(k.held) : c.firstAhead}</p>
                </div>
              </div>
              {k?.standing && (
                <div className="flex flex-col gap-2 rounded-[14px] bg-paper p-3">
                  <p className="t-label-m">{c.standing(c.weekdays[k.standing.wd], k.standing.hm)}</p>
                  {k.free.length > 0 ? (
                    <>
                      <p className="t-caption text-stone">{c.nextInStanding}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {k.free.map((iso) => (
                          <a
                            key={iso}
                            href={`/${t.therapist_slug}/book?start=${encodeURIComponent(iso)}&lang=${lang}`}
                            className="t-label-m rounded-full border border-sage/30 bg-sage-soft px-3 py-1.5 text-sage first-letter:uppercase hover:border-sage"
                          >
                            {short(iso)}
                          </a>
                        ))}
                      </div>
                      <p className="t-caption text-stone">{c.standingHint}</p>
                    </>
                  ) : (
                    <p className="t-caption text-stone">{c.noStanding}</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <a href={`/${t.therapist_slug}?lang=${lang}`} className="t-label-m flex h-10 items-center justify-center rounded-full bg-sage text-white hover:bg-sage-hover">
                  {k?.standing ? c.otherTime : d.bookAgain}
                </a>
                <Link href={`/me/messages?with=${t.therapist_slug}`} className="t-label-m flex h-10 items-center justify-center rounded-full border border-line-strong hover:border-ink/30">
                  {d.message}
                </Link>
              </div>
            </div>
            );
          })}
          {therapists.length > 0 && (
            <Link href="/find" className="t-label-m flex items-center justify-between rounded-[16px] border border-dashed border-line-strong px-4 py-3 text-stone hover:border-ink/30 hover:text-ink">
              {c.findMore} <span aria-hidden>→</span>
            </Link>
          )}
          <p className="t-caption flex gap-2 rounded-[16px] bg-sage-soft/70 p-4 text-sage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 shrink-0">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" />
            </svg>
            {d.privacy}
          </p>
        </aside>
      </div>
    </PortalShell>
  );
}
