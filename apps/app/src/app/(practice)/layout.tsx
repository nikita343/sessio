import { Sidebar } from "@/components/sidebar";
import { appHost, getTherapist } from "@/lib/therapist";

export default async function PracticeLayout({ children }: LayoutProps<"/">) {
  const { supabase, therapist } = await getTherapist();
  const { count } = await supabase.from("activity").select("id", { count: "exact", head: true }).eq("needs_review", true);
  return (
    <div className="flex min-h-dvh flex-col bg-paper lg:flex-row">
      <Sidebar name={therapist.full_name} slug={therapist.slug!} photo={therapist.photo_url} inboxCount={count ?? 0} host={appHost()} />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </main>
    </div>
  );
}
