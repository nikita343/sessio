import type { Metadata } from "next";
import { getTherapist } from "@/lib/therapist";
import { signOut } from "@/app/login/actions";
import { Button, Card, PageHeader, Textarea } from "@/components/ui";
import { saveAgreementNotes } from "@/lib/practice-actions";

export const metadata: Metadata = { title: "Settings" };

export default async function Settings(props: PageProps<"/settings">) {
  const sp = await props.searchParams;
  const { user, therapist } = await getTherapist();
  const rows = [
    ["Account", user.email ?? ""],
    ["Time zone", therapist.timezone],
    ["Currency", therapist.currency],
    ["Free cancellation", `up to ${therapist.cancellation_hours} h before`],
    ["Data location", "EU (Ireland) · encrypted at rest"],
    ["Record retention", "5 years from the end of the year your work with a client ended (Psychologist Act, art. 28)"],
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
      <Card id="agreement" className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="t-title-m">Client agreement</h2>
            <p className="t-body-s mt-1 text-stone">
              Clients accept this before they pay. It is built from your settings — price, session length, cancellation window and address — in Polish, English
              and Ukrainian, and covers confidentiality, recording, emergencies, data and the 14-day withdrawal right. Sessio stores the exact version each client
              accepted, with the date.
            </p>
          </div>
          {therapist.slug && (
            <a href={`/${therapist.slug}/agreement?lang=pl`} target="_blank" className="t-label-m shrink-0 text-sage hover:underline">
              Preview ↗
            </a>
          )}
        </div>
        <form action={saveAgreementNotes} className="flex flex-col gap-2">
          <label htmlFor="agreement_notes" className="t-label-m">
            Your additional terms <span className="t-caption text-stone">(optional, one per line, shown as section 12)</span>
          </label>
          <Textarea
            id="agreement_notes"
            name="agreement_notes"
            rows={4}
            maxLength={3000}
            defaultValue={therapist.agreement_notes ?? ""}
            placeholder="e.g. Sessions with couples require both partners to book. Supervision: I discuss anonymised cases with my supervisor."
          />
          <div className="flex items-center justify-between gap-3">
            <p className="t-caption text-stone">A starting template, not legal advice — have it checked if your practice has special terms.</p>
            <Button>{sp.saved === "agreement" ? "Saved ✓" : "Save"}</Button>
          </div>
        </form>
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
