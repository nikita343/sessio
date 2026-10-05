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
  // indirect (English)
  "want (it all|everything) to (end|stop)",
  "can'?t (go on|do this) (like this|any ?more)",
  "can'?t take (it|this) any ?more",
  "no (point|reason) (in )?(living|going on|being alive)",
  "nothing (left )?to live for",
  "better off (dead|without me)",
  "wish i (was|were)n'?t (here|alive)",
  "wish i (was|were) dead",
  "do ?n'?o?t want to wake up",
  "not worth living",
  "disappear (forever|for good)",
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
  // indirect (Polish, folded)
  "nie widze sensu.{0,30}(zyc|zycia|zyciu|dalej)",
  "nie ma sensu (dalej )?zyc",
  "nie mam po co zyc",
  "mam dosc zycia",
  "chce(,)? zeby (to|wszystko) sie (juz )?skonczy",
  "chcial(a)?bym (zniknac|nie zyc|umrzec)",
  "zniknac na zawsze",
  "(lepiej|lzej) (by bylo |bedzie )?beze mnie",
  "nie chce sie (juz )?(obudzic|budzic)",
  "nie dam (juz )?rady (dluzej )?zyc",
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
  "не бачу сенсу (жити|далі жити|в житті)",
  "немає сенсу жити",
  "хочу зникнути",
  "не хочу прокидатися",
  "краще б мене не було",
  "(всім|усім) (буде )?краще без мене",
  "хочу,? щоб (усе|все) (це )?закінчил",
  // Russian
  "самоуби",
  "не хочу жить",
  "хочу умереть",
  "покончить с собой",
  "покончу с собой",
  "убить себя",
  "убью себя",
  "не вижу смысла жить",
  "хочу исчезнуть",
  "не хочу просыпаться",
  "лучше бы меня не было",
  "всем (будет )?лучше без меня",
];

// entries are folded phrases; some use small regex groups for gendered or optional words
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

/** Which language to answer a client in: the script and words they wrote in, else the page language. */
export function replyLang(text: string, fallback: Lang): Lang {
  if (/[\u0400-\u04FF]/.test(text)) return "uk";
  const t = text.toLowerCase();
  if (/[ąćęłńóśźż]/.test(t) || /(^|\s)(nie|jest|się|czy|mam|chcę|chce|termin|dzień dobry|proszę|dziękuję)(\s|[.,!?]|$)/.test(t)) return "pl";
  if (/(^|\s)(the|is|i|you|my|want|can|do|have|hello|hi|please|thanks)(\s|[.,!?]|$)/.test(t)) return "en";
  return fallback;
}

/** Gender-neutral line telling the client their message reached the therapist. */
export const PASSED_ON: Record<Lang, string> = {
  pl: "Twoja wiadomość jest już u terapeuty.",
  en: "Your message is with your therapist now.",
  uk: "Ваше повідомлення вже в терапевта.",
};
