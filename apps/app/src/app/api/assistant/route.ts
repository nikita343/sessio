import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import { loadPublic } from "@/lib/public";
import { publicClient, SERVER_SECRET } from "@/lib/supabase/server";
import { aiAvailable, FAST_MODEL, model } from "@/lib/ai";
import { fmtDate, type Lang } from "@/lib/i18n";
import { money, LANGS } from "@/lib/format";
import { CRISIS_HELP, isCrisis } from "@/lib/crisis";

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
  const { slug, name, email, message, lang } = parsed.data;
  const data = await loadPublic(slug);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { therapist: th, service, days } = data;

  const sb = publicClient();
  const { error: postErr } = await sb.rpc("post_client_message", { p_slug: slug, p_name: name, p_email: email, p_body: message });
  if (postErr) return NextResponse.json({ error: "Could not send. Please try again." }, { status: 500 });

  const free = days
    .flatMap((d) => d.slots.filter((s) => s.free))
    .slice(0, 8)
    .map((s) => fmtDate(s.start, th.timezone, lang, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }));
  const first = th.full_name.split(" ")[0];

  let reply: string;
  let needsReview = false;
  let summary: string;

  if (isCrisis(message)) {
    reply = CRISIS_HELP[lang] + (lang === "pl" ? ` Przekazałem Twoją wiadomość ${first}.` : lang === "uk" ? ` Я передав ваше повідомлення: ${first}.` : ` I've passed your message to ${first}.`);
    needsReview = true;
    summary = `Urgent: ${name} wrote something that may mean they are at risk. Crisis lines were shared — please read their message.`;
  } else if (aiAvailable()) {
    try {
      const { output } = await generateText({
        model: model(FAST_MODEL),
        output: Output.object({
          schema: z.object({
            reply: z.string().describe("The answer to the client, in the client's language, 1–4 short sentences, warm and plain."),
            needs_review: z.boolean().describe("true if the therapist must personally handle this (clinical/personal content, requests for exceptions, complaints, refunds, anything you cannot answer from the facts)."),
            summary: z.string().describe("One line for the therapist's activity feed, in English, e.g. 'Answered Ola's question about evening times'."),
          }),
        }),
        system: `You are the booking assistant on ${th.full_name}'s Sessio page (a ${th.title || "therapist"} in ${th.city || "Poland"}).
You handle admin only: times, prices, formats, languages, cancellation, how online sessions work, how to pay.
You NEVER give clinical advice, diagnoses, or opinions on the client's situation, and you never claim to be the therapist.
If the client shares anything personal or clinical, thank them briefly, say ${first} will read it personally, and set needs_review=true.
Answer in ${lang === "pl" ? "Polish" : lang === "uk" ? "Ukrainian" : "English"}. Keep it short. Don't invent facts.

Facts:
- Session: ${service ? `${service.name}, ${service.duration_min} min, ${money(service.price_minor, th.currency)}, prepaid when booking (BLIK, card, Przelewy24)` : "not set"}
- Formats: ${th.formats.map((f) => (f === "online" ? "online in a private video room (nothing recorded)" : `in person${th.address ? ` at ${th.address}` : ""}`)).join("; ")}
- Languages: ${th.languages.map((l) => LANGS[l] ?? l).join(", ")}
- Free cancellation up to ${th.cancellation_hours} h before; later cancellations are not refunded.
- Next free times (${th.timezone}): ${free.join("; ") || "none in the next 3 weeks"}
- To book: pick a time on this page and pay; the video link arrives by email.
- Invoices: available on request — set needs_review=true so ${first} can issue it.`,
        prompt: `Client ${name} <${email}> writes:\n"""${message}"""`,
      });
      reply = output.reply;
      needsReview = output.needs_review;
      summary = output.summary;
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

  await sb.rpc("server_post_assistant", {
    p_secret: SERVER_SECRET(),
    p_slug: slug,
    p_email: email,
    p_body: reply,
    p_needs_review: needsReview,
    p_summary: summary,
  });

  return NextResponse.json({ reply, forwarded: needsReview });
}

function fallback(lang: Lang, first: string, free: string[], price: string) {
  const times = free.slice(0, 3).join(", ");
  if (lang === "pl") return `Dziękuję za wiadomość — ${first} odpowie osobiście. ${price ? `Sesja kosztuje ${price}. ` : ""}${times ? `Najbliższe wolne terminy: ${times}.` : ""}`;
  if (lang === "uk") return `Дякую за повідомлення — ${first} відповість особисто. ${price ? `Сесія коштує ${price}. ` : ""}${times ? `Найближчий вільний час: ${times}.` : ""}`;
  return `Thanks for your message — ${first} will reply personally. ${price ? `A session is ${price}. ` : ""}${times ? `Next free times: ${times}.` : ""}`;
}
