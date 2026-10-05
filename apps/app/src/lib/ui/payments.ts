import type { Lang } from "../i18n";

type PaymentsDict = {
  title: string;
  thisMonth: string;
  allTime: string;
  payouts: string;
  connected: string;
  finishSetup: string;
  notConnected: string;
  connectedBody: string;
  startedBody: string;
  notConnectedBody: string;
  methods: string;
  demo: string;
  openStripe: string;
  continueSetup: string;
  connectStripe: string;
  testMode: string;
  emptyTitle: string;
  emptyBody: string;
  session: (date: string) => string;
  testPayment: string;
  markedPaid: string;
  refunded: string;
  cancelledRefundDue: string;
  paid: string;
};

export const PAYMENTS_T: Record<Lang, PaymentsDict> = {
  pl: {
    title: "Płatności",
    thisMonth: "W tym miesiącu",
    allTime: "Łącznie",
    payouts: "Wypłaty",
    connected: "Połączono",
    finishSetup: "Dokończ konfigurację",
    notConnected: "Nie połączono",
    connectedBody: "Klienci płacą na Twoje własne konto Stripe, a wypłaty trafiają na Twoje konto bankowe.",
    startedBody: "Stripe potrzebuje jeszcze kilku informacji, zanim zaczniesz przyjmować płatności.",
    notConnectedBody: "Połącz swoje konto Stripe, aby klienci płacili bezpośrednio Tobie. Do tego czasu Twoja strona rezerwacji nie przyjmie płatnych rezerwacji.",
    methods: "BLIK, karta i Przelewy24. Sessio nie pobiera prowizji — obowiązuje tylko standardowa opłata Stripe.",
    demo: "Gabinet demo: płatności trafiają na testowe konto Stripe należące do Sessio. Twój własny gabinet podłącza tutaj swoje konto Stripe.",
    openStripe: "Otwórz panel Stripe ↗",
    continueSetup: "Kontynuuj konfigurację Stripe",
    connectStripe: "Połącz ze Stripe",
    testMode: "Dopóki nie zostaną dodane klucze Stripe, płatności działają na wbudowanym ekranie testowym.",
    emptyTitle: "Nie ma jeszcze płatności",
    emptyBody: "Klienci płacą z góry przy rezerwacji. Płatności pojawiają się tutaj i na Twoim koncie Stripe.",
    session: (d) => `Sesja ${d}`,
    testPayment: "płatność testowa",
    markedPaid: "oznaczona jako opłacona",
    refunded: "Zwrócona",
    cancelledRefundDue: "Odwołana · do zwrotu",
    paid: "Opłacona",
  },
  en: {
    title: "Payments",
    thisMonth: "This month",
    allTime: "All time",
    payouts: "Payouts",
    connected: "Connected",
    finishSetup: "Finish setup",
    notConnected: "Not connected",
    connectedBody: "Clients pay into your own Stripe account; payouts go to your bank.",
    startedBody: "Stripe needs a few more details before you can take payments.",
    notConnectedBody: "Connect your Stripe account so clients pay you directly. Until then, your booking page can’t take paid bookings.",
    methods: "BLIK, card and Przelewy24. Sessio takes 0% commission; Stripe’s own fee applies.",
    demo: "Demo practice: payments go to Sessio’s Stripe test account. Your own practice connects its own Stripe here.",
    openStripe: "Open Stripe dashboard ↗",
    continueSetup: "Continue Stripe setup",
    connectStripe: "Connect Stripe",
    testMode: "Payments run on the built-in test screen until Stripe keys are added.",
    emptyTitle: "No payments yet",
    emptyBody: "Clients prepay when they book. Payments land here and in your own Stripe account.",
    session: (d) => `Session ${d}`,
    testPayment: "test payment",
    markedPaid: "marked paid",
    refunded: "Refunded",
    cancelledRefundDue: "Cancelled · refund due",
    paid: "paid",
  },
  uk: {
    title: "Оплати",
    thisMonth: "Цього місяця",
    allTime: "За весь час",
    payouts: "Виплати",
    connected: "Підключено",
    finishSetup: "Завершіть налаштування",
    notConnected: "Не підключено",
    connectedBody: "Клієнти платять на Ваш власний акаунт Stripe, а виплати надходять на Ваш банківський рахунок.",
    startedBody: "Stripe потребує ще кількох даних, перш ніж Ви зможете приймати оплати.",
    notConnectedBody: "Підключіть свій акаунт Stripe, щоб клієнти платили Вам напряму. Доти Ваша сторінка бронювання не прийматиме платних бронювань.",
    methods: "BLIK, картка та Przelewy24. Sessio не бере комісії — діє лише стандартна комісія Stripe.",
    demo: "Демо-практика: оплати надходять на тестовий акаунт Stripe від Sessio. Ваша власна практика підключає тут свій Stripe.",
    openStripe: "Відкрити панель Stripe ↗",
    continueSetup: "Продовжити налаштування Stripe",
    connectStripe: "Підключити Stripe",
    testMode: "Поки не додано ключі Stripe, оплати проходять через вбудований тестовий екран.",
    emptyTitle: "Оплат ще немає",
    emptyBody: "Клієнти передоплачують під час бронювання. Оплати з’являються тут і на Вашому акаунті Stripe.",
    session: (d) => `Сесія ${d}`,
    testPayment: "тестова оплата",
    markedPaid: "позначено як оплачене",
    refunded: "Повернено",
    cancelledRefundDue: "Скасовано · потрібне повернення",
    paid: "Оплачено",
  },
};
