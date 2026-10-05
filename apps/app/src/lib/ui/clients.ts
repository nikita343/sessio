import type { Lang } from "../i18n";
import { UI_LOCALE } from "../ui-lang";

type Tone = "sage" | "clay" | "stone" | "warn" | "lavender";

/** Format an instant in the therapist's timezone with localized month/day names. */
export function uiDate(iso: string | Date, tz: string, lang: Lang, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(UI_LOCALE[lang], { timeZone: tz, ...opts }).format(new Date(iso));
}

const plFew = (n: number) => n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20);

export const CLIENTS_T: Record<
  Lang,
  {
    metaTitle: string;
    metaClient: string;
    title: string;
    count: (n: number) => string;
    search: string;
    noMatch: string;
    noClients: string;
    emptyBody: string;
    colClient: string;
    colEmail: string;
    colSessions: string;
    colLast: string;
    colNext: string;
    back: string;
    since: (date: string) => string;
    sinceFormat: Intl.DateTimeFormatOptions;
    email: string;
    held: string;
    paidTotal: string;
    signed: string;
    sessions: string;
    noSessions: string;
    online: string;
    inPerson: string;
    priceLine: (price: string, paid: boolean) => string;
    status: Record<string, [string, Tone]>;
    room: string;
    cancel: string;
    record: string;
    finishNote: string;
    writeNote: string;
    noShow: string;
    messages: string;
    noMessages: string;
    assistant: string;
    you: string;
    openInbox: string;
  }
> = {
  pl: {
    metaTitle: "Klienci",
    metaClient: "Karta klienta",
    title: "Klienci",
    count: (n) => `${n} ${n === 1 ? "klient" : "klientów"}`,
    search: "Szukaj po imieniu, nazwisku lub e-mailu",
    noMatch: "Brak wyników wyszukiwania",
    noClients: "Nie masz jeszcze klientów",
    emptyBody: "Klienci pojawią się tutaj, gdy po raz pierwszy zarezerwują sesję lub napiszą do Ciebie.",
    colClient: "Klient",
    colEmail: "E-mail",
    colSessions: "Sesje",
    colLast: "Ostatnia",
    colNext: "Następna",
    back: "← Klienci",
    since: (d) => `klient od ${d}`,
    sinceFormat: { day: "numeric", month: "long", year: "numeric" },
    email: "Napisz e-mail",
    held: "Odbyte sesje",
    paidTotal: "Łącznie opłacono",
    signed: "Podpisane wpisy",
    sessions: "Sesje",
    noSessions: "Brak sesji.",
    online: "Online",
    inPerson: "Stacjonarnie",
    priceLine: (p, paid) => `${p} · ${paid ? "zapłacono" : "do zapłaty"}`,
    status: {
      confirmed: ["Zaplanowana", "sage"],
      completed: ["Odbyta", "stone"],
      no_show: ["Nieobecność", "warn"],
      cancelled: ["Odwołana", "stone"],
      pending_payment: ["Czeka na płatność", "clay"],
    },
    room: "Pokój",
    cancel: "Odwołaj",
    record: "Wpis ✓",
    finishNote: "Dokończ notatkę",
    writeNote: "Napisz notatkę",
    noShow: "Nieobecność",
    messages: "Wiadomości",
    noMessages: "Brak wiadomości.",
    assistant: "Asystent",
    you: "Ty",
    openInbox: "Przejdź do wiadomości →",
  },
  en: {
    metaTitle: "Clients",
    metaClient: "Client",
    title: "Clients",
    count: (n) => `${n} client${n === 1 ? "" : "s"}`,
    search: "Search by name or email",
    noMatch: "No one matches that",
    noClients: "No clients yet",
    emptyBody: "Clients appear here the first time they book or message you.",
    colClient: "Client",
    colEmail: "Email",
    colSessions: "Sessions",
    colLast: "Last",
    colNext: "Next",
    back: "← Clients",
    since: (d) => `client since ${d}`,
    sinceFormat: { month: "short", year: "numeric" },
    email: "Email",
    held: "Sessions held",
    paidTotal: "Paid in total",
    signed: "Signed records",
    sessions: "Sessions",
    noSessions: "No sessions yet.",
    online: "Online",
    inPerson: "In person",
    priceLine: (p, paid) => `${p} ${paid ? "paid" : "unpaid"}`,
    status: {
      confirmed: ["Booked", "sage"],
      completed: ["Held", "stone"],
      no_show: ["No-show", "warn"],
      cancelled: ["Cancelled", "stone"],
      pending_payment: ["Awaiting payment", "clay"],
    },
    room: "Room",
    cancel: "Cancel",
    record: "Record ✓",
    finishNote: "Finish note",
    writeNote: "Write note",
    noShow: "No-show",
    messages: "Messages",
    noMessages: "No messages.",
    assistant: "Assistant",
    you: "You",
    openInbox: "Open inbox →",
  },
  uk: {
    metaTitle: "Клієнти",
    metaClient: "Картка клієнта",
    title: "Клієнти",
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "клієнт" : plFew(n) ? "клієнти" : "клієнтів"}`,
    search: "Пошук за ім’ям або e-mail",
    noMatch: "Нічого не знайдено",
    noClients: "Поки що немає клієнтів",
    emptyBody: "Клієнти з’являться тут, щойно вперше забронюють сесію або напишуть вам.",
    colClient: "Клієнт",
    colEmail: "E-mail",
    colSessions: "Сесії",
    colLast: "Остання",
    colNext: "Наступна",
    back: "← Клієнти",
    since: (d) => `клієнт з ${d}`,
    sinceFormat: { day: "numeric", month: "long", year: "numeric" },
    email: "Написати e-mail",
    held: "Проведені сесії",
    paidTotal: "Усього оплачено",
    signed: "Підписані записи",
    sessions: "Сесії",
    noSessions: "Сесій поки немає.",
    online: "Онлайн",
    inPerson: "Очно",
    priceLine: (p, paid) => `${p} · ${paid ? "оплачено" : "не оплачено"}`,
    status: {
      confirmed: ["Заплановано", "sage"],
      completed: ["Відбулася", "stone"],
      no_show: ["Неявка", "warn"],
      cancelled: ["Скасовано", "stone"],
      pending_payment: ["Очікує оплати", "clay"],
    },
    room: "Кімната",
    cancel: "Скасувати",
    record: "Запис ✓",
    finishNote: "Завершити нотатку",
    writeNote: "Написати нотатку",
    noShow: "Неявка",
    messages: "Повідомлення",
    noMessages: "Повідомлень немає.",
    assistant: "Асистент",
    you: "Ви",
    openInbox: "Відкрити повідомлення →",
  },
};
