export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "note"; text: string };

export type Post = {
  slug: string;
  title: string;
  dek: string;
  category: "Law & documentation" | "Running a practice" | "Privacy" | "Product";
  date: string; // ISO
  readMin: number;
  image: string;
  author: string;
  body: Block[];
  sources?: [string, string][];
};

export const POSTS: Post[] = [
  {
    slug: "psychologist-act-2026-art-28-documentation",
    title: "The new Psychologist Act, without the panic: what Art. 28 asks of your notes",
    dek: "The documentation duty starts on 19 May 2028, not today. Here is what the record must contain, how long to keep it, and what you can calmly set up now.",
    category: "Law & documentation",
    date: "2026-10-05",
    readMin: 7,
    image: "/photos/desk.webp",
    author: "Sessio team",
    body: [
      { t: "p", text: "The Act on the profession of psychologist was published on 18 February 2026 (Dz.U. 2026 poz. 187). Most of it enters into force two years and three months after publication — on 19 May 2028. Only the organising provisions, such as the committee that prepares the chamber and the census, apply already." },
      { t: "p", text: "So if someone tells you that your notes are \"non-compliant\" today, they are selling fear. The useful way to read Art. 28 is as a description of good documentation that you can start keeping now, so 2028 is a non-event." },
      { t: "h2", text: "What the record must contain" },
      { t: "p", text: "Art. 28 is unusually specific. Psychological documentation must include at least:" },
      { t: "ul", items: [
        "the client's identity — name, date of birth, address and PESEL (or an identity-document number);",
        "legal representatives, when the client is a minor;",
        "your name and your number in the Register of Psychologists;",
        "the name and address of the practice;",
        "a description of the services provided;",
        "the date the entry was prepared, and a signature.",
      ] },
      { t: "h2", text: "Formal record vs. working notes" },
      { t: "p", text: "Clients have the right to see their documentation — except test sheets and your short-term working notes (\"notatki robocze psychologa o znaczeniu krótkotrwałym\"). That carve-out matters: it means your hypotheses and reminders to yourself can live separately from the formal entry the client may one day read." },
      { t: "note", text: "In Sessio every session has two fields: the formal record (Art. 28, visible to the client on request) and private working notes. The AI draft never mixes them." },
      { t: "h2", text: "How long to keep it — and how to let it go" },
      { t: "p", text: "Records are kept for five years, counted from the end of the year in which services ended. After that, destruction requires a written protocol. Paper or electronic storage are both allowed, and you may entrust storage to a processor under a data-processing agreement." },
      { t: "h2", text: "A calm checklist for this year" },
      { t: "ul", items: [
        "Separate formal entries from working notes, starting with your next client.",
        "Write the date and a short description of the service in every entry.",
        "Collect identity details once, at the first session, and store them securely.",
        "Keep electronic records with an EU processor that signs a data-processing agreement.",
        "Leave a field for your Register number — you will apply between 2028 and 2030.",
      ] },
      { t: "p", text: "None of this needs new software. But if you would rather your booking, payments and notes lived in one place, that is what we are building." },
    ],
    sources: [
      ["Dz.U. 2026 poz. 187 (official text)", "https://dziennikustaw.gov.pl/D2026000018701.pdf"],
      ["Stasik Kancelaria — guide to the Act", "https://www.stasik-kancelaria.pl/ustawa-o-zawodzie-psychologa/"],
      ["Sobczyńscy i Partnerzy — the new Act", "https://sobczynscy.pl/blog/2026/02/23/nowa-ustawa-o-zawodzie-psychologa/"],
    ],
  },
  {
    slug: "what-a-marketplace-really-costs",
    title: "What a new client really costs you on a marketplace",
    dek: "Per-patient fees, first-session cuts and 45% commissions, side by side — and why “0% commission” is only half the story.",
    category: "Running a practice",
    date: "2026-10-01",
    readMin: 6,
    image: "/photos/online.webp",
    author: "Sessio team",
    body: [
      { t: "p", text: "Marketplaces are good at one thing: bringing you clients when you have none. The question is what they cost once your calendar is already full." },
      { t: "h2", text: "The published prices" },
      { t: "ul", items: [
        "ZnanyLekarz: 399 / 499 / 699 zł + VAT a month for new specialists (499–799 zł for returning ones), plus 26–32 zł for every new patient booked through the site.",
        "TwójPsycholog: about 130 zł gross a month plus 20% of a new client's first visit.",
        "Terappio: 50% of the first five sessions with each client.",
        "Mindly (Ukraine, reported Dec 2024): 45% of every session and 100% of the first — and therapists may not share their own contacts.",
      ] },
      { t: "p", text: "Most Polish marketplace fees are acquisition costs: you pay once per new client. Mindly's model is different — a permanent cut of every session, with the client locked into the platform." },
      { t: "h2", text: "Do the maths on your own week" },
      { t: "p", text: "The average session in Poland cost 192 zł in 2025 (216 zł in Warsaw). If you see 14 clients a week, that is roughly 11,500 zł a month. A ZnanyLekarz Starter plan alone is about 491 zł gross for a VAT-exempt psychologist — two to three sessions a month, before per-patient fees." },
      { t: "quote", text: "If your calendar is full, you are not paying for clients any more. You are paying rent on your own practice." },
      { t: "h2", text: "When a marketplace still makes sense" },
      { t: "ul", items: [
        "You are starting out and need visibility more than anything else.",
        "Reviews on a large portal bring you trust you could not build alone.",
        "You only keep a profile, with the booking calendar switched off.",
      ] },
      { t: "p", text: "Sessio does not bring clients. It runs the practice you already have — booking page, BLIK prepayment, private video and notes — for 149 zł a month, and your clients stay yours." },
    ],
    sources: [
      ["ZnanyLekarz pricing", "https://pro.znanylekarz.pl/cennik/znanylekarz-dla-lekarzy"],
      ["TwójPsycholog — platform functions", "https://twojpsycholog.pl/pomoc/platforma-funkcjonalnosci"],
      ["Terappio for therapists", "https://terappio.pl/psychotherapist"],
      ["Novyny.live — Mindly commission (Dec 2024)", "https://novyny.live/ekonomi/komisiia-zakhmarna-koristuvachi-mindly-rozpovili-pro-nabolile-219369.html"],
      ["TwójPsycholog — market report 2026", "https://twojpsycholog.pl/ile-kosztuje-terapia"],
    ],
  },
  {
    slug: "prepayment-and-no-shows",
    title: "No-shows, prepayment and the gentle cancellation policy",
    dek: "Many therapists already charge for missed sessions — and feel awkward about it every time. Prepayment turns a rule you enforce by hand into a default.",
    category: "Running a practice",
    date: "2026-09-29",
    readMin: 5,
    image: "/photos/booking.webp",
    author: "Sessio team",
    body: [
      { t: "p", text: "Polish therapists publish whole articles explaining why a cancelled session is still paid. The rule is fair — the hour was held for the client — but chasing it is uncomfortable, and it leaks into the relationship." },
      { t: "h2", text: "Make the rule visible before the client pays" },
      { t: "p", text: "Clients rarely object to a policy they agreed to up front. They object to a surprise. The fix is to show the policy at the moment of booking, in plain words, and ask the client to tick it." },
      { t: "ul", items: [
        "State the free-cancellation window in hours (24 h is common).",
        "Say what happens after it: the session is paid and not refunded.",
        "For online prepayment, ask the client to request the service within 14 days, as consumer law expects.",
      ] },
      { t: "h2", text: "Let prepayment do the reminding" },
      { t: "p", text: "When a session is paid with BLIK at booking, nobody needs to send an invoice, nobody waits for a transfer, and a client who might have drifted away shows up. Reminders with the video link do the rest." },
      { t: "note", text: "Sessio's booking page shows your cancellation window before payment, records the client's consent, and sends reminders with the private video link on its own." },
      { t: "h2", text: "And when life happens" },
      { t: "p", text: "A policy is a default, not a wall. Keep the discretion to waive a fee for illness or emergencies — prepayment just means the decision is yours, not a debt you have to collect." },
    ],
    sources: [
      ["Centrum Dobrej Terapii — why cancelled sessions are paid", "https://www.centrumdobrejterapii.pl/materialy/dlaczego-odwolane-sesje-terapeutyczne-sa-platne/"],
      ["UOKiK — exceptions to the right of withdrawal", "https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/wylaczenia-prawa-do-odstapienia/"],
    ],
  },
  {
    slug: "ai-notes-without-recording-sessions",
    title: "AI notes without recording your sessions",
    dek: "Most AI scribes record the whole hour. Sessio listens to two minutes of you, after the client has left — here is why, and how it works.",
    category: "Privacy",
    date: "2026-09-26",
    readMin: 6,
    image: "/photos/memo.webp",
    author: "Sessio team",
    body: [
      { t: "p", text: "AI note tools usually work by recording the session and transcribing it. That is convenient — and it means a recording of the most private hour of your client's week exists on someone's server." },
      { t: "h2", text: "A different design: the two-minute memo" },
      { t: "p", text: "After the session, you dictate what matters, the way you would jot it down anyway. Your words are transcribed in your browser, on your device. The audio is never uploaded and is discarded straight away." },
      { t: "ul", items: [
        "Names are replaced with placeholders before any text leaves your device.",
        "The AI only formats your words into the record structure — it does not diagnose, score risk or suggest treatment.",
        "Your private hypotheses go to working notes, not the formal record.",
        "Nothing is saved until you read it, edit it and sign it.",
      ] },
      { t: "h2", text: "Why this matters beyond privacy" },
      { t: "p", text: "A recording you keep may itself become part of the documentation you must store for five years. A memo you delete does not. And transcribing two minutes instead of fifty costs a fraction — about 5 zł a month for a full caseload instead of around 50 zł." },
      { t: "quote", text: "The narrowest AI feature turned out to be the right one: it helps with the writing, and stays out of the room." },
      { t: "h2", text: "What it does not do" },
      { t: "p", text: "It will not tell you what is wrong with your client. That judgement is yours, and keeping AI to formatting also keeps the tool clearly outside medical-device rules." },
    ],
    sources: [
      ["Coral EHR — SimplePractice Note Taker transcripts", "https://www.coralehr.com/blog/simplepractice-private-equity-acquisition/"],
      ["MDCG 2019-11 — software as a medical device", "https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf"],
    ],
  },
  {
    slug: "gdpr-for-independent-therapists",
    title: "GDPR for independent therapists: five questions to ask any software",
    dek: "You are the data controller. Your tools are processors. Here is what to check before you put a client's name into any of them.",
    category: "Privacy",
    date: "2026-09-24",
    readMin: 5,
    image: "/photos/session.webp",
    author: "Sessio team",
    body: [
      { t: "p", text: "Psychological documentation is health data — a special category under GDPR. As an independent practitioner you are the controller; every tool that stores or touches client data is a processor working on your behalf." },
      { t: "h2", text: "Five questions" },
      { t: "ul", items: [
        "Where is the data stored? Prefer the EU, and ask about every sub-processor.",
        "Will you sign a data-processing agreement (Art. 28 GDPR)?",
        "Is anything recorded? Video calls and AI notes are where data quietly multiplies.",
        "Can I export a client's file — without my working notes — when they ask for it?",
        "What happens to records after five years, and can I produce a destruction protocol?",
      ] },
      { t: "h2", text: "The free stack has a legal cost" },
      { t: "p", text: "Google Calendar, a free video tool and notes in a cloud doc are how most practices start. They work. Their weakness is not features, it is that client data ends up spread across US services with no agreement and no structure." },
      { t: "note", text: "Sessio stores data in the EU, signs a DPA with every therapist, never records sessions, and keeps working notes out of client exports." },
    ],
    sources: [
      ["KWWP — the new Act and personal data", "https://www.kwwp.pl/nowa-ustawa-o-zawodzie-psychologa-a-dokumentacja-psychologiczna-jak-uniknac-naruszenia-ochrony-danych-osobowych/"],
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}
