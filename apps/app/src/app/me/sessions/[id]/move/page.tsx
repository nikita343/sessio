import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { Avatar } from "@/components/ui";
import { Picker } from "@/app/[slug]/picker";
import { loadPublic } from "@/lib/public";
import { fmtDate, t } from "@/lib/i18n";
import { money, tzLabel } from "@/lib/format";
import { portalLang, pt, requireClient, type MySession } from "@/lib/portal";
import { moveSession } from "@/app/me/actions";

export const metadata: Metadata = { title: "Change time", robots: { index: false } };

export default async function MoveSession(props: PageProps<"/me/sessions/[id]/move">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const { supabase, profile } = await requireClient(`/me/sessions/${id}/move`);
  const lang = await portalLang(sp.lang);
  const d = pt(lang);
  const { data } = await supabase.rpc("my_sessions");
  const s = ((data ?? []) as MySession[]).find((x) => x.id === id);
  if (!s) notFound();
  if (s.status !== "confirmed" || new Date(s.starts_at).getTime() - Date.now() < s.cancellation_hours * 3600_000) redirect("/me");
  const pub = await loadPublic(s.therapist_slug);
  if (!pub) notFound();

  const fmt = (iso: string) => fmtDate(iso, s.timezone, lang, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false });
  const start = typeof sp.start === "string" && pub.days.some((x) => x.slots.some((sl) => sl.start === sp.start && sl.free)) ? sp.start : null;
  const pubT = t(lang);

  return (
    <PortalShell lang={lang} profile={profile} current="sessions" path={`/me/sessions/${id}/move`}>
      <div className="mx-auto flex max-w-[520px] flex-col gap-6 pt-6 md:pt-10">
        <Link href="/me" className="t-label-m text-stone hover:text-ink">
          ← {d.sessions}
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="t-display-l !text-[clamp(30px,4.5vw,40px)]">{d.moveTitle}</h1>
          <p className="t-body-m text-stone">{d.moveBody(s.therapist_name)}</p>
        </div>
        <div className="flex items-center gap-3 rounded-[18px] border border-line bg-surface p-4">
          <Avatar name={s.therapist_name} photo={s.therapist_photo} size={40} />
          <div className="min-w-0">
            <p className="t-label-m">{s.therapist_name}</p>
            <p className="t-body-s text-stone line-through first-letter:uppercase decoration-stone/40">{fmt(s.starts_at)}</p>
          </div>
        </div>
        {sp.err && <p className="t-body-s rounded-[14px] bg-[#f6e3dc] px-4 py-3 text-warn">{d.movedErr}</p>}

        {start ? (
          <form action={moveSession} className="flex flex-col gap-3 rounded-[24px] bg-surface p-6 shadow-[var(--shadow-card)]">
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="start" value={start} />
            <p className="t-overline text-sage">{d.moveTitle}</p>
            <p className="font-display text-[24px] font-medium tracking-[-0.03em] first-letter:uppercase">{fmt(start)}</p>
            <button className="t-label-m mt-2 h-12 rounded-full bg-sage text-white hover:bg-sage-hover">
              {d.moveCta(fmtDate(start, s.timezone, lang, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }))}
            </button>
            <Link href={`/me/sessions/${id}/move`} className="t-label-m text-center text-stone hover:text-ink">
              {pubT.back}
            </Link>
          </form>
        ) : (
          <div className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-card)] md:p-6">
            <Picker
              slug={s.therapist_slug}
              days={pub.days}
              lang={lang}
              tz={s.timezone}
              tzText={pubT.timesIn(tzLabel(s.timezone))}
              price={money(s.price_minor, s.currency)}
              footnote={d.moveBody(s.therapist_name)}
              hrefBase={`/me/sessions/${s.id}/move?start=`}
              ctaPrefix={d.move}
            />
          </div>
        )}
      </div>
    </PortalShell>
  );
}
