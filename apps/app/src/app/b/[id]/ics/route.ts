import { getPublicBooking } from "@/lib/booking-public";

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export async function GET(req: Request, ctx: RouteContext<"/b/[id]/ics">) {
  const { id } = await ctx.params;
  const token = new URL(req.url).searchParams.get("t") ?? "";
  const b = await getPublicBooking(id, token);
  if (!b) return new Response("Not found", { status: 404 });
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";
  const where = b.format === "online" && b.room_name ? `${app}/room/${b.room_name}?t=${token}` : b.therapist_address ?? "";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sessio//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.id}@usesessio.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(b.starts_at)}`,
    `DTEND:${stamp(b.ends_at)}`,
    `SUMMARY:Session with ${b.therapist_name}`,
    `LOCATION:${where}`,
    `DESCRIPTION:${b.format === "online" ? "Private video room: " + where : "In person"}\\nManage: ${app}/b/${b.id}?t=${token}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Session in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics, {
    headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": `attachment; filename="sessio-session.ics"` },
  });
}
