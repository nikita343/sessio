import type { Lang } from "./i18n";

/**
 * Therapist profile vocabulary. Therapists pick from fixed keys so the public page can show
 * every chip in the visitor's language; free text (about, first session, education) stays in
 * the therapist's own words, with optional translations in `profile_i18n`.
 */

type L = Record<Lang, string>;

export const SPECIALTIES: Record<string, L> = {
  anxiety: { pl: "Lęk", en: "Anxiety", uk: "Тривога" },
  panic: { pl: "Ataki paniki", en: "Panic attacks", uk: "Панічні атаки" },
  depression: { pl: "Obniżony nastrój i depresja", en: "Low mood and depression", uk: "Знижений настрій і депресія" },
  burnout: { pl: "Wypalenie zawodowe", en: "Burnout", uk: "Професійне вигорання" },
  stress: { pl: "Stres", en: "Stress", uk: "Стрес" },
  life_transitions: { pl: "Zmiany życiowe", en: "Life transitions", uk: "Життєві зміни" },
  emigration: { pl: "Emigracja i adaptacja", en: "Moving abroad and adapting", uk: "Еміграція та адаптація" },
  relationships: { pl: "Relacje i związki", en: "Relationships", uk: "Стосунки" },
  self_esteem: { pl: "Poczucie własnej wartości", en: "Self-esteem", uk: "Самооцінка" },
  grief: { pl: "Żałoba i strata", en: "Grief and loss", uk: "Втрата і горе" },
  trauma: { pl: "Trauma", en: "Trauma", uk: "Травма" },
  sleep: { pl: "Problemy ze snem", en: "Sleep problems", uk: "Проблеми зі сном" },
  ocd: { pl: "Natręctwa (OCD)", en: "Obsessive thoughts (OCD)", uk: "Нав’язливості (ОКР)" },
  anger: { pl: "Złość i emocje", en: "Anger and emotions", uk: "Гнів та емоції" },
  parenting: { pl: "Rodzicielstwo", en: "Parenting", uk: "Батьківство" },
  work: { pl: "Praca i kariera", en: "Work and career", uk: "Робота і кар’єра" },
};

export const APPROACHES: Record<string, L> = {
  cbt: { pl: "Terapia poznawczo-behawioralna (CBT)", en: "Cognitive-behavioural therapy (CBT)", uk: "Когнітивно-поведінкова терапія (КПТ)" },
  act: { pl: "Terapia akceptacji i zaangażowania (ACT)", en: "Acceptance and commitment therapy (ACT)", uk: "Терапія прийняття і відповідальності (ACT)" },
  schema: { pl: "Terapia schematów", en: "Schema therapy", uk: "Схема-терапія" },
  dbt: { pl: "Terapia dialektyczno-behawioralna (DBT)", en: "Dialectical behaviour therapy (DBT)", uk: "Діалектична поведінкова терапія (DBT)" },
  psychodynamic: { pl: "Psychodynamiczna", en: "Psychodynamic", uk: "Психодинамічна" },
  systemic: { pl: "Systemowa", en: "Systemic", uk: "Системна" },
  humanistic: { pl: "Humanistyczna", en: "Humanistic", uk: "Гуманістична" },
  gestalt: { pl: "Gestalt", en: "Gestalt", uk: "Гештальт" },
  emdr: { pl: "EMDR", en: "EMDR", uk: "EMDR" },
  solution_focused: { pl: "Skoncentrowana na rozwiązaniach (TSR)", en: "Solution-focused", uk: "Орієнтована на рішення" },
  mindfulness: { pl: "Mindfulness", en: "Mindfulness", uk: "Майндфулнес" },
  integrative: { pl: "Integracyjna", en: "Integrative", uk: "Інтегративна" },
};

export const WORKS_WITH: Record<string, L> = {
  adults: { pl: "Dorośli", en: "Adults", uk: "Дорослі" },
  young_adults: { pl: "Młodzi dorośli (18–25)", en: "Young adults (18–25)", uk: "Молоді дорослі (18–25)" },
  teens: { pl: "Młodzież 16+ (za zgodą opiekuna)", en: "Teens 16+ (with a guardian's consent)", uk: "Підлітки 16+ (за згодою опікуна)" },
  couples: { pl: "Pary", en: "Couples", uk: "Пари" },
  families: { pl: "Rodziny", en: "Families", uk: "Сім’ї" },
  seniors: { pl: "Seniorzy", en: "Older adults", uk: "Літні люди" },
};

export const LANG_NAMES: Record<string, L> = {
  pl: { pl: "polski", en: "Polish", uk: "польська" },
  uk: { pl: "ukraiński", en: "Ukrainian", uk: "українська" },
  en: { pl: "angielski", en: "English", uk: "англійська" },
  ru: { pl: "rosyjski", en: "Russian", uk: "російська" },
  de: { pl: "niemiecki", en: "German", uk: "німецька" },
};

