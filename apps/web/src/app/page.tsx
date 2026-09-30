import Image from "next/image";
import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

function Splash({ src, className = "" }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      sizes="100vw"
      className={`pointer-events-none select-none object-cover mix-blend-multiply ${className}`}
    />
  );
}

function Pill({ children, tone = "outline" }: { children: React.ReactNode; tone?: "outline" | "sage" | "lavender" | "sky" }) {
  const tones = {
    outline: "border border-line-strong bg-surface/70 text-ink",
    sage: "bg-sage-soft text-sage",
    lavender: "bg-lavender-soft text-[#5b5299]",
    sky: "bg-[#e3eef4] text-[#3d6a80]",
  };
  return <span className={`t-overline inline-flex rounded-full px-3 py-1.5 ${tones[tone]}`}>{children}</span>;
}

function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const v =
    variant === "primary"
      ? "bg-sage text-white hover:bg-sage-hover"
      : "border border-line-strong bg-surface text-ink hover:border-ink/40";
  return (
    <a href={href} className={`t-label-m inline-flex h-11 items-center justify-center rounded-full px-6 transition-colors ${v}`}>
      {children}
    </a>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="t-label-m group inline-flex items-center gap-2 text-ink">
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function Nav() {
  const links = [
    ["How it works", "#how"],
    ["Privacy", "#privacy"],
    ["Pricing", "#pricing"],
    ["For clinics", "mailto:hello@usesessio.com?subject=Sessio%20for%20clinics"],
  ];
  return (
    <header className="relative z-10 mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-5 md:px-16">
      <a href="/" aria-label="Sessio home">
        <Logo size={28} />
      </a>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 rounded-full border border-line bg-surface/70 px-6 py-3 backdrop-blur md:flex">
        {links.map(([label, href]) => (
          <a key={label} href={href} className="t-label-m text-ink/80 hover:text-ink">
            {label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <a href={`${APP_URL}/login`} className="t-label-m hidden px-3 text-ink/80 hover:text-ink sm:inline">
          Sign in
        </a>
        <ButtonLink href="#waitlist">Join the waitlist</ButtonLink>
      </div>
    </header>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden md:h-[726px]">
      <Splash src="/splash/hero.webp" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[254px] bg-gradient-to-b from-paper/0 to-paper" />
      <Nav />
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

/* --------------------------------- Footer -------------------------------- */

function Footer() {
  const cols: [string, [string, string][]][] = [
    [
      "Product",
      [
        ["Booking page", "#how"],
        ["Payments", "#how"],
        ["Notes", "#privacy"],
        ["Assistant", "#assistant"],
      ],
    ],
    [
      "Company",
      [
        ["Privacy", "/privacy"],
        ["Data processing (DPA)", "/privacy#dpa"],
        ["Contact", "mailto:hello@usesessio.com"],
      ],
    ],
  ];
  return (
    <footer className="overflow-hidden bg-ink text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 px-5 pt-16 md:flex-row md:px-16">
        <div className="flex flex-col gap-4">
          <Logo size={24} tone="inverse" />
          <p className="t-body-s max-w-[240px] text-white/60">
            Practice software for psychologists and therapists. Made in Warsaw.
          </p>
        </div>
        <div className="flex gap-16">
          {cols.map(([title, links]) => (
            <div key={title} className="flex flex-col gap-2.5">
              <p className="t-overline text-white/50">{title}</p>
              {links.map(([label, href]) => (
                <a key={label} href={href} className="t-label-m text-white/90 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 md:px-16">
        <p
          aria-hidden
          className="font-display -mb-[0.28em] mt-16 select-none bg-cover bg-clip-text font-semibold leading-none text-transparent opacity-85"
          style={{
            backgroundImage: "url(/splash/texture.webp), linear-gradient(90deg,#c9dfd1,#d8d3ee,#cfe2ec)",
            backgroundBlendMode: "multiply",
            fontSize: "clamp(120px, 23vw, 330px)",
            letterSpacing: "-0.06em",
          }}
        >
          sessio
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <Numbers />
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
        body="It answers booking questions, moves sessions and chases what's missing — in Polish, Ukrainian or English. Anything unusual waits for your OK."
        link={["What it can and can't see", "#privacy"]}
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
        link={["How we handle your data", "/privacy"]}
        splash="/splash/card-sky.webp"
      >
        <MemoCard />
      </Feature>
      <Cta />
      <Footer />
    </main>
  );
}
