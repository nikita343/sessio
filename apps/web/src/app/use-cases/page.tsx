import type { Metadata } from "next";
import { APP_URL, ClosingCta, Footer, PageHero, Photo, Pill, TextLink } from "@/components/site";

export const metadata: Metadata = {
  title: "Use cases — Sessio",
  description: "How independent psychologists and therapists use Sessio: leaving a marketplace, working online across borders, getting notes done and starting a first practice.",
};

const CASES = [
  {
    id: "established",
    tone: "sage" as const,
    who: "The established psychologist",
    title: "“My calendar is full. I just want the admin to disappear.”",
    story:
      "Fourteen clients a week, a Google Calendar, bank transfers to check every Friday and notes written late at night. A marketplace profile still brings the odd new client, but the monthly fee now costs her two or three sessions.",
    withSessio: [
      "Existing clients get one link to her own booking page and prepay with BLIK.",
      "The Friday transfer-check is gone: every session is paid before it happens.",
      "She keeps her marketplace profile for reviews, with the booking calendar switched off.",
    ],
    photo: "/photos/session.webp",
    alt: "A psychologist in her practice, sitting in a sage armchair by a tall window",
  },
  {
    id: "notes",
    tone: "lavender" as const,
    who: "The psychotherapist behind on notes",
    title: "“I know what happened in the session. Writing it down is the hard part.”",
    story:
      "Back-to-back sessions, and the notes pile up until Sunday. The new Act makes him want proper records, but not a tool that records his clients.",
    withSessio: [
      "Two minutes at the window after each session: a voice memo, transcribed on his phone.",
      "A draft record waits for him, with his hypotheses kept apart as working notes.",
      "He edits a sentence, signs, and the audio is gone.",
    ],
    photo: "/photos/memo.webp",
    alt: "A psychotherapist dictating a voice memo by the window after a session",
  },
  {
    id: "online",
    tone: "sky" as const,
    who: "The bilingual therapist working online",
    title: "“Half my clients are in Kraków, half in Lviv.”",
    story:
      "She works in Ukrainian and Polish, mostly online, and spent a year on a platform that took a cut of every session and forbade sharing her own contacts.",
    withSessio: [
      "One booking page that switches between Polish, Ukrainian and English.",
      "A private video room for every session — nothing to install for clients.",
      "Clients who were hers all along can book her directly, at 0% commission.",
    ],
    photo: "/photos/online.webp",
    alt: "A therapist with headphones in a video session at her home desk",
  },
  {
    id: "client",
    tone: "clay" as const,
    who: "And on the other side: the client",
    title: "“I booked it on the tram before I could talk myself out of it.”",
    story:
      "Asking for help is hard enough. Phoning a practice, waiting for a reply and transferring money to an account number adds three more chances to give up.",
    withSessio: [
      "She sees real free times and books in under a minute.",
      "BLIK confirms it on the spot; the video link arrives by email.",
      "If she has a question first, the assistant answers straight away — in her language.",
    ],
    photo: "/photos/booking.webp",
    alt: "A young woman on a tram smiling at her phone",
  },
];

export default function UseCases() {
  return (
    <main>
      <PageHero
        current="/use-cases"
        pill="Use cases"
        title={
          <>
            Different practices.
            <br />
            <span className="text-stone">The same quiet Monday.</span>
          </>
        }
        body="Sessio is for therapists who already have clients and want their time back. These are the people we design for — the stories are composites, drawn from what therapists write and ask about."
      />
      {CASES.map((c, i) => (
        <section key={c.id} id={c.id} className="mx-auto max-w-[1440px] scroll-mt-10 px-5 pb-[110px] md:px-16">
          <div className={`flex flex-col items-center gap-10 md:gap-20 ${i % 2 ? "md:flex-row-reverse" : "md:flex-row"}`}>
            <Photo src={c.photo} alt={c.alt} className="w-full md:w-[600px] md:shrink-0" priority={i === 0} />
            <div data-reveal className="flex w-full flex-col gap-5 md:flex-1">
              <Pill tone={c.tone}>{c.who}</Pill>
              <h2 className="t-heading-m max-w-[560px]">{c.title}</h2>
              <p className="t-body-l max-w-[560px] text-stone">{c.story}</p>
              <div className="max-w-[560px] rounded-[20px] border border-line bg-surface p-5">
                <p className="t-overline text-stone">With Sessio</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {c.withSessio.map((w) => (
                    <li key={w} className="t-body-m flex gap-3">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
      <section className="mx-auto max-w-[760px] px-5 pb-[110px] text-center">
        <h2 className="t-heading-m">Who Sessio is not for (yet)</h2>
        <p className="t-body-l mt-3 text-stone">
          If you need a stream of new clients, a marketplace will serve you better — Sessio does not sell demand. Clinics with many therapists and shared calendars are next on our list.
        </p>
        <p className="mt-5">
          <TextLink href={`${APP_URL}/anna-kowalska`}>See a booking page as a client would</TextLink>
        </p>
      </section>
      <ClosingCta />
      <Footer />
    </main>
  );
}
