"use client";

import { useEffect, useState } from "react";

/**
 * Quiet interface sounds, synthesised with Web Audio (no files to load):
 * a soft tick on buttons and links, a lighter tap on toggles, and a two-note chime
 * for success (dispatch `window.dispatchEvent(new CustomEvent("sessio:sound", { detail: "success" }))`).
 * Off when the viewer turns it off (remembered on this device).
 */
const KEY = "sessio_sounds";
let ctx: AudioContext | null = null;

function enabled() {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, gain: number, type: OscillatorType = "sine", at = 0) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function playSound(kind: "click" | "toggle" | "success" | "error") {
  if (typeof window === "undefined" || !enabled()) return;
  if (kind === "click") blip(1800, 0.035, 0.035, "triangle");
  if (kind === "toggle") blip(2400, 0.025, 0.025, "sine");
  if (kind === "success") {
    blip(880, 0.12, 0.04, "sine");
    blip(1320, 0.18, 0.035, "sine", 0.09);
  }
  if (kind === "error") {
    blip(320, 0.14, 0.05, "triangle");
    blip(240, 0.18, 0.04, "triangle", 0.1);
  }
}

/** Mount once in a layout: listens for clicks app-wide. */
export function UiSounds() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("button, a[href], [role=button], [role=option], summary, input[type=checkbox], input[type=radio], label:has(input[type=checkbox])");
      if (!el || el.closest("[data-silent]") || (el as HTMLButtonElement).disabled) return;
      const toggle = el.matches("input[type=checkbox], input[type=radio], label, [role=option]");
      playSound(toggle ? "toggle" : "click");
    };
    const onCustom = (e: Event) => playSound((e as CustomEvent).detail ?? "click");
    document.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("sessio:sound", onCustom);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("sessio:sound", onCustom);
    };
  }, []);
  return null;
}

/** Small on/off switch for the sounds. */
export function SoundToggle({ labelOn, labelOff }: { labelOn: string; labelOff: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    // read the saved choice after mount (localStorage isn't available during server render)
    const saved = enabled();
    if (!saved) queueMicrotask(() => setOn(false));
  }, []);
  function flip() {
    const next = !on;
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      /* private mode: just this session */
    }
    setOn(next);
    if (next) playSound("success");
  }
  return (
    <button type="button" onClick={flip} data-silent aria-pressed={on} title={on ? labelOn : labelOff} className="t-caption inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-stone transition-colors hover:bg-sunken hover:text-ink">
      <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="m16 9.5 5 5m0-5-5 5" />}
      </svg>
      {on ? labelOn : labelOff}
    </button>
  );
}
