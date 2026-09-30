"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { publicClient, SERVER_SECRET } from "@/lib/supabase/server";
import { stripe, PAY_METHODS, type PayMethod } from "@/lib/stripe";
import type { Lang } from "@/lib/i18n";

export type BookState = { error?: string };

export async function bookAndPay(_: BookState, form: FormData): Promise<BookState> {
  const slug = String(form.get("slug"));
  const lang = String(form.get("lang") ?? "en") as Lang;
  const method = (PAY_METHODS.includes(String(form.get("method")) as PayMethod) ? String(form.get("method")) : "blik") as PayMethod;
  if (!form.get("consent")) return { error: lang === "pl" ? "Zaznacz zgodę, aby kontynuować." : lang === "uk" ? "Позначте згоду, щоб продовжити." : "Please tick the box to continue." };

  const sb = publicClient();
  const { data, error } = await sb.rpc("create_booking", {
    p_slug: slug,
    p_service_id: String(form.get("service_id")),
    p_starts_at: String(form.get("start")),
    p_format: String(form.get("format") ?? "online"),
    p_name: String(form.get("name") ?? ""),
    p_email: String(form.get("email") ?? ""),
    p_phone: String(form.get("phone") ?? ""),
    p_note: String(form.get("note") ?? ""),
    p_lang: lang,
  });
  if (error) {
    const m = error.message;
    if (m.includes("slot taken")) return { error: "taken" };
    if (m.includes("name and email")) return { error: "Please add your name and a valid email." };
    return { error: m.includes("too late") ? "That time is too soon to book online." : "Something went wrong. Please try another time." };
  }
  const b = (Array.isArray(data) ? data[0] : data) as { booking_id: string; manage_token: string; price_minor: number; currency: string };
  const app = process.env.NEXT_PUBLIC_APP_URL ?? `https://${(await headers()).get("host")}`;
  const back = `${app}/b/${b.booking_id}?t=${b.manage_token}&lang=${lang}`;

  const s = stripe();
  if (!s) redirect(`/pay/${b.booking_id}?t=${b.manage_token}&m=${method}&lang=${lang}`);

  const session = await s.checkout.sessions.create({
    mode: "payment",
    payment_method_types: [method],
    customer_email: String(form.get("email")),
    locale: lang === "uk" ? "auto" : lang,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: b.currency.toLowerCase(),
          unit_amount: b.price_minor,
          product_data: { name: String(form.get("summary") ?? "Session") },
        },
      },
    ],
    metadata: { booking_id: b.booking_id, method },
    payment_intent_data: { metadata: { booking_id: b.booking_id } },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: `${back}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${app}/${slug}?lang=${lang}`,
  });
  await sb.rpc("server_set_checkout", { p_secret: SERVER_SECRET(), p_id: b.booking_id, p_session: session.id });
  redirect(session.url!);
}
