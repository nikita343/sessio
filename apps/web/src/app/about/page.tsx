import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import type { IconName } from "@/components/nav-data";
import { APP_URL, ClosingCta, Footer, PageHero, Photo, Pill, TextLink } from "@/components/site";

export const metadata: Metadata = {
  title: "About — Sessio",
  description: "Why Sessio exists: practice software for independent psychologists and therapists in Poland, built in Warsaw, with 0% commission and nothing recorded.",
};

const PRINCIPLES: { icon: IconName; title: string; body: string }[] = [
  { icon: "user", title: "Your clients stay yours", body: "No marketplace, no ranking, no ban on sharing your own contacts. We run the practice you built; we don't rent it back to you." },
  { icon: "card", title: "A price, not a percentage", body: "One monthly plan. Clients pay into your own Stripe account and we never touch the money, so there is nothing to take a cut of." },
  { icon: "video", title: "Nothing in the room", body: "We never record sessions. Video goes directly between you and your client, and voice memos are transcribed on your own device." },
  { icon: "mic", title: "AI formats, you decide", body: "AI shapes your own words into a draft record. It never diagnoses, scores risk or suggests treatment, and nothing is saved until you sign." },
  { icon: "book", title: "Ready for the new Act", body: "Records are structured around Art. 28 of the Psychologist Act, with working notes kept apart — so May 2028 is a non-event." },
  { icon: "chat", title: "Three languages, one practice", body: "Polish, Ukrainian and English everywhere a client looks: the booking page, emails, reminders and the client portal." },
];

const NOW = [
  ["Live", "Booking page with BLIK, card and Przelewy24 prepayment"],
  ["Live", "Private video room for every online session"],
  ["Live", "Voice-memo notes with private working notes"],
  ["Live", "Client portal: sessions, self-service moves, messages"],
  ["Live", "Day-before reminders and calendar invites"],
  ["Next", "A Polish version of this website"],
  ["Next", "Shared calendars for small clinics"],
];

export default function About() {
  return (
    <main>
      <PageHero
        current="/about"
        pill="About"
        title={
          <>
            Software that stays
            <br />
            <span className="text-stone">out of the room.</span>
          </>
        }
        body="Sessio is practice software for independent psychologists and therapists in Poland. It handles the booking, the money and the paperwork, so the hour itself belongs to you and your client."
      />

      <section className="mx-auto max-w-[1440px] px-5 pb-[110px] md:px-16">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-20">
          <Photo src="/photos/session-2.webp" alt="A calm therapy room with two armchairs by a tall window" className="w-full md:w-[600px] md:shrink-0" priority />
          <div data-reveal className="flex flex-col gap-5 md:flex-1">
            <Pill tone="sage">Why Sessio exists</Pill>
            <h2 className="t-heading-m max-w-[560px]">Good therapists were paying a toll to see their own clients.</h2>
            <p className="t-body-l max-w-[560px] text-stone">
              In Poland, a psychologist in private practice typically pays a marketplace a monthly fee plus a charge for every new client — or, on some platforms, a large share of every
              session. In return they get a calendar, a payment link and a profile they don&rsquo;t own.
            </p>
            <p className="t-body-l max-w-[560px] text-stone">
              Meanwhile the new Psychologist Act raised the bar for documentation, and the notes still get written at 11 pm. We thought the tools could be calmer, cheaper and more honest
              than that.
            </p>
            <TextLink href="/pricing">See what the same month costs elsewhere</TextLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-10 flex flex-col gap-3 md:mb-14">
          <p className="t-overline text-stone">What we hold to</p>
          <h2 className="t-display-l max-w-[760px] !text-[clamp(32px,4.5vw,52px)]">Six principles we don&rsquo;t trade for growth.</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} data-reveal className="flex flex-col gap-4 bg-surface p-7 md:p-9">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-[14px] bg-sage-soft text-sage">
                  <Icon name={p.icon} />
                </span>
                <span className="t-label-m text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="t-title-m md:text-[20px]">{p.title}</h3>
              <p className="t-body-m text-stone">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1312px] gap-6 px-5 pb-[110px] md:px-8 lg:grid-cols-[1fr_1.1fr] lg:px-0">
        <div data-reveal className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[28px] bg-ink p-8 text-white md:p-10">
          <div className="flex flex-col gap-4">
            <p className="t-overline text-white/50">Who&rsquo;s building it</p>
            <h2 className="t-heading-m">Independent, in Warsaw, and still small on purpose.</h2>
            <p className="t-body-m text-white/70">
              Sessio is built by Nick, a product developer based in Warsaw who works in Polish, Ukrainian and English — the same three languages as the product. It is early: we are
              building it together with a first group of founding therapists, and what they ask for is what gets built next.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="mailto:hello@usesessio.com" className="t-label-m inline-flex h-11 items-center rounded-full bg-white px-6 text-ink hover:bg-white/90">
              Write to Nick
            </a>
            <a href="/#waitlist" className="t-label-m inline-flex h-11 items-center rounded-full border border-white/25 px-6 text-white hover:border-white/60">
              Become a founding therapist
            </a>
          </div>
        </div>
        <div data-reveal className="flex flex-col gap-5 rounded-[28px] border border-line p-8 md:p-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-heading-m">Where we are</h2>
            <a href={`${APP_URL}/login`} className="t-label-m text-sage hover:underline">
              Open the demo →
            </a>
          </div>
          <ul className="flex flex-col divide-y divide-line">
            {NOW.map(([state, what]) => (
              <li key={what} className="flex items-center gap-4 py-3.5">
                <span className={`t-overline w-14 shrink-0 rounded-full py-1 text-center ${state === "Live" ? "bg-sage-soft text-sage" : "bg-lavender-soft text-[#5b5299]"}`}>{state}</span>
                <span className="t-body-m">{what}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
      <Footer />
    </main>
  );
}
