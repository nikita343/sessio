import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "node:crypto";
import { createClient } from "./supabase/server";
import { pickLang, type Lang } from "./i18n";

export type MySession = {
  id: string;
  manage_token: string;
  status: "pending_payment" | "confirmed" | "cancelled" | "completed" | "no_show";
  payment_status: "unpaid" | "paid" | "refunded";
  starts_at: string;
  ends_at: string;
  format: "online" | "in_person";
  price_minor: number;
  currency: string;
  room_name: string | null;
  paid_via: string | null;
  client_name: string;
  therapist_name: string;
  therapist_slug: string;
  therapist_title: string | null;
  therapist_photo: string | null;
  therapist_address: string | null;
  timezone: string;
  cancellation_hours: number;
  service_name: string | null;
  service_id: string | null;
  hold_expires_at: string | null;
};

export type MyThread = {
  therapist_slug: string;
  therapist_name: string;
  therapist_photo: string | null;
  last_body: string | null;
  last_author: "client" | "therapist" | "assistant" | null;
  last_at: string | null;
};

export type MyProfile = { email: string; full_name: string; avatar_url: string | null; is_therapist: boolean };

export const DEMO_CLIENT_EMAIL = "marta@demo.usesessio.com";
/** The demo client's password is derived from the server secret, so no extra secret has to be stored anywhere. */
export function demoClientPassword(secret: string) {
  return createHmac("sha256", secret).update("demo-client").digest("hex");
}

export async function portalLang(param?: unknown): Promise<Lang> {
  const jar = await cookies();
  const fromParam = typeof param === "string" && ["pl", "uk", "en"].includes(param) ? (param as Lang) : null;
  const saved = jar.get("sessio_lang")?.value;
  return fromParam ?? pickLang(undefined, saved);
}

