"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The footer wordmark drawn as a dot matrix on a canvas. The word is rendered once to an
 * offscreen canvas in the site's display font, sampled onto a grid, and every dot that lands
 * inside a letter is drawn in the brand gradient. Dots part around the pointer and spring
 * back. The canvas is sized from the measured glyph box, so the word is never cropped.
 */

type Dot = { x: number; y: number; inside: boolean; r: number; g: number; b: number; ox: number; oy: number };

const WORD = "sessio";
const STOPS: [number, [number, number, number]][] = [
  [0, [94, 143, 127]], // sage
  [0.5, [138, 128, 200]], // lavender
  [1, [118, 152, 196]], // slate blue
];

function mix(t: number): [number, number, number] {
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k)) as [number, number, number];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export function FooterDots() {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const [h, setH] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    const canvas = cvs.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dots: Dot[] = [];
    let W = 0;
    let H = 0;
    let step = 8;
    let radius = 4;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let revealAt = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = el.clientWidth;
      if (!W) return;
      // measure the word at a reference size (with the headings' tight letter-spacing), then scale it
      // so the inked glyphs span the full width; letter-spacing scales with the size, so one pass is exact
      type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";
      const setFont = (c: Ctx, px: number) => {
        c.font = `600 ${px}px ${family}`;
        if ("letterSpacing" in c) c.letterSpacing = `${-0.04 * px}px`;
      };
      const probe = document.createElement("canvas").getContext("2d")! as Ctx;
      setFont(probe, 200);
      const m = probe.measureText(WORD);
      const textW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      step = Math.max(4, Math.min(10, Math.round(W / 150)));
      radius = step * 0.36;
      const Wt = W - step; // half a dot of breathing room on each side, so no letter is clipped
      const scale = Wt / textW;
      const pad = step * 2;
      H = Math.ceil((m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) * scale + pad * 2);
      setH(H);

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true })! as Ctx;
      setFont(o, 200 * scale);
      o.textBaseline = "alphabetic";
      o.fillStyle = "#000";
      o.fillText(WORD, step / 2 + m.actualBoundingBoxLeft * scale, pad + m.actualBoundingBoxAscent * scale);
      const data = o.getImageData(0, 0, W, H).data;

      dots = [];
      const off2 = step / 2;
      for (let y = off2; y < H; y += step) {
        for (let x = off2; x < W; x += step) {
          const a = data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3];
          const inside = a > 110;
          const [r, g, b] = inside ? mix(x / W) : [28, 37, 48];
          dots.push({ x, y, inside, r, g, b, ox: 0, oy: 0 });
        }
      }
    };

    const draw = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = step * 11;
      let moving = false;
      const sinceReveal = revealAt ? time - revealAt : 0;
      for (const d of dots) {
        let tx = 0;
        let ty = 0;
        let near = 0;
        if (pointer.active && !reduce) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 0.001) {
            near = 1 - dist / R;
            const push = near * near * R * 0.42;
            tx = (dx / dist) * push;
            ty = (dy / dist) * push;
          }
        }
        d.ox += (tx - d.ox) * 0.16;
        d.oy += (ty - d.oy) * 0.16;
        if (Math.abs(d.ox - tx) > 0.05 || Math.abs(d.oy - ty) > 0.05) moving = true;

        // reveal: a soft wave from left to right the first time the footer is seen
        const wave = reduce ? 1 : Math.max(0, Math.min(1, (sinceReveal - (d.x / W) * 700) / 500));
        const base = d.inside ? 0.85 : 0.07;
        const alpha = Math.min(1, (base + near * (d.inside ? 0.15 : 0.18)) * wave);
        if (alpha <= 0.002) continue;
        ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, radius * (d.inside ? 1 + near * 0.25 : 0.8), 0, Math.PI * 2);
        ctx.fill();
      }
      const revealing = !reduce && sinceReveal < 1400;
      if (visible && (moving || pointer.active || revealing)) raf = requestAnimationFrame(draw);
      else raf = 0;
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= -40 && pointer.y >= -40 && pointer.x <= r.width + 40 && pointer.y <= r.height + 40;
      kick();
    };
    const onLeave = () => {
      pointer.active = false;
      kick();
    };

    let started = false;
    const start = () => {
      build();
      started = true;
      kick();
    };
    const fontReady = document.fonts?.ready ?? Promise.resolve();
    fontReady.then(start);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !revealAt) revealAt = performance.now();
        if (visible && started) kick();
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    const ro = new ResizeObserver(() => {
      if (!started || el.clientWidth === W) return;
      build();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      kick();
      if (!visible) draw(performance.now());
    });
    ro.observe(el);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);
    canvas.addEventListener("pointerup", (e) => {
      if (e.pointerType !== "mouse") onLeave();
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} className="relative w-full" style={{ height: h ?? undefined, aspectRatio: h ? undefined : "4.1 / 1" }}>
      <span className="sr-only">Sessio</span>
      <canvas ref={cvs} aria-hidden className="absolute inset-0 block touch-pan-y" />
    </div>
  );
}
