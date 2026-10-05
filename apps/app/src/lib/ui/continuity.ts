import type { Lang } from "@/lib/i18n";

type C = {
  sessionsTogether: (n: number) => string;
  firstAhead: string;
  standing: (day: string, time: string) => string;
  standingHint: string;
  nextInStanding: string;
  otherTime: string;
  noStanding: string;
  sessionNo: (n: number) => string;
  findTitle: string;
  findBody: string;
  findCta: string;
  findPoints: string[];
  haveLink: string;
  findMore: string;
  weekdays: string[]; // Monday-first, plural "on Thursdays"
};

export const CONT_T: Record<Lang, C> = {
  pl: {
    sessionsTogether: (n) => `${n} ${n === 1 ? "sesja" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "sesje" : "sesji"} razem`,
    firstAhead: "Pierwsza sesja przed Tobą",
    standing: (d, t) => `Twój stały termin: ${d}, ${t}`,
    standingHint: "Zarezerwuj kolejną sesję w tym samym czasie jednym kliknięciem. Płacisz za każdą osobno — bez subskrypcji.",
    nextInStanding: "Wolne w Twoim stałym terminie",
    otherTime: "Inny termin",
    noStanding: "W Twoim stałym terminie nie ma teraz wolnych miejsc — wybierz inny.",
    sessionNo: (n) => `Sesja nr ${n}`,
    findTitle: "Znajdź swojego terapeutę",
    findBody: "Odpowiedz na sześć krótkich pytań, a pokażemy specjalistów dopasowanych do Twoich potrzeb, języka, budżetu i godzin.",
    findCta: "Zacznij — 1 minuta",
    findPoints: ["Najbliższe wolne terminy od razu", "Pytanie do terapeuty przed rezerwacją", "Rezerwacja do 8 tygodni naprzód, zmiana do 24 h przed"],
    haveLink: "Masz link od swojego terapeuty? Zarezerwuj przez niego tym samym adresem e-mail — sesja pojawi się tutaj.",
    findMore: "Szukasz innego specjalisty?",
    weekdays: ["poniedziałki", "wtorki", "środy", "czwartki", "piątki", "soboty", "niedziele"],
  },
  en: {
    sessionsTogether: (n) => `${n} session${n === 1 ? "" : "s"} together`,
    firstAhead: "Your first session is ahead",
    standing: (d, t) => `Your usual time: ${d}, ${t}`,
    standingHint: "Book the next session at the same time in one tap. You pay for each one separately — no subscription.",
    nextInStanding: "Free at your usual time",
    otherTime: "Another time",
    noStanding: "Your usual time isn’t free right now — pick another.",
    sessionNo: (n) => `Session ${n}`,
    findTitle: "Find your therapist",
    findBody: "Answer six short questions and we’ll show specialists who fit your needs, language, budget and hours.",
    findCta: "Start — 1 minute",
    findPoints: ["The next free times straight away", "Ask the therapist a question before booking", "Book up to 8 weeks ahead, change up to 24 h before"],
    haveLink: "Have your therapist’s link? Book through it with this email — the session will appear here.",
    findMore: "Looking for another specialist?",
    weekdays: ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"],
  },
  uk: {
    sessionsTogether: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "сесія" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "сесії" : "сесій"} разом`,
    firstAhead: "Перша сесія попереду",
    standing: (d, t) => `Ваш постійний час: по ${d}, ${t}`,
    standingHint: "Забронюйте наступну сесію на той самий час одним дотиком. Оплата за кожну окремо — без підписки.",
    nextInStanding: "Вільно у ваш постійний час",
    otherTime: "Інший час",
    noStanding: "Ваш постійний час зараз зайнятий — оберіть інший.",
    sessionNo: (n) => `Сесія №${n}`,
    findTitle: "Знайдіть свого терапевта",
    findBody: "Дайте відповідь на шість коротких запитань, і ми покажемо фахівців, які підходять за потребами, мовою, бюджетом і годинами.",
    findCta: "Почати — 1 хвилина",
    findPoints: ["Найближчий вільний час одразу", "Запитання терапевту до бронювання", "Бронювання до 8 тижнів наперед, зміна до 24 год"],
    haveLink: "Маєте посилання від свого терапевта? Бронюйте через нього з цією адресою — сесія з’явиться тут.",
    findMore: "Шукаєте іншого фахівця?",
    weekdays: ["понеділках", "вівторках", "середах", "четвергах", "п’ятницях", "суботах", "неділях"],
  },
};
