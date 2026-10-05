import type { Lang } from "../i18n";
import { LANG_NAMES } from "../profile";

/** A spoken language's name in the UI language, capitalised for chips and captions ("Polski", "Українська"). */
export function langLabel(code: string, lang: Lang) {
  const n = LANG_NAMES[code]?.[lang];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : code;
}

/* ---------- Booking page (server) ---------- */

export const BOOKING_T: Record<Lang, { metaTitle: string; title: string; copyLink: string; openPage: string }> = {
  pl: { metaTitle: "Strona rezerwacji", title: "Strona rezerwacji", copyLink: "Kopiuj link", openPage: "Otwórz stronę ↗" },
  en: { metaTitle: "Booking page", title: "Booking page", copyLink: "Copy link", openPage: "Open page ↗" },
  uk: { metaTitle: "Сторінка бронювання", title: "Сторінка бронювання", copyLink: "Копіювати посилання", openPage: "Відкрити сторінку ↗" },
};

/* ---------- Copy link button (client) ---------- */

export const COPY_T: Record<Lang, { copyBooking: string; copied: string }> = {
  pl: { copyBooking: "Kopiuj link do rezerwacji", copied: "Skopiowano ✓" },
  en: { copyBooking: "Copy booking link", copied: "Copied ✓" },
  uk: { copyBooking: "Копіювати посилання для бронювання", copied: "Скопійовано ✓" },
};

/* ---------- Onboarding (server) ---------- */

export const ONBOARDING_T: Record<Lang, { metaTitle: string; step: string; title: string; body: string }> = {
  pl: {
    metaTitle: "Skonfiguruj swoją praktykę",
    step: "Krok 1 z 1",
    title: "Skonfiguruj swoją stronę rezerwacji",
    body: "Napisz klientom, kim jesteś, ile kosztuje sesja i kiedy pracujesz. Wszystko to możesz później zmienić.",
  },
  en: {
    metaTitle: "Set up your practice",
    step: "Step 1 of 1",
    title: "Set up your booking page",
    body: "Tell clients who you are, what a session costs and when you work. You can change all of this later.",
  },
  uk: {
    metaTitle: "Налаштуйте свою практику",
    step: "Крок 1 з 1",
    title: "Налаштуйте свою сторінку бронювання",
    body: "Розкажіть клієнтам, хто ви, скільки коштує сесія і коли ви працюєте. Усе це можна змінити пізніше.",
  },
};

/* ---------- Practice form (client) ---------- */

export const PRACTICE_T: Record<
  Lang,
  {
    days: string[];
    dayStart: (d: string) => string;
    dayEnd: (d: string) => string;
    aboutTitle: string;
    aboutBody: string;
    fullName: string;
    yourLink: string;
    slugPlaceholder: string;
    title: string;
    titleHint: string;
    titlePlaceholder: string;
    city: string;
    cityPlaceholder: string;
    bio: string;
    bioHint: string;
    bioPlaceholder: string;
    languages: string;
    sessions: string;
    online: string;
    inPerson: string;
    address: string;
    sessionTitle: string;
    sessionBody: string;
    name: string;
    defaultService: string;
    price: string;
    length: string;
    minutes: (n: number) => string;
    hoursTitle: string;
    hoursBody: string;
    notWorking: string;
    saved: string;
    goesLive: string;
    saving: string;
    publish: string;
    saveChanges: string;
  }
