import type { Metadata } from "next";
import Link from "next/link";
import { getTherapist } from "@/lib/therapist";
import { inTz, LANGS } from "@/lib/format";
import { Avatar, Card, Empty, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Clients" };

export default async function Clients(props: PageProps<"/clients">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const { supabase, therapist: th } = await getTherapist();
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
      <PageHeader eyebrow={`${rows.length} client${rows.length === 1 ? "" : "s"}`} title="Clients" />
      <form className="max-w-sm">
        <input name="q" defaultValue={q} placeholder="Search by name or email" className="h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-sm outline-none focus:border-sage" />
      </form>
      {rows.length === 0 ? (
        <Empty title={q ? "No one matches that" : "No clients yet"} body="Clients appear here the first time they book or message you." />
      ) : (
        <Card className="overflow-hidden">
          <div className="t-overline hidden grid-cols-[1.4fr_1fr_0.6fr_0.8fr_0.8fr] gap-4 border-b border-line px-6 py-3 text-stone md:grid">
            <span>Client</span>
            <span>Email</span>
            <span>Sessions</span>
            <span>Last</span>
            <span>Next</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.map((c) => (
              <li key={c.id}>
                <Link href={`/clients/${c.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 hover:bg-paper md:grid-cols-[1.4fr_1fr_0.6fr_0.8fr_0.8fr]">
                  <span className="flex items-center gap-3">
                    <Avatar name={c.full_name} size={32} tone="sage" />
                    <span>
                      <span className="t-label-m block">{c.full_name}</span>
                      <span className="t-caption text-stone">{LANGS[c.language] ?? c.language}</span>
                    </span>
                  </span>
                  <span className="t-body-s hidden truncate text-stone md:block">{c.email}</span>
                  <span className="t-body-s">{c.sessions}</span>
                  <span className="t-body-s hidden text-stone md:block">{c.last ? inTz(c.last, th.timezone, "d MMM") : "—"}</span>
                  <span className="t-body-s hidden md:block">{c.next ? inTz(c.next, th.timezone, "EEE d MMM, HH:mm") : "—"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
