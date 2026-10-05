import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { APP_URL, ButtonLink, Footer, MobileNav, Nav, Pill, Splash, TextLink } from "@/components/site";
import { POSTS, fmtDate } from "@/content/posts";
import { WEBINARS, fmtWhen } from "@/content/webinars";

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden md:h-[726px]">
      <Splash src="/splash/hero.webp" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[254px] bg-gradient-to-b from-paper/0 to-paper" />
      <Nav />
      <MobileNav />
      <div className="relative mx-auto flex max-w-[680px] flex-col items-center gap-6 px-5 pb-24 pt-16 text-center md:pt-[120px]">
        <Pill>For psychologists &amp; therapists</Pill>
        <h1 className="t-display-xl">
          Your whole practice,
          <br />
          <span className="text-stone">in one quiet place.</span>
        </h1>
        <p className="t-body-l text-stone">
          Booking, BLIK prepayment, private video and notes from a two-minute voice memo. No commission, no session
          recordings — your clients stay yours.
        </p>
        <ButtonLink href="#waitlist">Become a founding therapist</ButtonLink>
        <p className="t-caption text-stone">149 zł / month, all-in · price locked for life</p>
      </div>
    </section>
  );
}

/* -------------------------------- Showcase ------------------------------- */

function Showcase() {
  return (
    <section id="how" className="px-5 pb-[120px] md:px-16">
      <div className="relative mx-auto aspect-[1312/700] max-w-[1312px] overflow-hidden rounded-[20px] bg-sunken md:rounded-[32px]">
        <Splash src="/splash/showcase.webp" />
        <Image
          src="/img/dash.webp"
          alt="Sessio dashboard: today's sessions, payments and what the assistant handled"
          width={2256}
          height={1500}
          priority
          className="absolute"
          style={{ left: "0.915%", top: "1.714%", width: "85.98%", height: "auto" }}
        />
        <Image
          src="/img/mobile.webp"
          alt="A therapist's booking page on a phone, with times to pick and BLIK prepayment"
          width={849}
          height={1449}
          className="absolute"
          style={{ left: "66.77%", top: "8.571%", width: "32.36%", height: "auto" }}
        />
      </div>
    </section>
  );
}

/* --------------------------------- Numbers ------------------------------- */

function Numbers() {
  const items = [
    ["0%", "commission on your sessions"],
    ["2 min", "from voice memo to signed record"],
    ["0", "session recordings, ever"],
    ["EU", "hosted data, in the EU"],
  ];
  return (
    <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-10 px-5 pb-[140px] md:grid-cols-4 md:px-16">
      {items.map(([big, small], i) => (
        <div key={big} className={`flex flex-col gap-2 ${i % 2 ? "border-l border-line pl-6 md:pl-8" : ""} ${i === 2 ? "md:border-l md:border-line md:pl-8" : ""}`}>
          <span className="t-display-l">{big}</span>
          <span className="t-label-m text-stone">{small}</span>
        </div>
      ))}
    </section>
  );
}

/* --------------------------------- Features ------------------------------ */

