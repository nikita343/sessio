import { TZDate } from "@date-fns/tz";

/**
 * A small iCalendar reader for the onboarding import: enough of RFC 5545 to turn a Google / Apple / Outlook
 * export into upcoming sessions with an attendee. No dependency, no recurrence engine beyond weekly rules.
 */

export type IcsAttendee = { email: string; name: string | null };
export type IcsEvent = {
  uid: string;
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendees: IcsAttendee[];
  organizer: string | null;
  recurring: boolean;
};

type Prop = { name: string; params: Record<string, string>; value: string };

function unfold(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n[ \t]/g, "");
}

function parseLine(line: string): Prop | null {
  const i = line.indexOf(":");
  if (i < 0) return null;
  // params may contain ":" inside quotes — walk to the first ":" outside quotes
  let inQ = false;
  let split = -1;
  for (let k = 0; k < line.length; k++) {
    const c = line[k];
    if (c === '"') inQ = !inQ;
    else if (c === ":" && !inQ) {
      split = k;
      break;
    }
  }
  if (split < 0) return null;
  const head = line.slice(0, split);
  const value = line.slice(split + 1);
  const [rawName, ...rawParams] = head.split(";");
  const params: Record<string, string> = {};
  for (const p of rawParams) {
    const eq = p.indexOf("=");
    if (eq < 0) continue;
    params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, "");
  }
  return { name: rawName.toUpperCase(), params, value };
}

function unescape(v: string) {
  return v.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
}

type Local = { y: number; mo: number; d: number; h: number; mi: number; s: number; tz: string };

function toDate(l: Local): Date {
  if (l.tz === "UTC") return new Date(Date.UTC(l.y, l.mo, l.d, l.h, l.mi, l.s));
  return new Date(new TZDate(l.y, l.mo, l.d, l.h, l.mi, l.s, l.tz).getTime());
}

/** DTSTART/DTEND value → local wall time + zone, honouring TZID / Z / floating (therapist tz). Null for all-day values. */
function parseLocal(p: Prop, defaultTz: string): Local | null {
  if (p.params.VALUE === "DATE" || /^\d{8}$/.test(p.value)) return null;
  const m = p.value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  let tz = z ? "UTC" : p.params.TZID || defaultTz;
  const l: Local = { y: Number(y), mo: Number(mo) - 1, d: Number(d), h: Number(h), mi: Number(mi), s: Number(s ?? 0), tz };
  try {
    toDate(l);
  } catch {
    tz = defaultTz;
  }
  return { ...l, tz };
}

function parseDateTime(p: Prop, defaultTz: string): Date | null {
  const l = parseLocal(p, defaultTz);
  return l ? toDate(l) : null;
}

