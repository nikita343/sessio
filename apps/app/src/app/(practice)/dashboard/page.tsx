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

export const metadata: Metadata = { title: "Today" };

function greeting(h: number) {
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard(props: PageProps<"/dashboard">) {
  const sp = await props.searchParams;
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
  const review = acts.filter((a) => a.needs_review);
  const handled = acts.filter((a) => !a.needs_review).slice(0, 4);
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

  const stats = [
    ["Today", `${today.length} session${today.length === 1 ? "" : "s"}`, today.length ? `${online} online · ${today.length - online} in person` : "a quiet day"],
    ["This week", `${week.length} session${week.length === 1 ? "" : "s"}`, `${freeLeft} slot${freeLeft === 1 ? "" : "s"} left`],
    ["Paid this month", money(paidSum, th.currency), "all prepaid, 0 chasing"],
    ["No-shows", String(noShows ?? 0), "since prepayment"],
  ];

  return (
    <div className="flex flex-col gap-6">
      {sp.welcome && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-sage px-5 py-4 text-white">
          <p className="t-body-m">Your booking page is live. Share the link with clients — they can book and pay in under a minute.</p>
          <a href={`/${th.slug}`} target="_blank" className="t-label-m rounded-full bg-white px-4 py-2 text-sage">
            Open my page
          </a>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-caption text-stone">{inTz(new Date(), tz, "EEEE, d MMMM")}</p>
          <h1 className="t-heading-m !text-[36px]">
            {greeting(now.getHours())}, {firstName(th.full_name)}
          </h1>
        </div>
        <div className="flex gap-2">
          <CopyLink url={`${app}/${th.slug}`} />
          <LinkButton href="/calendar?new=1">+ Add session</LinkButton>
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
            <h2 className="t-title-m">{today.length ? "Today" : "Coming up"}</h2>
            <Link href="/calendar" className="t-label-m text-sage">
              View calendar →
            </Link>
          </div>
          {list.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="t-title-m">No sessions booked yet</p>
              <p className="t-body-s mx-auto mt-1 max-w-sm text-stone">Share your booking link. When a client books and pays, the session appears here with its video room.</p>
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
                  <li key={b.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-14 shrink-0">
                      <p className="font-display text-[20px] font-medium tracking-[-0.03em]">{inTz(b.starts_at, tz, "HH:mm")}</p>
                      {!today.length && <p className="t-caption text-stone">{inTz(b.starts_at, tz, "EEE d")}</p>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/clients/${b.client_id}`} className="t-label-m hover:underline">
                        {shortName(b.client?.full_name ?? "Client")}
                      </Link>
                      <p className="t-caption text-stone">
                        {n === 1 ? "First session" : `Session ${n}`} · {b.format === "online" ? "online" : "in person"}
                        {b.client?.language && b.client.language !== "pl" ? ` · ${b.client.language === "uk" ? "UA" : b.client.language.toUpperCase()}` : ""}
                      </p>
                    </div>
                    {b.status === "no_show" ? <Badge tone="warn">No-show</Badge> : b.payment_status === "paid" ? <Badge tone="sage">Paid</Badge> : <Badge tone="clay">Unpaid</Badge>}
                    <div className="w-[104px] text-right">
                      {live && b.room_name ? (
                        <Link href={`/room/${b.room_name}`} className={btn("primary", "md")}>
                          Join
                        </Link>
                      ) : past ? (
                        <Link href={`/notes/new?booking=${b.id}`} className="t-label-m text-ink hover:underline">
                          {note === "signed" ? "Signed" : note ? "Note ready" : "Write note"}
                        </Link>
                      ) : (
                        <Link href={`/clients/${b.client_id}`} className="t-label-m text-ink hover:underline">
                          Details
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="flex flex-col gap-4 rounded-[20px] bg-ink p-6 text-white">
          <p className="t-overline flex items-center gap-2 text-white/80">
            <span className="size-1.5 rounded-full bg-white" /> Handled for you
          </p>
          {handled.length === 0 && review.length === 0 && (
            <p className="t-body-s text-white/70">When clients book, pay, cancel or ask questions, the assistant handles the admin and lists it here.</p>
          )}
          <ul className="flex flex-col divide-y divide-white/10">
            {handled.map((a) => (
              <li key={a.id} className="py-3 first:pt-0">
                <p className="t-body-s">{a.summary}</p>
                <p className="t-caption mt-0.5 text-white/50">{timeAgo(a.created_at)}</p>
              </li>
            ))}
          </ul>
          {review.slice(0, 2).map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-[14px] bg-clay-soft p-4 text-ink">
              <p className="t-overline text-clay">Needs your OK</p>
              <p className="t-body-s">{a.summary}</p>
              <LinkButton href="/inbox" className="self-start">
                Review &amp; reply
              </LinkButton>
            </div>
          ))}
          <p className="t-caption text-white/50">The assistant sees bookings, payments and messages — never what is said in sessions.</p>
        </div>
      </div>
    </div>
  );
}
