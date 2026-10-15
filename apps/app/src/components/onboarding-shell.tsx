import type { ReactNode } from "react";
import { Logo } from "./logo";
import { LangSwitcher } from "./lang-switcher";
import type { Lang } from "@/lib/i18n";
import { ONB_T } from "@/lib/ui/onboarding";

/** Header with the logo and a 3-segment step indicator; content column below. */
export function OnboardingShell({ step, lang, wide = false, children }: { step: 1 | 2 | 3; lang: Lang; wide?: boolean; children: ReactNode }) {
  const t = ONB_T[lang] ?? ONB_T.pl;
  return (
    <main className="min-h-dvh bg-paper">
      <header className="flex h-20 items-center justify-between px-5 md:px-10">
        <Logo size={24} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            {[1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 w-7 overflow-hidden rounded-full bg-line-strong md:w-10">
                {i < step && <span className="block h-full w-full rounded-full bg-sage" />}
                {i === step && <span className="onb-fill block h-full w-full rounded-full bg-sage" />}
              </span>
            ))}
          </div>
          <span className="t-caption text-stone">{t.stepOf(step)}</span>
          <LangSwitcher lang={lang} tone="plain" />
        </div>
      </header>
      <div className={`mx-auto px-4 pb-24 pt-2 md:pt-6 ${wide ? "max-w-[920px]" : "max-w-[760px]"}`}>{children}</div>
    </main>
  );
}

export function StepIntro({ overline, title, body }: { overline: string; title: string; body: string }) {
  return (
    <div className="onb-rise flex flex-col gap-2">
      <p className="t-overline text-sage">{overline}</p>
      <h1 className="t-heading-m">{title}</h1>
      <p className="t-body-m max-w-[640px] text-stone">{body}</p>
    </div>
  );
}
