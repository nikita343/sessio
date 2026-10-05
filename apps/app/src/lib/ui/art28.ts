import type { Lang } from "../i18n";
import type { Missing } from "../art28";

type T = {
  title: string;
  lead: string;
  complete: string;
  missingTitle: string;
  missing: Record<Missing, string>;
  name: string;
  birth: string;
  pesel: string;
  peselHint: string;
  idDoc: string;
  idDocHint: string;
  address: string;
  guardian: string;
  guardianContact: string;
  guardianHint: string;
  save: string;
  saved: string;
  invalidPesel: string;
  updated: (when: string) => string;
  practice: string;
  psychologist: string;
  register: string;
  agreement: string;
  agreementAt: (when: string, version: string) => string;
  noAgreement: string;
  fillIn: string;
  fromClient: string;
  sourcePortal: string;
  note2028: string;
};

export const ART28_T: Record<Lang, T> = {
  pl: {
    title: "Dane do dokumentacji (art. 28)",
    lead: "Ustawa o zawodzie psychologa wymaga ich w dokumentacji od 19 maja 2028 r. Uzupełnij je przy pierwszej sesji — klient może też zrobić to sam w swoim portalu.",
    complete: "Komplet danych",
    missingTitle: "Brakuje",
    missing: {
      birth_date: "data urodzenia",
      identifier: "PESEL lub nr dokumentu",
      address: "adres klienta",
      guardian: "przedstawiciel ustawowy (osoba niepełnoletnia)",
      register: "Twój nr w rejestrze psychologów",
      practice_address: "adres gabinetu",
    },
    name: "Imię i nazwisko",
    birth: "Data urodzenia",
    pesel: "PESEL",
    peselHint: "Data urodzenia uzupełni się z numeru PESEL.",
    idDoc: "Nr dokumentu tożsamości",
    idDocHint: "Gdy klient nie ma numeru PESEL.",
    address: "Adres zamieszkania",
    guardian: "Przedstawiciel ustawowy",
    guardianContact: "Kontakt do przedstawiciela",
    guardianHint: "Wymagane, gdy klient ma mniej niż 18 lat.",
    save: "Zapisz dane",
    saved: "Zapisano",
    invalidPesel: "Ten numer PESEL jest nieprawidłowy (cyfra kontrolna się nie zgadza).",
    updated: (w) => `Ostatnia zmiana: ${w}`,
    practice: "Gabinet",
    psychologist: "Psycholog",
    register: "Nr w rejestrze",
    agreement: "Umowa i zgoda",
    agreementAt: (w, v) => `Zaakceptowana ${w} · wersja ${v}`,
    noAgreement: "Brak zapisanej akceptacji (sesja dodana ręcznie)",
    fillIn: "Uzupełnij w karcie klienta",
    fromClient: "Uzupełnione przez klienta w portalu",
    sourcePortal: "portal klienta",
    note2028: "Obowiązek dotyczy dokumentacji prowadzonej od 19 maja 2028 r.",
  },
  en: {
    title: "Documentation details (Art. 28)",
    lead: "The Psychologist Act requires these in records from 19 May 2028. Collect them at the first session — the client can also fill them in from their portal.",
    complete: "All details present",
    missingTitle: "Missing",
    missing: {
      birth_date: "date of birth",
      identifier: "PESEL or ID document number",
      address: "client's address",
      guardian: "legal representative (minor)",
      register: "your Register of Psychologists number",
      practice_address: "practice address",
    },
    name: "Full name",
    birth: "Date of birth",
    pesel: "PESEL",
    peselHint: "Date of birth is filled in from the PESEL.",
    idDoc: "ID document number",
    idDocHint: "If the client has no PESEL.",
    address: "Home address",
    guardian: "Legal representative",
    guardianContact: "Representative's contact",
    guardianHint: "Required when the client is under 18.",
    save: "Save details",
    saved: "Saved",
    invalidPesel: "This PESEL isn't valid (the check digit doesn't match).",
    updated: (w) => `Last changed: ${w}`,
    practice: "Practice",
    psychologist: "Psychologist",
    register: "Register no.",
    agreement: "Agreement and consent",
    agreementAt: (w, v) => `Accepted ${w} · version ${v}`,
    noAgreement: "No stored acceptance (session added by hand)",
    fillIn: "Complete in the client file",
    fromClient: "Filled in by the client in their portal",
    sourcePortal: "client portal",
    note2028: "The duty applies to records kept from 19 May 2028.",
  },
  uk: {
    title: "Дані для документації (ст. 28)",
    lead: "Закон про професію психолога вимагає їх у документації з 19 травня 2028 р. Заповніть їх на першій сесії — клієнт також може зробити це сам у своєму порталі.",
    complete: "Усі дані є",
    missingTitle: "Бракує",
    missing: {
      birth_date: "дата народження",
      identifier: "PESEL або номер документа",
      address: "адреса клієнта",
      guardian: "законний представник (неповнолітня особа)",
      register: "ваш номер у реєстрі психологів",
      practice_address: "адреса кабінету",
    },
    name: "Ім’я та прізвище",
    birth: "Дата народження",
    pesel: "PESEL",
    peselHint: "Дата народження заповниться з номера PESEL.",
    idDoc: "Номер документа, що посвідчує особу",
    idDocHint: "Якщо в клієнта немає PESEL.",
    address: "Адреса проживання",
    guardian: "Законний представник",
    guardianContact: "Контакт представника",
    guardianHint: "Обов’язково, якщо клієнтові менше 18 років.",
    save: "Зберегти дані",
    saved: "Збережено",
    invalidPesel: "Цей номер PESEL недійсний (контрольна цифра не збігається).",
    updated: (w) => `Остання зміна: ${w}`,
    practice: "Кабінет",
    psychologist: "Психолог",
    register: "№ у реєстрі",
    agreement: "Договір і згода",
    agreementAt: (w, v) => `Прийнято ${w} · версія ${v}`,
    noAgreement: "Немає збереженого прийняття (сесію додано вручну)",
    fillIn: "Заповнити в картці клієнта",
    fromClient: "Заповнено клієнтом у порталі",
    sourcePortal: "портал клієнта",
    note2028: "Обов’язок стосується документації з 19 травня 2028 р.",
  },
};