function parseDuration(v: string): number | null {
  // PT50M, PT1H, PT1H30M, P1D
  const m = v.match(/^-?P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return null;
  const [, d, h, mi, s] = m;
  return (Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(mi ?? 0) * 60 + Number(s ?? 0)) * 1000;
}

const DOW: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

/**
 * Expand a weekly / daily RRULE into occurrences inside [from, to], walking the calendar in the event's own
 * zone so a 10:00 session stays at 10:00 across the DST change. Other frequencies return just the base instance.
 */
function expand(startL: Local, end: Date, rrule: string | null, exdates: Set<number>, from: Date, to: Date): [Date, Date][] {
  const start = toDate(startL);
  const len = end.getTime() - start.getTime();
  const out: [Date, Date][] = [];
  const push = (s: Date) => {
    if (exdates.has(s.getTime())) return;
    if (s >= from && s <= to) out.push([s, new Date(s.getTime() + len)]);
  };
  const plusDays = (n: number) => toDate({ ...startL, d: startL.d + n });
  if (!rrule) {
    push(start);
    return out;
  }
  const rule: Record<string, string> = {};
  for (const part of rrule.split(";")) {
    const eq = part.indexOf("=");
    if (eq > 0) rule[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1).toUpperCase();
  }
  const freq = rule.FREQ;
  const interval = Math.max(1, Number(rule.INTERVAL ?? 1));
  const count = rule.COUNT ? Number(rule.COUNT) : Infinity;
  let until = to;
  if (rule.UNTIL) {
    const u = rule.UNTIL.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?Z?)?$/);
    if (u) until = new Date(Math.min(to.getTime(), Date.UTC(Number(u[1]), Number(u[2]) - 1, Number(u[3]), Number(u[4] ?? 23), Number(u[5] ?? 59), Number(u[6] ?? 59))));
  }
  // weekday of the base instance in its own zone
  const baseDow = new TZDate(start.getTime(), startL.tz === "UTC" ? "Etc/UTC" : startL.tz).getDay();
  if (freq === "WEEKLY") {
    const days = rule.BYDAY ? rule.BYDAY.split(",").map((d) => DOW[d.slice(-2)]).filter((d) => d !== undefined) : [baseDow];
    let produced = 0;
    for (let w = 0; w < 600 && produced < count; w++) {
      const weekStart = plusDays(w * 7 * interval);
      if (weekStart > until) break;
      for (const dow of days.sort((a, b) => a - b)) {
        const delta = (dow - baseDow + 7) % 7;
        const s = plusDays(w * 7 * interval + delta);
        if (s < start) continue;
        if (s > until) break;
        if (produced >= count) break;
        produced++;
        push(s);
      }
    }
    return out;
  }
  if (freq === "DAILY") {
    let produced = 0;
    for (let i = 0; i < 400 && produced < count; i++) {
      const s = plusDays(i * interval);
      if (s > until) break;
      produced++;
      push(s);
    }
    return out;
  }
  // MONTHLY/YEARLY or unknown: base instance only
  push(start);
  return out;
}

export function parseIcs(text: string, defaultTz: string, window: { from: Date; to: Date }): IcsEvent[] {
  const lines = unfold(text).split("\n");
  const events: IcsEvent[] = [];
  let cur: Prop[] | null = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (line === "BEGIN:VEVENT") {
      cur = [];
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur) {
        const get = (n: string) => cur!.find((p) => p.name === n);
        const ds = get("DTSTART");
        const startL = ds ? parseLocal(ds, defaultTz) : null;
        const start = startL ? toDate(startL) : null;
        if (start && startL) {
          const de = get("DTEND");
          let end = de ? parseDateTime(de, defaultTz) : null;
          if (!end) {
            const dur = get("DURATION");
            const ms = dur ? parseDuration(dur.value) : null;
            end = new Date(start.getTime() + (ms ?? 50 * 60_000));
          }
          const status = get("STATUS")?.value.toUpperCase();
          if (status !== "CANCELLED") {
            const attendees: IcsAttendee[] = cur
              .filter((p) => p.name === "ATTENDEE")
              .map((p) => ({ email: p.value.replace(/^mailto:/i, "").trim().toLowerCase(), name: p.params.CN?.trim() || null }))
              .filter((a) => a.email.includes("@"));
            const org = get("ORGANIZER");
            const exdates = new Set<number>();
            for (const p of cur.filter((p) => p.name === "EXDATE")) {
              for (const v of p.value.split(",")) {
                const d = parseDateTime({ ...p, value: v }, defaultTz);
                if (d) exdates.add(d.getTime());
              }
            }
            const rrule = get("RRULE")?.value ?? null;
            for (const [s, e] of expand(startL, end, rrule, exdates, window.from, window.to)) {
              events.push({
                uid: (get("UID")?.value ?? "") + (rrule ? `@${s.getTime()}` : ""),
                summary: unescape(get("SUMMARY")?.value ?? "").trim(),
                description: unescape(get("DESCRIPTION")?.value ?? "").trim(),
                start: s,
                end: e,
                attendees,
                organizer: org ? org.value.replace(/^mailto:/i, "").trim().toLowerCase() : null,
                recurring: Boolean(rrule),
              });
            }
          }
        }
      }
      cur = null;
      continue;
    }
    if (cur) {
      const p = parseLine(line);
      if (p) cur.push(p);
    }
  }
  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}
