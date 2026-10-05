import { NextResponse } from "next/server";
import { publicClient, SERVER_SECRET } from "@/lib/supabase/server";
import { sendReminderEmail } from "@/lib/email";

/**
 * Hourly (Supabase pg_cron → pg_net): sends the day-before reminder with the video link.
 * Each booking is claimed atomically in the database, so a reminder goes out at most once.
 */
export async function POST(req: Request) {
  if (!SERVER_SECRET() || req.headers.get("x-sessio-secret") !== SERVER_SECRET()) return NextResponse.json({ error: "not allowed" }, { status: 403 });
  const sb = publicClient();
  const { data, error } = await sb.rpc("server_due_reminders", { p_secret: SERVER_SECRET() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  type Row = Parameters<typeof sendReminderEmail>[0] & { therapist_id: string };
  const rows = (data ?? []) as Row[];
  const byTherapist = new Map<string, string[]>();
  let sent = 0;
  for (const r of rows) {
    const ok = await sendReminderEmail(r).catch(() => false);
    if (ok) {
      sent++;
      const t = new Intl.DateTimeFormat("en-GB", { timeZone: r.timezone, weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(r.starts_at));
      byTherapist.set(r.therapist_id, [...(byTherapist.get(r.therapist_id) ?? []), `${r.client_name} (${t})`]);
    }
  }
  for (const [therapist, names] of byTherapist) {
    await sb.rpc("server_log_reminders", {
      p_secret: SERVER_SECRET(),
      p_therapist: therapist,
      p_summary: `Sent ${names.length === 1 ? "a reminder" : `${names.length} reminders`} with the video link for tomorrow: ${names.join(", ")}.`,
    });
  }
  return NextResponse.json({ due: rows.length, sent });
}
