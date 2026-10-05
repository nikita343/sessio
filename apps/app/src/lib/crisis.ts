/**
 * Crisis detection for client messages (booking-page assistant and the client portal).
 * Deliberately broad and diacritic-insensitive: a false positive costs a therapist one extra read;
 * a miss costs far more. It never replaces the therapist — it shows help lines and flags the message.
 */
import type { Lang } from "./i18n";

function fold(s: string) {
  return s
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`]/g, "'")
    .replace(/\s+/g, " ");
}

const RAW: string[] = [
  // English
  "suicid",
  "kill myself",
  "killing myself",
  "kill my self",
  "end my life",
  "ending my life",
  "end it all",
  "take my own life",
  "take my life",
  "don't want to live",
  "dont want to live",
  "do not want to live",
  "don't want to be alive",
  "dont want to be alive",
  "want to die",
  "wanna die",
  "better off dead",
  "no reason to live",
  "self harm",
  "self-harm",
  "selfharm",
  "hurt myself",
  "hurting myself",
  "cut myself",
  "cutting myself",
  "overdose",
  // Polish (folded: no diacritics)
  "samob",
  "zabic sie",
  "zabije sie",
  "zabijam sie",
  "skonczyc ze soba",
  "skoncze ze soba",
  "skonczyc z soba",
  "odebrac sobie zycie",
  "odbiore sobie zycie",
  "nie chce zyc",
  "nie chce juz zyc",
  "nie chce dalej zyc",
  "chce umrzec",
  "wolal(a)? bym nie zyc",
  "nie ma sensu zyc",
  "zrobic sobie krzywde",
  "zrobie sobie krzywde",
  "robie sobie krzywde",
  "okalecz",
  "tne sie",
  "ciac sie",
  "ciecie sie",
  "przedawkow",
  // Ukrainian
  "самогуб",
  "не хочу жити",
  "не хочу більше жити",
  "хочу померти",
  "вбити себе",
  "вб'ю себе",
  "вбю себе",
  "покінчити з собою",
  "покінчу з собою",
  "заподіяти собі шкоду",
  "ріжу себе",
  // Russian
  "самоуби",
  "не хочу жить",
  "хочу умереть",
  "покончить с собой",
  "покончу с собой",
  "убить себя",
  "убью себя",
];

// entries are plain phrases (a few use "(a)?" for gendered Polish forms)
const PATTERNS = RAW.map((p) => new RegExp(fold(p)));

export function isCrisis(text: string) {
  const t = fold(text);
  return PATTERNS.some((re) => re.test(t));
}

export const CRISIS_HELP: Record<Lang, string> = {
  en: "If you are in danger or thinking about ending your life, please call 112 now, or the free 24/7 support line 116 123 (adults) / 116 111 (young people). You don't have to wait for a session.",
  pl: "Jeśli jesteś w niebezpieczeństwie lub myślisz o odebraniu sobie życia, zadzwoń teraz pod 112 albo na bezpłatny, całodobowy telefon wsparcia 116 123 (dorośli) / 116 111 (młodzież). Nie musisz czekać na sesję.",
  uk: "Якщо ви в небезпеці або думаєте про самогубство, будь ласка, зателефонуйте 112 зараз або на безкоштовну цілодобову лінію підтримки 116 123 (дорослі) / 116 111 (молодь). Не потрібно чекати на сесію.",
};
