import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { PortalShell } from "@/components/portal-shell";
import { PublicShell } from "@/components/public-shell";
import { Avatar } from "@/components/ui";
import { fmtDate, pickLang, type Lang } from "@/lib/i18n";
import { money } from "@/lib/format";
import { optionalClient, portalLang } from "@/lib/portal";
import { LANG_NAMES, SPECIALTIES } from "@/lib/profile";
import { loadDirectory, parseAnswers, type Match } from "@/lib/directory";
import { FIND_T, SPEAKS_PL } from "@/lib/ui/find";
import { Questionnaire } from "./questionnaire";

export async function generateMetadata(props: PageProps<"/find">): Promise<Metadata> {
  const sp = await props.searchParams;
  const lang = pickLang(sp.lang, (await cookies()).get("sessio_lang")?.value);
  return { title: FIND_T[lang].pageTitle, description: FIND_T[lang].lead };
}

function MatchCard({ m, lang }: { m: Match; lang: Lang }) {
  const t = FIND_T[lang];
  const th = m.therapist;
  const tz = th.timezone;
  const slot = m.nextFit ?? m.nextAny;
  const when = slot ? fmtDate(slot, tz, lang, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }) : "";
  const years = th.practising_since ? new Date().getFullYear() - th.practising_since : 0;
  const inPerson = (th.formats ?? []).includes("in_person");
  const langName = (l: string) => (lang === "pl" ? SPEAKS_PL[l] ?? l : LANG_NAMES[l]?.[lang] ?? l);
  return (
    <article className="flex flex-col gap-5 rounded-[24px] bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6 md:flex-row">
      <div className="flex shrink-0 items-start gap-4 md:w-[240px] md:flex-col">
        <Avatar name={th.full_name} photo={th.photo_url} size={88} />
        <div className="min-w-0">
          <h3 className="t-title-m md:text-[20px]">{th.full_name}</h3>
          <p className="t-body-s text-stone">{th.title}</p>
          <p className="t-caption mt-2 text-stone">
            {[years ? t.years(years) : "", t.perSession(money(m.service.price_minor, th.currency), m.service.duration_min)].filter(Boolean).join(" · ")}
          </p>
          <p className="t-caption text-stone">{[(th.formats ?? []).includes("online") ? t.online : "", inPerson ? t.inPerson(th.city) : ""].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="t-body-m text-ink/85">{th.bio}</p>
        <div className="flex flex-col gap-2 rounded-[16px] bg-paper p-4">
          <p className="t-overline text-sage">{t.fits}</p>
          {m.topics.length > 0 && (
            <p className="t-body-s">
              <span className="text-stone">{t.helpsWith}</span> {m.topics.map((k) => SPECIALTIES[k]?.[lang]).join(", ")}
            </p>
          )}
          {m.speaksLang && <p className="t-body-s">{t.speaks(langName((th.languages ?? []).includes(lang) ? lang : th.languages[0]))}</p>}
          {(th.specialties ?? []).length > 0 && m.topics.length === 0 && (
            <p className="t-body-s">
              <span className="text-stone">{t.helpsWith}</span> {(th.specialties ?? []).slice(0, 4).map((k) => SPECIALTIES[k]?.[lang]).join(", ")}
            </p>
          )}
          <p className="t-body-s">
            <span className="text-stone">{m.nextFit ? t.nextFit : t.nextAny}:</span> <span className="first-letter:uppercase">{slot ? when : t.noFree}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {slot && (
            <a href={`/${th.slug}/book?start=${encodeURIComponent(slot)}&lang=${lang}`} className="t-label-m inline-flex h-11 items-center rounded-full bg-sage px-5 text-white hover:bg-sage-hover">
              {t.book(when)}
            </a>
          )}
          <a href={`/${th.slug}?lang=${lang}`} className="t-label-m inline-flex h-11 items-center rounded-full border border-line-strong bg-surface px-5 hover:border-ink/30">
            {t.profile}
          </a>
          <a href={`/${th.slug}?lang=${lang}#ask`} className="t-label-m inline-flex h-11 items-center rounded-full px-4 text-stone hover:text-ink">
            {t.ask}
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function Find(props: PageProps<"/find">) {
  const sp = await props.searchParams;
  const lang = await portalLang(sp.lang);
  const t = FIND_T[lang];
  const profile = await optionalClient();
  const answers = sp.edit ? null : parseAnswers(sp);
  const editing = sp.edit ? parseAnswers({ ...sp, go: "1" }) : null;
  const matches = answers ? await loadDirectory(answers, lang) : [];
  const strong = matches.filter((m) => m.strong);
  const near = matches.filter((m) => !m.strong);

  const content = (
    <div className="flex flex-col gap-8 pt-6 md:pt-10">
      <header className="flex max-w-[720px] flex-col gap-2">
        <h1 className="t-display-l !text-[clamp(34px,5vw,52px)]">{t.title}</h1>
        <p className="t-body-m text-stone">{answers ? t.resultsLead : t.lead}</p>
      </header>

      {!answers ? (
        <Questionnaire lang={lang} initial={editing} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="t-title-m">{t.results(strong.length)}</p>
            <Link href={`/find?${new URLSearchParams({ edit: "1", topics: answers.topics.join(","), who: answers.who, lang: answers.lang, fmt: answers.fmt, when: answers.when, budget: answers.budget ? String(answers.budget) : "" }).toString()}`} className="t-label-m inline-flex h-10 items-center rounded-full border border-line-strong bg-surface px-4 hover:border-ink/30">
              ↺ {t.change}
            </Link>
          </div>
          {strong.map((m) => (
            <MatchCard key={m.therapist.id} m={m} lang={lang} />
          ))}
          {near.length > 0 && (
            <section className="flex flex-col gap-4">
              <div>
                <h2 className="t-title-m">{t.closest}</h2>
                <p className="t-body-s text-stone">{t.closestLead}</p>
              </div>
              {near.map((m) => (
                <MatchCard key={m.therapist.id} m={m} lang={lang} />
              ))}
            </section>
          )}
        </>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <p className="t-body-s rounded-[16px] border border-line bg-surface/80 p-4 text-stone">{t.honest}</p>
        <p className="t-body-s rounded-[16px] border border-line bg-surface/80 p-4 text-stone">
          {t.hasLink}{" "}
          {!profile && (
            <Link href="/me/login?next=/find" className="text-ink underline underline-offset-2">
              {t.signIn}
            </Link>
          )}
        </p>
      </div>
      <p className="t-caption text-stone">{t.crisis}</p>
    </div>
  );

  return profile ? (
    <PortalShell lang={lang} profile={profile} current="find" path="/find">
      {content}
    </PortalShell>
  ) : (
    <PublicShell lang={lang}>{content}</PublicShell>
  );
}
