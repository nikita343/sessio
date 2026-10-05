import type { Metadata } from "next";
import Link from "next/link";
import { getTherapist } from "@/lib/therapist";
import { shortName } from "@/lib/format";
import { pick, uiLang } from "@/lib/ui-lang";
import { D_DAY, D_SHORT, D_SHORT_YEAR, NOTES_T, noteDate } from "@/lib/ui/notes";
import { Badge, Card, Empty, PageHeader, btn } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(NOTES_T, await uiLang()).title };
}

export default async function Notes() {
  const { supabase, therapist: th } = await getTherapist();
  const lang = await uiLang();
  const t = pick(NOTES_T, lang);
  const [{ data: notes }, { data: past }] = await Promise.all([
    supabase.from("notes").select("id, status, session_number, signed_at, updated_at, client:clients(id, full_name), booking:bookings(starts_at)").order("updated_at", { ascending: false }).limit(100),
    supabase
      .from("bookings")
      .select("id, starts_at, client:clients(full_name), notes(id)")
      .in("status", ["confirmed", "completed"])
      .lt("ends_at", new Date().toISOString())
      .order("starts_at", { ascending: false })
      .limit(30),
  ]);
  type N = { id: string; status: string; session_number: number | null; signed_at: string | null; updated_at: string; client: { id: string; full_name: string } | null; booking: { starts_at: string } | null };
  const todo = ((past ?? []) as unknown as { id: string; starts_at: string; client: { full_name: string } | null; notes: { id: string }[] }[]).filter((b) => !b.notes?.length);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.title} eyebrow={t.eyebrow} />
      {todo.length > 0 && (
        <Card className="flex flex-col gap-3 border-clay/30 bg-clay-soft/50 p-5">
          <p className="t-overline text-clay">{t.withoutRecord} · {todo.length}</p>
          <ul className="flex flex-col gap-2">
            {todo.slice(0, 6).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3">
                <span className="t-body-s">
                  <span className="font-medium">{shortName(b.client?.full_name ?? t.clientFallback)}</span> · {noteDate(b.starts_at, th.timezone, lang, D_SHORT)}
                </span>
                <Link href={`/notes/new?booking=${b.id}`} className={btn("secondary", "sm")}>
                  {t.dictate}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {(notes ?? []).length === 0 ? (
        <Empty title={t.emptyTitle} body={t.emptyBody} />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {((notes ?? []) as unknown as N[]).map((n) => (
              <li key={n.id}>
                <Link href={`/notes/${n.id}`} className="flex flex-wrap items-center gap-4 px-6 py-3.5 hover:bg-paper">
                  <div className="min-w-[180px] flex-1">
                    <p className="t-label-m">
                      {n.client?.full_name} · {t.session(n.session_number ?? "—")}
                    </p>
                    <p className="t-caption text-stone">{n.booking ? noteDate(n.booking.starts_at, th.timezone, lang, D_SHORT_YEAR) : "—"}</p>
                  </div>
                  {n.status === "signed" ? <Badge tone="sage">{t.signedOn(n.signed_at ? noteDate(n.signed_at, th.timezone, lang, D_DAY) : "")}</Badge> : <Badge tone="clay">{t.draft}</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
