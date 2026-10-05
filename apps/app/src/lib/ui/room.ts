import type { Lang } from "../i18n";

/** Intl locale per UI language (client-safe copy; ui-lang.ts is server-only). */
export const ROOM_LOCALE: Record<Lang, string> = { pl: "pl-PL", en: "en-GB", uk: "uk-UA" };

type RoomDict = {
  metaTitle: string;
  unavailableTitle: string;
  unavailableBody: string;
  // status line (names are the other person's first name, in the nominative)
  waitingFor: (n: string) => string;
  connected: string;
  connecting: string;
  lostConnection: (n: string) => string;
  leftRoom: (n: string) => string;
  direct: string;
  relayed: string;
  // lobby
  camBlocked: string;
  mute: string;
  unmute: string;
  cameraOff: string;
  cameraOn: string;
  sessionWith: string;
  lobbyDirect: (n: string) => string;
  lobbyNothingRecorded: string;
  lobbyChat: string;
  joinNow: string;
  // left
  leftTitle: string;
  leftBody: string;
  leftTherapist: string;
  leftClient: string;
  rejoin: string;
  backToToday: string;
  // call
  keepOpen: (n: string) => string;
  privateChat: string;
  chatSub: string;
  closeChat: string;
  chatEmpty: (n: string) => string;
  messageTo: (n: string) => string;
  chatOpensWhen: (n: string) => string;
  send: string;
  hideChat: string;
  openChat: string;
  leave: string;
};

