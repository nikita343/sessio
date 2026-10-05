import type { Lang } from "../i18n";

type LoginDict = {
  metaTitle: string;
  signupTitle: string;
  signinTitle: string;
  signupBody: string;
  signinBody: string;
  demoResting: string;
  authFailed: string;
  google: string;
  orEmail: string;
  or: string;
  demo: string;
  demoNote: string;
  clientQ: string;
  clientLink: string;
  // form
  yourName: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  oneMoment: string;
  createPractice: string;
  signIn: string;
  haveAccount: string;
  newTo: string;
  openPractice: string;
  // server action messages
  badCredentials: string;
  passwordShort: string;
  checkInbox: string;
};

export const LOGIN_T: Record<Lang, LoginDict> = {
  pl: {
    metaTitle: "Zaloguj się",
    signupTitle: "Załóż gabinet",
    signinTitle: "Witaj ponownie",
    signupBody: "Pięć minut i masz stronę rezerwacji, na której klienci od razu zapłacą za sesję.",
    signinBody: "Zaloguj się do swojego gabinetu.",
    demoResting: "Gabinet demo chwilowo odpoczywa. Spróbuj ponownie za minutę.",
    authFailed: "Logowanie nie zostało dokończone. Spróbuj ponownie.",
    google: "Kontynuuj z Google",
    orEmail: "lub e-mailem",
    or: "lub",
    demo: "Zobacz gabinet demo",
    demoNote: "Gabinet Anny Kowalskiej z przykładowymi klientami. Nic tu nie jest prawdziwe. Dane odświeżają się mniej więcej co godzinę, więc wiadomości testowe mogą znikać.",
    clientQ: "Masz sesję jako klient?",
    clientLink: "Zobacz swoje sesje",
    yourName: "Imię i nazwisko",
    email: "E-mail",
    emailPlaceholder: "anna@gabinet.pl",
    password: "Hasło",
    oneMoment: "Chwileczkę…",
    createPractice: "Załóż gabinet",
    signIn: "Zaloguj się",
    haveAccount: "Masz już konto?",
    newTo: "Nie masz konta?",
    openPractice: "Załóż gabinet",
    badCredentials: "Nieprawidłowy e-mail lub hasło.",
    passwordShort: "Hasło musi mieć co najmniej 8 znaków.",
    checkInbox: "Sprawdź skrzynkę — wysłaliśmy link do potwierdzenia adresu e-mail.",
  },
  en: {
    metaTitle: "Sign in",
    signupTitle: "Open your practice",
    signinTitle: "Welcome back",
    signupBody: "Five minutes to a booking page your clients can pay on.",
    signinBody: "Sign in to your practice.",
    demoResting: "The demo practice is resting. Try again in a minute.",
    authFailed: "Sign-in didn’t finish. Please try again.",
    google: "Continue with Google",
    orEmail: "or with email",
    or: "or",
    demo: "Explore the demo practice",
    demoNote: "Anna Kowalska’s practice with sample clients. Nothing real. Sample data refreshes about every hour, so test messages may disappear.",
    clientQ: "Booked a session as a client?",
    clientLink: "See your sessions",
    yourName: "Your name",
    email: "Email",
    emailPlaceholder: "you@practice.pl",
    password: "Password",
    oneMoment: "One moment…",
    createPractice: "Create my practice",
    signIn: "Sign in",
    haveAccount: "Already have a practice?",
    newTo: "New to Sessio?",
    openPractice: "Open your practice",
    badCredentials: "That email and password don't match.",
    passwordShort: "Use at least 8 characters for the password.",
    checkInbox: "Check your inbox — we sent a link to confirm your email.",
  },
  uk: {
    metaTitle: "Вхід",
    signupTitle: "Створіть свою практику",
    signinTitle: "З поверненням",
    signupBody: "П’ять хвилин — і у вас є сторінка бронювання, де клієнти одразу оплачують сесію.",
    signinBody: "Увійдіть до своєї практики.",
    demoResting: "Демопрактика зараз відпочиває. Спробуйте ще раз за хвилину.",
    authFailed: "Вхід не завершився. Спробуйте ще раз.",
    google: "Продовжити з Google",
    orEmail: "або електронною поштою",
    or: "або",
    demo: "Переглянути демопрактику",
    demoNote: "Практика Анни Ковальської з тестовими клієнтами. Нічого справжнього. Дані оновлюються приблизно щогодини, тож тестові повідомлення можуть зникати.",
    clientQ: "Записалися на сесію як клієнт?",
    clientLink: "Переглянути свої сесії",
    yourName: "Ім’я та прізвище",
    email: "Електронна пошта",
    emailPlaceholder: "you@practice.pl",
    password: "Пароль",
    oneMoment: "Хвилинку…",
    createPractice: "Створити практику",
    signIn: "Увійти",
    haveAccount: "Вже маєте акаунт?",
    newTo: "Ще не маєте акаунта?",
    openPractice: "Створіть практику",
    badCredentials: "Неправильна електронна пошта або пароль.",
    passwordShort: "Пароль має містити щонайменше 8 символів.",
    checkInbox: "Перевірте пошту — ми надіслали посилання для підтвердження адреси.",
  },
};
