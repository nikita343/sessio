import type { Metadata } from "next";
import Link from "next/link";
import { ClipFrame } from "@/components/auto-video";
import { EarningsCalculator } from "@/components/earnings-calculator";
import { FaqList } from "@/components/faq-list";
import { GuideCard } from "@/components/guide-card";
import { Icon } from "@/components/icons";
import type { IconName } from "@/components/nav-data";
import { APP_URL, ButtonLink, ClosingCta, Footer, PageHero, Photo, Pill, TextLink } from "@/components/site";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "For therapists — Sessio",
  description:
    "For independent psychologists and psychotherapists in Poland: your own booking page with BLIK prepayment, private video, Art. 28 notes from a voice memo, a client portal and 0% commission — 149 zł a month.",
};

const FACTS: [string, string][] = [
  ["0%", "commission on your sessions"],
  ["149 zł", "a month, everything included"],
  ["~10 min", "to set up your booking page"],
  ["3", "languages: Polish, Ukrainian, English"],
];

const SECTIONS = [
  ["overview", "Overview"],
  ["features", "What you get"],
  ["earnings", "Earnings"],
  ["start", "Getting started"],
  ["compliance", "Law & privacy"],
  ["faq", "FAQ"],
] as const;

const WHO: { title: string; body: string }[] = [
  { title: "Psychologists in private practice", body: "Working on your own, online, in a rented room or both — as a sole trader (JDG) or a small company." },
  { title: "Psychotherapists and counsellors", body: "Any modality. Sessio doesn't ask about your approach; it just runs the booking, money and paperwork around it." },
  { title: "Therapists working across borders", body: "Clients in Poland and abroad, sessions in Polish, Ukrainian or English, one page that switches language." },
  { title: "Anyone leaving a marketplace", body: "You keep your clients, your contacts and your price. Keep the old profile for reviews if you like — book through your own link." },
];

const NEED = ["A practice in Poland (sole trader or company)", "A Stripe account for payouts — we walk you through it", "Your NIP and a bank account (IBAN)", "A laptop or phone with a recent browser"];

const FEATURES: { icon: IconName; title: string; points: string[]; href: string }[] = [
  {
    icon: "calendar",
    title: "Your booking page",
    points: ["Your own link: usesessio.com/your-name", "Photo, title, a few words, your price and hours", "Only real free times; double booking is impossible", "Online or in person, chosen per session"],
    href: "/guides/set-up-your-booking-page",
  },
  {
    icon: "card",
    title: "Prepayment, straight to you",
    points: ["BLIK, card and Przelewy24 on Stripe's checkout", "Money lands in your own Stripe account", "Cancellation window shown before booking", "Automatic refund inside the window"],
    href: "/guides/connect-stripe",
  },
  {
    icon: "video",
    title: "A private video room",
    points: ["One room per session, link sent automatically", "Opens 10 minutes before the start", "Peer-to-peer and encrypted; never recorded", "Works in the browser — nothing to install"],
    href: "/product/video",
  },
  {
    icon: "mic",
    title: "Notes from a voice memo",
    points: ["Two minutes of dictation after the session", "Transcribed on your device; audio discarded", "Names and contact details removed on your device first", "You read, edit and sign every record"],
    href: "/guides/voice-memo-to-signed-record",
  },
  {
    icon: "user",
    title: "Client files",
    points: ["Every session, payment and record per client", "Formal record apart from working notes", "Export a client's file without your notes", "Built around five-year retention"],
    href: "/guides/a-tour-of-your-practice",
  },
  {
    icon: "heart",
    title: "A portal for your clients",
    points: ["Clients sign in with Google or email", "They see and move sessions inside your window", "They write to you; you reply by email or in Sessio", "Crisis words show help lines at once"],
    href: "/guides/the-client-portal",
  },
  {
    icon: "chat",
    title: "Assistant and inbox",
    points: ["Answers price, time and “how does it work” questions", "Uses only your settings, in the client's language", "Anything personal waits for you", "Never gives clinical advice"],
    href: "/product/assistant",
  },
  {
    icon: "spark",
    title: "Reminders that send themselves",
    points: ["Confirmation with a calendar invite", "Reminder with the video link the day before", "Notice when a client moves or cancels", "Your Today screen shows what happened"],
    href: "/product/booking",
  },
];

