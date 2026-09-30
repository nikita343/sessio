import { TZDate } from "@date-fns/tz";
import type { Availability } from "./types";

export type Slot = { start: string; end: string; free: boolean };
export type Day = { date: string; weekday: number; slots: Slot[] };

/**
 * Build bookable slots for the next `days` days in the therapist's timezone.
 * Slots start on the hour (or :30 for sessions under an hour), within working hours,
 * at least `leadHours` from now, and never overlapping busy intervals.
 */
export function buildDays(opts: {
  availability: Availability[];
  busy: { starts_at: string; ends_at: string }[];
  durationMin: number;
  tz: string;
  days?: number;
  leadHours?: number;
  now?: Date;
}): Day[] {
  const { availability, busy, durationMin, tz, days = 21, leadHours = 12 } = opts;
  const now = opts.now ?? new Date();
  const earliest = now.getTime() + leadHours * 3600_000;
  const step = durationMin >= 60 ? 60 : 30;
  const busyMs = busy.map((b) => [new Date(b.starts_at).getTime(), new Date(b.ends_at).getTime()] as const);
  const today = new TZDate(now.getTime(), tz);
  const out: Day[] = [];

  for (let d = 0; d < days; d++) {
    const day = new TZDate(today.getFullYear(), today.getMonth(), today.getDate() + d, tz);
    const iso = ((day.getDay() + 6) % 7) + 1; // 1 = Monday
    const windows = availability.filter((a) => a.weekday === iso);
    if (!windows.length) continue;
    const slots: Slot[] = [];
    for (const w of windows) {
      const [sh, sm] = w.start_time.split(":").map(Number);
      const [eh, em] = w.end_time.split(":").map(Number);
      const endMin = eh * 60 + em;
      for (let m = sh * 60 + sm; m + durationMin <= endMin; m += step) {
        const start = new TZDate(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(m / 60), m % 60, tz);
        const s = start.getTime();
        const e = s + durationMin * 60_000;
        if (s < earliest) continue;
        const clash = busyMs.some(([bs, be]) => s < be && e > bs);
        slots.push({ start: new Date(s).toISOString(), end: new Date(e).toISOString(), free: !clash });
      }
    }
    slots.sort((a, b) => a.start.localeCompare(b.start));
    if (slots.length) out.push({ date: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`, weekday: iso, slots });
  }
  return out;
}
