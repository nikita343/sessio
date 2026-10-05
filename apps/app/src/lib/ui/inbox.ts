import type { Lang } from "../i18n";

export const INBOX_T: Record<
  Lang,
  {
    metaTitle: string;
    title: string;
    eyebrow: string;
    emptyTitle: string;
    emptyBody: string;
    urgent: string;
    needsYou: string;
    riskTitle: string;
    riskBody: string;
    assistant: string;
    you: string;
    replyPlaceholder: (firstName: string) => string;
    markHandled: string;
    send: string;
  }
> = {
  pl: {
    metaTitle: "Wiadomości",
    title: "Wiadomości",
    eyebrow: "Wiadomości z Twojej strony rezerwacji. Asystent odpowiada na pytania organizacyjne, a wszystko, co osobiste, czeka na Ciebie.",
    emptyTitle: "Nie masz jeszcze wiadomości",
    emptyBody: "Gdy klient zada pytanie na Twojej stronie rezerwacji, rozmowa pojawi się tutaj.",
    urgent: "Pilne · przeczytaj teraz",
    needsYou: "Czeka na Ciebie",
    riskTitle: "Ta osoba może być w zagrożeniu.",
    riskBody:
      "Numery pomocy kryzysowej (112, 116 123) zostały przekazane automatycznie. Przeczytaj wiadomość i skontaktuj się z tą osobą jak najszybciej.",
    assistant: "Asystent",
    you: "Ty",
    replyPlaceholder: (n) => `Napisz odpowiedź — ${n} otrzyma ją e-mailem`,
    markHandled: "Oznacz jako załatwione",
    send: "Wyślij odpowiedź",
  },
  en: {
    metaTitle: "Inbox",
    title: "Inbox",
    eyebrow: "Messages from your booking page. The assistant answers admin questions; anything personal waits for you.",
    emptyTitle: "No messages yet",
    emptyBody: "When a client asks something on your booking page, the conversation shows up here.",
    urgent: "Urgent · read now",
    needsYou: "Needs you",
    riskTitle: "This client may be at risk.",
    riskBody: "Crisis lines (112, 116 123) were shared automatically. Please read their message and contact them as soon as you can.",
    assistant: "Assistant",
    you: "You",
    replyPlaceholder: (n) => `Reply to ${n} — sent by email`,
    markHandled: "Mark as handled",
    send: "Send reply",
  },
  uk: {
    metaTitle: "Повідомлення",
    title: "Повідомлення",
    eyebrow: "Повідомлення з вашої сторінки бронювання. Асистент відповідає на організаційні питання, а все особисте чекає на вас.",
    emptyTitle: "Повідомлень поки немає",
    emptyBody: "Коли клієнт поставить запитання на вашій сторінці бронювання, розмова з’явиться тут.",
    urgent: "Терміново · прочитайте зараз",
    needsYou: "Чекає на вас",
    riskTitle: "Ця людина може бути в небезпеці.",
    riskBody:
      "Номери кризової допомоги (112, 116 123) надіслано автоматично. Прочитайте повідомлення і зв’яжіться з цією людиною якнайшвидше.",
    assistant: "Асистент",
    you: "Ви",
    replyPlaceholder: (n) => `Напишіть відповідь — ${n} отримає її на e-mail`,
    markHandled: "Позначити як опрацьоване",
    send: "Надіслати відповідь",
  },
};

/** Email the client receives when the therapist replies — in the client's language. */
export const REPLY_EMAIL_T: Record<Lang, { subject: (therapist: string | null) => string; footer: (url: string) => string }> = {
  pl: {
    subject: (n) => `${n ?? "Twój terapeuta"} — odpowiedź na Twoją wiadomość`,
    footer: (url) => `Aby odpowiedzieć lub zobaczyć swoje sesje, wejdź na: ${url}`,
  },
  en: {
    subject: (n) => `Reply from ${n ?? "your therapist"}`,
    footer: (url) => `Reply or see your sessions: ${url}`,
  },
  uk: {
    subject: (n) => `${n ?? "Ваш терапевт"} — відповідь на ваше повідомлення`,
    footer: (url) => `Щоб відповісти або переглянути свої сесії, перейдіть за посиланням: ${url}`,
  },
};
