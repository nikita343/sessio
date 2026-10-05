"use client";

import { useState } from "react";

const WEEKS = 4.33;
const zl = (n: number) => `${Math.round(n).toLocaleString("pl-PL")} zł`;

function Slider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-3">
        <span className="t-label-m">{label}</span>
        <span className="font-display text-[22px] font-medium tracking-[-0.03em] tabular-nums">
          {value}
          <span className="t-caption ml-1 text-stone">{suffix}</span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-sage)]"
      />
    </label>
  );
}

/**
 * What a month of sessions leaves you with on Sessio vs. common Polish platforms.
 * Prices are the published ones from the pricing page (checked 28 Sep 2026); estimates, not quotes.
 */
export function EarningsCalculator() {
  const [perWeek, setPerWeek] = useState(15);
  const [price, setPrice] = useState(200);
  const [newClients, setNewClients] = useState(2);

  const sessions = perWeek * WEEKS;
  const revenue = sessions * price;
  const firstVisits = Math.min(newClients, sessions);

  const rows = [
    { name: "Sessio", note: "149 zł a month, nothing per session or per client", cost: 149, ours: true },
    { name: "TwójPsycholog Premium", note: "≈ 130 zł + 20% of each new client's first visit", cost: 130 + firstVisits * price * 0.2 },
    { name: "ZnanyLekarz Starter", note: "≈ 491 zł + about 29 zł per new patient", cost: 491 + newClients * 29 },
    { name: "Mindly (reported Dec 2024)", note: "45% of every session + 100% of the first", cost: (sessions - firstVisits) * price * 0.45 + firstVisits * price },
  ].map((r) => ({ ...r, keep: Math.max(0, revenue - r.cost) }));
  const best = Math.max(...rows.map((r) => r.keep), 1);

  return (
    <div className="grid gap-6 rounded-[28px] bg-surface p-6 md:p-10 lg:grid-cols-[340px_1fr] lg:gap-12">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <p className="t-overline text-stone">Your month</p>
          <p className="font-display text-[40px] font-medium leading-none tracking-[-0.05em]">{zl(revenue)}</p>
          <p className="t-caption text-stone">from {Math.round(sessions)} sessions before any fees</p>
        </div>
        <Slider label="Sessions a week" value={perWeek} min={2} max={35} step={1} onChange={setPerWeek} suffix="/ wk" />
        <Slider label="Price per session" value={price} min={100} max={400} step={10} onChange={setPrice} suffix="zł" />
        <Slider label="New clients a month" value={newClients} min={0} max={10} step={1} onChange={setNewClients} suffix="new" />
      </div>
      <div className="flex flex-col gap-3">
        <p className="t-overline text-stone">What you keep each month</p>
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.name} className={`rounded-[18px] p-4 ${r.ours ? "bg-sage-soft" : "bg-paper"}`}>
              <div className="flex items-baseline justify-between gap-4">
                <span className={`t-label-m ${r.ours ? "text-sage" : ""}`}>{r.name}</span>
                <span className="font-display text-[22px] font-medium tracking-[-0.03em] tabular-nums">{zl(r.keep)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
                <div className={`h-full rounded-full transition-[width] duration-500 ${r.ours ? "bg-sage" : "bg-line-strong"}`} style={{ width: `${(r.keep / best) * 100}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap justify-between gap-2">
                <span className="t-caption text-stone">{r.note}</span>
                <span className="t-caption text-stone tabular-nums">fees ≈ {zl(r.cost)}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-caption text-stone">
          Estimates from published prices checked on 28 September 2026 (gross, VAT-exempt psychologist). Marketplaces also bring new clients, which Sessio doesn&rsquo;t — compare
          what fits your practice. Online payment processing (about 2% with Stripe) applies on any platform and isn&rsquo;t included.
        </p>
      </div>
    </div>
  );
}
