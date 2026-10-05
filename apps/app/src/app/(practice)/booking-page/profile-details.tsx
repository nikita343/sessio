import { Button, Card, Input, Textarea } from "@/components/ui";
import { saveProfileDetails } from "@/lib/practice-actions";
import { APPROACHES, SPECIALTIES, WORKS_WITH } from "@/lib/profile";
import type { Therapist } from "@/lib/types";

function Picks({ name, options, chosen, legend, hint }: { name: string; options: Record<string, { en: string }>; chosen: string[]; legend: string; hint?: string }) {
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
              {v.en}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const LANGS = [
  ["pl", "Polish"],
  ["en", "English"],
  ["uk", "Ukrainian"],
] as const;

export function ProfileDetails({ therapist: t, saved }: { therapist: Therapist; saved: boolean }) {
  const tr = t.profile_i18n ?? {};
  return (
    <Card id="profile" className="flex scroll-mt-6 flex-col gap-6 p-6">
      <div>
        <h2 className="t-title-m">Your profile</h2>
        <p className="t-body-s mt-1 text-stone">
          What clients read before they book. Topics and methods are shown in the client&rsquo;s language automatically; write the text in your main language and add
          translations below if you like.
        </p>
      </div>
      <form action={saveProfileDetails} className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">In practice since (year)</span>
            <Input name="practising_since" type="number" min={1960} max={new Date().getFullYear()} defaultValue={t.practising_since ?? ""} placeholder="2017" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">
              Register number <span className="t-caption text-stone">(optional)</span>
            </span>
            <Input name="register_number" defaultValue={t.register_number ?? ""} placeholder="From 2028: Register of Psychologists" />
          </label>
        </div>
        <Picks name="specialties" legend="What you help with" hint="(pick up to 20)" options={SPECIALTIES} chosen={t.specialties ?? []} />
        <Picks name="approaches" legend="How you work" options={APPROACHES} chosen={t.approaches ?? []} />
        <Picks name="works_with" legend="Who you work with" options={WORKS_WITH} chosen={t.works_with ?? []} />
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">
            About you <span className="t-caption text-stone">(a few short paragraphs; a blank line starts a new one)</span>
          </span>
          <Textarea name="about" rows={6} maxLength={3000} defaultValue={t.about ?? ""} placeholder="Who usually comes to you, how you work together, what clients can expect." />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-label-m">Your first session</span>
          <Textarea name="first_session" rows={3} maxLength={1200} defaultValue={t.first_session ?? ""} placeholder="What happens in the first meeting, and whether to prepare anything." />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">
              Education and training <span className="t-caption text-stone">(one per line: years · what · where)</span>
            </span>
            <Textarea name="education" rows={5} maxLength={2000} defaultValue={t.education ?? ""} placeholder={"2012–2017 · MA in Psychology · Warsaw\n2017–2021 · CBT psychotherapy training"} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="t-label-m">
              Supervision and memberships <span className="t-caption text-stone">(one per line)</span>
            </span>
            <Textarea name="memberships" rows={5} maxLength={1000} defaultValue={t.memberships ?? ""} placeholder="Regular supervision" />
          </label>
        </div>
        <details className="group rounded-[16px] border border-line p-4">
          <summary className="t-label-m cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            Translations <span className="t-caption text-stone">— optional; shown when a client views your page in that language</span>
          </summary>
          <div className="mt-4 flex flex-col gap-6">
            {LANGS.map(([l, name]) => (
              <div key={l} className="flex flex-col gap-3">
                <p className="t-overline text-stone">{name}</p>
                <Input name={`tr_${l}_title`} defaultValue={tr[l]?.title ?? ""} placeholder={`Title in ${name}`} />
                <Textarea name={`tr_${l}_bio`} rows={2} defaultValue={tr[l]?.bio ?? ""} placeholder={`Short intro in ${name}`} />
                <Textarea name={`tr_${l}_about`} rows={4} defaultValue={tr[l]?.about ?? ""} placeholder={`About you in ${name}`} />
                <Textarea name={`tr_${l}_first_session`} rows={2} defaultValue={tr[l]?.first_session ?? ""} placeholder={`First session in ${name}`} />
              </div>
            ))}
          </div>
        </details>
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="t-caption text-sage">Saved. Your page is up to date.</span>}
          <Button>Save profile</Button>
        </div>
      </form>
    </Card>
  );
}
