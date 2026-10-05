import type { Metadata } from "next";
import Link from "next/link";
import { getTherapist } from "@/lib/therapist";
import { uiLang, pick } from "@/lib/ui-lang";
import { CLIENTS_T, uiDate } from "@/lib/ui/clients";
import { langLabel } from "@/lib/ui/booking";
import { Avatar, Card, Empty, PageHeader } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(CLIENTS_T, await uiLang()).metaTitle };
}

export default async function Clients(props: PageProps<"/clients">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const { supabase, therapist: th } = await getTherapist();
  const lang = await uiLang();
  const t = pick(CLIENTS_T, lang);
  let query = supabase.from("clients").select("*, bookings(starts_at, status)").order("full_name");
  if (q) query = query.or(`full_name.ilike.%${q.replace(/[%,()]/g, "")}%,email.ilike.%${q.replace(/[%,()]/g, "")}%`);
  const { data } = await query;
  const now = Date.now();
  const rows = (data ?? []).map((c) => {
    const bs = (c.bookings as { starts_at: string; status: string }[]).filter((b) => ["confirmed", "completed", "no_show"].includes(b.status));
    const past = bs.filter((b) => new Date(b.starts_at).getTime() < now).sort((a, b) => b.starts_at.localeCompare(a.starts_at));
    const next = bs.filter((b) => new Date(b.starts_at).getTime() >= now).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return { ...c, sessions: past.length, last: past[0]?.starts_at, next: next[0]?.starts_at };
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow={t.count(rows.length)} title={t.title} />
      <form className="max-w-sm">
        <input name="q" defaultValue={q} placeholder={t.search} className="h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-sm outline-none focus:border-sage" />
      </form>
      {rows.length === 0 ? (
        <Empty title={q ? t.noMatch : t.noClients} body={t.emptyBody} />
      ) : (
        <Card className="overflow-hidden">
          <div className="t-overline hidden grid-cols-[1.4fr_1fr_0.6fr_0.8fr_0.8fr] gap-4 border-b border-line px-6 py-3 text-stone md:grid">
            <span>{t.colClient}</span>
            <span>{t.colEmail}</span>
            <span>{t.colSessions}</span>
            <span>{t.colLast}</span>
            <span>{t.colNext}</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.map((c) => (
              <li key={c.id}>
                <Link href={`/clients/${c.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 hover:bg-paper md:grid-cols-[1.4fr_1fr_0.6fr_0.8fr_0.8fr]">
                  <span className="flex items-center gap-3">
                    <Avatar name={c.full_name} size={32} tone="sage" />
                    <span>
                      <span className="t-label-m block">{c.full_name}</span>
                      <span className="t-caption text-stone">{langLabel(c.language, lang)}</span>
                    </span>
                  </span>
                  <span className="t-body-s hidden truncate text-stone md:block">{c.email}</span>
                  <span className="t-body-s">{c.sessions}</span>
                  <span className="t-body-s hidden text-stone md:block">{c.last ? uiDate(c.last, th.timezone, lang, { day: "numeric", month: "short" }) : "—"}</span>
                  <span className="t-body-s hidden md:block">{c.next ? uiDate(c.next, th.timezone, lang, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
