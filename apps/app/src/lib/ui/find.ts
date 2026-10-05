import type { Lang } from "@/lib/i18n";

type FindDict = {
  tab: string;
  title: string;
  lead: string;
  step: (n: number, of: number) => string;
  next: string;
  back: string;
  show: string;
  skip: string;
  qTopics: string;
  qTopicsHint: string;
  qWho: string;
  who: { me: string; couple: string; teen: string };
  qLang: string;
  qFmt: string;
  fmt: { online: string; in_person: string; any: string };
  qWhen: string;
  when: { morning: string; afternoon: string; evening: string; any: string };
  qBudget: string;
  budget: (n: number) => string;
  anyBudget: string;
  results: (n: number) => string;
  resultsLead: string;
  change: string;
  closest: string;
  closestLead: string;
  fits: string;
  helpsWith: string;
  speaks: (l: string) => string;
  nextFit: string;
  nextAny: string;
  noFree: string;
  book: (when: string) => string;
  profile: string;
  ask: string;
  years: (n: number) => string;
  perSession: (price: string, min: number) => string;
  online: string;
  inPerson: (city: string) => string;
  honest: string;
  hasLink: string;
  signIn: string;
  crisis: string;
  pageTitle: string;
};

export const FIND_T: Record<Lang, FindDict> = {
  pl: {
    tab: "Znajdź",
    title: "Znajdź swojego terapeutę",
    lead: "Sześć krótkich pytań. Pokażemy specjalistów, którzy pasują do Twoich potrzeb, języka, budżetu i godzin — i najbliższy wolny termin u każdego.",
    step: (n, of) => `Pytanie ${n} z ${of}`,
    next: "Dalej",
    back: "Wstecz",
    show: "Pokaż dopasowanych specjalistów",
    skip: "Pomiń",
    qTopics: "Z czym chcesz popracować?",
    qTopicsHint: "Wybierz do trzech. Nie musisz wiedzieć dokładnie — to tylko punkt wyjścia.",
    qWho: "Dla kogo szukasz pomocy?",
    who: { me: "Dla siebie", couple: "Dla nas jako pary", teen: "Dla nastolatka (16+)" },
    qLang: "W jakim języku chcesz rozmawiać?",
    qFmt: "Jak wolisz się spotykać?",
    fmt: { online: "Online, z domu", in_person: "W gabinecie", any: "Bez znaczenia" },
    qWhen: "Kiedy zwykle masz czas?",
    when: { morning: "Rano (do 12)", afternoon: "Po południu (12–17)", evening: "Wieczorem (po 17)", any: "Różnie" },
    qBudget: "Ile możesz przeznaczyć na sesję?",
    budget: (n) => `do ${n} zł`,
    anyBudget: "Bez limitu",
    results: (n) => (n === 1 ? "1 dopasowany specjalista" : n > 1 && n < 5 ? `${n} dopasowanych specjalistów` : `${n} dopasowanych specjalistów`),
    resultsLead: "Kolejność wynika tylko z Twoich odpowiedzi. Nikt nie płaci za wyższe miejsce.",
    change: "Zmień odpowiedzi",
    closest: "Najbliżej Twoich odpowiedzi",
    closestLead: "Te osoby nie spełniają wszystkich warunków — sprawdź, czego brakuje.",
    fits: "Dlaczego pasuje",
    helpsWith: "Pracuje z:",
    speaks: (l) => `Rozmawia po ${l}`,
    nextFit: "Najbliższy termin w Twoich godzinach",
    nextAny: "Najbliższy wolny termin",
    noFree: "Brak wolnych terminów w najbliższych tygodniach",
    book: (w) => `Zarezerwuj ${w}`,
    profile: "Profil i wszystkie terminy",
    ask: "Zadaj pytanie przed rezerwacją",
    years: (n) => `${n} ${n === 1 ? "rok" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "lata" : "lat"} praktyki`,
    perSession: (p, m) => `${p} · ${m} min`,
    online: "Online",
    inPerson: (c) => `Gabinet · ${c}`,
    honest: "Sessio jest nowe, więc lista jest krótka: pokazujemy tylko gabinety, które same zdecydowały się tu pojawić. Bez prowizji i płatnych wyróżnień.",
    hasLink: "Masz już link od swojego terapeuty? Zarezerwuj przez niego — sesja pojawi się tutaj.",
    signIn: "Zaloguj się",
    crisis: "Jeśli jesteś w kryzysie, nie czekaj na termin: zadzwoń pod 112 lub 116 123 (całodobowo).",
    pageTitle: "Znajdź terapeutę — Sessio",
  },
  en: {
    tab: "Find",
    title: "Find your therapist",
    lead: "Six short questions. We’ll show specialists who fit your needs, language, budget and hours — with the next free time for each.",
    step: (n, of) => `Question ${n} of ${of}`,
    next: "Next",
    back: "Back",
    show: "Show matching specialists",
    skip: "Skip",
    qTopics: "What would you like to work on?",
    qTopicsHint: "Pick up to three. You don’t need to be sure — it’s only a starting point.",
    qWho: "Who is the help for?",
    who: { me: "For me", couple: "For us as a couple", teen: "For a teenager (16+)" },
    qLang: "Which language do you want to talk in?",
    qFmt: "How would you like to meet?",
    fmt: { online: "Online, from home", in_person: "In person", any: "Either" },
    qWhen: "When are you usually free?",
    when: { morning: "Mornings (before 12)", afternoon: "Afternoons (12–17)", evening: "Evenings (after 17)", any: "It varies" },
    qBudget: "How much can you spend per session?",
    budget: (n) => `up to ${n} zł`,
    anyBudget: "No limit",
    results: (n) => `${n} matching specialist${n === 1 ? "" : "s"}`,
    resultsLead: "The order comes only from your answers. Nobody pays for a higher place.",
    change: "Change answers",
    closest: "Closest to your answers",
    closestLead: "These don’t meet every condition — see what’s missing.",
    fits: "Why it fits",
    helpsWith: "Works with:",
    speaks: (l) => `Speaks ${l}`,
    nextFit: "Next time in your hours",
    nextAny: "Next free time",
    noFree: "No free times in the next weeks",
    book: (w) => `Book ${w}`,
    profile: "Profile and all times",
    ask: "Ask a question before booking",
    years: (n) => `${n} year${n === 1 ? "" : "s"} in practice`,
    perSession: (p, m) => `${p} · ${m} min`,
    online: "Online",
    inPerson: (c) => `In person · ${c}`,
    honest: "Sessio is new, so the list is short: only practices that chose to be listed appear here. No commission, no paid placement.",
    hasLink: "Already have your therapist’s link? Book through it — the session will appear here.",
    signIn: "Sign in",
    crisis: "If you’re in crisis, don’t wait for a session: call 112 or 116 123 (24/7).",
    pageTitle: "Find a therapist — Sessio",
  },
  uk: {
    tab: "Знайти",
    title: "Знайдіть свого терапевта",
    lead: "Шість коротких запитань. Ми покажемо фахівців, які підходять за потребами, мовою, бюджетом і годинами, — і найближчий вільний час у кожного.",
    step: (n, of) => `Питання ${n} з ${of}`,
    next: "Далі",
    back: "Назад",
    show: "Показати відповідних фахівців",
    skip: "Пропустити",
    qTopics: "Над чим ви хочете працювати?",
    qTopicsHint: "Оберіть до трьох. Не обов’язково знати точно — це лише відправна точка.",
    qWho: "Для кого ви шукаєте допомогу?",
    who: { me: "Для себе", couple: "Для нас як пари", teen: "Для підлітка (16+)" },
    qLang: "Якою мовою ви хочете говорити?",
    qFmt: "Як вам зручніше зустрічатися?",
    fmt: { online: "Онлайн, з дому", in_person: "У кабінеті", any: "Без різниці" },
    qWhen: "Коли ви зазвичай вільні?",
    when: { morning: "Зранку (до 12)", afternoon: "Удень (12–17)", evening: "Увечері (після 17)", any: "По-різному" },
    qBudget: "Скільки ви можете витратити на сесію?",
    budget: (n) => `до ${n} zł`,
    anyBudget: "Без обмежень",
    results: (n) => `Відповідних фахівців: ${n}`,
    resultsLead: "Порядок залежить лише від ваших відповідей. Ніхто не платить за вище місце.",
    change: "Змінити відповіді",
    closest: "Найближче до ваших відповідей",
    closestLead: "Ці фахівці не відповідають усім умовам — подивіться, чого бракує.",
    fits: "Чому підходить",
    helpsWith: "Працює з:",
    speaks: (l) => `Розмовляє: ${l}`,
    nextFit: "Найближчий час у ваші години",
    nextAny: "Найближчий вільний час",
    noFree: "Немає вільного часу найближчими тижнями",
    book: (w) => `Забронювати ${w}`,
    profile: "Профіль і весь вільний час",
    ask: "Поставити запитання до бронювання",
    years: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "рік" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "роки" : "років"} практики`,
    perSession: (p, m) => `${p} · ${m} хв`,
    online: "Онлайн",
    inPerson: (c) => `Кабінет · ${c}`,
    honest: "Sessio нове, тому список короткий: тут лише практики, які самі вирішили з’явитися. Без комісії й платних позицій.",
    hasLink: "Уже маєте посилання від свого терапевта? Бронюйте через нього — сесія з’явиться тут.",
    signIn: "Увійти",
    crisis: "Якщо ви в кризі, не чекайте на сесію: телефонуйте 112 або 116 123 (цілодобово).",
    pageTitle: "Знайти терапевта — Sessio",
  },
};

/** "po polsku" etc. for the Polish "Rozmawia po …" line; other languages use the plain name. */
export const SPEAKS_PL: Record<string, string> = { pl: "polsku", uk: "ukraińsku", en: "angielsku", ru: "rosyjsku", de: "niemiecku" };
