import type { Metadata } from "next";
import { APP_URL, ButtonLink, Footer, PageHero, Pill } from "@/components/site";

export const metadata: Metadata = {
  title: "Pricing — Sessio",
  description: "149 zł a month, all-in. No commission, no per-client fees, no 12-month contract. Founding therapists keep the price for life.",
};

const INCLUDED = [
  "Your booking page in Polish, Ukrainian and English",
  "BLIK, card and Przelewy24 prepayment into your own account",
  "Private video room for every online session",
  "Voice-memo notes, transcribed on your device",
  "Art. 28-ready records and private working notes",
  "Admin assistant and inbox",
  "Reminders and calendar invites",
  "EU data storage and a data-processing agreement",
];

const COMPARE: [string, string, string][] = [
  ["ZnanyLekarz Starter", "≈ 491 zł gross / month", "+ 26–32 zł for every new patient"],
  ["TwójPsycholog Premium", "≈ 130 zł gross / month", "+ 20% of a new client's first visit"],
  ["Noa AI notes alone", "≈ 245 zł gross / month", "notes only — no booking or video"],
  ["Mindly (reported Dec 2024)", "45% of every session", "+ 100% of the first session"],
];

export default function Pricing() {
  return (
    <main>
      <PageHero
        current="/pricing"
        pill="Pricing"
        title={
          <>
            Less than one session
            <br />
            <span className="text-stone">a month.</span>
          </>
        }
        body="One plan, everything included. Psychologists are VAT-exempt, so the price you see is the price you pay."
      />
      <section className="mx-auto grid max-w-[1120px] gap-6 px-5 pb-[110px] md:grid-cols-[1.1fr_1fr]">
        <div data-reveal className="flex flex-col gap-6 rounded-[28px] bg-surface p-8 shadow-[var(--shadow-card)] md:p-10">
          <div className="flex items-center justify-between">
            <p className="t-title-m">Sessio</p>
            <Pill tone="sage">Founding price, locked for life</Pill>
          </div>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-[64px] font-medium leading-none tracking-[-0.06em]">149 zł</span>
            <span className="t-body-m text-stone">/ month, gross</span>
          </p>
          <p className="t-body-s text-stone">or 1,490 zł a year — two months free. Cancel any time; no 12-month contract.</p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {INCLUDED.map((x) => (
              <li key={x} className="t-body-s flex gap-2.5">
                <span aria-hidden className="text-sage">✓</span>
                {x}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/#waitlist">Become a founding therapist</ButtonLink>
            <ButtonLink href={`${APP_URL}/login`} variant="secondary">
              Explore the demo
            </ButtonLink>
          </div>
          <p className="t-caption text-stone">0% commission. Card and BLIK processing is charged by Stripe directly to your account (about 2% per session).</p>
        </div>
        <div data-reveal className="flex flex-col gap-4 rounded-[28px] border border-line p-8 md:p-10">
          <p className="t-overline text-stone">What the same month costs elsewhere</p>
          <ul className="flex flex-col divide-y divide-line">
            {COMPARE.map(([name, price, extra]) => (
              <li key={name} className="flex flex-col gap-0.5 py-3.5">
                <span className="t-label-m">{name}</span>
                <span className="t-body-s">{price}</span>
                <span className="t-caption text-stone">{extra}</span>
              </li>
            ))}
          </ul>
          <p className="t-caption text-stone">
            Published prices as checked on 28 September 2026; gross figures assume a VAT-exempt psychologist. Average session price in Poland in 2025: 192 zł (TwójPsycholog market report).
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[760px] px-5 pb-[110px]">
        <h2 className="t-heading-m text-center">Questions</h2>
        <div className="mt-8 flex flex-col divide-y divide-line">
          {[
            ["Do you take a share of my sessions?", "No. Clients pay you directly through your own Stripe account. Sessio charges only the monthly plan."],
            ["Do you bring me clients?", "No — and that is deliberate. Sessio runs the practice you already have. Your clients stay yours, with no ban on sharing your own contacts."],
            ["What happens to my data if I leave?", "You can export everything. We keep nothing after the retention period you choose and the law requires."],
            ["Is the AI optional?", "Yes. You can write records yourself. When you use voice notes, the audio stays on your device and names are removed before any AI step."],
            ["Can a clinic use Sessio?", "Not yet. Multi-therapist practices are next on the roadmap — write to us and we will let you know."],
          ].map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="t-title-m flex cursor-pointer list-none items-center justify-between">
                {q}
                <span aria-hidden className="text-stone transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="t-body-m mt-2 text-stone">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
