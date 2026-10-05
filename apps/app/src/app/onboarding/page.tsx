import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { PracticeForm } from "@/components/practice-form";
import { appHost, getTherapist } from "@/lib/therapist";
import type { Availability, Service } from "@/lib/types";
import { uiLang, pick } from "@/lib/ui-lang";
import { ONBOARDING_T } from "@/lib/ui/booking";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(ONBOARDING_T, await uiLang()).metaTitle };
}

export default async function Onboarding() {
  const { supabase, therapist } = await getTherapist({ allowUnpublished: true });
  const lang = await uiLang();
  const t = pick(ONBOARDING_T, lang);
  const [{ data: services }, { data: availability }] = await Promise.all([
    supabase.from("services").select("*").eq("therapist_id", therapist.id).order("sort").limit(1),
    supabase.from("availability").select("*").eq("therapist_id", therapist.id).order("weekday"),
  ]);
  return (
    <main className="min-h-dvh bg-paper">
      <header className="flex h-20 items-center px-6 md:px-10">
        <Logo size={24} />
      </header>
      <div className="mx-auto max-w-[760px] px-4 pb-24">
        <p className="t-overline text-sage">{t.step}</p>
        <h1 className="t-heading-m mt-2">{t.title}</h1>
        <p className="t-body-m mt-2 max-w-[560px] text-stone">{t.body}</p>
        <div className="mt-8">
          <PracticeForm
            therapist={therapist}
            service={(services?.[0] as Service) ?? null}
            availability={(availability as Availability[]) ?? []}
            from="onboarding"
            host={appHost()}
            lang={lang}
          />
        </div>
      </div>
    </main>
  );
}
