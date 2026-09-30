import type { Metadata } from "next";
import { getTherapist } from "@/lib/therapist";
import { signOut } from "@/app/login/actions";
import { Button, Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Settings" };

export default async function Settings() {
  const { user, therapist } = await getTherapist();
  const rows = [
    ["Account", user.email ?? ""],
    ["Time zone", therapist.timezone],
    ["Currency", therapist.currency],
    ["Free cancellation", `up to ${therapist.cancellation_hours} h before`],
    ["Data location", "EU (Ireland) · encrypted at rest"],
    ["Record retention", "5 years after the last session (Psychologist Act, art. 28)"],
  ];
  return (
    <div className="flex max-w-[720px] flex-col gap-6">
      <PageHeader title="Settings" />
      <Card className="divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
            <span className="t-body-s text-stone">{k}</span>
            <span className="t-label-m">{v}</span>
          </div>
        ))}
      </Card>
      <Card className="flex flex-col gap-2 p-6">
        <h2 className="t-title-m">Privacy</h2>
        <p className="t-body-s text-stone">
          You are the data controller for your clients&rsquo; records; Sessio processes them on your behalf under a data processing agreement. Video sessions run
          peer-to-peer between you and your client — they never pass through or get stored on Sessio&rsquo;s servers. Voice memos are transcribed in your
          browser and the audio is discarded.
        </p>
      </Card>
      <form action={signOut}>
        <Button variant="secondary">Sign out</Button>
      </form>
    </div>
  );
}
