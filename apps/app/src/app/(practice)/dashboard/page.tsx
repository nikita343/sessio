import type { Metadata } from "next";
import Link from "next/link";
import { TZDate } from "@date-fns/tz";
import { getTherapist } from "@/lib/therapist";
import { bookingsBetween, sessionNumbers, type BookingRow } from "@/lib/queries";
import { buildDays } from "@/lib/slots";
import { firstName, inTz, money, shortName, timeAgo } from "@/lib/format";
import { Badge, Card, LinkButton, btn } from "@/components/ui";
import { CopyLink } from "@/components/copy-link";
import type { Activity, Availability } from "@/lib/types";
import { pick, uiLang } from "@/lib/ui-lang";
import { DASHBOARD_T } from "@/lib/ui/dashboard";
import { activityText } from "@/lib/ui/activity";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(DASHBOARD_T, await uiLang()).title };
}

export default async function Dashboard(props: PageProps<"/dashboard">) {
  const sp = await props.searchParams;
  const lang = await uiLang();
  const t = pick(DASHBOARD_T, lang);
  const { supabase, therapist: th } = await getTherapist();
  const tz = th.timezone;
  const now = new TZDate(Date.now(), tz);
  const dayStart = new TZDate(now.getFullYear(), now.getMonth(), now.getDate(), tz);
  const dayEnd = new TZDate(now.getFullYear(), now.getMonth(), now.getDate() + 1, tz);
  const weekStart = new TZDate(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7), tz);
  const weekEnd = new TZDate(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7, tz);
  const monthStart = new TZDate(now.getFullYear(), now.getMonth(), 1, tz);

  const [week, upcoming, { data: paidMonth }, { count: noShows }, { data: activity }, { data: avail }, { data: svc }, { data: notes }] = await Promise.all([
    bookingsBetween(supabase, weekStart, weekEnd),
    bookingsBetween(supabase, dayEnd, new Date(dayEnd.getTime() + 14 * 86400_000), ["confirmed"]),
    supabase.from("bookings").select("price_minor").eq("payment_status", "paid").gte("starts_at", monthStart.toISOString()).neq("status", "cancelled"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "no_show"),
    supabase.from("activity").select("*").order("created_at", { ascending: false }).limit(12),
    supabase.from("availability").select("*"),
    supabase.from("services").select("duration_min").eq("active", true).limit(1),
    supabase.from("notes").select("booking_id, status"),
  ]);
  const today = week.filter((b) => new Date(b.starts_at) >= dayStart && new Date(b.starts_at) < dayEnd);
  const list: BookingRow[] = today.length ? today : upcoming.slice(0, 5);
  const nums = await sessionNumbers(supabase, [...new Set(list.map((b) => b.client_id))]);
  const noteBy = new Map((notes ?? []).map((n) => [n.booking_id, n.status]));

  const freeLeft = buildDays({
    availability: (avail as Availability[]) ?? [],
    busy: week.map((b) => ({ starts_at: b.starts_at, ends_at: b.ends_at })),
    durationMin: svc?.[0]?.duration_min ?? 50,
    tz,
    days: Math.max(1, Math.ceil((weekEnd.getTime() - Date.now()) / 86400_000)),
    leadHours: 0,
  }).reduce((n, d) => n + d.slots.filter((s) => s.free && new Date(s.start) < weekEnd).length, 0);

  const online = today.filter((b) => b.format === "online").length;
  const paidSum = (paidMonth ?? []).reduce((s, b) => s + b.price_minor, 0);
  const acts = (activity ?? []) as Activity[];
  // urgent (possible risk) first, then everything else that needs the therapist
  const review = acts.filter((a) => a.needs_review).sort((a, b) => Number(Boolean(b.urgent)) - Number(Boolean(a.urgent)));
  const handled = acts.filter((a) => !a.needs_review).slice(0, 4);
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

  const stats = [
    [t.statToday, t.sessions(today.length), today.length ? t.todaySplit(online, today.length - online) : t.quietDay],
    [t.statWeek, t.sessions(week.length), t.slotsLeft(freeLeft)],
    [t.statPaidMonth, money(paidSum, th.currency), t.allPrepaid],
    [t.statNoShows, String(noShows ?? 0), t.sincePrepayment],
  ];
  const dateLine = inTz(new Date(), tz, "EEEE, d MMMM", lang);

  return (
    <div className="flex flex-col gap-6">
      {sp.welcome && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-sage px-5 py-4 text-white">
          <p className="t-body-m">{t.welcome}</p>
          <a href={`/${th.slug}`} target="_blank" className="t-label-m rounded-full bg-white px-4 py-2 text-sage">
            {t.openMyPage}
          </a>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-caption text-stone">{dateLine.charAt(0).toUpperCase() + dateLine.slice(1)}</p>
          <h1 className="t-heading-m !text-[36px]">
            {t.greeting(now.getHours())}, {firstName(th.full_name)}
          </h1>
        </div>
        <div className="flex gap-2">
          <CopyLink url={`${app}/${th.slug}`} label={t.copyBookingLink} lang={lang} />
          <LinkButton href="/calendar?new=1">{t.addSession}</LinkButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(([k, v, s]) => (
          <Card key={k} className="flex flex-col gap-1.5 p-5">
            <p className="t-overline text-stone">{k}</p>
            <p className="font-display text-[28px] font-medium tracking-[-0.045em]">{v}</p>
            <p className="t-caption text-stone">{s}</p>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="t-title-m">{today.length ? t.today : t.comingUp}</h2>
            <Link href="/calendar" className="t-label-m text-sage">
              {t.viewCalendar}
            </Link>
          </div>
          {list.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="t-title-m">{t.emptyTitle}</p>
              <p className="t-body-s mx-auto mt-1 max-w-sm text-stone">{t.emptyBody}</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {list.map((b) => {
                const start = new Date(b.starts_at).getTime();
                const live = b.format === "online" && Date.now() > start - 10 * 60_000 && Date.now() < new Date(b.ends_at).getTime();
                const past = Date.now() > new Date(b.ends_at).getTime();
                const n = nums.get(b.id) ?? 1;
                const note = noteBy.get(b.id);
                return (
                  <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 sm:flex-nowrap sm:px-6">
                    <div className="w-14 shrink-0">
                      <p className="font-display text-[20px] font-medium tracking-[-0.03em]">{inTz(b.starts_at, tz, "HH:mm")}</p>
                      {!today.length && <p className="t-caption text-stone">{inTz(b.starts_at, tz, "EEE d", lang)}</p>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/clients/${b.client_id}`} className="t-label-m hover:underline">
                        {shortName(b.client?.full_name ?? t.client)}
                      </Link>
                      <p className="t-caption text-stone">
                        {n === 1 ? t.firstSession : t.sessionN(n)} · {b.format === "online" ? t.online : t.inPerson}
                        {b.client?.language && b.client.language !== "pl" ? ` · ${b.client.language === "uk" ? "UA" : b.client.language.toUpperCase()}` : ""}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 pl-[72px] sm:contents">
                    {b.status === "no_show" ? <Badge tone="warn">{t.noShow}</Badge> : b.payment_status === "paid" ? <Badge tone="sage">{t.paid}</Badge> : <Badge tone="clay">{t.unpaid}</Badge>}
                    <div className="text-right sm:w-[120px]">
                      {live && b.room_name ? (
                        <Link href={`/room/${b.room_name}`} className={btn("primary", "md")}>
                          {t.join}
                        </Link>
                      ) : past ? (
                        <Link href={`/notes/new?booking=${b.id}`} className="t-label-m text-ink hover:underline">
                          {note === "signed" ? t.signed : note ? t.noteReady : t.writeNote}
                        </Link>
                      ) : (
                        <Link href={`/clients/${b.client_id}`} className="t-label-m text-ink hover:underline">
                          {t.details}
                        </Link>
                      )}
                    </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="flex flex-col gap-4 rounded-[20px] bg-ink p-6 text-white">
          <p className="t-overline flex items-center gap-2 text-white/80">
            <span className="size-1.5 rounded-full bg-white" /> {t.handledForYou}
          </p>
          {handled.length === 0 && review.length === 0 && <p className="t-body-s text-white/70">{t.handledEmpty}</p>}
          <ul className="flex flex-col divide-y divide-white/10">
            {handled.map((a) => (
              <li key={a.id} className="py-3 first:pt-0">
                <p className="t-body-s">{activityText(a.summary, lang)}</p>
                <p className="t-caption mt-0.5 text-white/50">{timeAgo(a.created_at, lang)}</p>
              </li>
            ))}
          </ul>
          {review.slice(0, 2).map((a) => (
            <div key={a.id} className={`flex flex-col gap-3 rounded-[14px] p-4 text-ink ${a.urgent ? "bg-[#f6e3dc] ring-2 ring-warn/60" : "bg-clay-soft"}`}>
              <p className={`t-overline ${a.urgent ? "text-warn" : "text-clay"}`}>{a.urgent ? t.urgent : t.needsOk}</p>
              <p className="t-body-s">{activityText(a.summary, lang)}</p>
              <LinkButton href={a.ref_id ? `/inbox?c=${a.ref_id}` : "/inbox"} className="self-start">
                {t.reviewReply}
              </LinkButton>
            </div>
          ))}
          <p className="t-caption text-white/50">{t.privacy}</p>
        </div>
      </div>
    </div>
  );
}
