import type { Metadata } from "next";
import { PracticeForm } from "@/components/practice-form";
import { OnboardingShell, StepIntro } from "@/components/onboarding-shell";
import { appHost, getTherapist } from "@/lib/therapist";
import type { Availability, Service } from "@/lib/types";
import { uiLang, pick } from "@/lib/ui-lang";
import { ONBOARDING_T } from "@/lib/ui/booking";
import { ONB_T } from "@/lib/ui/onboarding";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(ONBOARDING_T, await uiLang()).metaTitle };
}

/** Step 1 of 3: the booking page. Also the entry point for "go through the steps again". */
export default async function Onboarding() {
  const { supabase, therapist } = await getTherapist({ allowUnpublished: true });
  const lang = await uiLang();
  const t = pick(ONB_T, lang);
  const [{ data: services }, { data: availability }] = await Promise.all([
    supabase.from("services").select("*").eq("therapist_id", therapist.id).order("sort").limit(1),
    supabase.from("availability").select("*").eq("therapist_id", therapist.id).order("weekday"),
  ]);
  return (
    <OnboardingShell step={1} lang={lang}>
      <div className="flex flex-col gap-8">
        <StepIntro overline={t.s1Overline} title={t.s1Title} body={t.s1Body} />
        <PracticeForm
          therapist={therapist}
          service={(services?.[0] as Service) ?? null}
          availability={(availability as Availability[]) ?? []}
          from="onboarding"
          host={appHost()}
          lang={lang}
        />
      </div>
    </OnboardingShell>
  );
}
