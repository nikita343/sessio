import { createHash } from "node:crypto";
import type { Lang } from "./i18n";

/**
 * The agreement between a therapist and a client ("umowa o świadczenie usług psychologicznych").
 * Sessio is the technical platform, not a party. The text is built from the therapist's own settings
 * so price, length, cancellation window and address always match what the client books; the therapist
 * can add their own terms at the end. A hash of the exact text is stored with each booking.
 */

export type AgreementInput = {
  therapistName: string;
  title: string;
  address: string | null;
  formats: string[];
  cancellationHours: number;
  durationMin: number;
  priceLabel: string;
  notes: string | null;
};

export type Agreement = { title: string; intro: string; sections: { h: string; items: string[] }[]; footer: string; version: string };

const T = {
  pl: {
    title: "Umowa o świadczenie usług psychologicznych",
    intro: (a: AgreementInput) =>
      `Umowa zawierana jest między ${a.therapistName}${a.title ? ` (${a.title})` : ""} („Specjalista”) a osobą rezerwującą sesję („Klient”) w chwili rezerwacji i opłacenia sesji. Sessio jest wyłącznie dostawcą narzędzia technicznego i nie jest stroną umowy ani nie świadczy usług psychologicznych.`,
    s: (a: AgreementInput) => [
      {
        h: "1. Przedmiot umowy",
        items: [
          `Specjalista prowadzi z Klientem sesję konsultacji psychologicznej lub psychoterapii trwającą ${a.durationMin} minut.`,
          a.formats.includes("in_person") && a.address
            ? `Sesja odbywa się online w prywatnym pokoju wideo Sessio albo stacjonarnie pod adresem: ${a.address} — zgodnie z wyborem przy rezerwacji.`
            : "Sesja odbywa się online w prywatnym pokoju wideo Sessio.",
          "Usługa nie jest świadczeniem medycznym ani pomocą w nagłych wypadkach.",
        ],
      },
      {
        h: "2. Wynagrodzenie i płatność",
        items: [
          `Cena jednej sesji wynosi ${a.priceLabel} i jest płatna z góry przy rezerwacji (BLIK, karta lub Przelewy24).`,
          "Płatność trafia bezpośrednio na konto Specjalisty za pośrednictwem Stripe. Sessio nie przyjmuje ani nie przechowuje pieniędzy Klienta.",
          "Rachunek lub fakturę wystawia Specjalista na prośbę Klienta.",
        ],
      },
      {
        h: "3. Odwołanie i zmiana terminu",
        items: [
          `Klient może bezpłatnie odwołać sesję lub zmienić jej termin najpóźniej ${a.cancellationHours} godz. przed jej rozpoczęciem — opłata zostanie zwrócona automatycznie.`,
          `Przy odwołaniu później niż ${a.cancellationHours} godz. przed sesją lub nieobecności Klienta opłata nie podlega zwrotowi.`,
          "Jeśli sesję odwoła Specjalista albo nie dołączy do niej, Klient otrzymuje pełny zwrot lub nowy termin — według wyboru Klienta.",
        ],
      },
      {
        h: "4. Prawo odstąpienia od umowy",
        items: [
          "Klientowi będącemu konsumentem przysługuje prawo odstąpienia od umowy w ciągu 14 dni.",
          "Rezerwując sesję przypadającą w tym okresie, Klient żąda rozpoczęcia usługi przed jego upływem i przyjmuje do wiadomości, że po pełnym wykonaniu usługi traci prawo odstąpienia.",
        ],
      },
      {
        h: "5. Poufność",
        items: [
          "Specjalista zachowuje w tajemnicy wszystko, czego dowiedział się w związku z sesjami, zgodnie z ustawą o zawodzie psychologa i zasadami etyki zawodowej.",
          "Tajemnica może zostać uchylona tylko w przypadkach przewidzianych prawem, w szczególności gdy zachodzi bezpośrednie zagrożenie życia lub zdrowia Klienta lub innych osób.",
        ],
      },
      {
        h: "6. Nagrywanie",
        items: [
          "Żadna ze stron nie nagrywa sesji (dźwięku, obrazu ani zrzutów ekranu) bez pisemnej zgody drugiej strony.",
          "Sessio nie nagrywa sesji: obraz i dźwięk płyną bezpośrednio między uczestnikami w postaci zaszyfrowanej, a czat w trakcie sesji nie jest zapisywany.",
        ],
      },
      {
        h: "7. Sesje online",
        items: [
          "Klient zapewnia prywatne, spokojne miejsce i stabilne połączenie z internetem.",
          "Jeśli połączenie zostanie przerwane, strony próbują połączyć się ponownie; sesja przerwana z przyczyn technicznych po stronie Specjalisty zostanie dokończona lub powtórzona.",
          "Specjalista może przerwać sesję, jeśli nie da się zapewnić bezpieczeństwa lub poufności rozmowy.",
        ],
      },
      {
        h: "8. Bezpieczeństwo",
        items: [
          "Sesje i wiadomości nie służą do udzielania pomocy w sytuacjach nagłych.",
          "W sytuacji zagrożenia życia lub zdrowia Klient dzwoni pod 112 albo na całodobowy telefon wsparcia 116 123 (dorośli) lub 116 111 (dzieci i młodzież).",
        ],
      },
      {
        h: "9. Dokumentacja i dane osobowe",
        items: [
          "Administratorem danych osobowych Klienta jest Specjalista. Sessio przetwarza je w jego imieniu na podstawie umowy powierzenia, na serwerach w Unii Europejskiej.",
          "Specjalista prowadzi dokumentację w zakresie wymaganym przez prawo i przechowuje ją przez okres wymagany przepisami. Klient ma prawo dostępu do swojej dokumentacji, z wyłączeniem roboczych notatek Specjalisty.",
        ],
      },
      {
        h: "10. Osoby niepełnoletnie",
        items: ["Sesje z osobą poniżej 18. roku życia odbywają się wyłącznie za zgodą przedstawiciela ustawowego, który dokonuje rezerwacji."],
      },
      {
        h: "11. Reklamacje i kontakt",
        items: [
          "Uwagi dotyczące sesji Klient kieruje bezpośrednio do Specjalisty przez wiadomości w Sessio lub e-mail; odpowiedź następuje w ciągu 14 dni.",
          "Problemy techniczne z platformą można zgłaszać na hello@usesessio.com.",
        ],
      },
    ],
    notes: "12. Dodatkowe warunki Specjalisty",
    footer: "Umowa podlega prawu polskiemu. Akceptacja następuje elektronicznie przy rezerwacji; jej data i wersja są zapisywane przy rezerwacji.",
  },
  en: {
    title: "Agreement for psychological services",
    intro: (a: AgreementInput) =>
      `This agreement is made between ${a.therapistName}${a.title ? ` (${a.title})` : ""} (“the Practitioner”) and the person booking the session (“the Client”) when a session is booked and paid for. Sessio only provides the technical platform; it is not a party to this agreement and does not provide psychological services.`,
    s: (a: AgreementInput) => [
      {
        h: "1. The service",
        items: [
          `The Practitioner holds a psychological consultation or therapy session of ${a.durationMin} minutes with the Client.`,
          a.formats.includes("in_person") && a.address
            ? `Sessions take place online in a private Sessio video room, or in person at ${a.address}, as chosen when booking.`
            : "Sessions take place online in a private Sessio video room.",
          "The service is not a medical service and not an emergency service.",
        ],
      },
      {
        h: "2. Fee and payment",
        items: [
          `Each session costs ${a.priceLabel} and is paid in advance when booking (BLIK, card or Przelewy24).`,
          "Payment goes directly to the Practitioner's account via Stripe. Sessio never receives or holds the Client's money.",
          "The Practitioner issues a receipt or invoice on request.",
        ],
      },
      {
        h: "3. Cancelling and rescheduling",
        items: [
          `The Client can cancel or move a session free of charge up to ${a.cancellationHours} hours before it starts; the fee is refunded automatically.`,
          `If the Client cancels later than ${a.cancellationHours} hours before the session or does not attend, the fee is not refunded.`,
          "If the Practitioner cancels or does not join, the Client gets a full refund or a new time, as the Client prefers.",
        ],
      },
      {
        h: "4. Right of withdrawal",
        items: [
          "A Client who is a consumer may withdraw from the agreement within 14 days.",
          "By booking a session within that period, the Client asks for the service to start early and accepts that the right of withdrawal is lost once the session has been fully provided.",
        ],
      },
      {
        h: "5. Confidentiality",
        items: [
          "The Practitioner keeps everything learned in the sessions confidential, as required by the Polish Psychologist Act and professional ethics.",
          "Confidentiality may only be set aside where the law requires it, in particular when there is a direct threat to the life or health of the Client or others.",
        ],
      },
      {
        h: "6. Recording",
        items: [
          "Neither party records a session (audio, video or screenshots) without the other's written consent.",
          "Sessio does not record sessions: video and audio travel directly between participants, encrypted, and the in-session chat is not saved.",
        ],
      },
      {
        h: "7. Online sessions",
        items: [
          "The Client joins from a private, quiet place with a stable internet connection.",
          "If the connection drops, both try to reconnect; a session cut short by a technical problem on the Practitioner's side is completed or repeated.",
          "The Practitioner may end a session if safety or confidentiality cannot be ensured.",
        ],
      },
      {
        h: "8. Safety",
        items: [
          "Sessions and messages are not an emergency service.",
          "In an emergency the Client calls 112, or the free 24/7 support lines 116 123 (adults) or 116 111 (children and young people).",
        ],
      },
      {
        h: "9. Records and personal data",
        items: [
          "The Practitioner is the controller of the Client's personal data. Sessio processes it on the Practitioner's behalf under a data processing agreement, on servers in the European Union.",
          "The Practitioner keeps records as required by law and for as long as the law requires. The Client may access their records, except the Practitioner's working notes.",
        ],
      },
      {
        h: "10. Minors",
        items: ["Sessions with anyone under 18 take place only with the consent of a legal guardian, who makes the booking."],
      },
      {
        h: "11. Complaints and contact",
        items: [
          "Feedback about a session goes directly to the Practitioner through Sessio messages or email; the Practitioner replies within 14 days.",
          "Technical problems with the platform can be reported to hello@usesessio.com.",
        ],
      },
    ],
    notes: "12. The Practitioner's additional terms",
    footer: "This agreement is governed by Polish law. It is accepted electronically when booking; the date and version are stored with the booking.",
  },
  uk: {
    title: "Договір про надання психологічних послуг",
    intro: (a: AgreementInput) =>
      `Договір укладається між ${a.therapistName}${a.title ? ` (${a.title})` : ""} («Спеціаліст») та особою, яка бронює сесію («Клієнт»), у момент бронювання та оплати сесії. Sessio лише надає технічну платформу, не є стороною договору й не надає психологічних послуг.`,
    s: (a: AgreementInput) => [
      {
        h: "1. Предмет договору",
        items: [
          `Спеціаліст проводить із Клієнтом сесію психологічної консультації або психотерапії тривалістю ${a.durationMin} хвилин.`,
          a.formats.includes("in_person") && a.address
            ? `Сесія відбувається онлайн у приватній відеокімнаті Sessio або очно за адресою: ${a.address} — відповідно до вибору під час бронювання.`
            : "Сесія відбувається онлайн у приватній відеокімнаті Sessio.",
          "Послуга не є медичною допомогою та не призначена для екстрених ситуацій.",
        ],
      },
      {
        h: "2. Вартість і оплата",
        items: [
          `Вартість однієї сесії — ${a.priceLabel}, оплата наперед під час бронювання (BLIK, картка або Przelewy24).`,
          "Оплата надходить безпосередньо на рахунок Спеціаліста через Stripe. Sessio не отримує й не зберігає кошти Клієнта.",
          "Рахунок або фактуру Спеціаліст видає на прохання Клієнта.",
        ],
      },
      {
        h: "3. Скасування та перенесення",
        items: [
          `Клієнт може безкоштовно скасувати або перенести сесію не пізніше ніж за ${a.cancellationHours} год до її початку — оплату буде повернено автоматично.`,
          `У разі скасування пізніше ніж за ${a.cancellationHours} год або відсутності Клієнта оплата не повертається.`,
          "Якщо сесію скасовує Спеціаліст або не приєднується до неї, Клієнт отримує повне повернення коштів або новий час — на вибір Клієнта.",
        ],
      },
      {
        h: "4. Право на відмову від договору",
        items: [
          "Клієнт-споживач має право відмовитися від договору протягом 14 днів.",
          "Бронюючи сесію в цей період, Клієнт просить почати надання послуги раніше й розуміє, що після повного надання послуги втрачає право на відмову.",
        ],
      },
      {
        h: "5. Конфіденційність",
        items: [
          "Спеціаліст зберігає в таємниці все, що дізнався під час сесій, відповідно до польського закону про професію психолога та професійної етики.",
          "Таємницю може бути розкрито лише у випадках, передбачених законом, зокрема за безпосередньої загрози життю чи здоров’ю Клієнта або інших осіб.",
        ],
      },
      {
        h: "6. Запис",
        items: [
          "Жодна зі сторін не записує сесію (звук, відео чи знімки екрана) без письмової згоди іншої сторони.",
          "Sessio не записує сесії: відео та звук передаються безпосередньо між учасниками в зашифрованому вигляді, а чат під час сесії не зберігається.",
        ],
      },
      {
        h: "7. Онлайн-сесії",
        items: [
          "Клієнт приєднується з приватного тихого місця зі стабільним інтернетом.",
          "Якщо зв’язок перерветься, сторони намагаються під’єднатися знову; сесію, перервану через технічні проблеми з боку Спеціаліста, буде завершено або проведено повторно.",
          "Спеціаліст може завершити сесію, якщо неможливо забезпечити безпеку чи конфіденційність розмови.",
        ],
      },
      {
        h: "8. Безпека",
        items: [
          "Сесії та повідомлення не призначені для екстреної допомоги.",
          "У разі загрози життю чи здоров’ю Клієнт телефонує 112 або на цілодобові лінії підтримки 116 123 (дорослі) чи 116 111 (діти й молодь).",
        ],
      },
      {
        h: "9. Документація та персональні дані",
        items: [
          "Розпорядником персональних даних Клієнта є Спеціаліст. Sessio обробляє їх від його імені на підставі договору доручення, на серверах у Європейському Союзі.",
          "Спеціаліст веде документацію в обсязі, передбаченому законом, і зберігає її протягом встановленого строку. Клієнт має право доступу до своєї документації, крім робочих нотаток Спеціаліста.",
        ],
      },
      {
        h: "10. Неповнолітні",
        items: ["Сесії з особою до 18 років відбуваються лише за згодою законного представника, який здійснює бронювання."],
      },
      {
        h: "11. Скарги та контакт",
        items: [
          "Зауваження щодо сесії Клієнт надсилає безпосередньо Спеціалісту через повідомлення Sessio або e-mail; відповідь — протягом 14 днів.",
          "Технічні проблеми з платформою можна повідомити на hello@usesessio.com.",
        ],
      },
    ],
    notes: "12. Додаткові умови Спеціаліста",
    footer: "Договір регулюється правом Польщі. Його приймають електронно під час бронювання; дата й версія зберігаються разом із бронюванням.",
  },
} as const;

