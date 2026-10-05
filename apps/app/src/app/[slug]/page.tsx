import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { loadPublic } from "@/lib/public";
import { pickLang, t, type Lang } from "@/lib/i18n";
import { money, tzLabel } from "@/lib/format";
import { APPROACHES, LANG_NAMES, P, SPECIALTIES, WORKS_WITH, lines, localized } from "@/lib/profile";
import { Avatar } from "@/components/ui";
import { PublicShell } from "@/components/public-shell";
import { Picker } from "./picker";
import { AskBox } from "./ask";

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await loadPublic(slug);
  if (!data) return { title: "Not found" };
  return {
    title: `${data.therapist.full_name} — ${data.therapist.title || "book a session"}`,
    description: data.therapist.bio.slice(0, 150),
    openGraph: data.therapist.photo_url ? { images: [data.therapist.photo_url] } : undefined,
  };
}

function Chip({ children, tone = "stone" }: { children: React.ReactNode; tone?: "stone" | "sage" | "clay" | "lavender" }) {
  const c = { stone: "border border-line bg-surface text-ink", sage: "bg-sage-soft text-sage", clay: "bg-clay-soft text-clay", lavender: "bg-lavender-soft text-[#5b5299]" }[tone];
  return <span className={`t-label-m inline-flex rounded-full px-3 py-1.5 ${c}`}>{children}</span>;
}

function Block({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="flex scroll-mt-6 flex-col gap-3 border-t border-line pt-6">
      <h2 className="t-title-m md:text-[20px]">{title}</h2>
      {children}
    </section>
  );
}

const label = (map: Record<string, Record<Lang, string>>, keys: string[] | undefined, lang: Lang) => (keys ?? []).filter((k) => map[k]).map((k) => map[k][lang]);