/** Signed-in client (anyone with a verified email), or bounce to the client sign-in. */
export async function requireClient(next = "/me") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/me/login?next=${encodeURIComponent(next)}`);
  const { data } = await supabase.rpc("my_profile");
  const profile = ((Array.isArray(data) ? data[0] : data) as MyProfile | null) ?? {
    email: user.email ?? "",
    full_name: "",
    avatar_url: null,
    is_therapist: false,
  };
  return { supabase, user, profile };
}

const en = {
  portal: "Your sessions",
  sessions: "Sessions",
  messages: "Messages",
  details: "My details",
  signOut: "Sign out",
  hi: (n: string) => (n ? `Hi, ${n}.` : "Hi."),
  nextUp: "Next session",
  noUpcoming: "No upcoming sessions.",
  noUpcomingBody: "When you book with your therapist using this email, it appears here — with the video link, receipt and options to move or cancel.",
  upcoming: "Coming up",
  past: "Past sessions",
  noPast: "Your past sessions and receipts will appear here.",
  yourTherapists: "Your therapists",
  bookAgain: "Book a session",
  message: "Message",
  join: "Join the session",
  addCal: "Add to calendar",
  move: "Change time",
  cancel: "Cancel",
  cancelConfirm: "Cancel this session",
  finishPay: "Finish payment",
  awaitingPay: "Awaiting payment",
  paid: (via: string) => `Paid · ${via}`,
  refunded: "Refunded",
  cancelled: "Cancelled",
  noShow: "Missed",
  done: "Held",
  online: "Online · private video room",
  inPerson: (a: string) => `In person · ${a}`,
  freeUntil: (when: string) => `Free changes until ${when}`,
  lockedChange: (h: number) => `Less than ${h} h to go — write to your therapist to change it.`,
  receipt: "Details",
  privacy: "Sessions are never recorded, and video goes directly between you and your therapist. Your therapist's notes are private to them.",
  moveTitle: "Choose a new time",
  moveBody: (n: string) => `Your payment moves with the session. ${n} sees the change straight away.`,
  moveCta: (t: string) => `Move to ${t}`,
  moved: "Done — your session has a new time. The video link stays the same.",
  movedErr: "That time was just taken or is too soon. Pick another.",
  threads: "Conversations",
  noThreads: "No conversations yet.",
  writeTo: (n: string) => `Write to ${n}…`,
  send: "Send",
  you: "You",
  assistant: "Assistant",
  replyNote: "Your therapist replies here and by email. In an emergency, call 112.",
  signInTitle: "Your sessions, in one place",
  signInBody: "Sign in with the email you used to book. See upcoming sessions, join video, move or cancel, find receipts and message your therapist.",
  google: "Continue with Google",
  demo: "Explore as a client (demo)",
  demoNote: "Marta’s account with Anna Kowalska. Sample data, nothing real.",
  therapistQ: "Are you a therapist?",
  therapistLink: "Sign in to your practice",
  orBook: "No account needed to book — use your therapist’s link.",
  lang: "Language",
  switchPractice: "Open my practice",
  minutes: (m: number) => `${m} min`,
  or: "or",
  saveTitle: "Keep your sessions in one place",
  saveBody: "Sign in with the same email to see this and future sessions, move or cancel them, find receipts and message your therapist. Optional.",
  openAccount: "Open your sessions",
};
type PortalDict = typeof en;

const pl: PortalDict = {
  portal: "Twoje sesje",
  sessions: "Sesje",
  messages: "Wiadomości",
  details: "Moje dane",
  signOut: "Wyloguj",
  hi: (n) => (n ? `Cześć, ${n}.` : "Cześć."),
  nextUp: "Najbliższa sesja",
  noUpcoming: "Brak zaplanowanych sesji.",
  noUpcomingBody: "Gdy zarezerwujesz sesję na ten adres e-mail, pojawi się tutaj — z linkiem do wideo, potwierdzeniem płatności i opcją zmiany terminu.",
  upcoming: "Nadchodzące",
  past: "Odbyte sesje",
  noPast: "Tu pojawią się odbyte sesje i potwierdzenia płatności.",
  yourTherapists: "Twoi terapeuci",
  bookAgain: "Zarezerwuj sesję",
  message: "Napisz",
  join: "Dołącz do sesji",
  addCal: "Dodaj do kalendarza",
  move: "Zmień termin",
  cancel: "Odwołaj",
  cancelConfirm: "Odwołaj tę sesję",
  finishPay: "Dokończ płatność",
  awaitingPay: "Oczekuje na płatność",
  paid: (via) => `Opłacono · ${via}`,
  refunded: "Zwrócono",
  cancelled: "Odwołana",
  noShow: "Nieobecność",
  done: "Odbyta",
  online: "Online · prywatny pokój wideo",
  inPerson: (a) => `Stacjonarnie · ${a}`,
  freeUntil: (when) => `Bezpłatna zmiana do ${when}`,
  lockedChange: (h) => `Zostało mniej niż ${h} h — napisz do terapeuty, aby to zmienić.`,
  receipt: "Szczegóły",
  privacy: "Sesje nigdy nie są nagrywane, a wideo płynie bezpośrednio między Tobą a terapeutą. Robocze notatki terapeuty nie są nikomu udostępniane.",
  moveTitle: "Wybierz nowy termin",
  moveBody: (n) => `Płatność przechodzi na nowy termin. ${n} od razu widzi zmianę.`,
  moveCta: (t) => `Przenieś na ${t}`,
  moved: "Gotowe — sesja ma nowy termin. Link do wideo się nie zmienia.",
  movedErr: "Ten termin został właśnie zajęty lub jest za blisko. Wybierz inny.",
  threads: "Rozmowy",
  noThreads: "Brak rozmów.",
  writeTo: (n) => `Napisz do: ${n}…`,
  send: "Wyślij",
  you: "Ty",
  assistant: "Asystent",
  replyNote: "Terapeuta odpowie tutaj i mailem. W nagłej sytuacji zadzwoń pod 112.",
  signInTitle: "Twoje sesje w jednym miejscu",
  signInBody: "Zaloguj się adresem, którego użyto przy rezerwacji. Zobacz terminy, dołącz do wideo, zmień lub odwołaj sesję, znajdź potwierdzenia i napisz do terapeuty.",
  google: "Kontynuuj z Google",
  demo: "Zobacz jako klient (demo)",
  demoNote: "Konto Marty u Anny Kowalskiej. Przykładowe dane.",
  therapistQ: "Jesteś terapeutą?",
  therapistLink: "Zaloguj się do gabinetu",
  orBook: "Do rezerwacji konto nie jest potrzebne — wystarczy link od terapeuty.",
  lang: "Język",
  switchPractice: "Otwórz mój gabinet",
  minutes: (m) => `${m} min`,
  or: "lub",
  saveTitle: "Wszystkie sesje w jednym miejscu",
  saveBody: "Zaloguj się tym samym adresem, aby widzieć tę i kolejne sesje, zmieniać terminy, znaleźć potwierdzenia i pisać do terapeuty. Opcjonalnie.",
  openAccount: "Otwórz swoje sesje",
};

const uk: PortalDict = {
  portal: "Ваші сесії",
  sessions: "Сесії",
  details: "Мої дані",
  messages: "Повідомлення",
  signOut: "Вийти",
  hi: (n) => (n ? `Привіт, ${n}.` : "Привіт."),
  nextUp: "Найближча сесія",
  noUpcoming: "Немає запланованих сесій.",
  noUpcomingBody: "Коли ви забронюєте сесію на цю адресу, вона з’явиться тут — з посиланням на відео, квитанцією та можливістю змінити час.",
  upcoming: "Найближчі",
  past: "Минулі сесії",
  noPast: "Тут з’являться минулі сесії та квитанції.",
  yourTherapists: "Ваші терапевти",
  bookAgain: "Забронювати сесію",
  message: "Написати",
  join: "Приєднатися до сесії",
  addCal: "Додати в календар",
  move: "Змінити час",
  cancel: "Скасувати",
  cancelConfirm: "Скасувати цю сесію",
  finishPay: "Завершити оплату",
  awaitingPay: "Очікує оплати",
  paid: (via) => `Оплачено · ${via}`,
  refunded: "Повернено",
  cancelled: "Скасовано",
  noShow: "Пропущено",
  done: "Відбулася",
  online: "Онлайн · приватна відеокімната",
  inPerson: (a) => `Особисто · ${a}`,
  freeUntil: (when) => `Безкоштовні зміни до ${when}`,
  lockedChange: (h) => `Залишилося менше ${h} год — напишіть терапевту, щоб змінити.`,
  receipt: "Деталі",
  privacy: "Сесії ніколи не записуються, а відео йде напряму між вами та терапевтом. Нотатки терапевта бачить лише він.",
  moveTitle: "Оберіть новий час",
  moveBody: (n) => `Оплата переходить на новий час. ${n} одразу бачить зміну.`,
  moveCta: (t) => `Перенести на ${t}`,
  moved: "Готово — сесія має новий час. Посилання на відео те саме.",
  movedErr: "Цей час щойно зайняли або він занадто близько. Оберіть інший.",
  threads: "Розмови",
  noThreads: "Розмов ще немає.",
  writeTo: (n) => `Написати: ${n}…`,
  send: "Надіслати",
  you: "Ви",
  assistant: "Асистент",
  replyNote: "Терапевт відповість тут і електронною поштою. У надзвичайній ситуації телефонуйте 112.",
  signInTitle: "Ваші сесії в одному місці",
  signInBody: "Увійдіть з адресою, яку ви вказали під час бронювання. Переглядайте сесії, приєднуйтесь до відео, змінюйте час, знаходьте квитанції та пишіть терапевту.",
  google: "Продовжити з Google",
  demo: "Подивитися як клієнт (демо)",
  demoNote: "Акаунт Марти в Анни Ковальської. Приклад даних.",
  therapistQ: "Ви терапевт?",
  therapistLink: "Увійти до практики",
  orBook: "Для бронювання акаунт не потрібен — достатньо посилання терапевта.",
  lang: "Мова",
  switchPractice: "Відкрити мою практику",
  minutes: (m) => `${m} хв`,
  or: "або",
  saveTitle: "Усі сесії в одному місці",
  saveBody: "Увійдіть з тією ж адресою, щоб бачити цю й наступні сесії, змінювати час, знаходити квитанції та писати терапевту. За бажанням.",
  openAccount: "Відкрити ваші сесії",
};

export function pt(lang: Lang): PortalDict {
  return lang === "pl" ? pl : lang === "uk" ? uk : en;
}