const STEPS: { title: string; body: string }[] = [
  { title: "Join as a founding therapist", body: "Leave your email. We invite founding therapists in small groups and keep 149 zł a month for them for life." },
  { title: "Set up your page", body: "Sign in with Google or email, write a few words, set your price and hours. About ten minutes; the guide shows each step." },
  { title: "Connect Stripe", body: "Stripe checks your details and bank account on its own secure pages. From then on, clients prepay straight into your account." },
  { title: "Send clients your link", body: "Share it once with existing clients and put it in your email signature. New bookings, reminders and rooms run on their own." },
];

const COMPLIANCE: { title: string; body: string }[] = [
  { title: "Art. 28 of the Psychologist Act", body: "Every record is structured around the Act's minimum content: who, when, what was provided, by whom, dated and signed. The duty applies from 19 May 2028 — you're ready early." },
  { title: "Working notes stay yours", body: "Hypotheses and reminders to yourself live apart from the formal record, and are left out when a client asks for their file, as the Act allows." },
  { title: "GDPR, with a DPA", body: "You are the controller; Sessio is your processor and signs a data-processing agreement. Data is stored in the EU and encrypted at rest." },
  { title: "Nothing recorded", body: "Sessions are never recorded and voice memos never leave your device. AI only formats your own words — it never diagnoses or scores risk." },
];

const VS: [string, string, string][] = [
  ["Who owns the client relationship", "You", "The platform"],
  ["Commission on sessions", "0%", "Often 20–45% or a fee per new client"],
  ["Sharing your own contacts", "Allowed", "Often restricted"],
  ["Your price and cancellation policy", "Yours to set", "Shaped by the platform"],
  ["Brings you new clients", "No", "Yes"],
];

const FAQ_T = [
  { q: "Do I need a company to use Sessio?", a: "No. A sole-trader registration (JDG) is enough. Stripe asks for your NIP and bank account so it can pay you out; psychologists are usually VAT-exempt, so the 149 zł you see is what you pay." },
  { q: "Can I use Sessio for in-person sessions too?", a: "Yes. Add your practice address and clients choose online or in person when they book. In-person sessions get the same prepayment, reminders and notes — just no video room." },
  { q: "Can I keep my marketplace profile?", a: "Yes. Many therapists keep it for reviews and visibility, and send clients to their own Sessio link to book and pay. Sessio has no rules about where your clients come from." },
  { q: "What happens to no-shows and late cancellations?", a: "Clients prepay when they book and see your cancellation window before paying. Inside the window they can cancel or move on their own and get an automatic refund; after it, the session stays paid." },
  { q: "Does the AI write my notes for me?", a: "It formats your own words. You dictate or type what matters, Sessio removes names and shapes it into a draft record, and nothing is saved until you read, edit and sign it." },
  { q: "What if I want to leave?", a: "Cancel any time — there is no 12-month contract. You can export your data, and we keep nothing beyond what the law requires." },
];

