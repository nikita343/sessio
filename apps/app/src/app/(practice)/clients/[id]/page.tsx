import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapist } from "@/lib/therapist";
import { money, timeAgo } from "@/lib/format";
import { uiLang, pick } from "@/lib/ui-lang";
import { CLIENTS_T, uiDate } from "@/lib/ui/clients";
import { langLabel } from "@/lib/ui/booking";
import { setBookingStatus } from "@/lib/booking-actions";
import { Avatar, Badge, Card, PageHeader, btn } from "@/components/ui";
import type { Booking, Note } from "@/lib/types";
import { IdentityCard } from "./identity-card";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(CLIENTS_T, await uiLang()).metaClient };
}

export default async function ClientPage(props: PageProps<"/clients/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const { supabase, therapist: th } = await getTherapist();
  const lang = await uiLang();
  const t = pick(CLIENTS_T, lang);
  const [{ data: client }, { data: bookings }, { data: notes }, { data: messages }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).maybeSingle(),
    supabase.from("bookings").select("*").eq("client_id", id).neq("status", "pending_payment").order("starts_at", { ascending: false }),
    supabase.from("notes").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("messages").select("*").eq("client_id", id).order("created_at", { ascending: false }).limit(20),
  ]);
  if (!client) notFound();
  const bs = (bookings ?? []) as Booking[];
  const noteBy = new Map(((notes ?? []) as Note[]).map((n) => [n.booking_id, n]));
  const held = bs.filter((b) => ["confirmed", "completed", "no_show"].includes(b.status) && new Date(b.starts_at).getTime() < Date.now());
  const paid = bs.filter((b) => b.payment_status === "paid" && b.status !== "cancelled").reduce((s, b) => s + b.price_minor, 0);
  const tz = th.timezone;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/clients" className="t-label-m text-stone hover:text-ink">
        {t.back}
      </Link>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={client.full_name} size={56} tone="sage" />
        <div className="flex-1">
          <PageHeader title={client.full_name} />
          <p className="t-body-s text-stone">
            {client.email}
            {client.phone ? ` · ${client.phone}` : ""} · {langLabel(client.language, lang)} · {t.since(uiDate(client.created_at, tz, lang, t.sinceFormat))}
          </p>
        </div>
        <a href={`mailto:${client.email}`} className={btn("secondary")}>
          {t.email}
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          [t.held, String(held.length)],
          [t.paidTotal, money(paid, th.currency)],
          [t.signed, String((notes ?? []).filter((n) => n.status === "signed").length)],
        ].map(([k, v]) => (
          <Card key={k} className="p-5">
            <p className="t-overline text-stone">{k}</p>
            <p className="mt-1 font-display text-[26px] font-medium tracking-[-0.04em]">{v}</p>
          </Card>
        ))}
      </div>

      <IdentityCard
        client={client}
        practice={{ register_number: th.register_number, address: th.address, online_only: !th.formats.includes("in_person") }}
        lang={lang}
        saved={sp.id_saved === "1"}
        error={typeof sp.id_err === "string" ? sp.id_err : null}
        updatedLabel={client.identity_updated_at ? uiDate(client.identity_updated_at, tz, lang, { day: "numeric", month: "long", year: "numeric" }) : null}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <h2 className="t-title-m border-b border-line px-6 py-4">{t.sessions}</h2>
          {bs.length === 0 ? (
            <p className="t-body-s px-6 py-8 text-stone">{t.noSessions}</p>
          ) : (
            <ul className="divide-y divide-line">
              {bs.map((b) => {
                const past = new Date(b.ends_at).getTime() < Date.now();
                const note = noteBy.get(b.id);
                const [label, tone] = t.status[b.status] ?? [b.status, "stone"];
                return (
                  <li key={b.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                    <div className="min-w-[160px] flex-1">
                      <p className="t-label-m">{uiDate(b.starts_at, tz, lang, { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      <p className="t-caption text-stone">
                        {b.format === "online" ? t.online : t.inPerson} · {t.priceLine(money(b.price_minor, b.currency), b.payment_status === "paid")}
                      </p>
                    </div>
                    <Badge tone={tone}>{label}</Badge>
                    {b.status === "confirmed" && !past && (
                      <>
                        {b.format === "online" && b.room_name && (
                          <Link href={`/room/${b.room_name}`} className={btn("secondary", "sm")}>
                            {t.room}
                          </Link>
                        )}
                        <form action={setBookingStatus}>
                          <input type="hidden" name="id" value={b.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button className={btn("ghost", "sm", "text-stone")}>{t.cancel}</button>
                        </form>
                      </>
                    )}
                    {past && b.status !== "cancelled" && (
                      <>
                        <Link href={note ? `/notes/${note.id}` : `/notes/new?booking=${b.id}`} className={btn(note?.status === "signed" ? "ghost" : "secondary", "sm")}>
                          {note?.status === "signed" ? t.record : note ? t.finishNote : t.writeNote}
                        </Link>
                        {b.status === "confirmed" && (
                          <form action={setBookingStatus}>
                            <input type="hidden" name="id" value={b.id} />
                            <input type="hidden" name="status" value="no_show" />
                            <button className={btn("ghost", "sm", "text-stone")}>{t.noShow}</button>
                          </form>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card className="flex flex-col gap-3 p-5">
          <h2 className="t-title-m">{t.messages}</h2>
          {(messages ?? []).length === 0 && <p className="t-body-s text-stone">{t.noMessages}</p>}
          {(messages ?? []).map((m) => (
            <div key={m.id} className={`rounded-2xl px-3.5 py-2.5 ${m.author === "client" ? "bg-paper" : m.author === "assistant" ? "bg-lavender-soft" : "bg-sage-soft"}`}>
              <p className="t-caption text-stone">
                {m.author === "client" ? client.full_name.split(" ")[0] : m.author === "assistant" ? t.assistant : t.you} · {timeAgo(m.created_at, lang)}
              </p>
              <p className="t-body-s whitespace-pre-line">{m.body}</p>
            </div>
          ))}
          <Link href="/inbox" className="t-label-m text-sage">
            {t.openInbox}
          </Link>
        </Card>
      </div>
    </div>
  );
}
