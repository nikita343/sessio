import type { Lang } from "../i18n";

/** Slavic plural: 1 → one, 2–4 (not 12–14) → few, everything else → many. Works for Polish and Ukrainian. */
function slavic(n: number, one: string, few: string, many: string, uaOne = false) {
  const m10 = n % 10;
  const m100 = n % 100;
  // Ukrainian uses the "one" form for 21, 31, 101…; Polish only for exactly 1
  if (uaOne ? m10 === 1 && m100 !== 11 : n === 1) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

type DashboardDict = {
  title: string;
  greeting: (hour: number) => string;
  welcome: string;
  openMyPage: string;
  copyBookingLink: string;
  addSession: string;
  statToday: string;
  statWeek: string;
  statPaidMonth: string;
  statNoShows: string;
  sessions: (n: number) => string;
  todaySplit: (online: number, inPerson: number) => string;
  quietDay: string;
  slotsLeft: (n: number) => string;
  allPrepaid: string;
  sincePrepayment: string;
  today: string;
  comingUp: string;
  viewCalendar: string;
  emptyTitle: string;
  emptyBody: string;
  client: string;
  firstSession: string;
  sessionN: (n: number) => string;
  online: string;
  inPerson: string;
  noShow: string;
  paid: string;
  unpaid: string;
  join: string;
  signed: string;
  noteReady: string;
  writeNote: string;
  details: string;
  handledForYou: string;
  handledEmpty: string;
  urgent: string;
  needsOk: string;
  reviewReply: string;
  privacy: string;
};

export const DASHBOARD_T: Record<Lang, DashboardDict> = {
  pl: {
    title: "Dziś",
    greeting: (h) => (h < 18 ? "Dzień dobry" : "Dobry wieczór"),
    welcome: "Twoja strona rezerwacji już działa. Udostępnij link klientom — zarezerwują i opłacą sesję w niecałą minutę.",
    openMyPage: "Otwórz moją stronę",
    copyBookingLink: "Kopiuj link do rezerwacji",
    addSession: "+ Dodaj sesję",
    statToday: "Dziś",
    statWeek: "W tym tygodniu",
    statPaidMonth: "Wpłaty w tym miesiącu",
    statNoShows: "Nieobecności",
    sessions: (n) => `${n} ${slavic(n, "sesja", "sesje", "sesji")}`,
    todaySplit: (o, p) => `${o} online · ${p} stacjonarnie`,
    quietDay: "spokojny dzień",
    slotsLeft: (n) => `${n} ${slavic(n, "wolny termin", "wolne terminy", "wolnych terminów")}`,
    allPrepaid: "wszystko z góry, zero ponagleń",
    sincePrepayment: "od wprowadzenia przedpłat",
    today: "Dziś",
    comingUp: "Najbliższe sesje",
    viewCalendar: "Zobacz kalendarz →",
    emptyTitle: "Nie masz jeszcze żadnych sesji",
    emptyBody: "Udostępnij swój link do rezerwacji. Gdy klient zarezerwuje i opłaci sesję, pojawi się ona tutaj razem z pokojem wideo.",
    client: "Klient",
    firstSession: "Pierwsza sesja",
    sessionN: (n) => `Sesja ${n}`,
    online: "online",
    inPerson: "stacjonarnie",
    noShow: "Nieobecność",
    paid: "Opłacona",
    unpaid: "Nieopłacona",
    join: "Dołącz",
    signed: "Podpisana",
    noteReady: "Notatka gotowa",
    writeNote: "Napisz notatkę",
    details: "Szczegóły",
    handledForYou: "Załatwione za Ciebie",
    handledEmpty: "Gdy klienci rezerwują, płacą, odwołują sesje lub o coś pytają, asystent zajmuje się formalnościami i pokazuje je tutaj.",
    urgent: "Pilne · możliwe ryzyko",
    needsOk: "Wymaga Twojej decyzji",
    reviewReply: "Sprawdź i odpowiedz",
    privacy: "Asystent widzi rezerwacje, płatności i wiadomości — nigdy to, co dzieje się na sesjach.",
  },
  en: {
    title: "Today",
    greeting: (h) => (h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"),
    welcome: "Your booking page is live. Share the link with clients — they can book and pay in under a minute.",
    openMyPage: "Open my page",
    copyBookingLink: "Copy booking link",
    addSession: "+ Add session",
    statToday: "Today",
    statWeek: "This week",
    statPaidMonth: "Paid this month",
    statNoShows: "No-shows",
    sessions: (n) => `${n} session${n === 1 ? "" : "s"}`,
    todaySplit: (o, p) => `${o} online · ${p} in person`,
    quietDay: "a quiet day",
    slotsLeft: (n) => `${n} slot${n === 1 ? "" : "s"} left`,
    allPrepaid: "all prepaid, 0 chasing",
    sincePrepayment: "since prepayment",
    today: "Today",
    comingUp: "Coming up",
    viewCalendar: "View calendar →",
    emptyTitle: "No sessions booked yet",
    emptyBody: "Share your booking link. When a client books and pays, the session appears here with its video room.",
    client: "Client",
    firstSession: "First session",
    sessionN: (n) => `Session ${n}`,
    online: "online",
    inPerson: "in person",
    noShow: "No-show",
    paid: "Paid",
    unpaid: "Unpaid",
    join: "Join",
    signed: "Signed",
    noteReady: "Note ready",
    writeNote: "Write note",
    details: "Details",
    handledForYou: "Handled for you",
    handledEmpty: "When clients book, pay, cancel or ask questions, the assistant handles the admin and lists it here.",
    urgent: "Urgent · possible risk",
    needsOk: "Needs your OK",
    reviewReply: "Review & reply",
    privacy: "The assistant sees bookings, payments and messages — never what is said in sessions.",
  },
  uk: {
    title: "Сьогодні",
    greeting: (h) => (h < 12 ? "Доброго ранку" : h < 18 ? "Добрий день" : "Добрий вечір"),
    welcome: "Ваша сторінка бронювання вже працює. Поділіться посиланням із клієнтами — вони забронюють і оплатять сесію менш ніж за хвилину.",
    openMyPage: "Відкрити мою сторінку",
    copyBookingLink: "Копіювати посилання",
    addSession: "+ Додати сесію",
    statToday: "Сьогодні",
    statWeek: "Цього тижня",
    statPaidMonth: "Оплати цього місяця",
    statNoShows: "Неявки",
    sessions: (n) => `${n} ${slavic(n, "сесія", "сесії", "сесій", true)}`,
    todaySplit: (o, p) => `${o} онлайн · ${p} очно`,
    quietDay: "спокійний день",
    slotsLeft: (n) => `${n} ${slavic(n, "вільне вікно", "вільні вікна", "вільних вікон", true)}`,
    allPrepaid: "усе передоплачено, без нагадувань",
    sincePrepayment: "відколи діє передоплата",
    today: "Сьогодні",
    comingUp: "Найближчі сесії",
    viewCalendar: "Переглянути календар →",
    emptyTitle: "Ще немає заброньованих сесій",
    emptyBody: "Поділіться посиланням для бронювання. Коли клієнт забронює й оплатить сесію, вона з’явиться тут разом із відеокімнатою.",
    client: "Клієнт",
    firstSession: "Перша сесія",
    sessionN: (n) => `Сесія ${n}`,
    online: "онлайн",
    inPerson: "очно",
    noShow: "Неявка",
    paid: "Оплачено",
    unpaid: "Не оплачено",
    join: "Приєднатися",
    signed: "Підписано",
    noteReady: "Нотатка готова",
    writeNote: "Написати нотатку",
    details: "Деталі",
    handledForYou: "Зроблено за Вас",
    handledEmpty: "Коли клієнти бронюють, оплачують, скасовують сесії чи ставлять запитання, асистент бере адмінроботу на себе й показує її тут.",
    urgent: "Терміново · можливий ризик",
    needsOk: "Потребує Вашого рішення",
    reviewReply: "Переглянути й відповісти",
    privacy: "Асистент бачить бронювання, оплати й повідомлення — але ніколи не те, що відбувається на сесіях.",
  },
};
