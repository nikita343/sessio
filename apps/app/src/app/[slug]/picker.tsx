"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Day } from "@/lib/slots";
import { fmtDate, t, type Lang } from "@/lib/i18n";

export function Picker({ slug, days, lang, tz, tzText, price, footnote }: { slug: string; days: Day[]; lang: Lang; tz: string; tzText: string; price: string; footnote: string }) {
  const d = t(lang);
  const router = useRouter();
  const firstOpen = days.findIndex((x) => x.slots.some((s) => s.free));
  const [dayIdx, setDayIdx] = useState(Math.max(0, firstOpen));
  const [slot, setSlot] = useState<string | null>(null);
  const day = days[dayIdx];
  const time = (iso: string) => fmtDate(iso, tz, lang, { hour: "2-digit", minute: "2-digit", hour12: false });
  const dayLabel = useMemo(() => (day ? fmtDate(day.slots[0]!.start, tz, lang, { weekday: "long", day: "numeric", month: "long" }) : ""), [day, tz, lang]);

  if (!days.length || firstOpen < 0) return <p className="t-body-s text-stone">{d.noTimes}</p>;

  return (
    <div className="flex flex-col gap-4">
      <p className="t-overline text-stone">{d.pickTime}</p>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="listbox" aria-label={d.pickTime}>
        {days.map((x, i) => {
          const open = x.slots.some((s) => s.free);
          const on = i === dayIdx;
          return (
            <button
              key={x.date}
              type="button"
              role="option"
              aria-selected={on}
              disabled={!open}
              onClick={() => {
                setDayIdx(i);
                setSlot(null);
              }}
              className={`flex h-[62px] w-[58px] shrink-0 flex-col items-center justify-center rounded-[14px] transition-colors ${
                on ? "bg-ink text-white" : open ? "bg-paper hover:bg-sunken" : "bg-paper text-stone/40"
              }`}
            >
              <span className={`text-[12px] ${on ? "text-white/80" : "text-stone"}`}>{fmtDate(x.slots[0]!.start, tz, lang, { weekday: "short" })}</span>
              <span className="font-display text-[19px] font-medium">{fmtDate(x.slots[0]!.start, tz, lang, { day: "numeric" })}</span>
            </button>
          );
        })}
      </div>
      <p className="t-body-s text-stone">
        <span className="capitalize">{dayLabel}</span> · {tzText}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {day?.slots.map((s) => {
          const on = slot === s.start;
          return (
            <button
              key={s.start}
              type="button"
              disabled={!s.free}
              onClick={() => setSlot(s.start)}
              className={`t-label-m h-11 rounded-[12px] border transition-colors ${
                on ? "border-sage bg-sage text-white" : s.free ? "border-line-strong bg-surface hover:border-sage" : "border-transparent bg-sunken text-stone/60 line-through decoration-stone/30"
              }`}
            >
              {time(s.start)}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!slot}
        onClick={() => slot && router.push(`/${slug}/book?start=${encodeURIComponent(slot)}&lang=${lang}`)}
        className="t-label-m mt-1 h-12 rounded-full bg-sage text-white transition-colors hover:bg-sage-hover disabled:bg-sage/40"
      >
        {slot ? d.book(time(slot), price) : d.pickFirst}
      </button>
      <p className="t-caption text-center text-stone">{footnote}</p>
    </div>
  );
}
