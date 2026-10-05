import type { Metadata } from "next";
import { APP_URL, ClosingCta, Footer, PageHero, Photo, Pill, TextLink } from "@/components/site";

export const metadata: Metadata = {
  title: "Product — Sessio",
  description: "Booking page with BLIK prepayment, a private video room, two-minute voice-memo notes and an admin assistant — one calm tool for your practice.",
};

const SECTIONS = [
  {
    id: "booking",
    pill: "Booking & payments",
    tone: "sage" as const,
    title: "A booking page that feels like you.",
    body: "Your photo, your words, your prices and your hours — in Polish, Ukrainian and English. Clients pick a time and prepay with BLIK, card or Przelewy24, straight into your own account.",
    points: [
      "Your own link: usesessio.com/your-name",
      "Prepayment at booking, with your cancellation window shown up front",
      "Consent to the 14-day rule recorded with every booking",
      "Calendar invite and reminders with the video link, sent on their own",
    ],
    photo: "/photos/booking.webp",
    alt: "A young woman on a Warsaw tram smiling at her phone after booking a session",
  },
  {
    id: "video",
    pill: "Private video",
    tone: "sky" as const,
    title: "A room that opens on its own — and records nothing.",
    body: "Every online session gets its own private room. Video goes directly between you and your client, encrypted, and never passes through or rests on our servers.",
    points: [
      "One link per session, in the confirmation and reminders",
      "Opens ten minutes before the session",
      "Peer-to-peer and encrypted; no recordings, ever",
      "Works in the browser — nothing for clients to install",
    ],
    photo: "/photos/online.webp",
    alt: "A therapist with headphones listening to a client on a laptop video call at home",
  },
  {
    id: "notes",
    pill: "Voice-memo notes",
    tone: "lavender" as const,
    title: "Two minutes of you. A record ready to sign.",
    body: "After the session, dictate what matters. It is transcribed on your own device, names are removed, and the words are shaped into a record for the new Psychologist Act. You read, edit and sign. The audio is gone.",
    points: [
      "Transcription in your browser — audio never leaves the device",
      "Formal record (Art. 28) kept apart from private working notes",
      "AI formats your words only; it never diagnoses or scores risk",
      "Built around five-year retention, as the Act requires",
    ],
    photo: "/photos/memo.webp",
    alt: "A psychotherapist by the window dictating a short voice note into his phone after a session",
  },
  {
    id: "assistant",
    pill: "Admin assistant",
    tone: "clay" as const,
    title: "Someone to answer “what time is free?” at 11 pm.",
    body: "Clients ask about prices, times and how sessions work. The assistant answers from your settings in their language, and anything personal waits for you in the inbox.",
    points: [
      "Answers admin questions from your page, day and night",
      "Suggests free times and passes reschedules to you with one tap",
      "Shares crisis lines immediately when a message sounds urgent",
      "Sees bookings, payments and messages — never what is said in sessions",
    ],
    photo: "/photos/desk.webp",
    alt: "A calm therapist's desk with tea, a planner and a phone lying face down",
  },
];

export default function ProductPage() {
  return (
    <main>
      <PageHero
        current="/product"
        pill="Product"
        title={
          <>
            One quiet place
            <br />
            <span className="text-stone">for the whole practice.</span>
          </>
        }
        body="Booking, prepayment, private video and documentation used to mean four tools and a spreadsheet. Sessio is one — built for therapists who already have clients."
      >
        <div className="flex flex-wrap justify-center gap-2">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="t-label-m rounded-full border border-line-strong bg-surface/80 px-4 py-2 hover:border-ink/30">
              {s.pill}
            </a>
          ))}
        </div>
      </PageHero>

      {SECTIONS.map((s, i) => (
        <section key={s.id} id={s.id} className="mx-auto max-w-[1440px] scroll-mt-10 px-5 pb-[110px] md:px-16">
          <div className={`flex flex-col items-center gap-10 md:gap-20 ${i % 2 ? "md:flex-row-reverse" : "md:flex-row"}`}>
            <div data-reveal className="flex w-full flex-col gap-5 md:flex-1">
              <Pill tone={s.tone}>{s.pill}</Pill>
              <h2 className="t-display-l max-w-[560px]">{s.title}</h2>
              <p className="t-body-l max-w-[560px] text-stone">{s.body}</p>
              <ul className="flex max-w-[560px] flex-col gap-2.5">
                {s.points.map((p) => (
                  <li key={p} className="t-body-m flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <Photo src={s.photo} alt={s.alt} className="w-full md:w-[620px] md:shrink-0" priority={i === 0} />
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-0">
        <div className="grid gap-4 rounded-[28px] bg-surface p-8 md:grid-cols-3 md:p-12">
          <div className="md:col-span-1">
            <Pill>Under the hood</Pill>
            <h2 className="t-heading-m mt-4">Built for trust first.</h2>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 md:col-span-2">
            {[
              ["EU data", "Client records are stored in the EU and covered by a data-processing agreement with you."],
              ["No recordings", "Sessions are never recorded. Voice-memo audio stays on your device and is discarded."],
              ["Your money", "Payments go to your own account. Sessio takes 0% of any session."],
              ["Your clients", "Export everything, any time. No lock-in, no ban on sharing your contacts."],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-title-m">{k}</dt>
                <dd className="t-body-s mt-1 text-stone">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="t-body-s mt-4 text-center text-stone">
          Want to see it working? <TextLink href={`${APP_URL}/anna-kowalska`}>Open a live demo booking page</TextLink>
        </p>
      </section>

      <ClosingCta />
      <Footer />
    </main>
  );
}