export const P: Record<
  Lang,
  {
    about: string;
    helps: string;
    approach: string;
    worksWith: string;
    education: string;
    memberships: string;
    firstSession: string;
    where: string;
    terms: string;
    years: (n: number) => string;
    langs: string;
    online: string;
    onlineBody: string;
    inPerson: string;
    map: string;
    price: string;
    length: string;
    cancel: (h: number) => string;
    pay: string;
    agreement: string;
    readAgreement: string;
    register: string;
    privacy: string;
    privacyBody: string;
    minutes: (n: number) => string;
  }
> = {
  pl: {
    about: "O mnie",
    helps: "W czym pomagam",
    approach: "Jak pracuję",
    worksWith: "Z kim pracuję",
    education: "Wykształcenie i kwalifikacje",
    memberships: "Superwizja i członkostwo",
    firstSession: "Pierwsza sesja",
    where: "Gdzie się spotykamy",
    terms: "Zasady sesji",
    years: (n) => `${n} ${n === 1 ? "rok" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "lata" : "lat"} praktyki`,
    langs: "Języki",
    online: "Online",
    onlineBody: "Prywatny, szyfrowany pokój wideo. Nic nie jest nagrywane; link przychodzi mailem.",
    inPerson: "W gabinecie",
    map: "Pokaż na mapie",
    price: "Cena",
    length: "Długość sesji",
    cancel: (h) => `Bezpłatne odwołanie lub zmiana terminu do ${h} h przed sesją — zwrot automatyczny.`,
    pay: "Płatność z góry: BLIK, karta lub Przelewy24, bezpośrednio na konto terapeuty.",
    agreement: "Umowa",
    readAgreement: "Przeczytaj umowę",
    register: "Nr w rejestrze psychologów",
    privacy: "Poufność",
    privacyBody: "Sesje nie są nagrywane. Twoje dane przechowujemy w UE i widzi je tylko terapeuta.",
    minutes: (n) => `${n} min`,
  },
  en: {
    about: "About me",
    helps: "What I help with",
    approach: "How I work",
    worksWith: "Who I work with",
    education: "Education and training",
    memberships: "Supervision and memberships",
    firstSession: "Your first session",
    where: "Where we meet",
    terms: "Session terms",
    years: (n) => `${n} ${n === 1 ? "year" : "years"} in practice`,
    langs: "Languages",
    online: "Online",
    onlineBody: "A private, encrypted video room. Nothing is recorded; the link arrives by email.",
    inPerson: "In person",
    map: "Show on map",
    price: "Price",
    length: "Session length",
    cancel: (h) => `Free cancellation or rescheduling up to ${h} h before — refunded automatically.`,
    pay: "Paid in advance by BLIK, card or Przelewy24, straight to the therapist.",
    agreement: "Agreement",
    readAgreement: "Read the agreement",
    register: "Psychologist register no.",
    privacy: "Confidentiality",
    privacyBody: "Sessions are never recorded. Your details are stored in the EU and seen only by your therapist.",
    minutes: (n) => `${n} min`,
  },
  uk: {
    about: "Про мене",
    helps: "З чим я допомагаю",
    approach: "Як я працюю",
    worksWith: "З ким я працюю",
    education: "Освіта і кваліфікація",
    memberships: "Супервізія та членство",
    firstSession: "Перша сесія",
    where: "Де ми зустрічаємося",
    terms: "Умови сесій",
    years: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "рік" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "роки" : "років"} практики`,
    langs: "Мови",
    online: "Онлайн",
    onlineBody: "Приватна зашифрована відеокімната. Нічого не записується; посилання приходить на e-mail.",
    inPerson: "У кабінеті",
    map: "Показати на мапі",
    price: "Вартість",
    length: "Тривалість сесії",
    cancel: (h) => `Безкоштовне скасування або перенесення до ${h} год до сесії — повернення автоматично.`,
    pay: "Оплата наперед: BLIK, картка або Przelewy24, безпосередньо терапевту.",
    agreement: "Договір",
    readAgreement: "Прочитати договір",
    register: "№ у реєстрі психологів",
    privacy: "Конфіденційність",
    privacyBody: "Сесії ніколи не записуються. Ваші дані зберігаються в ЄС, і бачить їх лише терапевт.",
    minutes: (n) => `${n} хв`,
  },
};

export type ProfileText = { title?: string; city?: string; bio?: string; about?: string; first_session?: string; education?: string; memberships?: string };

/** Therapist-written text in the visitor's language when a translation exists, otherwise the original. */
export function localized<T extends ProfileText>(base: T, i18n: Record<string, ProfileText> | null | undefined, lang: Lang): T {
  const tr = i18n?.[lang];
  if (!tr) return base;
  const out = { ...base };
  for (const k of ["title", "city", "bio", "about", "first_session", "education", "memberships"] as const) {
    const v = tr[k];
    if (typeof v === "string" && v.trim()) (out as ProfileText)[k] = v;
  }
  return out;
}

export const lines = (s: string | null | undefined) =>
  (s ?? "")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
