import { Button, Card, Input } from "@/components/ui";
import { saveClientIdentity } from "@/lib/client-actions";
import { ageOn, missingArt28, type Identity } from "@/lib/art28";
import { ART28_T } from "@/lib/ui/art28";
import type { Lang } from "@/lib/i18n";

export function IdentityCard({
  client,
  practice,
  lang,
  saved,
  error,
  updatedLabel,
}: {
  client: Identity & { id: string };
  practice: { register_number?: string | null; address?: string | null; online_only?: boolean };
  lang: Lang;
  saved: boolean;
  error: string | null;
  updatedLabel: string | null;
}) {
  const t = ART28_T[lang];
  const missing = missingArt28(client, practice);
  const minor = (ageOn(client.birth_date) ?? 99) < 18;
  return (
    <Card id="art28" className="flex scroll-mt-6 flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-[560px]">
          <h2 className="t-title-m">{t.title}</h2>
          <p className="t-body-s mt-1 text-stone">{t.lead}</p>
        </div>
        {missing.length === 0 ? (
          <span className="t-label-m inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-sage">✓ {t.complete}</span>
        ) : (
          <div className="flex max-w-[300px] flex-col gap-1 rounded-[14px] bg-clay-soft px-3.5 py-2.5">
            <span className="t-overline text-clay">{t.missingTitle}</span>
            <span className="t-caption text-ink">{missing.map((m) => t.missing[m]).join(" · ")}</span>
          </div>
        )}
      </div>
      {error === "pesel" && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{t.invalidPesel}</p>}
      <form action={saveClientIdentity} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="client_id" value={client.id} />
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">{t.name}</span>
          <Input name="full_name" defaultValue={client.full_name} required maxLength={120} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">{t.birth}</span>
          <Input name="birth_date" type="date" defaultValue={client.birth_date ?? ""} max={new Date().toISOString().slice(0, 10)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">{t.pesel}</span>
          <Input name="pesel" inputMode="numeric" pattern="\d{11}" maxLength={11} defaultValue={client.pesel ?? ""} placeholder="00000000000" autoComplete="off" />
          <span className="t-caption text-stone">{t.peselHint}</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">{t.idDoc}</span>
          <Input name="id_document" maxLength={40} defaultValue={client.id_document ?? ""} autoComplete="off" />
          <span className="t-caption text-stone">{t.idDocHint}</span>
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="t-label-m">{t.address}</span>
          <Input name="address" maxLength={200} defaultValue={client.address ?? ""} placeholder="ul. Przykładowa 1/2, 00-001 Warszawa" />
        </label>
        <details className="group sm:col-span-2" open={minor || Boolean(client.guardian_name)}>
          <summary className="t-label-m cursor-pointer list-none text-stone hover:text-ink [&::-webkit-details-marker]:hidden">
            + {t.guardian} <span className="t-caption">· {t.guardianHint}</span>
          </summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input name="guardian_name" maxLength={120} defaultValue={client.guardian_name ?? ""} placeholder={t.guardian} />
            <Input name="guardian_contact" maxLength={120} defaultValue={client.guardian_contact ?? ""} placeholder={t.guardianContact} />
          </div>
        </details>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
          <span className="t-caption text-stone">{updatedLabel ? t.updated(updatedLabel) : t.note2028}</span>
          <div className="flex items-center gap-3">
            {saved && <span className="t-caption text-sage">{t.saved} ✓</span>}
            <Button>{t.save}</Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
