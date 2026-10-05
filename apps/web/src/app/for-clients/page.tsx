import type { Metadata } from "next";
import { ClipFrame } from "@/components/auto-video";
import { FaqList } from "@/components/faq-list";
import { GuideCard } from "@/components/guide-card";
import { Icon } from "@/components/icons";
import type { IconName } from "@/components/nav-data";
import { APP_URL, ButtonLink, Footer, PageHero, Photo, Pill, TextLink } from "@/components/site";
import { FAQ } from "@/content/faq";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "For clients — Sessio",
  description: "Booked a session through Sessio? How booking and prepayment work, how to join a video session, and how to see, move and message about your sessions.",
};

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: "calendar", title: "Pick a time that's really free", body: "Your therapist's page shows only open times. No messages back and forth, no waiting for a reply." },
  { icon: "card", title: "Prepay in seconds", body: "BLIK, card or Przelewy24 on Stripe's secure page. The payment goes to your therapist, not to Sessio." },
  { icon: "video", title: "Join from the link", body: "The link is in your confirmation and in a reminder the day before. It opens in your browser — nothing to install." },
];

const PROMISES = [
  "Sessions are never recorded. Video goes directly between you and your therapist, encrypted.",
  "Your details are stored in the EU and used only by your therapist, for your sessions.",
  "Sessio never sells data and never uses your information to train AI.",
  "Your therapist decides what goes in your record. You can ask to see it, as Polish law allows.",
];

export default function ForClients() {
  const guides = GUIDES.filter((g) => g.audience === "Clients");
  const faq = FAQ.find((g) => g.id === "clients")!.items;
  return (
    <main>
      <PageHero
        current="/for-clients"
        pill="For clients"
        title={
          <>
            Booking should be
            <br />
            <span className="text-stone">the easy part.</span>
          </>
        }
        body="If your therapist sent you a Sessio link, this is what happens next — and what doesn't. Asking for help is hard enough; the rest should take a minute."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <ButtonLink href={`${APP_URL}/me/login`}>Sign in to your sessions</ButtonLink>
          <ButtonLink href={`${APP_URL}/anna-kowalska?lang=en`} variant="secondary">
            See an example page
          </ButtonLink>
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} data-reveal className="relative flex flex-col gap-4 overflow-hidden rounded-[24px] bg-surface p-7 md:p-8">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-[14px] bg-sage-soft text-sage">
                  <Icon name={s.icon} />
                </span>
                <span className="font-display text-[44px] font-medium leading-none tracking-[-0.06em] text-line-strong">{i + 1}</span>
              </div>
              <h2 className="t-title-m md:text-[20px]">{s.title}</h2>
              <p className="t-body-m text-stone">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="portal" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 pb-[110px] md:px-16">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div data-reveal className="w-full lg:w-[640px] lg:shrink-0">
            <ClipFrame src="/guides/portal.mp4" poster="/guides/portal.webp" label="Screen recording: the Sessio client portal" />
          </div>
          <div data-reveal className="flex flex-col gap-5 lg:flex-1">
            <Pill tone="clay">Your sessions, in one place</Pill>
            <h2 className="t-heading-m max-w-[520px]">See, move and message — without phoning anyone.</h2>
            <p className="t-body-l max-w-[520px] text-stone">
              Sign in with Google or with the email you booked with. You&rsquo;ll see every upcoming session and how to join it, change the time inside your therapist&rsquo;s cancellation
              window, and write to them directly.
            </p>
            <p className="t-body-m max-w-[520px] text-stone">No account is needed to book — the portal is there when you want it, in Polish, Ukrainian or English.</p>
            <TextLink href={`${APP_URL}/me/login?lang=en`}>Try the demo client portal</TextLink>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1312px] gap-6 px-5 pb-[110px] md:px-8 lg:grid-cols-[1.1fr_1fr] lg:px-0">
        <div data-reveal className="flex flex-col gap-5 rounded-[28px] border border-line p-8 md:p-10">
          <p className="t-overline text-stone">What we promise you</p>
          <ul className="flex flex-col divide-y divide-line">
            {PROMISES.map((p) => (
              <li key={p} className="t-body-m flex gap-4 py-3.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                  <svg viewBox="0 0 12 12" aria-hidden className="size-3">
                    <path d="m2.5 6.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
          <TextLink href="/privacy">How your data is handled</TextLink>
        </div>
        <div data-reveal className="flex flex-col justify-between gap-6 rounded-[28px] bg-[#f6e3dc] p-8 text-warn md:p-10">
          <div className="flex flex-col gap-3">
            <p className="t-overline">If you need help now</p>
            <h2 className="t-heading-m">Sessio is not an emergency service.</h2>
            <p className="t-body-m">If you are in danger or thinking about ending your life, please don&rsquo;t wait for a session or a reply to a message.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["112", "Emergency"],
              ["116 123", "Adults, 24/7, free"],
              ["116 111", "Young people, 24/7, free"],
            ].map(([n, l]) => (
              <a key={n} href={`tel:${n.replace(/\s/g, "")}`} className="flex flex-col rounded-[18px] bg-white/60 p-4 hover:bg-white/80">
                <span className="font-display text-[26px] font-medium tracking-[-0.04em]">{n}</span>
                <span className="t-caption">{l}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <h2 className="t-heading-m mb-8 border-b border-line pb-5">Guides for clients</h2>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.slug} g={g} />
          ))}
          <div data-reveal className="relative hidden flex-col justify-end overflow-hidden rounded-[18px] lg:flex">
            <Photo src="/photos/booking.webp" alt="A young woman on a tram smiling at her phone" ratio="aspect-[16/10]" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1312px] gap-10 px-5 pb-[110px] md:px-8 lg:grid-cols-[360px_1fr] lg:gap-20 lg:px-0">
        <div className="flex flex-col gap-4">
          <Pill tone="clay">Questions</Pill>
          <h2 className="t-heading-m">Questions clients ask</h2>
          <TextLink href="/faq#clients">All answers</TextLink>
        </div>
        <FaqList items={faq} />
      </section>
      <Footer />
    </main>
  );
}
