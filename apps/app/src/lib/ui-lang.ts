import { cookies } from "next/headers";
import type { Lang } from "./i18n";

/**
 * Language for the therapist app (dashboard, calendar, notes…). Same cookie as the client side
 * (`sessio_lang`, set by the language menu); Polish when nothing is chosen.
 */
export async function uiLang(): Promise<Lang> {
  const v = (await cookies()).get("sessio_lang")?.value;
  return v === "en" || v === "uk" || v === "pl" ? v : "pl";
}

/** Pick the dictionary for a language: `const t = pick(DICT, lang)`. */
export function pick<T>(dict: Record<Lang, T>, lang: Lang): T {
  return dict[lang] ?? dict.pl;
}

/** Locale for Intl / date-fns style formatting in the therapist app. */
export const UI_LOCALE: Record<Lang, string> = { pl: "pl-PL", en: "en-GB", uk: "uk-UA" };
