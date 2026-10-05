import { Button, Card, Input, Textarea } from "@/components/ui";
import { saveProfileDetails } from "@/lib/practice-actions";
import { APPROACHES, SPECIALTIES, WORKS_WITH } from "@/lib/profile";
import type { Therapist } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { LANG_NAMES } from "@/lib/profile";
import { PROFILE_T } from "@/lib/ui/booking";

function Picks({ name, options, chosen, legend, hint, lang }: { name: string; options: Record<string, Record<Lang, string>>; chosen: string[]; legend: string; hint?: string; lang: Lang }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="t-label-m">
        {legend} {hint && <span className="t-caption text-stone">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(options).map(([k, v]) => (
          <label key={k} className="cursor-pointer">
            <input type="checkbox" name={name} value={k} defaultChecked={chosen.includes(k)} className="peer sr-only" />
            <span className="t-label-m inline-flex rounded-full border border-line-strong px-3 py-1.5 text-stone transition-colors peer-checked:border-sage peer-checked:bg-sage-soft peer-checked:text-sage peer-focus-visible:ring-2 peer-focus-visible:ring-sage/40">
              {v[lang]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const LANGS = ["pl", "en", "uk"] as const;

export function ProfileDetails({ therapist: t, saved, lang }: { therapist: Therapist; saved: boolean; lang: Lang }) {
  const tr = t.profile_i18n ?? {};
  const c = PROFILE_T[lang];
  return (
    <Card id="profile" className="flex scroll-mt-6 flex-col gap-6 p-6">
      <div>
        <h2 className="t-title-m">{c.title}</h2>
        <p className="t-body-s mt-1 text-stone">{c.intro}</p>
      </div>
      <form action={saveProfileDetails} className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">{c.since}</span>
            <Input name="practising_since" type="number" min={1960} max={new Date().getFullYear()} defaultValue={t.practising_since ?? ""} placeholder="2017" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">
              {c.register} <span className="t-caption text-stone">{c.optional}</span>
            </span>
            <Input name="register_number" defaultValue={t.register_number ?? ""} placeholder={c.registerPlaceholder} />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="t-label-m">
              {c.practiceName} <span className="t-caption text-stone">{c.practiceNameHint}</span>
            </span>
            <Input name="practice_name" defaultValue={t.practice_name ?? ""} placeholder={c.practiceNamePlaceholder} />
          </label>
        </div>
        <Picks name="specialties" legend={c.helps} hint={c.helpsHint} options={SPECIALTIES} chosen={t.specialties ?? []} lang={lang} />
        <Picks name="approaches" legend={c.approach} options={APPROACHES} chosen={t.approaches ?? []} lang={lang} />
        <Picks name="works_with" legend={c.worksWith} options={WORKS_WITH} chosen={t.works_with ?? []} lang={lang} />
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">
            {c.about} <span className="t-caption text-stone">{c.aboutHint}</span>
          </span>
          <Textarea name="about" rows={6} maxLength={3000} defaultValue={t.about ?? ""} placeholder={c.aboutPlaceholder} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">{c.firstSession}</span>
          <Textarea name="first_session" rows={3} maxLength={1200} defaultValue={t.first_session ?? ""} placeholder={c.firstSessionPlaceholder} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">
              {c.education} <span className="t-caption text-stone">{c.educationHint}</span>
            </span>
            <Textarea name="education" rows={5} maxLength={2000} defaultValue={t.education ?? ""} placeholder={c.educationPlaceholder} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">
              {c.memberships} <span className="t-caption text-stone">{c.membershipsHint}</span>
            </span>
            <Textarea name="memberships" rows={5} maxLength={1000} defaultValue={t.memberships ?? ""} placeholder={c.membershipsPlaceholder} />
          </label>
        </div>
        <details className="group rounded-[16px] border border-line p-4">
          <summary className="t-label-m cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            {c.translations} <span className="t-caption text-stone">{c.translationsHint}</span>
          </summary>
          <div className="mt-4 flex flex-col gap-6">
            {LANGS.map((l) => (
              <div key={l} className="flex flex-col gap-3">
                <p className="t-overline text-stone">{LANG_NAMES[l][lang]}</p>
                <Input name={`tr_${l}_title`} defaultValue={tr[l]?.title ?? ""} placeholder={c.trTitle(c.inLang[l])} />
                <Textarea name={`tr_${l}_bio`} rows={2} defaultValue={tr[l]?.bio ?? ""} placeholder={c.trBio(c.inLang[l])} />
                <Textarea name={`tr_${l}_about`} rows={4} defaultValue={tr[l]?.about ?? ""} placeholder={c.trAbout(c.inLang[l])} />
                <Textarea name={`tr_${l}_first_session`} rows={2} defaultValue={tr[l]?.first_session ?? ""} placeholder={c.trFirst(c.inLang[l])} />
              </div>
            ))}
          </div>
        </details>
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="t-caption text-sage">{c.saved}</span>}
          <Button>{c.save}</Button>
        </div>
      </form>
    </Card>
  );
}
