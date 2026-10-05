import type { Lang } from "../i18n";

export const NAV_T: Record<Lang, { today: string; calendar: string; clients: string; notes: string; inbox: string; payments: string; bookingPage: string; settings: string; sounds: string; soundsOn: string; soundsOff: string }> = {
  pl: { today: "Dziś", calendar: "Kalendarz", clients: "Klienci", notes: "Notatki", inbox: "Wiadomości", payments: "Płatności", bookingPage: "Strona rezerwacji", settings: "Ustawienia", sounds: "Dźwięki", soundsOn: "Dźwięki włączone", soundsOff: "Dźwięki wyłączone" },
  en: { today: "Today", calendar: "Calendar", clients: "Clients", notes: "Notes", inbox: "Inbox", payments: "Payments", bookingPage: "Booking page", settings: "Settings", sounds: "Sounds", soundsOn: "Sounds on", soundsOff: "Sounds off" },
  uk: { today: "Сьогодні", calendar: "Календар", clients: "Клієнти", notes: "Нотатки", inbox: "Повідомлення", payments: "Оплати", bookingPage: "Сторінка бронювання", settings: "Налаштування", sounds: "Звуки", soundsOn: "Звуки увімкнено", soundsOff: "Звуки вимкнено" },
};
