import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import { loadPublic } from "@/lib/public";
import { publicClient, SERVER_SECRET } from "@/lib/supabase/server";
import { aiAvailable, FAST_MODEL, model } from "@/lib/ai";
import { fmtDate, type Lang } from "@/lib/i18n";
import { money, LANGS } from "@/lib/format";
import { CRISIS_HELP, PASSED_ON, isCrisis, replyLang } from "@/lib/crisis";
import type { Day } from "@/lib/slots";

const Body = z.object({
  slug: z.string(),
  name: z.string().trim().min(1).max(80),
  email: z.string().email(),
  message: z.string().trim().min(2).max(2000),
  lang: z.enum(["pl", "uk", "en"]).default("en"),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please fill in your name, email and a message." }, { status: 400 });
  const { slug, name, email, message, lang: pageLang } = parsed.data;
  // answer in the language the client actually wrote in
  const lang = replyLang(message, pageLang);
  const data = await loadPublic(slug);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { therapist: th, service, days } = data;

  const sb = publicClient();
  const { error: postErr } = await sb.rpc("post_client_message", { p_slug: slug, p_name: name, p_email: email, p_body: message });
  if (postErr) return NextResponse.json({ error: "Could not send. Please try again." }, { status: 500 });

  // Every free day for the next three weeks, as merged ranges of start times, so the model
  // never thinks the therapist is booked out just because the first few days are full.
  const availability = freeRanges(days, th.timezone, lang);
  const free = days
    .flatMap((d) => d.slots.filter((s) => s.free))
    .slice(0, 3)
    .map((s) => fmtDate(s.start, th.timezone, lang, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }));
  const first = th.full_name.split(" ")[0];
  const langName = lang === "pl" ? "Polish" : lang === "uk" ? "Ukrainian" : "English";

  let reply: string;
  let needsReview = false;
  let urgent = false;
  let summary: string;
  const crisisReply = () => `${CRISIS_HELP[lang]} ${PASSED_ON[lang]}`;
  const crisisSummary = `Urgent: ${name} wrote something that may mean they are at risk. Crisis lines were shared — please read their message now.`;

  if (isCrisis(message)) {
    reply = crisisReply();
    needsReview = true;
    urgent = true;
    summary = crisisSummary;
  } else if (aiAvailable()) {
    try {
      const { output } = await generateText({
        model: model(FAST_MODEL),
        output: Output.object({
          schema: z.object({
            risk: z
              .boolean()
              .describe("true if the message contains ANY hint that the writer may be at risk of harming themselves or others, or is in acute distress (hopelessness, wanting everything to end, not wanting to live), even if indirect or uncertain."),
            reply: z.string().describe("The answer to the client, in the client's language, 1–4 short sentences, warm and plain."),
            needs_review: z.boolean().describe("true if the therapist must personally handle this (clinical/personal content, requests for exceptions, complaints, refunds, anything you cannot answer from the facts)."),
            summary: z.string().describe("One line for the therapist's activity feed, in English, e.g. 'Answered Ola's question about evening times'."),
          }),
        }),
        system: `You are the booking assistant on the Sessio page of ${th.full_name}, ${th.title || "a therapist"} in ${th.city || "Poland"}.
You are not the therapist. Always speak about ${first} in the third person ("${first} has free times on…", "${first} will reply"), never as "I" when meaning the therapist.
You handle admin only: times, prices, formats, languages, cancellation, how online sessions work, how to pay.
You NEVER give clinical advice, diagnoses or opinions on the client's situation.
If the client shares anything personal or clinical, thank them briefly, say ${first} will read it personally, and set needs_review=true.
Safety: if there is any hint of risk or acute distress, set risk=true. Do not write your own help lines or phone numbers — the system adds the official ones.
Reply in ${langName}, in natural, correct ${langName} (in Polish say "wolne terminy", not "wolne czasy"). Keep it short. Don't invent facts.

Facts:
- Session: ${service ? `${service.name}, ${service.duration_min} min, ${money(service.price_minor, th.currency)}, prepaid when booking (BLIK, card, Przelewy24)` : "not set"}
- Formats: ${th.formats.map((f) => (f === "online" ? "online in a private video room (nothing recorded)" : `in person${th.address ? ` at ${th.address}` : ""}`)).join("; ")}
- Languages: ${th.languages.map((l) => LANGS[l] ?? l).join(", ")}
- Free cancellation up to ${th.cancellation_hours} h before; later cancellations are not refunded.
- To book: pick a time on this page and pay; the video link arrives by email.
- Invoices: available on request — set needs_review=true so ${first} can issue it.

COMPLETE list of free session start times for the next 3 weeks (${th.timezone}). Times are start times; anything not listed is taken or outside working hours. Days not listed have no free time:
${availability || "No free times in the next 3 weeks."}`,
        prompt: `A client writes:\n"""${message}"""`,
      });
      if (output.risk) {
        reply = crisisReply();
        needsReview = true;
        urgent = true;
        summary = crisisSummary;
      } else {
        reply = output.reply;
        needsReview = output.needs_review;
        summary = output.summary;
      }
    } catch {
      reply = fallback(lang, first, free, service ? money(service.price_minor, th.currency) : "");
      needsReview = true;
      summary = `${name} sent a message — waiting for your reply`;
    }
  } else {
    reply = fallback(lang, first, free, service ? money(service.price_minor, th.currency) : "");
    needsReview = true;
    summary = `${name} sent a message — waiting for your reply`;
  }

  await sb.rpc("server_post_assistant2", {
    p_secret: SERVER_SECRET(),
    p_slug: slug,
    p_email: email,
    p_body: reply,
    p_needs_review: needsReview,
    p_summary: summary,
    p_urgent: urgent,
  });

  return NextResponse.json({ reply, forwarded: needsReview, urgent });
}

