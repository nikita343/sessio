import type { Metadata } from "next";
import { getTherapist } from "@/lib/therapist";
import { signOut } from "@/app/login/actions";
import { Button, Card, PageHeader, Textarea } from "@/components/ui";
import { saveAgreementNotes } from "@/lib/practice-actions";
import { uiLang, pick } from "@/lib/ui-lang";
import { SETTINGS_T } from "@/lib/ui/settings";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(SETTINGS_T, await uiLang()).metaTitle };
}

export default async function Settings(props: PageProps<"/settings">) {
  const sp = await props.searchParams;
  const { user, therapist } = await getTherapist();
  const lang = await uiLang();
  const t = pick(SETTINGS_T, lang);
  const rows = [
    [t.account, user.email ?? ""],
    [t.timezone, therapist.timezone],
    [t.currency, therapist.currency],
    [t.cancellation, t.cancellationValue(therapist.cancellation_hours)],
    [t.dataLocation, t.dataLocationValue],
    [t.retention, t.retentionValue],
  ];
  return (
    <div className="flex max-w-[720px] flex-col gap-6">
      <PageHeader title={t.title} />
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
            <h2 className="t-title-m">{t.agreementTitle}</h2>
            <p className="t-body-s mt-1 text-stone">{t.agreementBody}</p>
          </div>
          {therapist.slug && (
            <a href={`/${therapist.slug}/agreement?lang=${lang}`} target="_blank" className="t-label-m shrink-0 text-sage hover:underline">
              {t.preview}
            </a>
          )}
        </div>
        <form action={saveAgreementNotes} className="flex flex-col gap-2">
          <label htmlFor="agreement_notes" className="t-label-m">
            {t.extraTerms} <span className="t-caption text-stone">{t.extraTermsHint}</span>
          </label>
          <Textarea
            id="agreement_notes"
            name="agreement_notes"
            rows={4}
            maxLength={3000}
            defaultValue={therapist.agreement_notes ?? ""}
            placeholder={t.extraTermsPlaceholder}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="t-caption text-stone">{t.disclaimer}</p>
            <Button>{sp.saved === "agreement" ? t.saved : t.save}</Button>
          </div>
        </form>
      </Card>
      <Card className="flex flex-col gap-2 p-6">
        <h2 className="t-title-m">{t.privacyTitle}</h2>
        <p className="t-body-s text-stone">{t.privacyBody}</p>
      </Card>
      <form action={signOut}>
        <Button variant="secondary">{t.signOut}</Button>
      </form>
    </div>
  );
}
