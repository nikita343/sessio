import type { Lang } from "../i18n";

type OnbDict = {
  stepOf: (n: number) => string;
  // step 1
  s1Overline: string;
  s1Title: string;
  s1Body: string;
  // step 2
  s2Overline: string;
  s2Title: string;
  s2Body: string;
  tabPaste: string;
  tabIcs: string;
  pasteLabel: string;
  pastePlaceholder: string;
  dropTitle: string;
  dropBody: string;
  dropChosen: (name: string) => string;
  previewBtn: string;
  previewTitle: (n: number) => string;
  previewSummary: (fresh: number, existing: number, check: number) => string;
  statusNew: string;
  statusExists: string;
  statusCheck: string;
  sessionsFound: (n: number, skipped: number) => string;
  sessionsNote: string;
  dedupeNote: string;
  remindersNote: string;
  nothingFound: string;
  addBtn: (n: number) => string;
  addSessionsBtn: (clients: number, sessions: number) => string;
  changeBtn: string;
  back: string;
  skipNoList: string;
  importError: string;
  // step 3
  s3Overline: string;
  s3Title: string;
  s3Body: string;
  s3Card1Title: string;
  s3Card1Body: string;
  s3Card2Title: string;
  s3Card2Body: string;
  s3Card3Title: string;
  s3Card3Body: string;
  startNote: string;
  skipForNow: string;
  practiceBanner: string;
  useSample: string;
  practiceClient: string;
  // checklist
  clTitle: string;
  clProgress: (done: number, total: number) => string;
  clLead: (left: number) => string;
  clAllDone: string;
  clPage: string;
  clPageSub: (link: string) => string;
  clClients: string;
  clClientsSub: string;
  clClientsDone: (n: number, sessions: number) => string;
  clNote: string;
  clNoteSub: string;
  clNoteDone: string;
  clStripe: string;
  clStripeSub: string;
  clStripeDone: string;
  clAdd: string;
  clStart: string;
  clConnect: string;
  clHide: string;
  clRedo: string;
  noteSignedToast: string;
  // dashboard empty
  emptyAddClients: string;
  emptyAddSession: string;
  // sidebar
  more: string;
  less: string;
  // sample memo
  sampleMemo: string;
};

