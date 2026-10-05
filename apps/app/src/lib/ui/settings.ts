import type { Lang } from "../i18n";

export const SETTINGS_T: Record<
  Lang,
  {
    metaTitle: string;
    title: string;
    account: string;
    timezone: string;
    currency: string;
    cancellation: string;
    cancellationValue: (h: number) => string;
    dataLocation: string;
    dataLocationValue: string;
    retention: string;
    retentionValue: string;
    agreementTitle: string;
    agreementBody: string;
    preview: string;
    extraTerms: string;
    extraTermsHint: string;
    extraTermsPlaceholder: string;
    disclaimer: string;
    save: string;
    saved: string;
    privacyTitle: string;
    privacyBody: string;
    signOut: string;
  }
> = {
  pl: {
    metaTitle: "Ustawienia",
    title: "Ustawienia",
    account: "Konto",
    timezone: "Strefa czasowa",
    currency: "Waluta",
    cancellation: "Bezpłatne odwołanie",
    cancellationValue: (h) => `do ${h} godz. przed sesją`,
    dataLocation: "Lokalizacja danych",
    dataLocationValue: "UE (Irlandia) · dane szyfrowane",
    retention: "Przechowywanie dokumentacji",
    retentionValue: "5 lat od końca roku, w którym zakończyła się Twoja praca z klientem (ustawa o zawodzie psychologa, art. 28)",
    agreementTitle: "Umowa z klientem",
    agreementBody:
      "Klient akceptuje ją przed płatnością. Powstaje automatycznie na podstawie Twoich ustawień — ceny, długości sesji, terminu bezpłatnego odwołania i adresu — w wersji polskiej, angielskiej i ukraińskiej. Obejmuje poufność, nagrywanie sesji, sytuacje kryzysowe, ochronę danych oraz 14-dniowe prawo odstąpienia od umowy. Sessio przechowuje dokładną wersję zaakceptowaną przez każdego klienta wraz z datą akceptacji.",
    preview: "Podgląd ↗",
    extraTerms: "Twoje dodatkowe postanowienia",
    extraTermsHint: "(opcjonalnie, jedno w wierszu; pojawią się w umowie jako punkt 12)",
    extraTermsPlaceholder:
      "np. Na sesje dla par rezerwację robią oboje partnerzy. Superwizja: omawiam zanonimizowane przypadki z moim superwizorem.",
    disclaimer: "To szablon wyjściowy, a nie porada prawna — jeśli w Twojej praktyce obowiązują szczególne zasady, skonsultuj go z prawnikiem.",
    save: "Zapisz",
    saved: "Zapisano ✓",
    privacyTitle: "Prywatność",
    privacyBody:
      "Jesteś administratorem danych swoich klientów; Sessio przetwarza je w Twoim imieniu na podstawie umowy powierzenia przetwarzania danych. Sesje wideo łączą się bezpośrednio (peer-to-peer) między Tobą a klientem — nie przechodzą przez serwery Sessio i nie są na nich zapisywane. Notatki głosowe są transkrybowane w Twojej przeglądarce, a nagranie zostaje usunięte.",
    signOut: "Wyloguj się",
  },
  en: {
    metaTitle: "Settings",
    title: "Settings",
    account: "Account",
    timezone: "Time zone",
    currency: "Currency",
    cancellation: "Free cancellation",
    cancellationValue: (h) => `up to ${h} h before`,
    dataLocation: "Data location",
    dataLocationValue: "EU (Ireland) · encrypted at rest",
    retention: "Record retention",
    retentionValue: "5 years from the end of the year your work with a client ended (Psychologist Act, art. 28)",
    agreementTitle: "Client agreement",
    agreementBody:
      "Clients accept this before they pay. It is built from your settings — price, session length, cancellation window and address — in Polish, English and Ukrainian, and covers confidentiality, recording, emergencies, data and the 14-day withdrawal right. Sessio stores the exact version each client accepted, with the date.",
    preview: "Preview ↗",
    extraTerms: "Your additional terms",
    extraTermsHint: "(optional, one per line, shown as section 12)",
    extraTermsPlaceholder: "e.g. Sessions with couples require both partners to book. Supervision: I discuss anonymised cases with my supervisor.",
    disclaimer: "A starting template, not legal advice — have it checked if your practice has special terms.",
    save: "Save",
    saved: "Saved ✓",
    privacyTitle: "Privacy",
    privacyBody:
      "You are the data controller for your clients’ records; Sessio processes them on your behalf under a data processing agreement. Video sessions run peer-to-peer between you and your client — they never pass through or get stored on Sessio’s servers. Voice memos are transcribed in your browser and the audio is discarded.",
    signOut: "Sign out",
  },
  uk: {
    metaTitle: "Налаштування",
    title: "Налаштування",
    account: "Обліковий запис",
    timezone: "Часовий пояс",
    currency: "Валюта",
    cancellation: "Безкоштовне скасування",
    cancellationValue: (h) => `до ${h} год до сесії`,
    dataLocation: "Розташування даних",
    dataLocationValue: "ЄС (Ірландія) · дані зашифровано",
    retention: "Зберігання документації",
    retentionValue: "5 років від кінця року, у якому завершилася ваша робота з клієнтом (Закон про професію психолога, ст. 28)",
    agreementTitle: "Договір з клієнтом",
    agreementBody:
      "Клієнт приймає його перед оплатою. Договір формується з ваших налаштувань — ціни, тривалості сесії, строку безкоштовного скасування та адреси — польською, англійською та українською мовами й охоплює конфіденційність, запис сесій, кризові ситуації, захист даних і 14-денне право на відмову від договору. Sessio зберігає точну версію, яку прийняв кожен клієнт, разом із датою.",
    preview: "Попередній перегляд ↗",
    extraTerms: "Ваші додаткові умови",
    extraTermsHint: "(необов’язково, по одній у рядку; з’являться в договорі як пункт 12)",
    extraTermsPlaceholder:
      "Напр.: Сесії для пар бронюють обидва партнери. Супервізія: я обговорюю анонімізовані випадки зі своїм супервізором.",
    disclaimer: "Це базовий шаблон, а не юридична консультація — якщо у вашій практиці є особливі умови, проконсультуйтеся з юристом.",
    save: "Зберегти",
    saved: "Збережено ✓",
    privacyTitle: "Конфіденційність",
    privacyBody:
      "Ви є контролером даних своїх клієнтів; Sessio обробляє їх від вашого імені на підставі договору про обробку даних. Відеосесії з’єднуються напряму (peer-to-peer) між вами та клієнтом — вони не проходять через сервери Sessio і не зберігаються на них. Голосові нотатки розшифровуються у вашому браузері, а аудіо видаляється.",
    signOut: "Вийти",
  },
};
