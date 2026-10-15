import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingShell, StepIntro } from "@/components/onboarding-shell";
import { Button, btn } from "@/components/ui";
import { startPracticeNote } from "@/lib/onboarding-actions";
import { getTherapist } from "@/lib/therapist";
import { uiLang, pick } from "@/lib/ui-lang";
import { ONB_T } from "@/lib/ui/onboarding";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(ONB_T, await uiLang()).s3Title };
}

/** Step 3 of 3: the first (practice) note, written in the real editor. */
export default async function OnboardingNote(props: PageProps<"/onboarding/note">) {
  const sp = await props.searchParams;
  await getTherapist();
  const lang = await uiLang();
  const t = pick(ONB_T, lang);
  const cards = [
    [t.s3Card1Title, t.s3Card1Body],
    [t.s3Card2Title, t.s3Card2Body],
    [t.s3Card3Title, t.s3Card3Body],
  ];
  return (
    <OnboardingShell step={3} lang={lang}>
      <div className="flex flex-col gap-8">
        <StepIntro overline={t.s3Overline} title={t.s3Title} body={t.s3Body} />
        <ol className="grid gap-3 md:grid-cols-3">
          {cards.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-2 rounded-[20px] border border-line bg-surface p-5">
              <span className="flex size-7 items-center justify-center rounded-full bg-sage-soft font-display text-[13px] font-medium text-sage">{i + 1}</span>
              <p className="t-title-m">{title}</p>
              <p className="t-body-s text-stone">{body}</p>
            </li>
          ))}
        </ol>
        {sp.error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{t.importError}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className={btn("ghost")}>
            {t.skipForNow}
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/onboarding/clients" className={btn("secondary")}>
              {t.back}
            </Link>
            <form action={startPracticeNote}>
              <Button>{t.startNote}</Button>
            </form>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
