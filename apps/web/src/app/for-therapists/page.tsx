import type { Metadata } from "next";
import Link from "next/link";
import { ClipFrame } from "@/components/auto-video";
import { FaqList } from "@/components/faq-list";
import { GuideCard } from "@/components/guide-card";
import { Icon } from "@/components/icons";
import type { IconName } from "@/components/nav-data";
import { APP_URL, ButtonLink, ClosingCta, Footer, PageHero, Pill, TextLink } from "@/components/site";
import { FAQ } from "@/content/faq";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "For therapists — Sessio",
  description: "For independent psychologists and psychotherapists in Poland: your own booking page with BLIK prepayment, private video, voice-memo notes for Art. 28 and 0% commission.",
};

const WEEK: { when: string; icon: IconName; title: string; body: string }[] = [
  { when: "Sunday, 23:10", icon: "calendar", title: "A new client books — while you sleep", body: "She picks Tuesday 17:00 on your page and prepays with BLIK. The confirmation, invite and video link go out on their own." },
  { when: "Monday, 08:30", icon: "spark", title: "Today, at a glance", body: "Four sessions, all paid. One client moved Thursday to Friday from his portal, and the assistant already answered a price question." },
  { when: "Monday, 13:52", icon: "mic", title: "Two minutes at the window", body: "You dictate what mattered. The draft record waits, with your hypotheses kept apart as working notes. You edit a line and sign." },
  { when: "Monday, 17:00", icon: "video", title: "The room opens itself", body: "Your online client clicks the link from yesterday's reminder. Nothing to install, nothing recorded." },
  { when: "Friday, 16:00", icon: "card", title: "No transfers to check", body: "Every session this week was paid before it happened, straight into your Stripe account. A late cancellation stayed paid, as your policy says." },
];

const BEFORE_AFTER: [string, string][] = [
  ["Messages to agree a time", "Clients book real free times themselves"],
  ["Bank transfers checked by hand", "Prepayment with BLIK, card or Przelewy24"],
  ["A marketplace fee plus a charge per new client", "149 zł a month, 0% commission"],
  ["Zoom links copied into emails", "A private room per session, sent automatically"],
  ["Notes written late at night", "Two minutes of dictation, a record to sign"],
  ["“Can we move Thursday?” threads", "Clients move sessions inside your window"],
];

export default function ForTherapists() {
  const guides = GUIDES.filter((g) => g.audience === "Therapists").slice(0, 3);
  const faq = FAQ.find((g) => g.id === "therapists")!.items.slice(0, 4);
  return (
    <main>
      <PageHero
        current="/for-therapists"
        pill="For therapists"
        title={
          <>
            Your practice,
            <br />
            <span className="text-stone">without the admin.</span>
          </>
        }
        body="For psychologists, psychotherapists and counsellors in private practice who already have clients. One page to book and prepay, one room for video, two minutes for notes — and nothing taken from your sessions."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <ButtonLink href="/#waitlist">Become a founding therapist</ButtonLink>
          <ButtonLink href={`${APP_URL}/login`} variant="secondary">
            Explore the demo practice
          </ButtonLink>
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1120px] px-3 pb-[110px] md:px-8">
        <div data-reveal>
          <ClipFrame src="/guides/tour.mp4" poster="/guides/tour.webp" label="Screen recording: a tour of the Sessio practice dashboard" />
        </div>
        <p className="t-caption mt-3 text-center text-stone">The real product, on the demo practice. Names and sessions are made up.</p>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-10 flex flex-col gap-3">
          <p className="t-overline text-stone">A week with Sessio</p>
          <h2 className="t-display-l max-w-[760px] !text-[clamp(32px,4.5vw,52px)]">What changes is mostly what you stop doing.</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {WEEK.map((w) => (
            <li key={w.when} data-reveal className="flex flex-col gap-4 rounded-[24px] bg-surface p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="t-label-m text-stone">{w.when}</span>
                <span className="flex size-9 items-center justify-center rounded-[12px] bg-sage-soft text-sage">
                  <Icon name={w.icon} className="size-[18px]" />
                </span>
              </div>
              <h3 className="t-title-m">{w.title}</h3>
              <p className="t-body-s text-stone">{w.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[1120px] px-5 pb-[110px]">
        <div data-reveal className="overflow-hidden rounded-[28px] border border-line">
          <div className="grid grid-cols-2 bg-surface">
            <p className="t-overline p-5 text-stone md:px-8">Before</p>
            <p className="t-overline border-l border-line p-5 text-sage md:px-8">With Sessio</p>
          </div>
          {BEFORE_AFTER.map(([a, b]) => (
            <div key={a} className="grid grid-cols-2 border-t border-line">
              <p className="t-body-m p-5 text-stone line-through decoration-line-strong decoration-1 md:px-8">{a}</p>
              <p className="t-body-m border-l border-line p-5 md:px-8">{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="t-body-m max-w-[620px] text-stone">
            Sessio doesn&rsquo;t bring new clients — if you need a stream of them, keep your marketplace profile for reviews and send people to your own link to book.
          </p>
          <TextLink href="/pricing">Compare the costs</TextLink>
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <h2 className="t-heading-m">See each part in half a minute</h2>
          <Link href="/guides" className="t-label-m text-sage hover:underline">
            All guides →
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.slug} g={g} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1312px] gap-10 px-5 pb-[110px] md:px-8 lg:grid-cols-[360px_1fr] lg:gap-20 lg:px-0">
        <div className="flex flex-col gap-4">
          <Pill tone="sage">Questions</Pill>
          <h2 className="t-heading-m">What therapists ask first</h2>
          <TextLink href="/faq">Read all answers</TextLink>
        </div>
        <FaqList items={faq} />
      </section>

      <ClosingCta />
      <Footer />
    </main>
  );
}
