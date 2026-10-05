import type { Metadata } from "next";
import Link from "next/link";
import { TZDate } from "@date-fns/tz";
import { getTherapist } from "@/lib/therapist";
import { bookingsBetween } from "@/lib/queries";
import { inTz, shortName } from "@/lib/format";
import { PageHeader, btn } from "@/components/ui";
import { AddSession } from "./add-session";
import type { Availability } from "@/lib/types";
import { pick, uiLang } from "@/lib/ui-lang";
import { CALENDAR_T } from "@/lib/ui/calendar";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(CALENDAR_T, await uiLang()).title };
}

const START_H = 8;
const END_H = 21;
const PX = 56; // px per hour

export default async function Calendar(props: PageProps<"/calendar">) {
  const sp = await props.searchParams;
  const lang = await uiLang();
  const t = pick(CALENDAR_T, lang);
  const w = Number(sp.w ?? 0) || 0;
  const { supabase, therapist: th } = await getTherapist();
  const tz = th.timezone;
  const now = new TZDate(Date.now(), tz);
  const monday = new TZDate(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + w * 7, tz);
  const next = new TZDate(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7, tz);
  const [bookings, { data: avail }, { data: clients }] = await Promise.all([
    bookingsBetween(supabase, monday, next, ["confirmed", "completed", "no_show"]),
    supabase.from("availability").select("*"),
    supabase.from("clients").select("id, full_name").order("full_name"),
  ]);
  const days = Array.from({ length: 7 }, (_, i) => new TZDate(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, tz));
  const hours = Array.from({ length: END_H - START_H }, (_, i) => START_H + i);
  const top = (iso: string) => {
    const d = new TZDate(new Date(iso).getTime(), tz);
    return (d.getHours() + d.getMinutes() / 60 - START_H) * PX;
  };
  const todayKey = inTz(new Date(), tz, "yyyy-MM-dd");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`${inTz(monday, tz, "d MMM", lang)} – ${inTz(new Date(next.getTime() - 1), tz, "d MMM yyyy", lang)}`}
        title={t.title}
        actions={
          <>
            <Link href={`/calendar?w=${w - 1}`} className={btn("secondary", "md", "!px-3")} aria-label={t.prevWeek}>
              ←
            </Link>
            <Link href="/calendar" className={btn("secondary")}>
              {t.thisWeek}
            </Link>
            <Link href={`/calendar?w=${w + 1}`} className={btn("secondary", "md", "!px-3")} aria-label={t.nextWeek}>
              →
            </Link>
            <AddSession open={Boolean(sp.new)} clients={clients ?? []} defaultDate={inTz(new Date(), tz, "yyyy-MM-dd")} lang={lang} />
          </>
        }
      />
      <div className="overflow-x-auto rounded-[16px] border border-line bg-surface">
        <div className="grid min-w-[760px] grid-cols-[52px_repeat(7,1fr)]">
          <div className="border-b border-line" />
          {days.map((d) => {
            const key = inTz(d, tz, "yyyy-MM-dd");
            return (
              <div key={key} className={`border-b border-l border-line px-3 py-2.5 ${key === todayKey ? "bg-sage-soft/60" : ""}`}>
                <p className="t-caption text-stone">{inTz(d, tz, "EEE", lang)}</p>
                <p className="font-display text-[18px] font-medium">{inTz(d, tz, "d")}</p>
              </div>
            );
          })}
          <div className="relative" style={{ height: hours.length * PX }}>
            {hours.map((h) => (
              <span key={h} className="t-caption absolute right-2 -translate-y-1/2 text-stone" style={{ top: (h - START_H) * PX }}>
                {h > START_H ? `${h}:00` : ""}
              </span>
            ))}
          </div>
          {days.map((d, i) => {
            const iso = i + 1;
            const key = inTz(d, tz, "yyyy-MM-dd");
            const windows = ((avail as Availability[]) ?? []).filter((a) => a.weekday === iso);
            const dayBookings = bookings.filter((b) => inTz(b.starts_at, tz, "yyyy-MM-dd") === key);
            return (
              <div key={key} className="relative border-l border-line" style={{ height: hours.length * PX }}>
                {hours.map((h) => (
                  <div key={h} className="absolute inset-x-0 border-t border-line/60" style={{ top: (h - START_H) * PX }} />
                ))}
                {windows.map((a) => {
                  const [sh, sm] = a.start_time.split(":").map(Number);
                  const [eh, em] = a.end_time.split(":").map(Number);
                  return (
                    <div
                      key={a.start_time}
                      className="absolute inset-x-0 bg-sage-soft/35"
                      style={{ top: (sh + sm / 60 - START_H) * PX, height: (eh + em / 60 - sh - sm / 60) * PX }}
                    />
                  );
                })}
                {dayBookings.map((b) => {
                  const h = ((new Date(b.ends_at).getTime() - new Date(b.starts_at).getTime()) / 3600_000) * PX;
                  return (
                    <Link
                      key={b.id}
                      href={`/clients/${b.client_id}`}
                      className={`absolute inset-x-1 flex flex-col overflow-hidden rounded-[10px] px-2 py-1.5 text-left text-[12px] leading-tight shadow-sm ${
                        b.status === "no_show" ? "bg-[#f6e3dc] text-warn" : b.format === "online" ? "bg-sage text-white" : "bg-clay text-white"
                      }`}
                      style={{ top: top(b.starts_at) + 1, height: h - 2 }}
                    >
                      <span className="font-medium">{shortName(b.client?.full_name ?? t.client)}</span>
                      <span className="opacity-80">
                        {inTz(b.starts_at, tz, "HH:mm")} · {b.format === "online" ? t.online : t.inPerson}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <p className="t-caption text-stone">{t.legend}</p>
    </div>
  );
}