> = {
  pl: {
    days: ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"],
    dayStart: (d) => `${d} – początek`,
    dayEnd: (d) => `${d} – koniec`,
    aboutTitle: "O Tobie",
    aboutBody: "To widzą klienci na Twojej stronie rezerwacji.",
    fullName: "Imię i nazwisko",
    yourLink: "Twój link",
    slugPlaceholder: "twoje-imie",
    title: "Tytuł zawodowy",
    titleHint: "Na przykład: Psycholog · CBT",
    titlePlaceholder: "Psycholog · CBT",
    city: "Miasto",
    cityPlaceholder: "Warszawa",
    bio: "Kilka słów dla klientów",
    bioHint: "Z kim i jak pracujesz. Wystarczą dwa, trzy zdania.",
    bioPlaceholder: "Pracuję z osobami doświadczającymi lęku, wypalenia i trudnych zmian życiowych…",
    languages: "Języki",
    sessions: "Sesje",
    online: "Online — prywatny pokój wideo",
    inPerson: "Stacjonarnie",
    address: "Adres gabinetu",
    sessionTitle: "Twoja sesja",
    sessionBody: "Klienci płacą z góry przy rezerwacji. Pieniądze trafiają bezpośrednio na Twoje konto.",
    name: "Nazwa",
    defaultService: "Sesja indywidualna",
    price: "Cena (zł)",
    length: "Czas trwania",
    minutes: (n) => `${n} ${n === 1 ? "minuta" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "minuty" : "minut"}`,
    hoursTitle: "Kiedy pracujesz",
    hoursBody: "Klienci mogą wybierać terminy tylko w tych godzinach. Godziny podajesz w czasie polskim.",
    notWorking: "Wolne",
    saved: "Zapisano. Twoja strona jest aktualna.",
    goesLive: "Strona zostanie opublikowana po zapisaniu.",
    saving: "Zapisywanie…",
    publish: "Opublikuj moją stronę",
    saveChanges: "Zapisz zmiany",
  },
  en: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    dayStart: (d) => `${d} start`,
    dayEnd: (d) => `${d} end`,
    aboutTitle: "About you",
    aboutBody: "This is what clients see on your booking page.",
    fullName: "Full name",
    yourLink: "Your link",
    slugPlaceholder: "your-name",
    title: "Title",
    titleHint: "For example: Psychologist · CBT",
    titlePlaceholder: "Psychologist · CBT",
    city: "City",
    cityPlaceholder: "Warsaw",
    bio: "A few words for clients",
    bioHint: "Who you work with and how. Two or three sentences is plenty.",
    bioPlaceholder: "I work with anxiety, burnout and life transitions…",
    languages: "Languages",
    sessions: "Sessions",
    online: "Online — private video room",
    inPerson: "In person",
    address: "Practice address",
    sessionTitle: "Your session",
    sessionBody: "Clients prepay this when they book. It goes to your own account.",
    name: "Name",
    defaultService: "Individual session",
    price: "Price (zł)",
    length: "Length",
    minutes: (n) => `${n} minute${n === 1 ? "" : "s"}`,
    hoursTitle: "When you work",
    hoursBody: "Clients can only pick times inside these hours. Times are in Warsaw time.",
    notWorking: "Not working",
    saved: "Saved. Your page is up to date.",
    goesLive: "Your page goes live when you save.",
    saving: "Saving…",
    publish: "Publish my page",
    saveChanges: "Save changes",
  },
  uk: {
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    dayStart: (d) => `${d} — початок`,
    dayEnd: (d) => `${d} — кінець`,
    aboutTitle: "Про вас",
    aboutBody: "Це бачать клієнти на вашій сторінці бронювання.",
    fullName: "Ім’я та прізвище",
    yourLink: "Ваше посилання",
    slugPlaceholder: "vashe-imya",
    title: "Посада / спеціалізація",
    titleHint: "Наприклад: Психолог · КПТ",
    titlePlaceholder: "Психолог · КПТ",
    city: "Місто",
    cityPlaceholder: "Варшава",
    bio: "Кілька слів для клієнтів",
    bioHint: "З ким і як ви працюєте. Двох-трьох речень цілком достатньо.",
    bioPlaceholder: "Працюю з тривогою, вигоранням і життєвими змінами…",
    languages: "Мови",
    sessions: "Сесії",
    online: "Онлайн — приватна відеокімната",
    inPerson: "Очно",
    address: "Адреса кабінету",
    sessionTitle: "Ваша сесія",
    sessionBody: "Клієнти оплачують сесію наперед під час бронювання. Кошти надходять прямо на ваш рахунок.",
    name: "Назва",
    defaultService: "Індивідуальна сесія",
    price: "Ціна (zł)",
    length: "Тривалість",
    minutes: (n) =>
      `${n} ${n % 10 === 1 && n % 100 !== 11 ? "хвилина" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "хвилини" : "хвилин"}`,
    hoursTitle: "Коли ви працюєте",
    hoursBody: "Клієнти можуть обирати час лише в ці години. Час указано за Варшавою.",
    notWorking: "Вихідний",
    saved: "Збережено. Ваша сторінка актуальна.",
    goesLive: "Сторінка стане доступною після збереження.",
    saving: "Збереження…",
    publish: "Опублікувати мою сторінку",
    saveChanges: "Зберегти зміни",
  },
};

