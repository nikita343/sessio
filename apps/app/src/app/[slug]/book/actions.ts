"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { publicClient } from "@/lib/supabase/server";
import { stripe, PAY_METHODS, type PayMethod } from "@/lib/stripe";
import { startCheckout } from "@/lib/checkout";
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

  let url: string | null = null;
  try {
    url = await startCheckout({
      bookingId: b.booking_id,
      token: b.manage_token,
      method,
      lang,
      email: String(form.get("email")),
      summary: String(form.get("summary") ?? "Session"),
      priceMinor: b.price_minor,
      currency: b.currency,
      slug,
      app,
    });
  } catch (e) {
    console.error("stripe checkout failed", e);
    // release the slot we were holding for this payment
    await sb.rpc("cancel_booking_by_client", { p_id: b.booking_id, p_token: b.manage_token });
    const msg = e instanceof Error ? e.message : "";
    if (/payment method type|not activated|not enabled|invalid.*payment_method_types/i.test(msg))
      return { error: lang === "pl" ? "Ta metoda płatności jest chwilowo niedostępna. Wybierz inną." : lang === "uk" ? "Цей спосіб оплати тимчасово недоступний. Оберіть інший." : "That payment method isn’t available right now. Please choose another." };
    return { error: lang === "pl" ? "Płatność chwilowo niedostępna. Spróbuj ponownie." : lang === "uk" ? "Оплата тимчасово недоступна. Спробуйте ще раз." : "Payments are briefly unavailable. Please try again." };
  }
  redirect(url!);
}
