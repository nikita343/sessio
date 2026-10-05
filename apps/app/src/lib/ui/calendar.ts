import type { Lang } from "../i18n";

type CalendarDict = {
  title: string;
  prevWeek: string;
  thisWeek: string;
  nextWeek: string;
  client: string;
  online: string;
  inPerson: string;
  legend: string;
  // add-session dialog (client component)
  addSession: string;
  addTitle: string;
  close: string;
  clientLabel: string;
  newClient: string;
  name: string;
  email: string;
  date: string;
  time: string;
  where: string;
  whereOnline: string;
  whereInPerson: string;
  alreadyPaid: string;
  adding: string;
  submit: string;
  /** Known server-action errors (English, from lib/booking-actions) → translated text. */
  errors: Record<string, string>;
};

export const CALENDAR_T: Record<Lang, CalendarDict> = {
  pl: {
    title: "Kalendarz",
    prevWeek: "Poprzedni tydzień",
    thisWeek: "Bieżący tydzień",
    nextWeek: "Następny tydzień",
    client: "Klient",
    online: "online",
    inPerson: "stacjonarnie",
    legend: "Zacienione godziny to czas, w którym klienci mogą rezerwować. Zielone sesje odbywają się online, ceglaste — stacjonarnie.",
    addSession: "+ Dodaj sesję",
    addTitle: "Dodaj sesję",
    close: "Zamknij",
    clientLabel: "Klient",
    newClient: "Nowy klient…",
    name: "Imię i nazwisko",
    email: "E-mail",
    date: "Data",
    time: "Godzina",
    where: "Forma",
    whereOnline: "Online — prywatny pokój wideo",
    whereInPerson: "Stacjonarnie",
    alreadyPaid: "Już opłacona (gotówką lub przelewem)",
    adding: "Dodawanie…",
    submit: "Dodaj sesję",
    errors: {
      "Set up your session on the Booking page first.": "Najpierw skonfiguruj sesję na stronie rezerwacji.",
      "Pick a client or add a name and email.": "Wybierz klienta albo podaj imię i e-mail.",
      "Could not save the client.": "Nie udało się zapisać klienta.",
      "Pick a date and time.": "Wybierz datę i godzinę.",
      "You already have a session at that time.": "Masz już sesję o tej porze.",
    },
  },
  en: {
    title: "Calendar",
    prevWeek: "Previous week",
    thisWeek: "This week",
    nextWeek: "Next week",
    client: "Client",
    online: "online",
    inPerson: "in person",
    legend: "Shaded hours are when clients can book. Green sessions are online, clay ones in person.",
    addSession: "+ Add session",
    addTitle: "Add a session",
    close: "Close",
    clientLabel: "Client",
    newClient: "New client…",
    name: "Name",
    email: "Email",
    date: "Date",
    time: "Time",
    where: "Where",
    whereOnline: "Online — private video room",
    whereInPerson: "In person",
    alreadyPaid: "Already paid (cash or transfer)",
    adding: "Adding…",
    submit: "Add session",
    errors: {},
  },
  uk: {
    title: "Календар",
    prevWeek: "Попередній тиждень",
    thisWeek: "Цей тиждень",
    nextWeek: "Наступний тиждень",
    client: "Клієнт",
    online: "онлайн",
    inPerson: "очно",
    legend: "Затінені години — час, коли клієнти можуть бронювати. Зелені сесії — онлайн, теракотові — очно.",
    addSession: "+ Додати сесію",
    addTitle: "Додати сесію",
    close: "Закрити",
    clientLabel: "Клієнт",
    newClient: "Новий клієнт…",
    name: "Ім’я",
    email: "Email",
    date: "Дата",
    time: "Час",
    where: "Формат",
    whereOnline: "Онлайн — приватна відеокімната",
    whereInPerson: "Очно",
    alreadyPaid: "Уже оплачено (готівкою або переказом)",
    adding: "Додаємо…",
    submit: "Додати сесію",
    errors: {
      "Set up your session on the Booking page first.": "Спершу налаштуйте сесію на сторінці бронювання.",
      "Pick a client or add a name and email.": "Оберіть клієнта або вкажіть ім’я та email.",
      "Could not save the client.": "Не вдалося зберегти клієнта.",
      "Pick a date and time.": "Оберіть дату й час.",
      "You already have a session at that time.": "У Вас уже є сесія на цей час.",
    },
  },
};