export const ROOM_T: Record<Lang, RoomDict> = {
  pl: {
    metaTitle: "Pokój sesji",
    unavailableTitle: "Ten pokój jest niedostępny",
    unavailableBody: "Otwórz link z e-maila z potwierdzeniem rezerwacji albo zaloguj się, jeśli prowadzisz tę sesję. Po odwołaniu sesji jej pokój zostaje zamknięty.",
    waitingFor: (n) => `Czekamy, aż dołączy ${n}…`,
    connected: "Połączono · szyfrowane",
    connecting: "Łączenie…",
    lostConnection: (n) => `${n} stracił(a) połączenie…`,
    leftRoom: (n) => `${n} opuścił(a) pokój`,
    direct: "bezpośrednio",
    relayed: "przez serwer pośredniczący",
    camBlocked: "Kamera lub mikrofon są zablokowane. Zezwól na dostęp w przeglądarce i odśwież stronę.",
    mute: "Wycisz mikrofon",
    unmute: "Włącz mikrofon",
    cameraOff: "Wyłącz kamerę",
    cameraOn: "Włącz kamerę",
    sessionWith: "Twoja sesja",
    lobbyDirect: () => "🔒 Obraz i dźwięk płyną bezpośrednio między wami, zaszyfrowane.",
    lobbyNothingRecorded: "Nic nie jest nagrywane. Serwery Sessio nigdy nie widzą ani nie słyszą sesji.",
    lobbyChat: "Czat w trakcie rozmowy też jest prywatny: wiadomości płyną bezpośrednio między wami i nie są zapisywane.",
    joinNow: "Dołącz teraz",
    leftTitle: "Opuszczono sesję",
    leftBody: "Nic nie zostało nagrane, a czat zniknął.",
    leftTherapist: "Możesz teraz podyktować notatkę.",
    leftClient: "Dbaj o siebie.",
    rejoin: "Dołącz ponownie",
    backToToday: "Wróć do „Dziś”",
    keepOpen: (n) => `Nie zamykaj tej strony. Rozmowa zacznie się, gdy tylko dołączy ${n}.`,
    privateChat: "Prywatny czat",
    chatSub: "Bezpośredni i szyfrowany · nie jest zapisywany",
    closeChat: "Zamknij czat",
    chatEmpty: () => "Wiadomości trafiają prosto do przeglądarki rozmówcy. Nie są nigdzie przechowywane i znikają po zakończeniu rozmowy.",
    messageTo: () => "Napisz wiadomość",
    chatOpensWhen: (n) => `Czat otworzy się, gdy dołączy ${n}`,
    send: "Wyślij",
    hideChat: "Ukryj czat",
    openChat: "Otwórz prywatny czat",
    leave: "Wyjdź",
  },
  en: {
    metaTitle: "Session room",
    unavailableTitle: "This room isn’t available",
    unavailableBody: "Open the link from your booking email, or sign in if you’re the therapist. Cancelled sessions close their room.",
    waitingFor: (n) => `Waiting for ${n}…`,
    connected: "Connected · encrypted",
    connecting: "Connecting…",
    lostConnection: (n) => `${n} lost connection…`,
    leftRoom: (n) => `${n} left the room`,
    direct: "direct",
    relayed: "relayed",
    camBlocked: "Camera or microphone is blocked. Allow access in your browser and reload.",
    mute: "Mute",
    unmute: "Unmute",
    cameraOff: "Camera off",
    cameraOn: "Camera on",
    sessionWith: "Your session with",
    lobbyDirect: (n) => `🔒 Video goes directly between you and ${n}, encrypted.`,
    lobbyNothingRecorded: "Nothing is recorded. Sessio’s servers never see or hear the session.",
    lobbyChat: "The chat inside the call is private too: it goes directly between you and is not saved.",
    joinNow: "Join now",
    leftTitle: "You left the session",
    leftBody: "Nothing was recorded, and the chat is gone.",
    leftTherapist: "You can dictate your note now.",
    leftClient: "Take care.",
    rejoin: "Rejoin",
    backToToday: "Back to today",
    keepOpen: (n) => `Keep this page open. The call starts as soon as ${n} joins.`,
    privateChat: "Private chat",
    chatSub: "Direct and encrypted · not saved",
    closeChat: "Close chat",
    chatEmpty: (n) => `Messages go straight to ${n}’s browser. They aren’t stored anywhere and disappear when the call ends.`,
    messageTo: (n) => `Message ${n}`,
    chatOpensWhen: (n) => `Chat opens when ${n} joins`,
    send: "Send",
    hideChat: "Hide chat",
    openChat: "Open private chat",
    leave: "Leave",
  },
  uk: {
    metaTitle: "Кімната сесії",
    unavailableTitle: "Ця кімната недоступна",
    unavailableBody: "Відкрийте посилання з листа про бронювання або увійдіть, якщо ви проводите цю сесію. Після скасування сесії її кімната закривається.",
    waitingFor: (n) => `Чекаємо, поки приєднається ${n}…`,
    connected: "З’єднано · зашифровано",
    connecting: "З’єднання…",
    lostConnection: (n) => `${n} втратив(-ла) з’єднання…`,
    leftRoom: (n) => `${n} вийшов(-ла) з кімнати`,
    direct: "напряму",
    relayed: "через сервер-посередник",
    camBlocked: "Камеру або мікрофон заблоковано. Дозвольте доступ у браузері й перезавантажте сторінку.",
    mute: "Вимкнути мікрофон",
    unmute: "Увімкнути мікрофон",
    cameraOff: "Вимкнути камеру",
    cameraOn: "Увімкнути камеру",
    sessionWith: "Ваша сесія",
    lobbyDirect: () => "🔒 Відео й звук передаються напряму між вами, у зашифрованому вигляді.",
    lobbyNothingRecorded: "Нічого не записується. Сервери Sessio ніколи не бачать і не чують сесії.",
    lobbyChat: "Чат під час дзвінка теж приватний: повідомлення передаються напряму між вами й не зберігаються.",
    joinNow: "Приєднатися",
    leftTitle: "Ви вийшли із сесії",
    leftBody: "Нічого не записано, а чат зник.",
    leftTherapist: "Тепер можна надиктувати нотатку.",
    leftClient: "Бережіть себе.",
    rejoin: "Приєднатися знову",
    backToToday: "Назад до «Сьогодні»",
    keepOpen: (n) => `Не закривайте цю сторінку. Дзвінок почнеться, щойно приєднається ${n}.`,
    privateChat: "Приватний чат",
    chatSub: "Напряму й зашифровано · не зберігається",
    closeChat: "Закрити чат",
    chatEmpty: () => "Повідомлення надходять просто до браузера співрозмовника. Вони ніде не зберігаються і зникають після завершення дзвінка.",
    messageTo: () => "Напишіть повідомлення",
    chatOpensWhen: (n) => `Чат відкриється, коли приєднається ${n}`,
    send: "Надіслати",
    hideChat: "Сховати чат",
    openChat: "Відкрити приватний чат",
    leave: "Вийти",
  },
};
