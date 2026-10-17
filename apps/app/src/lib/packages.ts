import type { Lang } from "./i18n";

/** Prepaid session packages: size → discount in percent. A single session stays the default. */
export const PACKAGES = [
  { size: 4, discount: 5 },
  { size: 8, discount: 10 },
  { size: 12, discount: 15 },
] as const;

export type PackageSize = 1 | 4 | 8 | 12;

/** Monthly membership: 4 sessions a month at 10% off, card only (BLIK/Przelewy24 can't charge monthly). */
export const MEMBERSHIP = { sessions: 4, discount: 10 } as const;
export const membershipPrice = (sessionMinor: number) => Math.round(sessionMinor * MEMBERSHIP.sessions * (100 - MEMBERSHIP.discount) / 100);

export function packagePrice(sessionMinor: number, size: PackageSize) {
  if (size === 1) return sessionMinor;
  const p = PACKAGES.find((x) => x.size === size)!;
  return Math.round((sessionMinor * size * (100 - p.discount)) / 100);
}

export function discountFor(size: PackageSize) {
  return size === 1 ? 0 : PACKAGES.find((x) => x.size === size)!.discount;
}

export const PKG_T: Record<
  Lang,
  {
    title: string;
    single: string;
    pack: (n: number) => string;
    perSession: (p: string) => string;
    save: (d: number) => string;
    hint: string;
    credits: (left: number) => string;
    creditsHint: string;
    useCredit: string;
    payInstead: string;
    summary: (n: number, d: number) => string;
    noCredit: string;
    membership: string;
    perMonth: (p: string) => string;
    membershipHint: string;
    membershipSummary: string;
  }
> = {
  uk: {
    title: "Як оплатити",
    single: "Одна сесія",
    pack: (n) => `Пакет ${n} сесій`,
    perSession: (p) => `${p} за сесію`,
    save: (d) => `−${d}%`,
    hint: "Ця сесія — перша з пакета. Наступні бронюєте без оплати, увійшовши в акаунт Sessio.",
    credits: (left) => `У вас ${left} ${left === 1 ? "сесія" : left < 5 ? "сесії" : "сесій"} з пакета`,
    creditsHint: "Ця сесія спишеться з пакета — без оплати.",
    useCredit: "Забронювати з пакета",
    payInstead: "Оплатити окремо",
    summary: (n, d) => `Пакет ${n} сесій (−${d}%)`,
    noCredit: "У пакеті не лишилося сесій. Оберіть оплату.",
    membership: "Абонемент · 4 сесії на місяць",
    perMonth: (p) => `${p} / міс`,
    membershipHint: "Щомісяця 4 сесії зі знижкою 10%. Списується з картки раз на місяць, невикористані сесії переходять далі. Скасувати можна будь-коли — напишіть терапевту.",
    membershipSummary: "Абонемент: 4 сесії на місяць (−10%)",
  },
  pl: {
    title: "Jak zapłacić",
    single: "Jedna sesja",
    pack: (n) => `Pakiet ${n} sesji`,
    perSession: (p) => `${p} za sesję`,
    save: (d) => `−${d}%`,
    hint: "Ta sesja jest pierwszą z pakietu. Kolejne rezerwujesz bez płatności po zalogowaniu do konta Sessio.",
    credits: (left) => `Masz ${left} ${left === 1 ? "sesję" : left < 5 ? "sesje" : "sesji"} z pakietu`,
    creditsHint: "Ta sesja zostanie odliczona z pakietu — bez płatności.",
    useCredit: "Zarezerwuj z pakietu",
    payInstead: "Zapłać osobno",
    summary: (n, d) => `Pakiet ${n} sesji (−${d}%)`,
    noCredit: "W pakiecie nie zostały sesje. Wybierz płatność.",
    membership: "Abonament · 4 sesje miesięcznie",
    perMonth: (p) => `${p} / mies.`,
    membershipHint: "Co miesiąc 4 sesje taniej o 10%. Płatność kartą raz w miesiącu, niewykorzystane sesje przechodzą dalej. Możesz zrezygnować w każdej chwili — napisz do terapeuty.",
    membershipSummary: "Abonament: 4 sesje miesięcznie (−10%)",
  },
  en: {
    title: "How to pay",
    single: "Single session",
    pack: (n) => `${n}-session package`,
    perSession: (p) => `${p} per session`,
    save: (d) => `−${d}%`,
    hint: "This session is the first of the package. Book the rest without paying when signed in to Sessio.",
    credits: (left) => `You have ${left} package ${left === 1 ? "session" : "sessions"} left`,
    creditsHint: "This session comes out of your package — nothing to pay.",
    useCredit: "Book from my package",
    payInstead: "Pay separately",
    summary: (n, d) => `${n}-session package (−${d}%)`,
    noCredit: "No sessions left in your package. Please choose a payment.",
    membership: "Membership · 4 sessions a month",
    perMonth: (p) => `${p} / month`,
    membershipHint: "4 sessions every month at 10% off. Charged to your card monthly; unused sessions roll over. Cancel any time — message your therapist.",
    membershipSummary: "Membership: 4 sessions a month (−10%)",
  },
};
