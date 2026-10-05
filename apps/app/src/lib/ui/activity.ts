import type { Lang } from "@/lib/i18n";

/**
 * Activity lines are stored in English by the database and server code (one canonical form,
 * easy to search). The dashboard shows them in the therapist's interface language by matching
 * the known shapes below; anything unrecognised (e.g. model-written lines) is shown as stored.
 */

const DAYS: Record<string, Record<Exclude<Lang, "en">, string>> = {
  Mon: { pl: "pon.", uk: "пн" },
  Tue: { pl: "wt.", uk: "вт" },
  Wed: { pl: "śr.", uk: "ср" },
  Thu: { pl: "czw.", uk: "чт" },
  Fri: { pl: "pt.", uk: "пт" },
  Sat: { pl: "sob.", uk: "сб" },
  Sun: { pl: "niedz.", uk: "нд" },
};
const MONTHS: Record<string, Record<Exclude<Lang, "en">, string>> = {
  Jan: { pl: "sty", uk: "січ" },
  Feb: { pl: "lut", uk: "лют" },
  Mar: { pl: "mar", uk: "бер" },
  Apr: { pl: "kwi", uk: "кві" },
  May: { pl: "maj", uk: "тра" },
  Jun: { pl: "cze", uk: "чер" },
  Jul: { pl: "lip", uk: "лип" },
  Aug: { pl: "sie", uk: "сер" },
  Sep: { pl: "wrz", uk: "вер" },
  Oct: { pl: "paź", uk: "жов" },
  Nov: { pl: "lis", uk: "лис" },
  Dec: { pl: "gru", uk: "гру" },
};

/** "Thu 08 Oct 16:00" / "Thu 08 Oct, 16:00" → "czw. 8 paź 16:00" */
function when(s: string, lang: Exclude<Lang, "en">) {
  return s
    .replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g, (d) => DAYS[d][lang])
    .replace(/\b0?(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (_, n, m) => `${n} ${MONTHS[m][lang]}`)
    .replace(",", "");
}

type Rule = [RegExp, Record<Exclude<Lang, "en">, (m: RegExpMatchArray, w: (s: string) => string) => string>];

const RULES: Rule[] = [
  [
    /^(.+) booked (.+?) and prepaid (.+?) \((.+)\)\. Confirmation with the video link sent\.?$/,
    {
      pl: (m, w) => `Nowa rezerwacja: ${m[1]}, ${w(m[2])} — opłacona z góry ${m[3]} (${m[4]}). Potwierdzenie z linkiem wideo wysłane.`,
      uk: (m, w) => `Нове бронювання: ${m[1]}, ${w(m[2])} — оплачено наперед ${m[3]} (${m[4]}). Підтвердження з відеопосиланням надіслано.`,
    },
  ],
  [
    /^(.+) booked a session and prepaid (.+?) \((.+)\)\.?$/,
    {
      pl: (m) => `Nowa rezerwacja: ${m[1]} — opłacona z góry ${m[2]} (${m[3]}).`,
      uk: (m) => `Нове бронювання: ${m[1]} — оплачено наперед ${m[2]} (${m[3]}).`,
    },
  ],
  [
    /^Refunded (.+?) for a session cancelled in the free window\.?$/,
    {
      pl: (m) => `Zwrócono ${m[1]} za sesję odwołaną w bezpłatnym terminie.`,
      uk: (m) => `Повернено ${m[1]} за сесію, скасовану в безкоштовний період.`,
    },
  ],
  [
    /^Client cancelled (.+?) — slot is open again\.?$/,
    {
      pl: (m, w) => `Klient odwołał sesję ${w(m[1])} — termin jest znów wolny.`,
      uk: (m, w) => `Клієнт скасував сесію ${w(m[1])} — час знову вільний.`,
    },
  ],
  [
    /^(.+) wrote to you from their Sessio account\.?$/,
    {
      pl: (m) => `${m[1]}: nowa wiadomość z konta Sessio.`,
      uk: (m) => `${m[1]}: нове повідомлення з акаунта Sessio.`,
    },
  ],
  [
    /^(.+) moved their session from (.+?) to (.+?)\. Calendar and link updated\.?$/,
    {
      pl: (m, w) => `${m[1]}: sesja przeniesiona z ${w(m[2])} na ${w(m[3])}. Kalendarz i link zaktualizowane.`,
      uk: (m, w) => `${m[1]}: сесію перенесено з ${w(m[2])} на ${w(m[3])}. Календар і посилання оновлено.`,
    },
  ],
  [
    /^(.+) sent a message — waiting for your reply\.?$/,
    {
      pl: (m) => `${m[1]}: nowa wiadomość — czeka na Twoją odpowiedź.`,
      uk: (m) => `${m[1]}: нове повідомлення — чекає на вашу відповідь.`,
    },
  ],
  [
    /^Urgent: (.+?) wrote something that may mean they are at risk\. Crisis lines were shared — please read their message now\.?$/,
    {
      pl: (m) => `Pilne: wiadomość od ${m[1]} może oznaczać zagrożenie. Wysłano numery pomocowe — przeczytaj ją teraz.`,
      uk: (m) => `Терміново: повідомлення від ${m[1]} може означати ризик. Надіслано кризові номери — прочитайте його зараз.`,
    },
  ],
  [
    /^Sent (a reminder|\d+ reminders) with the video link for tomorrow: (.+)\.$/,
    {
      pl: (m) => `Wysłano ${m[1] === "a reminder" ? "przypomnienie" : `przypomnienia (${m[1].split(" ")[0]})`} z linkiem wideo na jutro: ${m[2]}.`,
      uk: (m) => `Надіслано ${m[1] === "a reminder" ? "нагадування" : `нагадування (${m[1].split(" ")[0]})`} з відеопосиланням на завтра: ${m[2]}.`,
    },
  ],
  [
    /^Sent (\d+) reminders with video links yesterday for today's sessions\.?$/,
    {
      pl: (m) => `Wczoraj wysłano ${m[1]} przypomnienia z linkami wideo na dzisiejsze sesje.`,
      uk: (m) => `Учора надіслано ${m[1]} нагадування з відеопосиланнями на сьогоднішні сесії.`,
    },
  ],
];

export function activityText(summary: string, lang: Lang): string {
  if (lang === "en") return summary;
  const w = (s: string) => when(s, lang);
  for (const [re, out] of RULES) {
    const m = summary.match(re);
    if (m) return out[lang](m, w);
  }
  return summary;
}
