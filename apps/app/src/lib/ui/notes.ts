import type { Lang } from "../i18n";

/** Intl locale per UI language (client-safe copy; ui-lang.ts is server-only). */
const LOCALE: Record<Lang, string> = { pl: "pl-PL", en: "en-GB", uk: "uk-UA" };

/** Localized date/time in the therapist's timezone. */
export function noteDate(iso: string | Date, tz: string, lang: Lang, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(LOCALE[lang], { timeZone: tz, ...opts }).format(new Date(iso));
}

/** "Mon 5 Oct, 14:00" */
export const D_SHORT: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
/** "Mon, 5 Oct 2026, 14:00" */
export const D_SHORT_YEAR: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
/** "5 Oct" */
export const D_DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
/** "5 Oct 2026" */
export const D_DAY_YEAR: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
/** "14:00" */
export const D_TIME: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

type NotesDict = {
  // list
  title: string;
  eyebrow: string;
  withoutRecord: string;
  clientFallback: string;
  dictate: string;
  emptyTitle: string;
  emptyBody: string;
  session: (n: number | string) => string;
  signedOn: (date: string) => string;
  draft: string;
  // note page
  recordTitle: string;
  formLabel: (inPerson: boolean) => string;
  psychologistLabel: (name: string, reg: string | null | undefined) => string;
  // editor
  privacyMode: string;
  yourMemo: string;
  memoLanguage: string;
  stopRecording: string;
  recordMemo: string;
  recording: string;
  preparing: string;
  transcribing: (t: string) => string;
  tapToRecord: string;
  uploadAudio: string;
  transcript: string;
  transcriptDeleted: string;
  transcriptPlaceholder: string;
  drafting: string;
  draftRecord: string;
  privacyNote: string;
  signedBadge: (at: string | null) => string;
  aiDraft: string;
  templateDraft: string;
  formalRecord: string;
  formalRecordNote: string;
  fieldClient: string;
  fieldDate: string;
  fieldForm: string;
  fieldPsychologist: string;
  bodyPlaceholder: string;
  workingNotes: string;
  workingNote: string;
  workingPlaceholder: string;
  retention: string;
  saving: string;
  saved: string;
  discard: string;
  approveSign: string;
  micBlocked: string;
  transcriptionFailed: (msg: string) => string;
  readFailed: (msg: string) => string;
  draftFailed: string;
  signFailed: string;
};

