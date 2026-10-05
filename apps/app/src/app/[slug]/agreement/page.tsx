import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { loadPublic } from "@/lib/public";
import { pickLang } from "@/lib/i18n";
import { money } from "@/lib/format";
import { agreementFor } from "@/lib/agreement";
import { PublicShell } from "@/components/public-shell";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Agreement", robots: { index: false } };

const BACK = { pl: "Wróć do rezerwacji", en: "Back to booking", uk: "Назад до бронювання" } as const;
const PRINT = { pl: "Drukuj lub zapisz PDF", en: "Print or save as PDF", uk: "Друк або PDF" } as const;
const VERSION = { pl: "Wersja", en: "Version", uk: "Версія" } as const;

export default async function AgreementPage(props: PageProps<"/[slug]/agreement">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const data = await loadPublic(slug);
  if (!data) notFound();
  const lang = pickLang(sp.lang, (await cookies()).get("sessio_lang")?.value);
  const ag = agreementFor(data.therapist, data.service, data.therapist.currency, lang, money);

  return (
    <PublicShell lang={lang} path={`/${slug}/agreement`}>
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 rounded-[24px] bg-surface p-6 shadow-[var(--shadow-card)] md:p-10 print:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <a href={`/${slug}?lang=${lang}`} className="t-label-m text-stone hover:text-ink">
            ← {BACK[lang]}
          </a>
          <PrintButton label={PRINT[lang]} />
        </div>
        <header className="flex flex-col gap-3">
          <h1 className="t-heading-m">{ag.title}</h1>
          <p className="t-body-m text-stone">{ag.intro}</p>
        </header>
        {ag.sections.map((s) => (
          <section key={s.h} className="flex flex-col gap-2 border-t border-line pt-5">
            <h2 className="t-title-m">{s.h}</h2>
            <ul className="flex flex-col gap-2">
              {s.items.map((i) => (
                <li key={i} className="t-body-s flex gap-3 text-ink/85">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-sage" />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <footer className="t-caption border-t border-line pt-5 text-stone">
          {ag.footer} {VERSION[lang]}: {ag.version}
        </footer>
      </article>
    </PublicShell>
  );
}
