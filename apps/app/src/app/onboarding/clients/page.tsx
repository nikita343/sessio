import type { Metadata } from "next";
import { ImportClients } from "@/components/import-clients";
import { OnboardingShell, StepIntro } from "@/components/onboarding-shell";
import { getTherapist } from "@/lib/therapist";
import { uiLang, pick } from "@/lib/ui-lang";
import { ONB_T } from "@/lib/ui/onboarding";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(ONB_T, await uiLang()).s2Title };
}

/** Step 2 of 3: clients — pasted list and/or a calendar export. */
export default async function OnboardingClients() {
  await getTherapist(); // bounces to step 1 when there is no booking page yet
  const lang = await uiLang();
  const t = pick(ONB_T, lang);
  return (
    <OnboardingShell step={2} lang={lang} wide>
      <div className="flex flex-col gap-8">
        <StepIntro overline={t.s2Overline} title={t.s2Title} body={t.s2Body} />
        <ImportClients lang={lang} backHref="/onboarding" skipHref="/onboarding/note" />
      </div>
    </OnboardingShell>
  );
}
