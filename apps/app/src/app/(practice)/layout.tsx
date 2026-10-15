import { Sidebar } from "@/components/sidebar";
import { appHost, getTherapist } from "@/lib/therapist";
import { uiLang } from "@/lib/ui-lang";
import { UiSounds } from "@/components/ui-sounds";
import { getChecklist } from "@/lib/onboarding";

export default async function PracticeLayout({ children }: LayoutProps<"/">) {
  const { supabase, therapist } = await getTherapist();
  const lang = await uiLang();
  const [{ count }, checklist] = await Promise.all([
    supabase.from("activity").select("id", { count: "exact", head: true }).eq("needs_review", true),
    getChecklist(supabase, therapist),
  ]);
  return (
    <div lang={lang} className="flex min-h-dvh flex-col bg-paper lg:flex-row">
      <Sidebar name={therapist.full_name} slug={therapist.slug!} photo={therapist.photo_url} inboxCount={count ?? 0} host={appHost()} lang={lang} folded={checklist.show} />
      <UiSounds />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </main>
    </div>
  );
}