/* ---------- Profile details (server) ---------- */

export const PROFILE_T: Record<
  Lang,
  {
    title: string;
    intro: string;
    since: string;
    register: string;
    optional: string;
    registerPlaceholder: string;
    practiceName: string;
    listed: string;
    listedHint: string;
    practiceNameHint: string;
    practiceNamePlaceholder: string;
    helps: string;
    helpsHint: string;
    approach: string;
    worksWith: string;
    about: string;
    aboutHint: string;
    aboutPlaceholder: string;
    firstSession: string;
    firstSessionPlaceholder: string;
    education: string;
    educationHint: string;
    educationPlaceholder: string;
    memberships: string;
    membershipsHint: string;
    membershipsPlaceholder: string;
    translations: string;
    translationsHint: string;
    /** "in Polish" / "po polsku" / "польською" for placeholders */
    inLang: Record<Lang, string>;
    trTitle: (inLang: string) => string;
    trBio: (inLang: string) => string;
    trAbout: (inLang: string) => string;
    trFirst: (inLang: string) => string;
    saved: string;
    save: string;
  }
> = {
  pl: {
    title: "Twój profil",
    intro:
      "To czytają klienci przed rezerwacją. Tematy i metody pracy wyświetlają się automatycznie w języku klienta; teksty napisz w swoim głównym języku, a poniżej możesz dodać tłumaczenia.",
    since: "W zawodzie od (rok)",
    register: "Numer w rejestrze",
    optional: "(opcjonalnie)",
    registerPlaceholder: "Od 2028 r.: Rejestr Psychologów",
    practiceName: "Nazwa praktyki do dokumentacji",
    listed: "Pokaż mój profil w wyszukiwarce Sessio",
    listedHint: "Klienci, którzy wypełnią krótką ankietę na usesessio.com, zobaczą Cię, jeśli pasujesz do ich potrzeb. Bez prowizji i opłat za pozycję.",
    practiceNameHint: "(art. 28 — widoczna we wpisach)",
    practiceNamePlaceholder: "np. Gabinet Psychologiczny Anna Kowalska, NIP 000-000-00-00",
    helps: "W czym pomagasz",
    helpsHint: "(maks. 20)",
    approach: "Jak pracujesz",
    worksWith: "Z kim pracujesz",
    about: "O Tobie",
    aboutHint: "(kilka krótkich akapitów; pusta linia rozpoczyna nowy akapit)",
    aboutPlaceholder: "Kto najczęściej do Ciebie trafia, jak wygląda wspólna praca i czego klienci mogą się spodziewać.",
    firstSession: "Pierwsza sesja",
    firstSessionPlaceholder: "Jak wygląda pierwsze spotkanie i czy trzeba się do niego jakoś przygotować.",
    education: "Wykształcenie i szkolenia",
    educationHint: "(jedno w wierszu: lata · co · gdzie)",
    educationPlaceholder: "2012–2017 · Psychologia, studia magisterskie · Warszawa\n2017–2021 · Szkoła psychoterapii CBT",
    memberships: "Superwizja i członkostwo",
    membershipsHint: "(jedno w wierszu)",
    membershipsPlaceholder: "Regularna superwizja",
    translations: "Tłumaczenia",
    translationsHint: "— opcjonalne; wyświetlają się, gdy klient ogląda Twoją stronę w danym języku",
    inLang: { pl: "po polsku", en: "po angielsku", uk: "po ukraińsku" },
    trTitle: (l) => `Tytuł zawodowy ${l}`,
    trBio: (l) => `Krótkie przedstawienie ${l}`,
    trAbout: (l) => `O Tobie ${l}`,
    trFirst: (l) => `Pierwsza sesja ${l}`,
    saved: "Zapisano. Twoja strona jest aktualna.",
    save: "Zapisz profil",
  },
  en: {
    title: "Your profile",
    intro:
      "What clients read before they book. Topics and methods are shown in the client’s language automatically; write the text in your main language and add translations below if you like.",
    since: "In practice since (year)",
    register: "Register number",
    optional: "(optional)",
    registerPlaceholder: "From 2028: Register of Psychologists",
    practiceName: "Practice name for records",
    listed: "Show my profile in Sessio’s therapist finder",
    listedHint: "Clients who answer the short questionnaire on usesessio.com will see you when you fit their needs. No commission, no paid placement.",
    practiceNameHint: "(Art. 28 — shown on records)",
    practiceNamePlaceholder: "e.g. Anna Kowalska Psychology Practice, tax ID 000-000-00-00",
    helps: "What you help with",
    helpsHint: "(pick up to 20)",
    approach: "How you work",
    worksWith: "Who you work with",
    about: "About you",
    aboutHint: "(a few short paragraphs; a blank line starts a new one)",
    aboutPlaceholder: "Who usually comes to you, how you work together, what clients can expect.",
    firstSession: "Your first session",
    firstSessionPlaceholder: "What happens in the first meeting, and whether to prepare anything.",
    education: "Education and training",
    educationHint: "(one per line: years · what · where)",
    educationPlaceholder: "2012–2017 · MA in Psychology · Warsaw\n2017–2021 · CBT psychotherapy training",
    memberships: "Supervision and memberships",
    membershipsHint: "(one per line)",
    membershipsPlaceholder: "Regular supervision",
    translations: "Translations",
    translationsHint: "— optional; shown when a client views your page in that language",
    inLang: { pl: "in Polish", en: "in English", uk: "in Ukrainian" },
    trTitle: (l) => `Title ${l}`,
    trBio: (l) => `Short intro ${l}`,
    trAbout: (l) => `About you ${l}`,
    trFirst: (l) => `First session ${l}`,
    saved: "Saved. Your page is up to date.",
    save: "Save profile",
  },
  uk: {
    title: "Ваш профіль",
    intro:
      "Це читають клієнти перед бронюванням. Теми й методи роботи автоматично показуються мовою клієнта; тексти пишіть своєю основною мовою, а нижче за бажання додайте переклади.",
    since: "Практикую з (рік)",
    register: "Номер у реєстрі",
    optional: "(необов’язково)",
    registerPlaceholder: "З 2028 р.: Реєстр психологів",
    practiceName: "Назва практики для документації",
    listed: "Показувати мій профіль у пошуку Sessio",
    listedHint: "Клієнти, які заповнять коротку анкету на usesessio.com, побачать вас, якщо ви їм підходите. Без комісії та платних позицій.",
    practiceNameHint: "(ст. 28 — видно в записах)",
    practiceNamePlaceholder: "напр. Психологічний кабінет Анни Ковальської",
    helps: "З чим ви допомагаєте",
    helpsHint: "(до 20)",
    approach: "Як ви працюєте",
    worksWith: "З ким ви працюєте",
    about: "Про вас",
    aboutHint: "(кілька коротких абзаців; порожній рядок починає новий)",
    aboutPlaceholder: "Хто зазвичай до вас звертається, як виглядає спільна робота і чого клієнтам очікувати.",
    firstSession: "Перша сесія",
    firstSessionPlaceholder: "Що відбувається на першій зустрічі і чи потрібно до неї готуватися.",
    education: "Освіта і навчання",
    educationHint: "(по одному в рядку: роки · що · де)",
    educationPlaceholder: "2012–2017 · Магістр психології · Варшава\n2017–2021 · Навчання КПТ-психотерапії",
    memberships: "Супервізія та членство",
    membershipsHint: "(по одному в рядку)",
    membershipsPlaceholder: "Регулярна супервізія",
    translations: "Переклади",
    translationsHint: "— необов’язково; показуються, коли клієнт переглядає вашу сторінку цією мовою",
    inLang: { pl: "польською", en: "англійською", uk: "українською" },
    trTitle: (l) => `Посада / спеціалізація ${l}`,
    trBio: (l) => `Короткий опис ${l}`,
    trAbout: (l) => `Про вас ${l}`,
    trFirst: (l) => `Перша сесія ${l}`,
    saved: "Збережено. Ваша сторінка актуальна.",
    save: "Зберегти профіль",
  },
};

