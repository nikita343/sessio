import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { HeaderChrome } from "@/components/header-chrome";
import { DesktopMenu } from "@/components/nav-menu";
import { NAV } from "@/components/nav-data";
import { InkCanvas } from "@/components/ink";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

/** Ink splash: static image first (and for reduced motion), then a living WebGL version on top. */
export function Splash({
  src,
  className = "",
  base = "#f4f3ef",
  strength = 1,
  interactive = false,
}: {
  src: string;
  className?: string;
  base?: string;
  strength?: number;
  interactive?: boolean;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 select-none ${className}`}>
      <Image src={src} alt="" fill sizes="100vw" className="object-cover mix-blend-multiply" style={{ opacity: strength }} />
      <InkCanvas src={src} base={base} strength={strength} interactive={interactive} />
    </div>
  );
}

export function Pill({ children, tone = "outline" }: { children: React.ReactNode; tone?: "outline" | "sage" | "lavender" | "sky" | "clay" }) {
  const tones = {
    outline: "border border-line-strong bg-surface/70 text-ink",
    sage: "bg-sage-soft text-sage",
    lavender: "bg-lavender-soft text-[#5b5299]",
    sky: "bg-[#e3eef4] text-[#3d6a80]",
    clay: "bg-clay-soft text-clay",
  };
  return <span className={`t-overline inline-flex w-fit rounded-full px-3 py-1.5 ${tones[tone]}`}>{children}</span>;
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
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

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="t-label-m group inline-flex items-center gap-2 text-ink">
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}

export function Nav({ current }: { current?: string }) {
  return (
    <header className="relative z-30 mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-3 px-5 md:h-[90px] md:px-16">
      <Link href="/" aria-label="Sessio home">
        <Logo size={28} />
      </Link>
      <DesktopMenu groups={NAV} current={current} className="absolute left-1/2 hidden -translate-x-1/2 rounded-full border border-line bg-surface/85 p-1 lg:block" />
      <div className="flex items-center gap-1.5 sm:gap-2">
        <a href={`${APP_URL}/login`} className="t-label-m hidden px-3 text-ink/80 hover:text-ink xl:inline">
          Sign in
        </a>
        <Link href="/#waitlist" className="t-label-m inline-flex h-11 items-center justify-center rounded-full bg-sage px-5 text-white transition-colors hover:bg-sage-hover sm:px-6">
          <span className="sm:hidden lg:inline xl:hidden">Join</span>
          <span className="hidden sm:inline lg:hidden xl:inline">Join the waitlist</span>
        </Link>
        <HeaderChrome items={NAV} current={current} />
      </div>
    </header>
  );
}

/** Kept for older imports; the mobile menu now lives in <Nav />. */
export function MobileNav() {
  return null;
}

/** Standard top of an inner page: splash, nav and a centred title block. */
export function PageHero({
  current,
  pill,
  title,
  body,
  splash = "/splash/hero.webp",
  children,
}: {
  current?: string;
  pill?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  splash?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <Splash src={splash} strength={0.8} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-paper/0 to-paper" />
      <Nav current={current} />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5 px-5 pb-20 pt-12 text-center md:pb-24 md:pt-20">
        {pill && (
          <span data-hero-fade>
            <Pill>{pill}</Pill>
          </span>
        )}
        <h1 data-split className="t-display-l">
          {title}
        </h1>
        {body && (
          <p data-hero-fade className="t-body-l max-w-[620px] text-stone">
            {body}
          </p>
        )}
        {children && <div data-hero-fade>{children}</div>}
      </div>
    </section>
  );
}

export function Photo({ src, alt, ratio = "aspect-[3/2]", className = "", priority = false }: { src: string; alt: string; ratio?: string; className?: string; priority?: boolean }) {
  return (
    <div data-reveal className={`relative overflow-hidden rounded-[24px] bg-sunken ${ratio} ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority={priority} />
    </div>
  );
}

export function Footer() {
  const cols: [string, [string, string][]][] = [
    [
      "Product",
      [
        ["Booking & payments", "/product#booking"],
        ["Private video", "/product#video"],
        ["Voice-memo notes", "/product#notes"],
        ["Admin assistant", "/product#assistant"],
        ["Pricing", "/pricing"],
      ],
    ],
    [
      "Who it's for",
      [
        ["For therapists", "/for-therapists"],
        ["For clients", "/for-clients"],
        ["Use cases", "/use-cases"],
        ["Demo booking page", `${APP_URL}/anna-kowalska`],
        ["Client sign-in", `${APP_URL}/me/login`],
      ],
    ],
    [
      "Resources",
      [
        ["Blog", "/blog"],
        ["Guides", "/guides"],
        ["Webinars", "/webinars"],
        ["FAQ", "/faq"],
      ],
    ],
    [
      "Company",
      [
        ["About", "/about"],
        ["Privacy", "/privacy"],
        ["Data processing (DPA)", "/privacy#dpa"],
        ["Contact", "mailto:hello@usesessio.com"],
      ],
    ],
  ];
  return (
    <footer className="overflow-hidden bg-ink text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 px-5 pt-16 md:px-16 lg:flex-row">
        <div className="flex flex-col gap-4">
          <Logo size={24} tone="inverse" />
          <p className="t-body-s max-w-[260px] text-white/60">Practice software for psychologists and therapists. Made in Warsaw, hosted in the EU.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-12 lg:gap-16">
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
          data-rise="90"
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

/** Closing call to action used at the bottom of inner pages. */
export function ClosingCta({ title = "Your practice, your clients.", body = "149 zł a month, all-in. Founding therapists keep that price for life." }: { title?: string; body?: string }) {
  return (
    <section className="px-5 pb-[80px] md:px-16">
      <div data-reveal className="relative mx-auto flex max-w-[1312px] flex-col items-center gap-5 overflow-hidden rounded-[28px] bg-surface px-5 py-20 text-center md:rounded-[32px]">
        <Splash src="/splash/cta.webp" base="#ffffff" />
        <h2 className="t-display-l relative max-w-[640px]">{title}</h2>
        <p className="t-body-l relative max-w-[520px] text-stone">{body}</p>
        <div className="relative flex flex-wrap justify-center gap-2">
          <ButtonLink href="/#waitlist">Become a founding therapist</ButtonLink>
          <ButtonLink href={`${APP_URL}/login`} variant="secondary">
            Explore the demo
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
