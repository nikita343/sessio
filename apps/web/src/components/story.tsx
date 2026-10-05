"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCREEN_H, SCREEN_W, ScreenBlik, ScreenBooking, ScreenEmail, ScreenLock, ScreenMemo, ScreenVideo } from "@/components/story-screens";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Chapter = {
  tag: string;
  title: [string, string];
  body: string;
  bg: string; // stage tint
  accent: string; // timeline colour
  screen: React.ReactNode | null;
};

const CHAPTERS: Chapter[] = [
  {
    tag: "One client · one week",
    title: ["One client,", "one week of care."],
    body: "A single session, from the first click to the signed note — made calm by Sessio.",
    bg: "#efeee9",
    accent: "#3f6b5e",
    screen: <ScreenLock />,
  },
  {
    tag: "Sunday 21:40 · Booking page",
    title: ["It starts with", "a free slot."],
    body: "Marta opens Anna’s page, reads how she works and picks Tuesday at 11:00. No messages back and forth.",
    bg: "#e4e0f4",
    accent: "#6b62a8",
    screen: <ScreenBooking />,
  },
  {
    tag: "Sunday 21:42 · BLIK",
    title: ["Paid before", "hello."],
    body: "Six digits in her banking app. 200 zł lands in Anna’s own account — Sessio takes nothing.",
    bg: "#dbe8e0",
    accent: "#3f6b5e",
    screen: <ScreenBlik />,
  },
  {
    tag: "Monday 11:00 · Reminder",
    title: ["A reminder,", "not a chase."],
    body: "The day before, Marta gets the private video link and the cancellation terms. Anna doesn’t lift a finger.",
    bg: "#d9e7ef",
    accent: "#3d6a80",
    screen: <ScreenEmail />,
  },
  {
    tag: "Tuesday 11:00 · Session",
    title: ["Fifty undivided", "minutes."],
    body: "The room opens straight from the email. Video runs peer-to-peer between the two of them, and nothing is recorded.",
    bg: "#f1e5d4",
    accent: "#a97b62",
    screen: <ScreenVideo />,
  },
  {
    tag: "Tuesday 11:52 · Voice memo",
    title: ["Two minutes,", "then the evening is hers."],
    body: "Anna dictates what mattered. It’s transcribed on her phone and drafted into a record she reads, edits and signs.",
    bg: "#d6e5dc",
    accent: "#3f6b5e",
    screen: <ScreenMemo />,
  },
  {
    tag: "And next Tuesday",
    title: ["Every session,", "handled."],
    body: "From the first click to the signed note, in one quiet place. Your clients stay yours.",
    bg: "#1c2530",
    accent: "#b8b0e0",
    screen: null,
  },
];

// Timeline stops (chapters 1..6)
const STOPS = [
  ["Booking", "Sun 21:40"],
  ["Payment", "Sun 21:42"],
  ["Reminder", "Mon 11:00"],
  ["Session", "Tue 11:00"],
  ["Notes", "Tue 11:52"],
  ["Next week", "Tue 11:00"],
];
const stopAt = (k: number) => (k + 0.5) / STOPS.length; // 0..1 along the track
const fillFor = (i: number) => (i === 0 ? 0 : stopAt(i - 1));

