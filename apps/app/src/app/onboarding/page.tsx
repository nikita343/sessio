import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { PracticeForm } from "@/components/practice-form";
import { appHost, getTherapist } from "@/lib/therapist";
import type { Availability, Service } from "@/lib/types";

export const metadata: Metadata = { title: "Set up your practice" };

export default async function Onboarding() {
  const { supabase, therapist } = await getTherapist({ allowUnpublished: true });
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
        <p className="t-overline text-sage">Step 1 of 1</p>
        <h1 className="t-heading-m mt-2">Set up your booking page</h1>
        <p className="t-body-m mt-2 max-w-[560px] text-stone">
          Tell clients who you are, what a session costs and when you work. You can change all of this later.
        </p>
        <div className="mt-8">
          <PracticeForm
            therapist={therapist}
            service={(services?.[0] as Service) ?? null}
            availability={(availability as Availability[]) ?? []}
            from="onboarding"
            host={appHost()}
          />
        </div>
      </div>
    </main>
  );
}
