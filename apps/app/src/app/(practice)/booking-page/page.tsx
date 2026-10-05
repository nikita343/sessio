import type { Metadata } from "next";
import { PracticeForm } from "@/components/practice-form";
import { ProfileDetails } from "./profile-details";
import { CopyLink } from "@/components/copy-link";
import { appHost, getTherapist } from "@/lib/therapist";
import { PageHeader, btn } from "@/components/ui";
import type { Availability, Service } from "@/lib/types";
import { uiLang, pick } from "@/lib/ui-lang";
import { BOOKING_T } from "@/lib/ui/booking";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(BOOKING_T, await uiLang()).metaTitle };
}

export default async function BookingPageSettings(props: PageProps<"/booking-page">) {
  const sp = await props.searchParams;
  const { supabase, therapist } = await getTherapist();
  const lang = await uiLang();
  const t = pick(BOOKING_T, lang);
  const [{ data: services }, { data: availability }] = await Promise.all([
    supabase.from("services").select("*").eq("therapist_id", therapist.id).order("sort").limit(1),
    supabase.from("availability").select("*").eq("therapist_id", therapist.id).order("weekday"),
  ]);
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${therapist.slug}`;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`${appHost()}/${therapist.slug}`}
        title={t.title}
        actions={
          <>
            <CopyLink url={url} label={t.copyLink} lang={lang} />
            <a href={`/${therapist.slug}`} target="_blank" className={btn("primary")}>
              {t.openPage}
            </a>
          </>
        }
      />
      <div className="max-w-[820px]">
        <PracticeForm therapist={therapist} service={(services?.[0] as Service) ?? null} availability={(availability as Availability[]) ?? []} from="settings" host={appHost()} lang={lang} />
      </div>
      <div className="max-w-[820px]">
        <ProfileDetails therapist={therapist} saved={sp.saved === "profile"} lang={lang} />
      </div>
    </div>
  );
}