export const NOTES_T: Record<Lang, NotesDict> = {
  pl: {
    title: "Notatki",
    eyebrow: "Dokumentacja psychologiczna zgodna z ustawą o zawodzie psychologa (art. 28)",
    withoutRecord: "Sesje bez wpisu",
    clientFallback: "Klient",
    dictate: "Podyktuj notatkę",
    emptyTitle: "Nie ma jeszcze wpisów",
    emptyBody: "Po sesji nagraj dwuminutową notatkę głosową. Transkrypcja powstanie na Twoim urządzeniu, a na jej podstawie przygotujemy wpis do podpisu.",
    session: (n) => `Sesja ${n}`,
    signedOn: (d) => `Podpisano ${d}`,
    draft: "Szkic",
    recordTitle: "Wpis z sesji",
    formLabel: (inPerson) => `Pomoc psychologiczna · ${inPerson ? "stacjonarnie" : "online"}`,
    psychologistLabel: (name, reg) => `${name} · Nr wpisu ${reg || "— (dodaj w: Strona rezerwacji → Twój profil)"}`,
    privacyMode: "Tryb prywatny · transkrypcja na tym urządzeniu",
    yourMemo: "Twoja notatka głosowa",
    memoLanguage: "Język notatki",
    stopRecording: "Zatrzymaj nagrywanie",
    recordMemo: "Nagraj notatkę",
    recording: "Nagrywanie",
    preparing: "Przygotowywanie transkrypcji na urządzeniu",
    transcribing: (t) => `Transkrypcja ${t} nagrania na tym urządzeniu…`,
    tapToRecord: "Nagraj, co było ważne na sesji.",
    uploadAudio: "lub prześlij plik audio",
    transcript: "Transkrypcja",
    transcriptDeleted: "Transkrypcja została usunięta po podpisaniu wpisu.",
    transcriptPlaceholder: "Tu pojawi się Twoja notatka. Możesz ją też wpisać lub wkleić.",
    drafting: "Przygotowuję wpis…",
    draftRecord: "Przygotuj wpis",
    privacyNote:
      "Nagranie nie opuszcza tego urządzenia i nie jest zapisywane. Imię i nazwisko klienta oraz Twoje, numery telefonów, adresy e-mail, PESEL i adresy zamieszkania są usuwane przed jakimkolwiek użyciem AI, a transkrypcja jest kasowana w chwili podpisania.",
    signedBadge: (at) => `Podpisano · ${at ?? ""}`,
    aiDraft: "Szkic AI · sprawdź przed podpisaniem",
    templateDraft: "Szkic z szablonu · AI wyłączone · sprawdź przed podpisaniem",
    formalRecord: "Dokumentacja (wpis)",
    formalRecordNote: "· art. 28 · udostępniana klientowi na wniosek",
    fieldClient: "Klient",
    fieldDate: "Data",
    fieldForm: "Forma",
    fieldPsychologist: "Psycholog",
    bodyPlaceholder: "Przygotuj wpis na podstawie notatki albo napisz go tutaj.",
    workingNotes: "Notatki robocze",
    workingNote: "· prywatne · nie są udostępniane klientowi",
    workingPlaceholder: "Hipotezy, co sprawdzić następnym razem…",
    retention:
      "Podpisane wpisy przechowujemy przez 5 lat od końca roku, w którym zakończyła się Twoja praca z klientem (art. 28). Potem Sessio przygotuje protokół zniszczenia do Twojego zatwierdzenia.",
    saving: "Zapisywanie…",
    saved: "Szkic zapisany",
    discard: "Usuń szkic",
    approveSign: "Zatwierdź i podpisz",
    micBlocked: "Dostęp do mikrofonu jest zablokowany. Zezwól na niego w przeglądarce albo wpisz notatkę poniżej.",
    transcriptionFailed: (m) => `Transkrypcja na tym urządzeniu nie powiodła się (${m}). Możesz wpisać notatkę ręcznie.`,
    readFailed: (m) => `Nie udało się odczytać nagrania: ${m}`,
    draftFailed: "Nie udało się przygotować wpisu",
    signFailed: "Nie udało się podpisać",
  },
  en: {
    title: "Notes",
    eyebrow: "Psychological documentation, ready for the Psychologist Act (art. 28)",
    withoutRecord: "Sessions without a record",
    clientFallback: "Client",
    dictate: "Dictate note",
    emptyTitle: "No records yet",
    emptyBody: "After a session, record a two-minute voice memo. It's transcribed on your device and drafted into a record for you to sign.",
    session: (n) => `Session ${n}`,
    signedOn: (d) => `Signed ${d}`,
    draft: "Draft",
    recordTitle: "Session record",
    formLabel: (inPerson) => `Psychological help · ${inPerson ? "in person" : "online"}`,
    psychologistLabel: (name, reg) => `${name} · Reg. no. ${reg || "— (add in Booking page → Your profile)"}`,
    privacyMode: "Privacy mode · transcribed on this device",
    yourMemo: "Your voice memo",
    memoLanguage: "Memo language",
    stopRecording: "Stop recording",
    recordMemo: "Record a memo",
    recording: "Recording",
    preparing: "Preparing on-device transcription",
    transcribing: (t) => `Transcribing ${t} of audio on this device…`,
    tapToRecord: "Tap to record what matters from the session.",
    uploadAudio: "or upload an audio file",
    transcript: "Transcript",
    transcriptDeleted: "The transcript was deleted when the record was signed.",
    transcriptPlaceholder: "Your memo appears here. You can also type or paste it.",
    drafting: "Drafting the record…",
    draftRecord: "Draft the record",
    privacyNote:
      "Audio never leaves this device and is not saved. Your client’s and your own name, phone numbers, emails, PESEL and street addresses are removed before any AI step, and the transcript is discarded when you sign.",
    signedBadge: (at) => `Signed · ${at ?? ""}`,
    aiDraft: "AI draft · review before signing",
    templateDraft: "Template draft · AI is off · review before signing",
    formalRecord: "Formal record",
    formalRecordNote: "· Art. 28 · visible to the client on request",
    fieldClient: "Client",
    fieldDate: "Date",
    fieldForm: "Form",
    fieldPsychologist: "Psychologist",
    bodyPlaceholder: "Draft the record from your memo, or write it here.",
    workingNotes: "Working notes",
    workingNote: "· private · not shared with the client",
    workingPlaceholder: "Hypotheses, things to check next time…",
    retention:
      "Signed records are kept for 5 years from the end of the year in which your work with the client ended (art. 28), then Sessio prepares a destruction protocol for you to confirm.",
    saving: "Saving…",
    saved: "Draft saved",
    discard: "Discard draft",
    approveSign: "Approve & sign",
    micBlocked: "Microphone access was blocked. Allow it in the browser, or type your memo below.",
    transcriptionFailed: (m) => `Transcription failed on this device (${m}). You can type the memo instead.`,
    readFailed: (m) => `Could not read the recording: ${m}`,
    draftFailed: "Drafting failed",
    signFailed: "Could not sign",
  },
  uk: {
    title: "Нотатки",
    eyebrow: "Психологічна документація згідно із законом про професію психолога (ст. 28)",
    withoutRecord: "Сесії без запису",
    clientFallback: "Клієнт",
    dictate: "Надиктувати нотатку",
    emptyTitle: "Записів ще немає",
    emptyBody: "Після сесії запишіть двохвилинну голосову нотатку. Її буде розшифровано на вашому пристрої та підготовлено як запис для підпису.",
    session: (n) => `Сесія ${n}`,
    signedOn: (d) => `Підписано ${d}`,
    draft: "Чернетка",
    recordTitle: "Запис сесії",
    formLabel: (inPerson) => `Психологічна допомога · ${inPerson ? "очно" : "онлайн"}`,
    psychologistLabel: (name, reg) => `${name} · Реєстр. № ${reg || "— (додайте в: Сторінка бронювання → Ваш профіль)"}`,
    privacyMode: "Приватний режим · розшифровка на цьому пристрої",
    yourMemo: "Ваша голосова нотатка",
    memoLanguage: "Мова нотатки",
    stopRecording: "Зупинити запис",
    recordMemo: "Записати нотатку",
    recording: "Іде запис",
    preparing: "Готуємо розшифровку на пристрої",
    transcribing: (t) => `Розшифровуємо ${t} аудіо на цьому пристрої…`,
    tapToRecord: "Запишіть, що було важливим на сесії.",
    uploadAudio: "або завантажте аудіофайл",
    transcript: "Розшифровка",
    transcriptDeleted: "Розшифровку видалено під час підписання запису.",
    transcriptPlaceholder: "Тут з’явиться ваша нотатка. Її також можна ввести або вставити.",
    drafting: "Готуємо запис…",
    draftRecord: "Підготувати запис",
    privacyNote:
      "Аудіо не залишає цей пристрій і не зберігається. Ім’я клієнта та ваше, номери телефонів, електронні адреси, PESEL і адреси проживання видаляються до будь-якої обробки ШІ, а розшифровка знищується в момент підписання.",
    signedBadge: (at) => `Підписано · ${at ?? ""}`,
    aiDraft: "Чернетка ШІ · перевірте перед підписанням",
    templateDraft: "Чернетка за шаблоном · ШІ вимкнено · перевірте перед підписанням",
    formalRecord: "Документація (запис)",
    formalRecordNote: "· ст. 28 · надається клієнту на запит",
    fieldClient: "Клієнт",
    fieldDate: "Дата",
    fieldForm: "Формат",
    fieldPsychologist: "Психолог",
    bodyPlaceholder: "Підготуйте запис на основі нотатки або напишіть його тут.",
    workingNotes: "Робочі нотатки",
    workingNote: "· приватні · не надаються клієнту",
    workingPlaceholder: "Гіпотези, що перевірити наступного разу…",
    retention:
      "Підписані записи зберігаються 5 років від кінця року, в якому завершилася ваша робота з клієнтом (ст. 28). Після цього Sessio підготує протокол знищення для вашого підтвердження.",
    saving: "Збереження…",
    saved: "Чернетку збережено",
    discard: "Видалити чернетку",
    approveSign: "Затвердити й підписати",
    micBlocked: "Доступ до мікрофона заблоковано. Дозвольте його в браузері або введіть нотатку нижче.",
    transcriptionFailed: (m) => `Не вдалося розшифрувати на цьому пристрої (${m}). Ви можете ввести нотатку вручну.`,
    readFailed: (m) => `Не вдалося прочитати запис: ${m}`,
    draftFailed: "Не вдалося підготувати запис",
    signFailed: "Не вдалося підписати",
  },
};