/* ---------- Server action errors (practice-actions.ts) ---------- */

export type PracticeErr =
  | "name"
  | "slug"
  | "title"
  | "city"
  | "bio"
  | "address"
  | "languages"
  | "formats"
  | "service"
  | "price"
  | "duration"
  | "check"
  | "reserved"
  | "noDays"
  | "endAfterStart"
  | "taken";

export const PRACTICE_ERR_T: Record<Lang, Record<PracticeErr, string>> = {
  pl: {
    name: "Podaj imię i nazwisko.",
    slug: "Link może mieć 3–40 znaków: małe litery, cyfry lub myślniki.",
    title: "Tytuł zawodowy może mieć maksymalnie 80 znaków.",
    city: "Nazwa miasta może mieć maksymalnie 60 znaków.",
    bio: "Opis dla klientów może mieć maksymalnie 600 znaków.",
    address: "Adres może mieć maksymalnie 160 znaków.",
    languages: "Wybierz co najmniej jeden język.",
    formats: "Wybierz co najmniej jedną formę sesji.",
    service: "Nazwa sesji powinna mieć od 2 do 60 znaków.",
    price: "Podaj cenę od 0 do 5000 zł.",
    duration: "Wybierz czas trwania sesji.",
    check: "Sprawdź formularz.",
    reserved: "Ten link jest zarezerwowany — wybierz inny.",
    noDays: "Dodaj co najmniej jeden dzień pracy.",
    endAfterStart: "W każdym dniu pracy godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.",
    taken: "Ten link jest już zajęty — wybierz inny.",
  },
  en: {
    name: "Add your name",
    slug: "Use 3–40 lowercase letters, numbers or dashes",
    title: "Keep the title under 80 characters",
    city: "Keep the city under 60 characters",
    bio: "Keep the intro under 600 characters",
    address: "Keep the address under 160 characters",
    languages: "Pick at least one language",
    formats: "Pick at least one format",
    service: "Give the session a name of 2–60 characters",
    price: "Set a price between 0 and 5000 zł",
    duration: "Pick a session length",
    check: "Check the form",
    reserved: "That link is reserved — try another.",
    noDays: "Add at least one working day.",
    endAfterStart: "Each working day needs an end time after its start time.",
    taken: "Someone already uses that link — try another.",
  },
  uk: {
    name: "Вкажіть ім’я та прізвище.",
    slug: "Посилання: 3–40 символів — малі латинські літери, цифри або дефіси.",
    title: "Посада може містити не більше 80 символів.",
    city: "Назва міста може містити не більше 60 символів.",
    bio: "Опис для клієнтів може містити не більше 600 символів.",
    address: "Адреса може містити не більше 160 символів.",
    languages: "Оберіть щонайменше одну мову.",
    formats: "Оберіть щонайменше один формат сесій.",
    service: "Назва сесії має містити від 2 до 60 символів.",
    price: "Вкажіть ціну від 0 до 5000 zł.",
    duration: "Оберіть тривалість сесії.",
    check: "Перевірте форму.",
    reserved: "Це посилання зарезервоване — оберіть інше.",
    noDays: "Додайте щонайменше один робочий день.",
    endAfterStart: "У кожен робочий день час завершення має бути пізніше за час початку.",
    taken: "Це посилання вже зайняте — оберіть інше.",
  },
};