// Screen position inside /story/hand.webp (2048×1152)
const IMG_W = 2048;
const IMG_H = 1152;
const SCR = { x: 1219, y: 160, w: 344, h: 758 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Title({ c, className = "" }: { c: Chapter; className?: string }) {
  return (
    <h2 className={`t-display-xl ${className}`}>
      {c.title[0]} <span className="opacity-55">{c.title[1]}</span>
    </h2>
  );
}

/* ----------------------------- Pinned (desktop) ----------------------------- */

function Pinned() {
  const root = useRef<HTMLDivElement>(null);
  const screenBox = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const texts = q("[data-text]");
      const screens = q("[data-screen]");
      const bgs = q("[data-bg]");
      const fill = q("[data-fill]")[0];
      const dot = q("[data-dot]")[0];
      const rail = q("[data-rail]")[0];
      const N = CHAPTERS.length;

      // keep the overlay screen scaled to the photo's phone
      const box = screenBox.current!;
      const fit = () => box.style.setProperty("--s", String(box.clientWidth / SCREEN_W));
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(box);

      gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });
      gsap.set(screens.slice(1), { autoAlpha: 0, scale: 0.96 });
      gsap.set(bgs.slice(1), { autoAlpha: 0 });
      gsap.set(fill, { scaleX: 0, transformOrigin: "left center", backgroundColor: CHAPTERS[0].accent });
      gsap.set(dot, { left: "0%", backgroundColor: CHAPTERS[0].accent });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.9 },
      });

      for (let i = 0; i < N - 1; i++) {
        const t = i + 0.55;
        const d = 0.45;
        tl.to(texts[i], { autoAlpha: 0, y: -40, duration: d }, t)
          .to(texts[i + 1], { autoAlpha: 1, y: 0, duration: d }, t + 0.1)
          .to(bgs[i + 1], { autoAlpha: 1, duration: d }, t)
          .to(fill, { scaleX: fillFor(i + 1), backgroundColor: CHAPTERS[i + 1].accent, duration: d }, t)
          .to(dot, { left: `${fillFor(i + 1) * 100}%`, backgroundColor: CHAPTERS[i + 1].accent, duration: d }, t);
        if (screens[i]) tl.to(screens[i], { autoAlpha: 0, scale: 1.03, duration: d * 0.8 }, t);
        if (screens[i + 1]) {
          tl.to(screens[i + 1], { autoAlpha: 1, scale: 1, duration: d }, t + 0.1);
          const pops = screens[i + 1].querySelectorAll("[data-pop]");
          if (pops.length) tl.from(pops, { autoAlpha: 0, y: 10, stagger: 0.06, duration: 0.2, ease: "power1.out" }, i + 1.05);
          const wave = screens[i + 1].querySelectorAll("[data-wave] > span");
          if (wave.length) tl.from(wave, { scaleY: 0.2, opacity: 0.25, stagger: 0.012, duration: 0.15 }, i + 1.05);
        }
      }
      // last chapter: the hand dissolves into ink, the rail turns light
      tl.to(q("[data-hand], [data-floor]"), { autoAlpha: 0, duration: 0.45 }, N - 2 + 0.55).to(rail, { color: "rgba(244,243,239,0.75)", duration: 0.45 }, N - 2 + 0.55);
      tl.to({}, { duration: 0.4 }, N - 1); // hold the ending

      // the phone breathes a little
      gsap.to(q("[data-float]"), { y: -12, rotate: -0.6, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

      return () => ro.disconnect();
    },
    { scope: root },
  );

  const N = CHAPTERS.length;
  return (
    <section ref={root} className="relative" style={{ height: `${N * 100}vh` }} aria-label="One client, one week of care">
      <div className="sticky top-0 h-screen overflow-hidden">
        {CHAPTERS.map((c, i) => (
          <div
            key={i}
            data-bg
            className="absolute inset-0"
            style={{ background: i === N - 1 ? c.bg : `radial-gradient(ellipse 70% 80% at 72% 40%, #fbfaf6 0%, ${c.bg} 62%, ${c.bg} 100%)` }}
          />
        ))}

        {/* photo: multiplies over the tint, so the room changes colour around the hand */}
        <div
          data-float
          data-hand
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 mix-blend-multiply"
          style={{ width: `max(100vw, ${(100 * IMG_W) / IMG_H}vh)`, aspectRatio: `${IMG_W}/${IMG_H}` }}
        >
          <Image src="/story/hand.webp" alt="" fill sizes="180vh" className="select-none object-cover" />
        </div>

        {/* live screen, positioned on the phone in the photo */}
        <div
          data-float
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
          style={{ width: `max(100vw, ${(100 * IMG_W) / IMG_H}vh)`, aspectRatio: `${IMG_W}/${IMG_H}` }}
          aria-hidden
        >
          <div
            ref={screenBox}
            className="absolute overflow-hidden rounded-[4.5%/2.1%]"
            style={{ left: pct(SCR.x, IMG_W), top: pct(SCR.y, IMG_H), width: pct(SCR.w, IMG_W), height: pct(SCR.h, IMG_H) }}
          >
            {CHAPTERS.map((c, i) =>
              c.screen ? (
                <div
                  key={i}
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ width: SCREEN_W, height: SCREEN_H, transform: "scale(var(--s, 1))" }}
                >
                  <div data-screen className="h-full w-full">
                    {c.screen}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>

        {/* soft floor so the timeline stays readable over the hand */}
        <div data-floor className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-[#fbfaf6]/90 via-[#fbfaf6]/50 to-transparent" />

        {/* copy */}
        <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-16">
          <div className="relative h-[340px] w-full max-w-[520px]">
            {CHAPTERS.map((c, i) => (
              <div key={i} data-text className={`absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-5 ${i === N - 1 ? "text-paper" : "text-ink"}`}>
                <span
                  className={`t-overline w-fit rounded-full px-3 py-1.5 ${i === N - 1 ? "bg-white/10 text-lavender" : "bg-white/70 text-ink/70"}`}
                >
                  {c.tag}
                </span>
                <Title c={c} />
                <p className={`t-body-l max-w-[420px] ${i === N - 1 ? "text-paper/70" : "text-ink/70"}`}>{c.body}</p>
                {i === N - 1 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a href="#waitlist" className="t-label-m inline-flex h-11 items-center rounded-full bg-paper px-6 text-ink hover:bg-white">
                      Become a founding therapist
                    </a>
                    <a
                      href="https://app.usesessio.com/anna-kowalska"
                      className="t-label-m inline-flex h-11 items-center rounded-full border border-white/25 px-6 text-paper hover:border-white/60"
                    >
                      Try the booking page
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* timeline */}
        <div data-rail className="absolute inset-x-0 bottom-8 mx-auto max-w-[1440px] px-16 text-ink/70">
          <div className="grid grid-cols-6">
            {STOPS.map(([stage]) => (
              <span key={stage} className="t-label-m text-center">
                {stage}
              </span>
            ))}
          </div>
          <div className="relative my-3 h-[2px] rounded-full bg-current/20">
            <div data-fill className="absolute inset-0 rounded-full" />
            <span data-dot className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white/40" />
          </div>
          <div className="grid grid-cols-6">
            {STOPS.map(([stage, time]) => (
              <span key={stage} className="t-caption text-center opacity-70">
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Stacked (mobile / reduced) ----------------------- */

function Stacked() {
  return (
    <section className="flex flex-col gap-6 px-5 pb-[120px]" aria-label="One client, one week of care">
      {CHAPTERS.map((c, i) => (
        <div
          key={i}
          data-reveal
          className={`flex flex-col items-center gap-8 overflow-hidden rounded-[28px] px-6 py-10 ${i === CHAPTERS.length - 1 ? "text-paper" : "text-ink"}`}
          style={{ background: c.bg }}
        >
          <div className="flex w-full flex-col gap-4">
            <span className={`t-overline w-fit rounded-full px-3 py-1.5 ${i === CHAPTERS.length - 1 ? "bg-white/10 text-lavender" : "bg-white/70 text-ink/70"}`}>
              {c.tag}
            </span>
            <h2 className="t-display-l">
              {c.title[0]} <span className="opacity-55">{c.title[1]}</span>
            </h2>
            <p className="t-body-m opacity-75">{c.body}</p>
          </div>
          {c.screen && (
            <div className="rounded-[38px] bg-ink p-[7px] shadow-[0_30px_60px_-30px_rgb(28_37_48/0.6)]">
              <div className="relative overflow-hidden rounded-[31px]" style={{ width: SCREEN_W * 0.72, height: SCREEN_H * 0.72 }}>
                <div className="absolute left-0 top-0 origin-top-left" style={{ width: SCREEN_W, height: SCREEN_H, transform: "scale(0.72)" }}>
                  {c.screen}
                </div>
              </div>
            </div>
          )}
          {i === CHAPTERS.length - 1 && (
            <a href="#waitlist" className="t-label-m inline-flex h-11 items-center self-start rounded-full bg-paper px-6 text-ink">
              Become a founding therapist
            </a>
          )}
        </div>
      ))}
    </section>
  );
}

export function Story() {
  return (
    <>
      <div className="hidden md:motion-safe:block">
        <Pinned />
      </div>
      <div className="md:motion-safe:hidden">
        <Stacked />
      </div>
    </>
  );
}