export const ONB_T: Record<Lang, OnbDict> = {
  pl: {
    stepOf: (n) => `Krok ${n} z 3`,
    s1Overline: "KROK 1 Z 3",
    s1Title: "Twoja strona rezerwacji",
    s1Body: "Imię, cena i godziny — to wszystko, czego potrzebuje klient, żeby się umówić. Po zapisaniu strona jest od razu online; zmienisz ją później w Ustawieniach.",
    s2Overline: "KROK 2 Z 3",
    s2Title: "Twoi klienci",
    s2Body: "Wklej listę albo wrzuć eksport kalendarza. Każdy klient dostanie własny link do płatności i pokój wideo, a Ty zobaczysz najbliższe sesje od razu na pulpicie.",
    tabPaste: "Wklej listę",
    tabIcs: "Importuj kalendarz (.ics)",
    pasteLabel: "Jedna osoba w wierszu: imię i nazwisko, e-mail. Opcjonalnie telefon i język (PL, UA, EN).",
    pastePlaceholder: "Marta Nowak, marta.nowak@wp.pl\nPiotr Zieliński, p.zielinski@onet.pl, 600 123 456\nОлена Ковальчук, olena.k@gmail.com, UA",
    dropTitle: "lub dodaj plik .ics z Google Calendar, Apple albo Outlook",
    dropBody: "Spotkania z najbliższych 8 tygodni trafią do kalendarza, każde z klientem. Eksport: Google Calendar → Ustawienia → Eksport.",
    dropChosen: (name) => `Plik: ${name}`,
    previewBtn: "Pokaż podgląd",
    previewTitle: (n) => `PODGLĄD · ${n} ${n === 1 ? "OSOBA" : n >= 2 && n <= 4 ? "OSOBY" : "OSÓB"}`,
    previewSummary: (fresh, existing, check) => [fresh ? `${fresh} ${fresh === 1 ? "nowa" : "nowe"}` : "", existing ? `${existing} już jest` : "", check ? `${check} do sprawdzenia` : ""].filter(Boolean).join(" · "),
    statusNew: "Nowy",
    statusExists: "Już jest",
    statusCheck: "Sprawdź e-mail",
    sessionsFound: (n, skipped) => `${n} ${n === 1 ? "sesja" : n >= 2 && n <= 4 ? "sesje" : "sesji"} z kalendarza trafi do Sessio${skipped ? ` · ${skipped} pominięto (brak e-maila uczestnika)` : ""}`,
    sessionsNote: "Spotkania bez adresu e-mail uczestnika pomijamy — dodaj takie osoby z listy powyżej.",
    dedupeNote: "Duplikaty łączymy po e-mailu — nic nie dodamy dwa razy.",
    remindersNote: "Dzień przed każdą sesją klient dostanie e-mail z przypomnieniem i linkiem do wideo.",
    nothingFound: "Nie znaleźliśmy żadnej osoby z adresem e-mail. Sprawdź format: imię i nazwisko, przecinek, e-mail.",
    addBtn: (n) => `Dodaj ${n} ${n === 1 ? "klienta" : "klientów"} →`,
    addSessionsBtn: (clients, sessions) => `Dodaj ${clients} ${clients === 1 ? "klienta" : "klientów"} i ${sessions} ${sessions === 1 ? "sesję" : sessions >= 2 && sessions <= 4 ? "sesje" : "sesji"} →`,
    changeBtn: "Zmień listę",
    back: "← Wstecz",
    skipNoList: "Pomiń — nie mam listy",
    importError: "Nie udało się zapisać. Spróbuj ponownie.",
    s3Overline: "KROK 3 Z 3",
    s3Title: "Pierwsza notatka z sesji",
    s3Body: "Opowiedz 30 sekund o ostatniej sesji — albo użyj przykładu. Imiona, telefony i PESEL znikają, zanim tekst trafi do AI. Nic nie zapisze się, dopóki nie podpiszesz.",
    s3Card1Title: "Nagraj albo wpisz",
    s3Card1Body: "Transkrypcja działa na Twoim urządzeniu. Audio znika po zatwierdzeniu.",
    s3Card2Title: "AI robi szkic",
    s3Card2Body: "Dokumentacja (art. 28) osobno od Twoich notatek roboczych, których klient nie widzi.",
    s3Card3Title: "Ty podpisujesz",
    s3Card3Body: "Czytasz, poprawiasz, podpisujesz. Dopiero wtedy wpis trafia do dokumentacji.",
    startNote: "Zacznij notatkę ćwiczebną",
    skipForNow: "Pomiń na razie",
    practiceBanner: "To notatka ćwiczebna z przykładowym klientem — nie jest przypisana do żadnej prawdziwej sesji. Po podpisaniu wrócisz na pulpit.",
    useSample: "Użyj przykładowej notatki",
    practiceClient: "Klient ćwiczebny",
    clTitle: "Pierwsze kroki",
    clProgress: (done, total) => `${done} z ${total}`,
    clLead: (left) => (left === 1 ? "Został jeden krok." : `${left} kroki do końca — każdy zajmuje około dwóch minut.`),
    clAllDone: "Wszystko gotowe. Twoja praktyka działa w jednym miejscu.",
    clPage: "Twoja strona jest online",
    clPageSub: (link) => `${link} · skopiuj link i wyślij klientom`,
    clClients: "Dodaj klientów",
    clClientsSub: "Wklej listę albo wrzuć .ics — każdy dostanie link do płatności i pokój wideo.",
    clClientsDone: (n, sessions) => `${n} ${n === 1 ? "klient" : n >= 2 && n <= 4 ? "klientów" : "klientów"}${sessions ? ` · ${sessions} ${sessions === 1 ? "sesja" : sessions >= 2 && sessions <= 4 ? "sesje" : "sesji"} w kalendarzu` : ""}`,
    clNote: "Podpisz pierwszą notatkę",
    clNoteSub: "30 sekund głosem → szkic dokumentacji art. 28 → Twój podpis.",
    clNoteDone: "Pierwsza notatka podpisana",
    clStripe: "Podłącz Stripe, żeby przyjmować przedpłaty",
    clStripeSub: "BLIK, karta i P24 trafiają prosto na Twoje konto. 0% prowizji.",
    clStripeDone: "Przedpłaty włączone",
    clAdd: "Dodaj",
    clStart: "Zacznij",
    clConnect: "Podłącz",
    clHide: "Ukryj",
    clRedo: "Przejdź kroki jeszcze raz",
    noteSignedToast: "Pierwsza notatka podpisana. Tak będzie wyglądać każda następna — tylko z prawdziwym klientem.",
    emptyAddClients: "Dodaj klientów",
    emptyAddSession: "Dodaj sesję",
    more: "Więcej",
    less: "Mniej",
    sampleMemo:
      "Sesja dwunasta, online. Klient przyniósł trzy zapisy myśli, najmocniej wychodzi katastrofizowanie przed poniedziałkowymi spotkaniami. Ćwiczyliśmy przeformułowanie w dwóch kolumnach i zaplanowaliśmy jedną małą ekspozycję: zabrać głos jako pierwszy na środowym stand-upie. Sen lepszy, około sześciu godzin. Zadanie domowe: dwa zapisy myśli i ekspozycja. Sprawdzić następnym razem, czy przeformułowanie działa pod presją czasu.",
  },
  en: {
    stepOf: (n) => `Step ${n} of 3`,
    s1Overline: "STEP 1 OF 3",
    s1Title: "Your booking page",
    s1Body: "Name, price and hours — everything a client needs to book. The page goes live when you save; you can change it later in Settings.",
    s2Overline: "STEP 2 OF 3",
    s2Title: "Your clients",
    s2Body: "Paste a list or drop a calendar export. Every client gets a payment link and a video room, and your next sessions show up on the dashboard right away.",
    tabPaste: "Paste a list",
    tabIcs: "Import calendar (.ics)",
    pasteLabel: "One person per line: full name, email. Optionally phone and language (PL, UA, EN).",
    pastePlaceholder: "Marta Nowak, marta.nowak@wp.pl\nPiotr Zieliński, p.zielinski@onet.pl, 600 123 456\nОлена Ковальчук, olena.k@gmail.com, UA",
    dropTitle: "or add an .ics file from Google Calendar, Apple or Outlook",
    dropBody: "Events from the next 8 weeks land in your calendar, each with its client. Export: Google Calendar → Settings → Export.",
    dropChosen: (name) => `File: ${name}`,
    previewBtn: "Show preview",
    previewTitle: (n) => `PREVIEW · ${n} ${n === 1 ? "PERSON" : "PEOPLE"}`,
    previewSummary: (fresh, existing, check) => [fresh ? `${fresh} new` : "", existing ? `${existing} already here` : "", check ? `${check} to check` : ""].filter(Boolean).join(" · "),
    statusNew: "New",
    statusExists: "Already here",
    statusCheck: "Check email",
    sessionsFound: (n, skipped) => `${n} session${n === 1 ? "" : "s"} from the calendar will be added${skipped ? ` · ${skipped} skipped (no attendee email)` : ""}`,
    sessionsNote: "Events without an attendee email are skipped — add those people in the list above.",
    dedupeNote: "Duplicates are merged by email — nothing is added twice.",
    remindersNote: "The day before each session the client gets a reminder email with the video link.",
    nothingFound: "No person with an email address found. Check the format: full name, comma, email.",
    addBtn: (n) => `Add ${n} client${n === 1 ? "" : "s"} →`,
    addSessionsBtn: (clients, sessions) => `Add ${clients} client${clients === 1 ? "" : "s"} and ${sessions} session${sessions === 1 ? "" : "s"} →`,
    changeBtn: "Change the list",
    back: "← Back",
    skipNoList: "Skip — I don't have a list",
    importError: "Could not save. Please try again.",
    s3Overline: "STEP 3 OF 3",
    s3Title: "Your first session note",
    s3Body: "Talk for 30 seconds about your last session — or use the sample. Names, phones and PESEL numbers are removed before the text reaches the AI. Nothing is saved until you sign.",
    s3Card1Title: "Record or type",
    s3Card1Body: "Transcription runs on your device. The audio is discarded once you approve.",
    s3Card2Title: "AI drafts",
    s3Card2Body: "The Art. 28 record, separate from your working notes, which the client never sees.",
    s3Card3Title: "You sign",
    s3Card3Body: "Read, edit, sign. Only then does the entry go into the documentation.",
    startNote: "Start a practice note",
    skipForNow: "Skip for now",
    practiceBanner: "This is a practice note with a sample client — it is not attached to any real session. You'll return to the dashboard after signing.",
    useSample: "Use the sample memo",
    practiceClient: "Practice client",
    clTitle: "First steps",
    clProgress: (done, total) => `${done} of ${total}`,
    clLead: (left) => (left === 1 ? "One step left." : `${left} steps left — each takes about two minutes.`),
    clAllDone: "All done. Your practice runs in one place.",
    clPage: "Your page is online",
    clPageSub: (link) => `${link} · copy the link and send it to clients`,
    clClients: "Add your clients",
    clClientsSub: "Paste a list or drop an .ics — each gets a payment link and a video room.",
    clClientsDone: (n, sessions) => `${n} client${n === 1 ? "" : "s"}${sessions ? ` · ${sessions} session${sessions === 1 ? "" : "s"} in the calendar` : ""}`,
    clNote: "Sign your first note",
    clNoteSub: "30 seconds of voice → an Art. 28 draft → your signature.",
    clNoteDone: "First note signed",
    clStripe: "Connect Stripe to take prepayments",
    clStripeSub: "BLIK, card and P24 go straight to your account. 0% commission.",
    clStripeDone: "Prepayments on",
    clAdd: "Add",
    clStart: "Start",
    clConnect: "Connect",
    clHide: "Hide",
    clRedo: "Go through the steps again",
    noteSignedToast: "First note signed. Every next one works the same way — with a real client.",
    emptyAddClients: "Add clients",
    emptyAddSession: "Add a session",
    more: "More",
    less: "Less",
    sampleMemo:
      "Session twelve, online. The client brought three thought records; the strongest pattern is catastrophising before Monday meetings. We practised a two-column reframe and planned one small exposure: speaking first at Wednesday's stand-up. Sleep is better, about six hours. Homework: two thought records and the exposure. Check next time whether the reframe works under time pressure.",
  },
  uk: {
    stepOf: (n) => `Крок ${n} з 3`,
    s1Overline: "КРОК 1 З 3",
    s1Title: "Ваша сторінка бронювання",
    s1Body: "Ім'я, ціна та години — усе, що потрібно клієнту, щоб записатися. Після збереження сторінка одразу онлайн; змінити її можна пізніше в Налаштуваннях.",
    s2Overline: "КРОК 2 З 3",
    s2Title: "Ваші клієнти",
    s2Body: "Вставте список або додайте експорт календаря. Кожен клієнт отримає посилання на оплату і відеокімнату, а найближчі сесії з'являться на панелі одразу.",
    tabPaste: "Вставити список",
    tabIcs: "Імпорт календаря (.ics)",
    pasteLabel: "Одна особа в рядку: ім'я та прізвище, e-mail. За бажанням телефон і мова (PL, UA, EN).",
    pastePlaceholder: "Marta Nowak, marta.nowak@wp.pl\nPiotr Zieliński, p.zielinski@onet.pl, 600 123 456\nОлена Ковальчук, olena.k@gmail.com, UA",
    dropTitle: "або додайте файл .ics з Google Calendar, Apple чи Outlook",
    dropBody: "Зустрічі з найближчих 8 тижнів потраплять до календаря, кожна з клієнтом. Експорт: Google Calendar → Налаштування → Експорт.",
    dropChosen: (name) => `Файл: ${name}`,
    previewBtn: "Показати перегляд",
    previewTitle: (n) => `ПЕРЕГЛЯД · ${n} ${n === 1 ? "ОСОБА" : n >= 2 && n <= 4 ? "ОСОБИ" : "ОСІБ"}`,
    previewSummary: (fresh, existing, check) => [fresh ? `${fresh} ${fresh === 1 ? "нова" : "нові"}` : "", existing ? `${existing} вже є` : "", check ? `${check} перевірити` : ""].filter(Boolean).join(" · "),
    statusNew: "Новий",
    statusExists: "Вже є",
    statusCheck: "Перевірте e-mail",
    sessionsFound: (n, skipped) => `${n} ${n === 1 ? "сесія" : n >= 2 && n <= 4 ? "сесії" : "сесій"} з календаря буде додано${skipped ? ` · ${skipped} пропущено (немає e-mail учасника)` : ""}`,
    sessionsNote: "Зустрічі без e-mail учасника пропускаємо — додайте цих людей у списку вище.",
    dedupeNote: "Дублікати об'єднуємо за e-mail — нічого не додамо двічі.",
    remindersNote: "За день до кожної сесії клієнт отримає нагадування з посиланням на відео.",
    nothingFound: "Не знайдено жодної особи з e-mail. Перевірте формат: ім'я та прізвище, кома, e-mail.",
    addBtn: (n) => `Додати ${n} ${n === 1 ? "клієнта" : "клієнтів"} →`,
    addSessionsBtn: (clients, sessions) => `Додати ${clients} ${clients === 1 ? "клієнта" : "клієнтів"} і ${sessions} ${sessions === 1 ? "сесію" : sessions >= 2 && sessions <= 4 ? "сесії" : "сесій"} →`,
    changeBtn: "Змінити список",
    back: "← Назад",
    skipNoList: "Пропустити — немає списку",
    importError: "Не вдалося зберегти. Спробуйте ще раз.",
    s3Overline: "КРОК 3 З 3",
    s3Title: "Перша нотатка із сесії",
    s3Body: "Розкажіть 30 секунд про останню сесію — або скористайтеся прикладом. Імена, телефони та PESEL зникають до того, як текст потрапить до AI. Нічого не збережеться, поки ви не підпишете.",
    s3Card1Title: "Запишіть або введіть",
    s3Card1Body: "Транскрипція працює на вашому пристрої. Аудіо зникає після затвердження.",
    s3Card2Title: "AI робить чернетку",
    s3Card2Body: "Документація (ст. 28) окремо від ваших робочих нотаток, яких клієнт не бачить.",
    s3Card3Title: "Ви підписуєте",
    s3Card3Body: "Читаєте, правите, підписуєте. Лише тоді запис потрапляє до документації.",
    startNote: "Почати тренувальну нотатку",
    skipForNow: "Пропустити поки що",
    practiceBanner: "Це тренувальна нотатка з прикладовим клієнтом — вона не прив'язана до жодної справжньої сесії. Після підпису ви повернетеся на панель.",
    useSample: "Використати приклад нотатки",
    practiceClient: "Тренувальний клієнт",
    clTitle: "Перші кроки",
    clProgress: (done, total) => `${done} з ${total}`,
    clLead: (left) => (left === 1 ? "Залишився один крок." : `${left} кроки до кінця — кожен займає близько двох хвилин.`),
    clAllDone: "Усе готово. Ваша практика працює в одному місці.",
    clPage: "Ваша сторінка онлайн",
    clPageSub: (link) => `${link} · скопіюйте посилання і надішліть клієнтам`,
    clClients: "Додайте клієнтів",
    clClientsSub: "Вставте список або додайте .ics — кожен отримає посилання на оплату і відеокімнату.",
    clClientsDone: (n, sessions) => `${n} ${n === 1 ? "клієнт" : n >= 2 && n <= 4 ? "клієнти" : "клієнтів"}${sessions ? ` · ${sessions} ${sessions === 1 ? "сесія" : sessions >= 2 && sessions <= 4 ? "сесії" : "сесій"} у календарі` : ""}`,
    clNote: "Підпишіть першу нотатку",
    clNoteSub: "30 секунд голосом → чернетка документації ст. 28 → ваш підпис.",
    clNoteDone: "Першу нотатку підписано",
    clStripe: "Підключіть Stripe, щоб приймати передоплати",
    clStripeSub: "BLIK, картка і P24 надходять просто на ваш рахунок. 0% комісії.",
    clStripeDone: "Передоплати увімкнено",
    clAdd: "Додати",
    clStart: "Почати",
    clConnect: "Підключити",
    clHide: "Сховати",
    clRedo: "Пройти кроки ще раз",
    noteSignedToast: "Першу нотатку підписано. Кожна наступна працює так само — зі справжнім клієнтом.",
    emptyAddClients: "Додати клієнтів",
    emptyAddSession: "Додати сесію",
    more: "Більше",
    less: "Менше",
    sampleMemo:
      "Дванадцята сесія, онлайн. Клієнт приніс три записи думок; найсильніше проявляється катастрофізація перед понеділковими зустрічами. Ми практикували переформулювання у дві колонки і запланували одну невелику експозицію: взяти слово першим на середовому стендапі. Сон кращий, близько шести годин. Домашнє завдання: два записи думок і експозиція. Перевірити наступного разу, чи працює переформулювання під тиском часу.",
  },
};