function fallback(lang: Lang, first: string, free: string[], price: string) {
  const times = free.slice(0, 3).join(", ");
  if (lang === "pl") return `Dziękuję za wiadomość — ${first} odpowie osobiście. ${price ? `Sesja kosztuje ${price}. ` : ""}${times ? `Najbliższe wolne terminy: ${times}.` : ""}`;
  if (lang === "uk") return `Дякую за повідомлення — ${first} відповість особисто. ${price ? `Сесія коштує ${price}. ` : ""}${times ? `Найближчий вільний час: ${times}.` : ""}`;
  return `Thanks for your message — ${first} will reply personally. ${price ? `A session is ${price}. ` : ""}${times ? `Next free times: ${times}.` : ""}`;
}

/** "czw., 8 paź: 09:00, 11:00, 13:00–19:00" — consecutive start times merged into ranges. */
function freeRanges(days: Day[], tz: string, lang: Lang) {
  const hm = (iso: string) => fmtDate(iso, tz, lang, { hour: "2-digit", minute: "2-digit", hour12: false });
  return days
    .map((d) => {
      const free = d.slots.filter((s) => s.free);
      if (!free.length) return null;
      const step = d.slots.length > 1 ? new Date(d.slots[1].start).getTime() - new Date(d.slots[0].start).getTime() : 0;
      const parts: string[] = [];
      let runStart = free[0].start;
      let prev = free[0].start;
      for (let i = 1; i <= free.length; i++) {
        const cur = free[i]?.start;
        if (cur && step && new Date(cur).getTime() - new Date(prev).getTime() === step) {
          prev = cur;
          continue;
        }
        parts.push(runStart === prev ? hm(runStart) : `${hm(runStart)}–${hm(prev)}`);
        if (cur) runStart = prev = cur;
      }
      const label = fmtDate(free[0].start, tz, lang, { weekday: "short", day: "numeric", month: "short" });
      return `- ${label}: ${parts.join(", ")}`;
    })
    .filter(Boolean)
    .join("\n");
}
