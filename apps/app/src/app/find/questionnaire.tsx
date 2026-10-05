"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { FIND_T } from "@/lib/ui/find";
import { LANG_NAMES, SPECIALTIES } from "@/lib/profile";
import type { Answers, Fmt, When, Who } from "@/lib/directory";

const BUDGETS = [150, 200, 250, 300];

export function Questionnaire({ lang, initial }: { lang: Lang; initial: Answers | null }) {
  const t = FIND_T[lang];
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState<string[]>(initial?.topics ?? []);
  const [who, setWho] = useState<Who>(initial?.who ?? "me");
  const [spoken, setSpoken] = useState(initial?.lang ?? lang);
  const [fmt, setFmt] = useState<Fmt>(initial?.fmt ?? "any");
  const [when, setWhen] = useState<When>(initial?.when ?? "any");
  const [budget, setBudget] = useState<number | null>(initial?.budget ?? null);
  const total = 6;

  const submit = () => {
    const q = new URLSearchParams({ go: "1", topics: topics.join(","), who, lang: spoken, fmt, when, budget: budget ? String(budget) : "" });
    router.push(`/find?${q.toString()}`);
  };

  const pill = (on: boolean) =>
    `t-label-m rounded-full border px-4 py-2.5 text-left transition-colors ${on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface hover:border-ink/40"}`;
  const big = (on: boolean) =>
    `t-label-m flex min-h-14 items-center justify-between gap-3 rounded-[16px] border px-5 py-3 text-left transition-colors ${on ? "border-sage bg-sage-soft text-sage" : "border-line-strong bg-surface hover:border-ink/40"}`;
  const dot = (on: boolean) => <span aria-hidden className={`size-4 shrink-0 rounded-full border-2 ${on ? "border-sage bg-sage" : "border-line-strong"}`} />;

  const steps = [
    {
      q: t.qTopics,
      hint: t.qTopicsHint,
      body: (
        <div className="flex flex-wrap gap-2">
          {Object.entries(SPECIALTIES).map(([k, v]) => {
            const on = topics.includes(k);
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => setTopics(on ? topics.filter((x) => x !== k) : topics.length >= 3 ? [...topics.slice(1), k] : [...topics, k])}
                className={pill(on)}
              >
                {v[lang]}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      q: t.qWho,
      body: (
        <div className="grid gap-2 sm:grid-cols-3">
          {(["me", "couple", "teen"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={who === k} onClick={() => setWho(k)} className={big(who === k)}>
              {t.who[k]} {dot(who === k)}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: t.qLang,
      body: (
        <div className="grid gap-2 sm:grid-cols-2">
          {(["pl", "uk", "en", "ru"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={spoken === k} onClick={() => setSpoken(k)} className={big(spoken === k)}>
              <span className="first-letter:uppercase">{LANG_NAMES[k][lang]}</span> {dot(spoken === k)}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: t.qFmt,
      body: (
        <div className="grid gap-2 sm:grid-cols-3">
          {(["online", "in_person", "any"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={fmt === k} onClick={() => setFmt(k)} className={big(fmt === k)}>
              {t.fmt[k]} {dot(fmt === k)}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: t.qWhen,
      body: (
        <div className="grid gap-2 sm:grid-cols-2">
          {(["morning", "afternoon", "evening", "any"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={when === k} onClick={() => setWhen(k)} className={big(when === k)}>
              {t.when[k]} {dot(when === k)}
            </button>
          ))}
        </div>
      ),
    },
    {
      q: t.qBudget,
      body: (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[...BUDGETS, null].map((b) => (
            <button key={String(b)} type="button" aria-pressed={budget === b} onClick={() => setBudget(b)} className={big(budget === b)}>
              {b ? t.budget(b) : t.anyBudget}
            </button>
          ))}
        </div>
      ),
    },
  ];
  const s = steps[step];
  const last = step === total - 1;

  return (
    <section className="rounded-[28px] bg-surface p-5 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="t-overline text-sage">{t.step(step + 1, total)}</p>
        <div className="flex gap-1" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "w-6 bg-sage" : "w-3 bg-line-strong"}`} />
          ))}
        </div>
      </div>
      <h2 className="t-heading-s mt-4">{s.q}</h2>
      {s.hint && <p className="t-body-s mt-1 text-stone">{s.hint}</p>}
      <div className="mt-6">{s.body}</div>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="t-label-m h-11 rounded-full px-4 text-stone hover:text-ink disabled:invisible">
          ← {t.back}
        </button>
        <div className="flex items-center gap-2">
          {!last && step === 0 && topics.length === 0 && (
            <button type="button" onClick={() => setStep(1)} className="t-label-m h-11 rounded-full px-4 text-stone hover:text-ink">
              {t.skip}
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? submit() : setStep(step + 1))}
            className="t-label-m h-11 rounded-full bg-sage px-6 text-white transition-colors hover:bg-sage-hover"
          >
            {last ? t.show : `${t.next} →`}
          </button>
        </div>
      </div>
    </section>
  );
}
