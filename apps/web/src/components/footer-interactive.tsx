"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const WORD = "sessio";
const TEXTURE = "url(/splash/texture.webp), linear-gradient(90deg,#c9dfd1,#d8d3ee,#cfe2ec)";

/**
 * Footer wordmark. Each letter clips its own slice of one continuous ink texture, so the word
 * reads as a single painted surface; letters lift toward the cursor, the ink drifts with it,
 * and a click (or tap) sends a ripple through the word. Calm by default, still for reduced motion.
 */
export function FooterWordmark() {
  const wrap = useRef<HTMLDivElement>(null);
  const letters = useRef<HTMLSpanElement[]>([]);

  // give every letter its slice of the shared texture
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      letters.current.forEach((s) => {
        s.style.backgroundSize = `${w}px ${h}px, ${w}px ${h}px`;
        s.style.backgroundPosition = `${-s.offsetLeft}px 0, ${-s.offsetLeft}px 0`;
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ls = letters.current;
    const ys = ls.map((l) => gsap.quickTo(l, "y", { duration: 0.6, ease: "power3.out" }));
    const rs = ls.map((l) => gsap.quickTo(l, "rotate", { duration: 0.8, ease: "power3.out" }));
    const drift = { x: 0 };

    const move = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const px = e.clientX;
      const near = e.clientY > box.top - 160 && e.clientY < box.bottom + 80;
      ls.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(px - cx) / Math.max(box.width / 3, 1);
        const pull = near ? Math.max(0, 1 - d) : 0;
        ys[i](-pull * pull * box.height * 0.22);
        rs[i](near ? ((px - cx) / box.width) * -6 * pull : 0);
      });
      // ink drifts gently with the pointer
      const tx = ((px - box.left) / box.width - 0.5) * 60;
      gsap.to(drift, {
        x: tx,
        duration: 1.2,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => ls.forEach((l) => (l.style.backgroundPosition = `${-l.offsetLeft + drift.x}px 0, ${-l.offsetLeft}px 0`)),
      });
    };
    const leave = () => ls.forEach((_, i) => (ys[i](0), rs[i](0)));
    const ripple = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const origin = ls.reduce((best, l, i) => {
        const r = l.getBoundingClientRect();
        return Math.abs(e.clientX - (r.left + r.width / 2)) < Math.abs(e.clientX - (ls[best].getBoundingClientRect().left + ls[best].getBoundingClientRect().width / 2)) ? i : best;
      }, 0);
      ls.forEach((l, i) => {
        const delay = Math.abs(i - origin) * 0.07;
        gsap.fromTo(l, { scaleY: 1, scaleX: 1 }, { keyframes: [{ scaleY: 1.12, scaleX: 0.94, y: -box.height * 0.12, duration: 0.18 }, { scaleY: 1, scaleX: 1, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" }], delay, transformOrigin: "50% 100%" });
      });
    };

    // a soft wave once, when the footer first comes into view (helps touch screens discover it)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        gsap.fromTo(ls, { y: 0 }, { keyframes: [{ y: -18, duration: 0.35, ease: "sine.out" }, { y: 0, duration: 0.7, ease: "sine.inOut" }], stagger: 0.08, delay: 0.2 });
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", ripple);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", ripple);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-label="Sessio"
      role="img"
      className="font-display relative mt-14 inline-flex cursor-pointer select-none pb-[0.06em] font-semibold leading-[0.9] md:mt-20"
      style={{ fontSize: "clamp(88px, 21vw, 300px)", letterSpacing: "-0.065em", touchAction: "manipulation" }}
    >
      {WORD.split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden
          ref={(n) => {
            if (n) letters.current[i] = n;
          }}
          className="inline-block bg-clip-text text-transparent will-change-transform"
          style={{ backgroundImage: TEXTURE, backgroundBlendMode: "multiply" }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

/** Small live details for the footer bar: Warsaw time, copy-to-clipboard email, back to top. */
export function FooterBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const muted = tone === "light" ? "text-stone hover:text-ink" : "text-white/60 hover:text-white";
  const [time, setTime] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText("hello@usesessio.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:hello@usesessio.com";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className={`t-caption inline-flex items-center gap-2 ${tone === "light" ? "text-stone" : "text-white/60"}`}>
        <span className="relative flex size-2">
          <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${tone === "light" ? "bg-sage" : "bg-[#9fd3b6]"}`} />
          <span className={`relative inline-flex size-2 rounded-full ${tone === "light" ? "bg-sage" : "bg-[#9fd3b6]"}`} />
        </span>
        Warsaw {time ?? "--:--"}
      </span>
      <button type="button" onClick={copy} className={`t-caption transition-colors ${muted}`}>
        {copied ? "Copied ✓" : "hello@usesessio.com"}
      </button>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
        className={`t-caption group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${tone === "light" ? "border-line-strong text-ink/75 hover:border-ink/40 hover:text-ink" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"}`}
      >
        Back to top
        <span aria-hidden className="transition-transform group-hover:-translate-y-0.5">
          ↑
        </span>
      </button>
    </div>
  );
}
