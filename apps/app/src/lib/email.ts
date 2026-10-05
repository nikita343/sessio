type Row = { id: string; manage_token: string; client_email: string; client_name: string; therapist_name: string; starts_at: string; timezone: string; room_name: string | null };

const sent = new Set<string>();

export async function sendBookingEmail(row: Row) {
  const key = process.env.RESEND_API_KEY;
  if (!key || sent.has(row.id)) return;
  sent.add(row.id);
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";
  const manage = `${app}/b/${row.id}?t=${row.manage_token}`;
  const room = row.room_name ? `${app}/room/${row.room_name}?t=${row.manage_token}` : manage;
  const when = new Intl.DateTimeFormat("en-GB", { timeZone: row.timezone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(row.starts_at));
  const html = `<!doctype html><html><body style="margin:0;background:#F4F3EF;font-family:Helvetica,Arial,sans-serif;color:#1C2530">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <p style="font-size:18px;font-weight:600;margin:0 0 24px;color:#3F6B5E">sessio</p>
    <div style="background:#fff;border-radius:20px;padding:28px">
      <h1 style="font-size:24px;margin:0 0 8px;letter-spacing:-0.5px">You're booked</h1>
      <p style="font-size:15px;line-height:1.5;color:#667080;margin:0 0 20px">${when} with ${row.therapist_name}.</p>
      <a href="${room}" style="display:inline-block;background:#3F6B5E;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px">Your private video room</a>
      <p style="font-size:13px;line-height:1.5;color:#667080;margin:20px 0 0">The room opens 10 minutes before the session. Nothing is recorded.<br/>Need to change something? <a href="${manage}" style="color:#1C2530">Manage your booking</a>, or see all your sessions at <a href="${app}/me" style="color:#1C2530">${app.replace(/^https?:\/\//, "")}/me</a>.</p>
    </div>
    <p style="font-size:12px;color:#667080;margin:20px 0 0">Sent by Sessio on behalf of ${row.therapist_name}. Paid directly to your therapist — Sessio takes no commission.</p>
  </div></body></html>`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Sessio <bookings@usesessio.com>",
      to: [row.client_email],
      subject: `Booked: ${when} with ${row.therapist_name}`,
      html,
    }),
  });
}

type ReminderRow = {
  id: string;
  manage_token: string;
  client_email: string;
  client_name: string;
  therapist_name: string;
  starts_at: string;
  timezone: string;
  room_name: string | null;
  format: "online" | "in_person";
  address: string | null;
  cancellation_hours: number;
  lang: string;
};

const R = {
  pl: { subj: (w: string, n: string) => `Jutro: ${w} z ${n}`, title: "Do zobaczenia jutro", room: "Twój prywatny pokój wideo", where: (a: string) => `Spotkanie w gabinecie: ${a}`, foot: "Pokój otwiera się 10 minut przed sesją. Nic nie jest nagrywane.", manage: "Zarządzaj rezerwacją", locale: "pl-PL" },
  uk: { subj: (w: string, n: string) => `Завтра: ${w} з ${n}`, title: "До зустрічі завтра", room: "Ваша приватна відеокімната", where: (a: string) => `Зустріч у кабінеті: ${a}`, foot: "Кімната відкривається за 10 хвилин до сесії. Нічого не записується.", manage: "Керувати бронюванням", locale: "uk-UA" },
  en: { subj: (w: string, n: string) => `Tomorrow: ${w} with ${n}`, title: "See you tomorrow", room: "Your private video room", where: (a: string) => `In person at ${a}`, foot: "The room opens 10 minutes before the session. Nothing is recorded.", manage: "Manage your booking", locale: "en-GB" },
} as const;

/** Day-before reminder with the video link (or the address), in the client's language. */
export async function sendReminderEmail(row: ReminderRow) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const l = R[(row.lang as keyof typeof R) in R ? (row.lang as keyof typeof R) : "pl"];
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";
  const manage = `${app}/b/${row.id}?t=${row.manage_token}`;
  const room = row.room_name ? `${app}/room/${row.room_name}?t=${row.manage_token}` : manage;
  const when = new Intl.DateTimeFormat(l.locale, { timeZone: row.timezone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(row.starts_at));
  const action =
    row.format === "online"
      ? `<a href="${room}" style="display:inline-block;background:#3F6B5E;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px">${l.room}</a>`
      : `<p style="font-size:15px;margin:0">${l.where(row.address ?? "")}</p>`;
  const html = `<!doctype html><html><body style="margin:0;background:#F4F3EF;font-family:Helvetica,Arial,sans-serif;color:#1C2530">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <p style="font-size:18px;font-weight:600;margin:0 0 24px;color:#3F6B5E">sessio</p>
    <div style="background:#fff;border-radius:20px;padding:28px">
      <h1 style="font-size:24px;margin:0 0 8px;letter-spacing:-0.5px">${l.title}</h1>
      <p style="font-size:15px;line-height:1.5;color:#667080;margin:0 0 20px">${when} · ${row.therapist_name}</p>
      ${action}
      <p style="font-size:13px;line-height:1.5;color:#667080;margin:20px 0 0">${l.foot}<br/><a href="${manage}" style="color:#1C2530">${l.manage}</a> · <a href="${app}/me" style="color:#1C2530">${app.replace(/^https?:\/\//, "")}/me</a></p>
    </div>
  </div></body></html>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM ?? "Sessio <bookings@usesessio.com>", to: [row.client_email], subject: l.subj(when, row.therapist_name), html }),
  });
  return r.ok;
}