export function buildAgreement(a: AgreementInput, lang: Lang): Agreement {
  const t = T[lang];
  const sections: Agreement["sections"] = t.s(a).map((s) => ({ h: s.h, items: [...s.items] }));
  const notes = (a.notes ?? "").trim();
  if (notes) sections.push({ h: t.notes, items: notes.split(/\n+/).map((l) => l.trim()).filter(Boolean) });
  const body = JSON.stringify([t.title, t.intro(a), sections, t.footer]);
  const version = `v1-${lang}-${createHash("sha256").update(body).digest("hex").slice(0, 16)}`;
  return { title: t.title, intro: t.intro(a), sections, footer: t.footer, version };
}

export const AGREE_LABEL: Record<Lang, (name: string) => [string, string, string]> = {
  pl: (n) => ["Akceptuję ", "umowę o świadczenie usług psychologicznych", ` (${n}): warunki sesji, odwołań, poufności i płatności.`],
  en: (n) => ["I accept the ", "agreement for psychological services", ` (${n}): session, cancellation, confidentiality and payment terms.`],
  uk: (n) => ["Я приймаю ", "договір про надання психологічних послуг", ` (${n}): умови сесій, скасування, конфіденційності та оплати.`],
};

/** Build the agreement for a published therapist's page from what loadPublic returns. */
export function agreementFor(
  t: { full_name: string; title: string; address: string | null; formats: string[]; cancellation_hours: number; agreement_notes?: string | null },
  service: { duration_min: number; price_minor: number } | null,
  currency: string,
  lang: Lang,
  money: (minor: number, currency: string) => string,
) {
  return buildAgreement(
    {
      therapistName: t.full_name,
      title: t.title,
      address: t.address,
      formats: t.formats ?? ["online"],
      cancellationHours: t.cancellation_hours,
      durationMin: service?.duration_min ?? 50,
      priceLabel: service ? money(service.price_minor, currency) : "—",
      notes: t.agreement_notes ?? null,
    },
    lang,
  );
}
