import type { Metadata } from "next";
import { PracticeForm } from "@/components/practice-form";
import { CopyLink } from "@/components/copy-link";
import { appHost, getTherapist } from "@/lib/therapist";
import { PageHeader, btn } from "@/components/ui";
import type { Availability, Service } from "@/lib/types";

export const metadata: Metadata = { title: "Booking page" };

export default async function BookingPageSettings() {
  const { supabase, therapist } = await getTherapist();
  const [{ data: services }, { data: availability }] = await Promise.all([
    supabase.from("services").select("*").eq("therapist_id", therapist.id).order("sort").limit(1),
    supabase.from("availability").select("*").eq("therapist_id", therapist.id).order("weekday"),
  ]);
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${therapist.slug}`;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`${appHost()}/${therapist.slug}`}
        title="Booking page"
        actions={
          <>
            <CopyLink url={url} label="Copy link" />
            <a href={`/${therapist.slug}`} target="_blank" className={btn("primary")}>
              Open page ↗
            </a>
          </>
        }
      />
      <div className="max-w-[820px]">
        <PracticeForm therapist={therapist} service={(services?.[0] as Service) ?? null} availability={(availability as Availability[]) ?? []} from="settings" host={appHost()} />
      </div>
    </div>
  );
}