function Feature({
  id,
  pill,
  tone,
  title,
  body,
  link,
  splash,
  reverse = false,
  children,
}: {
  id?: string;
  pill: string;
  tone: "sage" | "lavender" | "sky";
  title: React.ReactNode;
  body: string;
  link: [string, string];
  splash: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-[1440px] px-5 pb-[120px] md:px-16">
      <div className={`flex flex-col items-center gap-12 md:gap-20 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
        <div className="flex w-full flex-col items-start gap-5 md:flex-1">
          <Pill tone={tone}>{pill}</Pill>
          <h2 className="t-display-l max-w-[560px]">{title}</h2>
          <p className="t-body-l max-w-[612px] text-stone">{body}</p>
          <TextLink href={link[1]}>{link[0]}</TextLink>
        </div>
        <div className="relative flex aspect-[620/540] w-full items-center justify-center overflow-hidden rounded-[28px] bg-sunken md:w-[620px] md:shrink-0">
          <Splash src={splash} />
          <div className="relative w-[82%] max-w-[420px]">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="t-body-s text-stone">{k}</span>
      <span className="t-label-m text-right">{v}</span>
    </div>
  );
}

function BookingCard() {
  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] bg-surface p-6 shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between">
        <span className="t-title-m">New booking</span>
        <span className="t-overline rounded-full bg-sage-soft px-2.5 py-1 text-sage">Paid · BLIK</span>
      </div>
      <Row k="Client" v="Marta N. · first session" />
      <Row k="When" v="Tue 6 Oct · 11:00–11:50" />
      <Row k="Where" v="Private video room" />
      <Row k="Amount" v="200 zł → your account" />
      <p className="t-caption rounded-xl bg-paper px-3 py-2.5 text-stone">
        Reminder with video link scheduled for Mon 11:00 and Tue 10:00
      </p>
    </div>
  );
}

function ThreadCard() {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-float)]">
      <div className="flex items-center gap-2.5">
        <span className="t-label-m flex size-8 items-center justify-center rounded-full bg-lavender-soft text-[#5b5299]">P</span>
        <div>
          <p className="t-label-m">Piotr S.</p>
          <p className="t-caption text-stone">Message via your booking page</p>
        </div>
      </div>
      <p className="t-body-s max-w-[80%] self-start rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5">
        Hi, something came up on Thursday. Could we move the session?
      </p>
      <p className="t-body-s max-w-[82%] self-end rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-white">
        Of course, Piotr. Anna has Tuesday 17:30 or Wednesday 09:00. Which suits you?
      </p>
      <p className="t-body-s self-start rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5">Tuesday works, thanks!</p>
      <p className="t-caption self-center rounded-full bg-sage-soft px-3 py-1.5 text-sage">
        Moved to Tue 17:30 · calendar and link updated
      </p>
    </div>
  );
}

function MemoCard() {
  const bars = [8, 14, 10, 18, 12, 20, 9, 16, 11, 19, 7, 13, 17, 10, 15, 8, 12, 18, 9, 14, 11, 16];
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-float)]">
      <span className="t-caption inline-flex w-fit items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-sage">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" />
        </svg>
        Transcribed on this device
      </span>
      <div className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5">
        <span className="flex size-7 items-center justify-center rounded-full bg-ink text-white">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2 1l7 4-7 4z" fill="currentColor" />
          </svg>
        </span>
        <span className="flex flex-1 items-center gap-[3px]" aria-hidden>
          {bars.map((h, i) => (
            <span key={i} className={`w-[3px] rounded-full ${i < 9 ? "bg-ink" : "bg-line-strong"}`} style={{ height: h }} />
          ))}
        </span>
        <span className="t-caption text-stone">2:14</span>
      </div>
      <div className="rounded-xl border border-line p-3">
        <p className="t-overline text-stone">Draft record · Session 12</p>
        <p className="t-body-s mt-1">
          Continued thought records for work situations; fewer Sunday-evening episodes (2 vs 4). Homework: one
          behavioural experiment.
        </p>
      </div>
      <span className="t-label-m flex h-10 items-center justify-center rounded-full bg-sage text-white">Approve &amp; sign</span>
    </div>
  );
}

/* ----------------------------------- CTA --------------------------------- */

function Cta() {
  return (
    <section id="pricing" className="px-5 pb-[80px] md:px-16">
      <div
        id="waitlist"
        className="relative mx-auto flex max-w-[1312px] scroll-mt-10 flex-col items-center overflow-hidden rounded-[28px] bg-surface px-5 py-24 text-center md:min-h-[650px] md:justify-center md:rounded-[32px]"
      >
        <Splash src="/splash/cta.webp" />
        <div className="relative flex max-w-[680px] flex-col items-center gap-6">
          <Pill>Founding therapists · first 100</Pill>
          <h2 className="t-display-xl">
            Less admin.
            <br />
            <span className="text-stone">More therapy.</span>
          </h2>
          <p className="t-body-l text-stone">
            149 zł a month, all-in. No commission, no per-client fees, no 12-month contract. We&rsquo;re onboarding
            therapists in Warsaw and Kraków this autumn.
          </p>
          <WaitlistForm />
          <p className="t-caption text-stone">No payment now. Founding price locked for life.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Human sections --------------------------- */

function HumanIntro() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-[140px] md:px-16">
      <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-20">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[28px]">
          <Image src="/photos/session.webp" alt="A psychologist in her light-filled practice, sitting in a sage armchair" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-5">
          <Pill>Why we built it</Pill>
          <h2 className="t-display-l">For the people who hold the room.</h2>
          <p className="t-body-l text-stone">
            Therapists give fifty undivided minutes, then spend the evening on transfers, reminders and notes. Marketplaces solved that by taking a share of every session — and the clients with it.
          </p>
          <p className="t-body-l text-stone">
            Sessio is the opposite deal: a calm tool you pay a flat fee for, that does the admin and gets out of the way. Your clients stay yours.
          </p>
          <TextLink href="/use-cases">See who it&rsquo;s for</TextLink>
        </div>
      </div>
    </section>
  );
}

const CASES = [
  ["/photos/session-2.webp", "The established psychologist", "“My calendar is full. I just want the admin to disappear.”", "/use-cases#established"],
  ["/photos/memo.webp", "The psychotherapist behind on notes", "“I know what happened in the session. Writing it down is the hard part.”", "/use-cases#notes"],
  ["/photos/online.webp", "The bilingual therapist online", "“Half my clients are in Kraków, half in Lviv.”", "/use-cases#online"],
];

function UseCasesTeaser() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-[140px] md:px-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-4">
          <Pill>Use cases</Pill>
          <h2 className="t-display-l max-w-[620px]">Different practices. The same quiet Monday.</h2>
        </div>
        <TextLink href="/use-cases">All use cases</TextLink>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CASES.map(([img, who, quote, href]) => (
          <Link key={href} href={href} className="group flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-sunken">
              <Image src={img} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            <p className="t-overline text-stone">{who}</p>
            <p className="t-title-m">{quote}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Resources() {
  const posts = POSTS.slice(0, 3);
  const next = WEBINARS[0];
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-[120px] md:px-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-4">
          <Pill>Resources</Pill>
          <h2 className="t-display-l max-w-[620px]">Plain answers about the new Act, money and privacy.</h2>
        </div>
        <TextLink href="/blog">Read the blog</TextLink>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-sunken">
              <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 22vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            <p className="t-overline text-stone">{p.category}</p>
            <h3 className="t-title-m group-hover:underline group-hover:underline-offset-4">{p.title}</h3>
            <p className="t-caption text-stone">
              {fmtDate(p.date)} · {p.readMin} min read
            </p>
          </Link>
        ))}
        <Link href={`/webinars#${next.slug}`} className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-[24px] bg-ink p-6 text-white">
          <div className="flex flex-col gap-3">
            <span className="t-overline text-white/60">Free webinar · {next.lang}</span>
            <h3 className="t-heading-s">{next.title}</h3>
            <p className="t-body-s text-white/70 first-letter:uppercase">{fmtWhen(next.date)}</p>
          </div>
          <span className="t-label-m inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-ink transition-transform group-hover:translate-x-0.5">
            Save your seat →
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <Numbers />
      <HumanIntro />
      <Feature
        pill="Booking & payments"
        tone="sage"
        title={
          <>
            Booked and paid,
            <br />
            before you say hello.
          </>
        }
        body="Clients choose a time on your own page and prepay with BLIK, card or Przelewy24 — straight to your account. Reminders and the video link go out on their own, so no-shows stop costing you."
        link={["See a booking page", `${APP_URL}/anna-kowalska`]}
        splash="/splash/card-sage.webp"
      >
        <BookingCard />
      </Feature>
      <Feature
        id="assistant"
        pill="Admin assistant"
        tone="lavender"
        title={<>An assistant for everything around the session.</>}
        body="It answers booking questions, offers free times and chases what's missing — in Polish, Ukrainian or English. Anything personal waits for you."
        link={["What it can and can't see", "/privacy#never"]}
        splash="/splash/card-lavender.webp"
        reverse
      >
        <ThreadCard />
      </Feature>
      <Feature
        id="privacy"
        pill="Private notes"
        tone="sky"
        title={
          <>
            Two-minute notes.
            <br />
            Nothing recorded.
          </>
        }
        body="After the session, dictate what matters. It's transcribed on your own device, drafted into a record ready for the new Psychologist Act, and waits for you to edit and sign. The audio is deleted."
        link={["How the notes work", "/product#notes"]}
        splash="/splash/card-sky.webp"
      >
        <MemoCard />
      </Feature>
      <UseCasesTeaser />
      <Resources />
      <Cta />
      <Footer />
    </main>
  );
}
