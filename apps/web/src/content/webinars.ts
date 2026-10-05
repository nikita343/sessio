export type Webinar = {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO with time, Europe/Warsaw
  durationMin: number;
  lang: string;
  host: string;
  agenda: string[];
  status: "upcoming" | "replay-soon";
};

export const WEBINARS: Webinar[] = [
  {
    slug: "art-28-in-practice",
    title: "Art. 28 in practice: documentation that is ready for 2028",
    dek: "What the new Psychologist Act asks of your records, what the working-notes carve-out means, and a template you can use from your next session.",
    date: "2026-10-15T18:00:00+02:00",
    durationMin: 60,
    lang: "Polish",
    host: "Sessio team with a guest lawyer",
    agenda: [
      "The Act's timeline: what applies now, in 2028 and by 2030",
      "Minimum content of a record, line by line",
      "Formal record vs. working notes",
      "Retention, destruction protocols and storing records with a processor",
      "Q&A",
    ],
    status: "upcoming",
  },
  {
    slug: "leaving-a-marketplace",
    title: "Taking your practice off the marketplace — calmly",
    dek: "How to move existing clients to your own booking page without losing reviews, trust or a single session.",
    date: "2026-10-29T18:00:00+01:00",
    durationMin: 45,
    lang: "Polish & Ukrainian",
    host: "Sessio team",
    agenda: [
      "What a new client really costs you on each platform",
      "Telling existing clients about your own booking link",
      "Prepayment and a cancellation policy clients accept",
      "Keeping reviews without the booking funnel",
    ],
    status: "upcoming",
  },
  {
    slug: "ai-notes-ethically",
    title: "AI notes, ethically: two minutes of dictation, zero recordings",
    dek: "A live demo of on-device transcription and an honest conversation about where AI belongs in therapy — and where it does not.",
    date: "2026-11-12T18:00:00+01:00",
    durationMin: 45,
    lang: "English",
    host: "Sessio team",
    agenda: [
      "Why most AI scribes record the session — and the alternative",
      "Live demo: memo → on-device transcript → draft record → sign",
      "What AI must never do in a therapy practice",
      "Q&A",
    ],
    status: "upcoming",
  },
];

export function fmtWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
