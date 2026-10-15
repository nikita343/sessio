"use client";

import { useActionState, useState } from "react";
import { savePractice, type PracticeState } from "@/lib/practice-actions";
import { LANGS } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import { PRACTICE_T, langLabel } from "@/lib/ui/booking";
import { ONB_T } from "@/lib/ui/onboarding";
import type { Availability, Service, Therapist } from "@/lib/types";
import { Button, Card, Field, Input, Textarea, inputCls } from "./ui";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function PracticeForm({
  therapist,
  service,
  availability,
  from,
  host,
  lang = "pl",
}: {
  therapist: Therapist;
  service: Service | null;
  availability: Availability[];
  from: "onboarding" | "settings";
  host: string;
  lang?: Lang;
}) {
  const t = PRACTICE_T[lang] ?? PRACTICE_T.pl;
  const [state, action, pending] = useActionState<PracticeState, FormData>(savePractice, {});
  const [name, setName] = useState(therapist.full_name);
  const [slug, setSlug] = useState(therapist.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(therapist.slug));
  const [formats, setFormats] = useState<string[]>(therapist.formats ?? ["online"]);
  const initialHours = availability.length
    ? availability.map((a) => ({ weekday: a.weekday, start: a.start_time.slice(0, 5), end: a.end_time.slice(0, 5) }))
    : [1, 2, 3, 4, 5].map((d) => ({ weekday: d, start: "09:00", end: "17:00" }));
  const [hours, setHours] = useState(initialHours);
  const o = ONB_T[lang] ?? ONB_T.pl;
  // onboarding: one time range for every working day unless the therapist opens "different hours per day"
  const [perDay, setPerDay] = useState(() => from === "onboarding" && new Set(initialHours.map((h) => `${h.start}-${h.end}`)).size > 1);
  const [moreOpen, setMoreOpen] = useState(false);
  const shared = hours[0] ?? { start: "09:00", end: "17:00" };

  const toggleDay = (d: number) =>
    setHours((h) => (h.some((x) => x.weekday === d) ? h.filter((x) => x.weekday !== d) : [...h, { weekday: d, start: shared.start, end: shared.end }].sort((a, b) => a.weekday - b.weekday)));
  const setTime = (d: number, key: "start" | "end", val: string) => setHours((h) => h.map((x) => (x.weekday === d ? { ...x, [key]: val } : x)));
  const setAll = (key: "start" | "end", val: string) => setHours((h) => h.map((x) => ({ ...x, [key]: val })));
  const chip = (on: boolean) => `t-label-m flex cursor-pointer select-none items-center gap-2 rounded-full border px-3.5 py-2 transition-colors ${on ? "border-sage bg-sage-soft text-sage" : "border-line-strong bg-surface text-ink hover:border-ink/30"}`;

  if (from === "onboarding") {
    return (
      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="from" value={from} />
        <input type="hidden" name="service_id" value={service?.id ?? ""} />
        <input type="hidden" name="hours" value={JSON.stringify(hours)} />
        {/* hidden on this step, kept so the same action validates; editable later on the Booking page */}
        {!moreOpen && (
          <>
            <input type="hidden" name="title" value={therapist.title ?? ""} />
            <input type="hidden" name="city" value={therapist.city ?? ""} />
            <input type="hidden" name="bio" value={therapist.bio ?? ""} />
            <input type="hidden" name="address" value={therapist.address ?? ""} />
            {(therapist.languages?.length ? therapist.languages : [lang]).map((code) => (
              <input key={code} type="hidden" name="languages" value={code} />
            ))}
          </>
        )}
        <input type="hidden" name="service_name" value={service?.name ?? t.defaultService} />

        <Card className="onb-rise onb-rise-1 flex flex-col gap-5 p-6">
          <div>
            <h2 className="t-title-m">{t.aboutTitle}</h2>
            <p className="t-body-s text-stone">{t.aboutBody}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t.fullName} htmlFor="full_name">
              <Input
                id="full_name"
                name="full_name"
                required
                autoFocus={!therapist.full_name}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </Field>
            <Field label={t.yourLink} htmlFor="slug" hint={`${host}/${slug || t.slugPlaceholder}`}>
              <Input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
              />
            </Field>
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="t-label-m mb-1.5">{t.sessions}</legend>
            <div className="flex flex-wrap gap-2">
              {[
                ["online", t.online],
                ["in_person", t.inPerson],
              ].map(([v, label]) => (
                <label key={v} className={chip(formats.includes(v))}>
                  <input type="checkbox" name="formats" value={v} checked={formats.includes(v)} onChange={(e) => setFormats((f) => (e.target.checked ? [...f, v] : f.filter((x) => x !== v)))} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          {formats.includes("in_person") && !moreOpen && (
            <Field label={t.address} htmlFor="address_onb">
              <Input id="address_onb" name="address" defaultValue={therapist.address ?? ""} placeholder="ul. Puławska 24/5, Warszawa" />
            </Field>
          )}
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className="t-label-m w-fit text-sage hover:underline" aria-expanded={moreOpen}>
            {moreOpen ? o.lessAbout : o.moreAbout}
          </button>
          {moreOpen && (
            <div className="flex flex-col gap-5 border-t border-line pt-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={t.title} htmlFor="title" hint={t.titleHint}>
                  <Input id="title" name="title" defaultValue={therapist.title} placeholder={t.titlePlaceholder} />
                </Field>
                <Field label={t.city} htmlFor="city">
                  <Input id="city" name="city" defaultValue={therapist.city} placeholder={t.cityPlaceholder} />
                </Field>
              </div>
              <Field label={t.bio} htmlFor="bio" hint={t.bioHint}>
                <Textarea id="bio" name="bio" rows={3} defaultValue={therapist.bio} placeholder={t.bioPlaceholder} />
              </Field>
              <fieldset className="flex flex-col gap-2">
                <legend className="t-label-m mb-1.5">{t.languages}</legend>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(LANGS).map((code) => (
                    <label key={code} className="t-label-m flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 has-[:checked]:border-sage has-[:checked]:bg-sage-soft has-[:checked]:text-sage">
                      <input type="checkbox" name="languages" value={code} defaultChecked={(therapist.languages?.length ? therapist.languages : [lang]).includes(code)} className="sr-only" />
                      {langLabel(code, lang)}
                    </label>
                  ))}
                </div>
              </fieldset>
              {formats.includes("in_person") && (
                <Field label={t.address} htmlFor="address">
                  <Input id="address" name="address" defaultValue={therapist.address ?? ""} placeholder="ul. Puławska 24/5, Warszawa" />
                </Field>
              )}
            </div>
          )}
        </Card>

        <Card className="onb-rise onb-rise-2 flex flex-col gap-5 p-6">
          <div>
            <h2 className="t-title-m">{t.sessionTitle}</h2>
            <p className="t-body-s text-stone">{o.sessionOneBody}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t.price} htmlFor="price">
              <div className="relative">
                <Input id="price" name="price" type="number" min={0} step={10} defaultValue={service ? service.price_minor / 100 : 200} className="pr-12" />
                <span className="t-body-s pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-stone">zł</span>
              </div>
            </Field>
            <Field label={t.length} htmlFor="duration">
              <select id="duration" name="duration" defaultValue={service?.duration_min ?? 50} className={inputCls}>
                {[30, 45, 50, 60, 75, 90, 120].map((m) => (
                  <option key={m} value={m}>
                    {t.minutes(m)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <Card className="onb-rise onb-rise-3 flex flex-col gap-5 p-6">
          <div>
            <h2 className="t-title-m">{t.hoursTitle}</h2>
            <p className="t-body-s text-stone">{t.hoursBody}</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.hoursTitle}>
            {t.days.map((label, i) => {
              const d = i + 1;
              const on = hours.some((x) => x.weekday === d);
              return (
                <label key={d} className={chip(on)}>
                  <input type="checkbox" checked={on} onChange={() => toggleDay(d)} className="sr-only" />
                  {label}
                </label>
              );
            })}
          </div>
          {!perDay ? (
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-[150px]">
                <Field label={o.from} htmlFor="start_all">
                  <input id="start_all" type="time" step={1800} value={shared.start} onChange={(e) => setAll("start", e.target.value)} className={inputCls} />
                </Field>
              </div>
              <div className="w-[150px]">
                <Field label={o.to} htmlFor="end_all">
                  <input id="end_all" type="time" step={1800} value={shared.end} onChange={(e) => setAll("end", e.target.value)} className={inputCls} />
                </Field>
              </div>
              <button type="button" onClick={() => setPerDay(true)} className="t-label-m mb-3 text-sage hover:underline">
                {o.perDay}
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {t.days.map((label, i) => {
                const d = i + 1;
                const h = hours.find((x) => x.weekday === d);
                if (!h) return null;
                return (
                  <div key={d} className="flex min-h-12 items-center gap-3 py-2">
                    <span className="t-label-m w-12 shrink-0">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-[120px] shrink-0">
                        <input type="time" step={1800} value={h.start} onChange={(e) => setTime(d, "start", e.target.value)} className={`${inputCls} h-9`} aria-label={t.dayStart(label)} />
                      </div>
                      <span className="text-stone">–</span>
                      <div className="w-[120px] shrink-0">
                        <input type="time" step={1800} value={h.end} onChange={(e) => setTime(d, "end", e.target.value)} className={`${inputCls} h-9`} aria-label={t.dayEnd(label)} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={() => { setPerDay(false); setAll("start", shared.start); setAll("end", shared.end); }} className="t-label-m w-fit pt-3 text-sage hover:underline">
                {o.sameHours}
              </button>
            </div>
          )}
        </Card>

        <div className="onb-rise onb-rise-4 sticky bottom-4 flex items-center justify-between gap-4 rounded-full border border-line bg-surface/95 py-2 pl-5 pr-2 shadow-[var(--shadow-card)] backdrop-blur">
          <p className="t-body-s text-stone">{state.error ? <span className="text-warn">{state.error}</span> : o.nothingFinal}</p>
          <Button size="md" disabled={pending}>
            {pending ? t.saving : t.publish}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="service_id" value={service?.id ?? ""} />
      <input type="hidden" name="hours" value={JSON.stringify(hours)} />

      <Card className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="t-title-m">{t.aboutTitle}</h2>
          <p className="t-body-s text-stone">{t.aboutBody}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label={t.fullName} htmlFor="full_name">
            <Input
              id="full_name"
              name="full_name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </Field>
          <Field label={t.yourLink} htmlFor="slug" hint={`${host}/${slug || t.slugPlaceholder}`}>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
            />
          </Field>
          <Field label={t.title} htmlFor="title" hint={t.titleHint}>
            <Input id="title" name="title" defaultValue={therapist.title} placeholder={t.titlePlaceholder} />
          </Field>
          <Field label={t.city} htmlFor="city">
            <Input id="city" name="city" defaultValue={therapist.city} placeholder={t.cityPlaceholder} />
          </Field>
        </div>
        <Field label={t.bio} htmlFor="bio" hint={t.bioHint}>
          <Textarea id="bio" name="bio" rows={3} defaultValue={therapist.bio} placeholder={t.bioPlaceholder} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="t-label-m mb-1.5">{t.languages}</legend>
            <div className="flex flex-wrap gap-2">
              {Object.keys(LANGS).map((code) => (
                <label key={code} className="t-label-m flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 has-[:checked]:border-sage has-[:checked]:bg-sage-soft has-[:checked]:text-sage">
                  <input type="checkbox" name="languages" value={code} defaultChecked={therapist.languages?.includes(code)} className="sr-only" />
                  {langLabel(code, lang)}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="t-label-m mb-1.5">{t.sessions}</legend>
            <div className="flex flex-wrap gap-2">
              {[
                ["online", t.online],
                ["in_person", t.inPerson],
              ].map(([v, label]) => (
                <label key={v} className="t-label-m flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 has-[:checked]:border-sage has-[:checked]:bg-sage-soft has-[:checked]:text-sage">
                  <input
                    type="checkbox"
                    name="formats"
                    value={v}
                    checked={formats.includes(v)}
                    onChange={(e) => setFormats((f) => (e.target.checked ? [...f, v] : f.filter((x) => x !== v)))}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        {formats.includes("in_person") && (
          <Field label={t.address} htmlFor="address">
            <Input id="address" name="address" defaultValue={therapist.address ?? ""} placeholder="ul. Puławska 24/5, Warszawa" />
          </Field>
        )}
      </Card>

      <Card className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="t-title-m">{t.sessionTitle}</h2>
          <p className="t-body-s text-stone">{t.sessionBody}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label={t.name} htmlFor="service_name">
            <Input id="service_name" name="service_name" defaultValue={service?.name ?? t.defaultService} />
          </Field>
          <Field label={t.price} htmlFor="price">
            <Input id="price" name="price" type="number" min={0} step={10} defaultValue={service ? service.price_minor / 100 : 200} />
          </Field>
          <Field label={t.length} htmlFor="duration">
            <select id="duration" name="duration" defaultValue={service?.duration_min ?? 50} className={inputCls}>
              {[30, 45, 50, 60, 75, 90, 120].map((m) => (
                <option key={m} value={m}>
                  {t.minutes(m)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div>
          <h2 className="t-title-m">{t.hoursTitle}</h2>
          <p className="t-body-s text-stone">{t.hoursBody}</p>
        </div>
        <div className="flex flex-col divide-y divide-line">
          {t.days.map((label, i) => {
            const d = i + 1;
            const h = hours.find((x) => x.weekday === d);
            return (
              <div key={d} className="flex min-h-12 flex-wrap items-center gap-3 py-2">
                <label className="t-label-m flex w-28 cursor-pointer items-center gap-2.5">
                  <input type="checkbox" checked={Boolean(h)} onChange={() => toggleDay(d)} className="size-4 accent-[#3F6B5E]" />
                  {label}
                </label>
                {h ? (
                  <div className="flex items-center gap-2">
                    <input type="time" step={1800} value={h.start} onChange={(e) => setTime(d, "start", e.target.value)} className={`${inputCls} h-9 w-[110px]`} aria-label={t.dayStart(label)} />
                    <span className="text-stone">–</span>
                    <input type="time" step={1800} value={h.end} onChange={(e) => setTime(d, "end", e.target.value)} className={`${inputCls} h-9 w-[110px]`} aria-label={t.dayEnd(label)} />
                  </div>
                ) : (
                  <span className="t-body-s text-stone">{t.notWorking}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-full border border-line bg-surface/95 py-2 pl-5 pr-2 shadow-[var(--shadow-card)] backdrop-blur">
        <p className="t-body-s text-stone">
          {state.error ? <span className="text-warn">{state.error}</span> : state.saved ? <span className="text-sage">{t.saved}</span> : t.goesLive}
        </p>
        <Button size="md" disabled={pending}>
          {pending ? t.saving : t.saveChanges}
        </Button>
      </div>
    </form>
  );
}
