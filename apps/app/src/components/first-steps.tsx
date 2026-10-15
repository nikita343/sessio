import Link from "next/link";
import type { Checklist } from "@/lib/onboarding";
import { dismissChecklist } from "@/lib/onboarding-actions";
import type { Lang } from "@/lib/i18n";
import { ONB_T } from "@/lib/ui/onboarding";
import { btn } from "./ui";

function Check({ on }: { on: boolean }) {
  return on ? (
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-sage text-white" aria-hidden>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.2l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="size-[22px] shrink-0 rounded-full border-2 border-line-strong bg-surface" aria-hidden />
  );
}

/** The "Pierwsze kroki" card on the dashboard: four derived steps, a progress bar, one CTA per open step. */
export function FirstSteps({ c, lang, link, noteJustSigned }: { c: Checklist; lang: Lang; link: string; noteJustSigned?: boolean }) {
  const t = ONB_T[lang] ?? ONB_T.pl;
  const left = c.total - c.done;
  const steps: { done: boolean; title: string; sub: string; href?: string; cta?: string; primary?: boolean }[] = [
    { done: c.page, title: t.clPage, sub: t.clPageSub(link) },
    { done: c.clients, title: c.clients ? t.clClientsDone(c.clientsCount, c.upcoming) : t.clClients, sub: c.clients ? "" : t.clClientsSub, href: "/onboarding/clients", cta: t.clAdd },
    { done: c.note, title: c.note ? t.clNoteDone : t.clNote, sub: c.note ? "" : t.clNoteSub, href: "/onboarding/note", cta: t.clStart },
    { done: c.stripe, title: c.stripe ? t.clStripeDone : t.clStripe, sub: c.stripe ? "" : t.clStripeSub, href: "/payments", cta: t.clConnect },
  ];
  // the first open step gets the primary button
  const firstOpen = steps.findIndex((s) => !s.done);
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 md:p-6" aria-label={t.clTitle}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="t-title-m">{t.clTitle}</h2>
          <p className="t-body-s text-stone">{noteJustSigned ? t.noteSignedToast : c.complete ? t.clAllDone : t.clLead(left)}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="t-label-m text-stone">{t.clProgress(c.done, c.total)}</span>
          <form action={dismissChecklist}>
            <button className="t-caption text-stone hover:text-ink">{t.clHide}</button>
          </form>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sunken" role="progressbar" aria-valuemin={0} aria-valuemax={c.total} aria-valuenow={c.done}>
        <div className="h-full rounded-full bg-sage transition-[width]" style={{ width: `${(c.done / c.total) * 100}%` }} />
      </div>
      <ol className="flex flex-col divide-y divide-line">
        {steps.map((s, i) => (
          <li key={s.title} className="flex items-center gap-3.5 py-3 first:pt-1 last:pb-1">
            <Check on={s.done} />
            <div className="min-w-0 flex-1">
              <p className={`t-label-m ${s.done ? "text-stone" : "text-ink"}`}>{s.title}</p>
              {s.sub && <p className="t-caption text-stone">{s.sub}</p>}
            </div>
            {!s.done && s.href && s.cta && (
              <Link href={s.href} className={btn(i === firstOpen ? "primary" : "secondary", "sm")}>
                {s.cta}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <Link href="/onboarding" className="t-caption w-fit text-stone hover:text-ink">
        {t.clRedo} →
      </Link>
    </section>
  );
}