export default async function BookingPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const data = await loadPublic(slug);
  if (!data) notFound();
  const { therapist: raw, service, days } = data;
  const lang = pickLang(sp.lang, (await cookies()).get("sessio_lang")?.value);
  const d = t(lang);
  const p = P[lang];
  const th = localized(
    { ...raw, title: raw.title, city: raw.city, bio: raw.bio, about: raw.about ?? "", first_session: raw.first_session ?? "", education: raw.education ?? "", memberships: raw.memberships ?? "" },
    raw.profile_i18n,
    lang,
  );
  const online = th.formats.includes("online");
  const inPerson = th.formats.includes("in_person");
  const formats = th.formats.length > 1 ? d.onlineAndInPerson : d[th.formats[0] ?? "online"];
  const langs = th.languages.map((l) => LANG_NAMES[l]?.[lang] ?? l).join(" · ");
  const years = th.practising_since ? new Date().getFullYear() - th.practising_since : 0;
  const evenings = days.some((day) => day.slots.some((s) => new Date(s.start).getUTCHours() >= 15));
  const helps = label(SPECIALTIES, th.specialties, lang);
  const approaches = label(APPROACHES, th.approaches, lang);
  const worksWith = label(WORKS_WITH, th.works_with, lang);
  const education = lines(th.education);
  const memberships = lines(th.memberships);
  const about = lines(th.about);
  const price = service ? money(service.price_minor, th.currency) : null;
  const subtitle = [th.title, th.city && `${th.city}${online ? (lang === "pl" ? " i online" : lang === "uk" ? " та онлайн" : " & online") : ""}`].filter(Boolean).join(" · ");

  return (
    <PublicShell lang={lang} path={`/${slug}`}>
      <div className="grid gap-6 pt-4 md:grid-cols-[minmax(0,1fr)_420px] md:gap-x-10 md:pt-8">
        {/* summary */}
        <section className="flex min-w-0 flex-col gap-5 md:col-start-1 md:row-start-1">
          <div className="flex items-center gap-5">
            <div className="shrink-0 overflow-hidden rounded-[28px] shadow-[var(--shadow-card)]">
              {th.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={th.photo_url} alt={th.full_name} width={128} height={128} className="size-24 object-cover md:size-32" />
              ) : (
                <Avatar name={th.full_name} size={112} />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="t-heading-m md:!text-[40px]">{th.full_name}</h1>
              <p className="t-body-s text-stone md:text-[15px]">{subtitle}</p>
              {th.register_number && (
                <p className="t-caption text-stone">
                  {p.register}: {th.register_number}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip tone="sage">{formats}</Chip>
            <Chip>{langs}</Chip>
            {years > 0 && <Chip tone="lavender">{p.years(years)}</Chip>}
            {evenings && <Chip tone="clay">{lang === "pl" ? "Terminy wieczorne" : lang === "uk" ? "Вечірній час" : "Evenings available"}</Chip>}
          </div>
          {th.bio && <p className="t-body-l max-w-[600px] whitespace-pre-line text-ink/90">{th.bio}</p>}
          {service && price && (
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[32px] font-medium tracking-[-0.04em]">{price}</span>
              <span className="t-body-s text-stone">{d.perSession(service.duration_min)}</span>
            </p>
          )}
          {helps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {helps.slice(0, 5).map((h) => (
                <span key={h} className="t-caption rounded-full bg-paper px-2.5 py-1 text-stone ring-1 ring-line">
                  {h}
                </span>
              ))}
              {helps.length > 5 && <a href="#helps" className="t-caption px-1.5 py-1 text-sage hover:underline">+{helps.length - 5}</a>}
            </div>
          )}
        </section>

        {/* booking */}
        <section className="min-w-0 self-start rounded-[24px] bg-surface p-5 shadow-[var(--shadow-card)] md:sticky md:top-6 md:col-start-2 md:row-span-2 md:row-start-1 md:p-6">
          {service && price ? (
            <Picker slug={slug} days={days} lang={lang} tz={th.timezone} tzText={d.timesIn(tzLabel(th.timezone))} price={price} footnote={d.footnote(th.cancellation_hours)} />
          ) : (
            <p className="t-body-s text-stone">{d.noTimes}</p>
          )}
        </section>

        {/* details */}
        <div className="flex min-w-0 flex-col gap-8 pb-6 md:col-start-1 md:row-start-2">
          {about.length > 0 && (
            <Block title={p.about}>
              {about.map((a) => (
                <p key={a} className="t-body-m max-w-[640px] text-ink/85">
                  {a}
                </p>
              ))}
            </Block>
          )}

          {helps.length > 0 && (
            <Block title={p.helps} id="helps">
              <div className="flex flex-wrap gap-2">
                {helps.map((h) => (
                  <Chip key={h} tone="sage">
                    {h}
                  </Chip>
                ))}
              </div>
            </Block>
          )}

          {(approaches.length > 0 || worksWith.length > 0) && (
            <div className="grid gap-8 border-t border-line pt-6 sm:grid-cols-2">
              {approaches.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="t-title-m md:text-[20px]">{p.approach}</h2>
                  <ul className="flex flex-col gap-2">
                    {approaches.map((a) => (
                      <li key={a} className="t-body-s flex gap-2.5">
                        <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sage" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {worksWith.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="t-title-m md:text-[20px]">{p.worksWith}</h2>
                  <ul className="flex flex-col gap-2">
                    {worksWith.map((a) => (
                      <li key={a} className="t-body-s flex gap-2.5">
                        <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sage" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {th.first_session && (
            <section className="flex flex-col gap-2 rounded-[20px] bg-lavender-soft/60 p-5 md:p-6">
              <h2 className="t-title-m md:text-[20px]">{p.firstSession}</h2>
              {lines(th.first_session).map((l) => (
                <p key={l} className="t-body-m text-ink/85">
                  {l}
                </p>
              ))}
            </section>
          )}

          {(education.length > 0 || memberships.length > 0) && (
            <Block title={p.education}>
              {education.length > 0 && (
                <ol className="relative flex flex-col gap-4 border-l border-line-strong pl-5">
                  {education.map((e) => {
                    const [when, ...rest] = e.split(" · ");
                    const hasWhen = rest.length > 0;
                    return (
                      <li key={e} className="relative">
                        <span aria-hidden className="absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-paper bg-sage" />
                        {hasWhen && <p className="t-caption text-stone">{when}</p>}
                        <p className="t-body-m">{hasWhen ? rest.join(" · ") : e}</p>
                      </li>
                    );
                  })}
                </ol>
              )}
              {memberships.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="t-overline text-stone">{p.memberships}</p>
                  <ul className="flex flex-col gap-1.5">
                    {memberships.map((m) => (
                      <li key={m} className="t-body-s flex gap-2.5">
                        <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-line-strong" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Block>
          )}

          <Block title={p.where}>
            <div className="grid gap-3 sm:grid-cols-2">
              {online && (
                <div className="flex flex-col gap-1.5 rounded-[18px] border border-line bg-surface p-5">
                  <p className="t-label-m">{p.online}</p>
                  <p className="t-body-s text-stone">{p.onlineBody}</p>
                </div>
              )}
              {inPerson && th.address && (
                <div className="flex flex-col gap-1.5 rounded-[18px] border border-line bg-surface p-5">
                  <p className="t-label-m">{p.inPerson}</p>
                  <p className="t-body-s text-stone">{th.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(th.address)}`}
                    target="_blank"
                    rel="noopener"
                    className="t-label-m mt-1 w-fit text-sage hover:underline"
                  >
                    {p.map} ↗
                  </a>
                </div>
              )}
            </div>
          </Block>

          {service && price && (
            <Block title={p.terms}>
              <dl className="overflow-hidden rounded-[18px] border border-line bg-surface">
                {[
                  [p.price, price],
                  [p.length, p.minutes(service.duration_min)],
                  [p.langs, langs],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
                    <dt className="t-body-s text-stone">{k}</dt>
                    <dd className="t-label-m text-right">{v}</dd>
                  </div>
                ))}
                <div className="flex flex-col gap-2 px-5 py-4">
                  <p className="t-body-s">{p.cancel(th.cancellation_hours)}</p>
                  <p className="t-body-s text-stone">{p.pay}</p>
                  <p className="t-body-s text-stone">
                    <span className="text-ink">{p.privacy}:</span> {p.privacyBody}
                  </p>
                  <a href={`/${slug}/agreement?lang=${lang}`} className="t-label-m mt-1 w-fit text-sage hover:underline">
                    {p.readAgreement} →
                  </a>
                </div>
              </dl>
            </Block>
          )}

          <div id="ask" className="scroll-mt-6 border-t border-line pt-6">
            <AskBox slug={slug} lang={lang} />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