export default function ForTherapists() {
  const guides = GUIDES.filter((g) => g.audience === "Therapists").slice(0, 3);
  return (
    <main>
      <PageHero
        current="/for-therapists"
        pill="For therapists"
        title={
          <>
            Your practice online,
            <br />
            <span className="text-stone">without giving away a cut.</span>
          </>
        }
        body="Sessio is for psychologists, psychotherapists and counsellors who already have clients. Your own booking page with prepayment, a private video room, notes from a two-minute voice memo and a portal for your clients — for one monthly price."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <ButtonLink href="/#waitlist">Become a founding therapist</ButtonLink>
          <ButtonLink href={`${APP_URL}/login`} variant="secondary">
            Explore the demo practice
          </ButtonLink>
        </div>
      </PageHero>

      {/* facts */}
      <section className="mx-auto max-w-[1312px] px-5 pb-12 md:px-8 lg:px-0">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-line bg-line lg:grid-cols-4">
          {FACTS.map(([n, l]) => (
            <div key={l} data-reveal className="flex flex-col gap-1 bg-surface p-6 md:p-8">
              <dt className="font-display text-[clamp(32px,4vw,48px)] font-medium leading-none tracking-[-0.05em]">{n}</dt>
              <dd className="t-body-s text-stone">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* in-page nav */}
      <nav aria-label="On this page" className="sticky top-0 z-20 border-y border-line bg-paper/90 backdrop-blur-md">
        <ul className="mx-auto flex max-w-[1312px] gap-1 overflow-x-auto px-5 py-2 md:px-8 lg:px-0">
          {SECTIONS.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="t-label-m inline-flex h-9 items-center rounded-full px-4 text-ink/70 hover:bg-surface hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* overview */}
      <section id="overview" className="mx-auto max-w-[1120px] scroll-mt-20 px-3 pb-[100px] pt-16 md:px-8">
        <div data-reveal>
          <ClipFrame src="/guides/tour.mp4" poster="/guides/tour.webp" label="Screen recording: a tour of the Sessio practice dashboard" />
        </div>
        <p className="t-caption mt-3 text-center text-stone">The real product, on the demo practice. Names and sessions are made up.</p>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <Pill tone="sage">Who it&rsquo;s for</Pill>
            <h2 className="t-heading-m">Built for therapists who already have clients.</h2>
            <p className="t-body-m text-stone">Sessio doesn&rsquo;t sell you demand. It runs the practice you&rsquo;ve built, so the money and the relationship stay with you.</p>
            <div className="mt-2 rounded-[20px] border border-line bg-surface p-5">
              <p className="t-overline text-stone">What you&rsquo;ll need</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {NEED.map((n) => (
                  <li key={n} className="t-body-s flex gap-3">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sage" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHO.map((w) => (
              <div key={w.title} data-reveal className="flex flex-col gap-2 rounded-[22px] bg-surface p-6">
                <h3 className="t-title-m">{w.title}</h3>
                <p className="t-body-s text-stone">{w.body}</p>
              </div>
            ))}
            <div data-reveal className="flex flex-col gap-2 rounded-[22px] border border-dashed border-line-strong p-6 sm:col-span-2">
              <h3 className="t-title-m">Not the right fit yet</h3>
              <p className="t-body-s text-stone">
                Clinics with several therapists and shared calendars (on our list), and anyone who mainly needs a stream of new clients — a marketplace serves that better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-[1312px] scroll-mt-20 px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-10 flex flex-col gap-3">
          <p className="t-overline text-stone">What you get</p>
          <h2 className="t-display-l max-w-[820px] !text-[clamp(32px,4.5vw,52px)]">Everything around the session, in one place.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} data-reveal className="group flex flex-col gap-4 rounded-[24px] bg-surface p-6 transition-shadow hover:shadow-[var(--shadow-card)]">
              <span className="flex size-11 items-center justify-center rounded-[14px] bg-sage-soft text-sage">
                <Icon name={f.icon} />
              </span>
              <h3 className="t-title-m">{f.title}</h3>
              <ul className="flex flex-1 flex-col gap-2">
                {f.points.map((p) => (
                  <li key={p} className="t-body-s flex gap-2.5 text-stone">
                    <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-line-strong" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="t-label-m text-sage">
                See how <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* earnings */}
      <section id="earnings" className="mx-auto max-w-[1312px] scroll-mt-20 px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-10 flex flex-col gap-3">
          <p className="t-overline text-stone">Earnings</p>
          <h2 className="t-display-l max-w-[820px] !text-[clamp(32px,4.5vw,52px)]">A price, not a percentage.</h2>
          <p className="t-body-l max-w-[680px] text-stone">Move the sliders to your own month and see what each option leaves you with. Sessio costs the same whether you see five clients or thirty.</p>
        </div>
        <div data-reveal>
          <EarningsCalculator />
        </div>
        <p className="mt-4">
          <TextLink href="/pricing">See the full price comparison</TextLink>
        </p>
      </section>

      {/* getting started */}
      <section id="start" className="mx-auto max-w-[1440px] scroll-mt-20 px-5 pb-[110px] md:px-16">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-20">
          <Photo src="/photos/desk-2.webp" alt="A therapist's desk with a laptop and notebook by a window" className="w-full lg:sticky lg:top-24 lg:w-[520px] lg:shrink-0" />
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="t-overline text-stone">Getting started</p>
              <h2 className="t-heading-m">From sign-up to your first paid booking.</h2>
            </div>
            <ol className="flex flex-col">
              {STEPS.map((s, i) => (
                <li key={s.title} data-reveal className="grid grid-cols-[48px_1fr] gap-4 border-t border-line py-6 md:grid-cols-[64px_1fr]">
                  <span className="font-display text-[30px] font-medium leading-none tracking-[-0.05em] text-sage md:text-[36px]">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="t-title-m md:text-[20px]">{s.title}</h3>
                    <p className="t-body-m text-stone">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3 rounded-[22px] bg-ink p-6 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="t-title-m">Moving from another tool?</p>
                <p className="t-body-s text-white/70">Write to us and a person will help you set up and word the message to your clients.</p>
              </div>
              <a href="mailto:hello@usesessio.com?subject=Help%20me%20set%20up%20Sessio" className="t-label-m inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-ink hover:bg-white/90">
                hello@usesessio.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* compare */}
      <section className="mx-auto max-w-[1120px] px-5 pb-[110px]">
        <h2 className="t-heading-m mb-6">Your own page vs. a marketplace</h2>
        <div data-reveal className="overflow-hidden rounded-[28px] border border-line">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-surface">
            <p className="t-overline p-4 text-stone md:px-6" />
            <p className="t-overline border-l border-line p-4 text-sage md:px-6">Sessio</p>
            <p className="t-overline border-l border-line p-4 text-stone md:px-6">Typical marketplace</p>
          </div>
          {VS.map(([k, a, b]) => (
            <div key={k} className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-line">
              <p className="t-body-s p-4 md:px-6 md:text-[15px]">{k}</p>
              <p className="t-label-m border-l border-line p-4 md:px-6">{a}</p>
              <p className="t-body-s border-l border-line p-4 text-stone md:px-6">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* compliance */}
      <section id="compliance" className="mx-auto max-w-[1312px] scroll-mt-20 px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-10 flex flex-col gap-3">
          <p className="t-overline text-stone">Law & privacy</p>
          <h2 className="t-display-l max-w-[820px] !text-[clamp(32px,4.5vw,52px)]">Ready for the new Act, careful with everything else.</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line md:grid-cols-2">
          {COMPLIANCE.map((c, i) => (
            <div key={c.title} data-reveal className="flex flex-col gap-3 bg-surface p-7 md:p-9">
              <span className="t-label-m text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t-title-m md:text-[20px]">{c.title}</h3>
              <p className="t-body-m text-stone">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          <TextLink href="/blog/psychologist-act-2026-art-28-documentation">What Art. 28 asks of your notes</TextLink>
          <TextLink href="/privacy">How Sessio handles data</TextLink>
        </div>
      </section>

      {/* guides */}
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

      {/* faq */}
      <section id="faq" className="mx-auto grid max-w-[1312px] scroll-mt-20 gap-10 px-5 pb-[110px] md:px-8 lg:grid-cols-[360px_1fr] lg:gap-20 lg:px-0">
        <div className="flex flex-col gap-4">
          <Pill tone="sage">Questions</Pill>
          <h2 className="t-heading-m">What therapists ask before joining</h2>
          <TextLink href="/faq">Read all answers</TextLink>
        </div>
        <FaqList items={FAQ_T} />
      </section>

      <ClosingCta title="Keep what you earn." />
      <Footer />
    </main>
  );
}
