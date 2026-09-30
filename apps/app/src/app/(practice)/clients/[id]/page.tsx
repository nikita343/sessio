import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapist } from "@/lib/therapist";
import { inTz, LANGS, money, timeAgo } from "@/lib/format";
import { setBookingStatus } from "@/lib/booking-actions";
import { Avatar, Badge, Card, PageHeader, btn } from "@/components/ui";
import type { Booking, Note } from "@/lib/types";

export const metadata: Metadata = { title: "Client" };

const STATUS: Record<string, [string, "sage" | "clay" | "stone" | "warn" | "lavender"]> = {
  confirmed: ["Booked", "sage"],
  completed: ["Held", "stone"],
  no_show: ["No-show", "warn"],
  cancelled: ["Cancelled", "stone"],
  pending_payment: ["Awaiting payment", "clay"],
};

export default async function ClientPage(props: PageProps<"/clients/[id]">) {
  const { id } = await props.params;
  const { supabase, therapist: th } = await getTherapist();
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
        ← Clients
      </Link>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={client.full_name} size={56} tone="sage" />
        <div className="flex-1">
          <PageHeader title={client.full_name} />
          <p className="t-body-s text-stone">
            {client.email}
            {client.phone ? ` · ${client.phone}` : ""} · {LANGS[client.language] ?? client.language} · client since {inTz(client.created_at, tz, "MMM yyyy")}
          </p>
        </div>
        <a href={`mailto:${client.email}`} className={btn("secondary")}>
          Email
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Sessions held", String(held.length)],
          ["Paid in total", money(paid, th.currency)],
          ["Signed records", String((notes ?? []).filter((n) => n.status === "signed").length)],
        ].map(([k, v]) => (
          <Card key={k} className="p-5">
            <p className="t-overline text-stone">{k}</p>
            <p className="mt-1 font-display text-[26px] font-medium tracking-[-0.04em]">{v}</p>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <h2 className="t-title-m border-b border-line px-6 py-4">Sessions</h2>
          {bs.length === 0 ? (
            <p className="t-body-s px-6 py-8 text-stone">No sessions yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {bs.map((b) => {
                const past = new Date(b.ends_at).getTime() < Date.now();
                const note = noteBy.get(b.id);
                const [label, tone] = STATUS[b.status] ?? [b.status, "stone"];
                return (
                  <li key={b.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                    <div className="min-w-[160px] flex-1">
                      <p className="t-label-m">{inTz(b.starts_at, tz, "EEE d MMM yyyy, HH:mm")}</p>
                      <p className="t-caption text-stone">
                        {b.format === "online" ? "Online" : "In person"} · {money(b.price_minor, b.currency)} {b.payment_status === "paid" ? "paid" : "unpaid"}
                      </p>
                    </div>
                    <Badge tone={tone}>{label}</Badge>
                    {b.status === "confirmed" && !past && (
                      <>
                        {b.format === "online" && b.room_name && (
                          <Link href={`/room/${b.room_name}`} className={btn("secondary", "sm")}>
                            Room
                          </Link>
                        )}
                        <form action={setBookingStatus}>
                          <input type="hidden" name="id" value={b.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button className={btn("ghost", "sm", "text-stone")}>Cancel</button>
                        </form>
                      </>
                    )}
                    {past && b.status !== "cancelled" && (
                      <>
                        <Link href={note ? `/notes/${note.id}` : `/notes/new?booking=${b.id}`} className={btn(note?.status === "signed" ? "ghost" : "secondary", "sm")}>
                          {note?.status === "signed" ? "Record ✓" : note ? "Finish note" : "Write note"}
                        </Link>
                        {b.status === "confirmed" && (
                          <form action={setBookingStatus}>
                            <input type="hidden" name="id" value={b.id} />
                            <input type="hidden" name="status" value="no_show" />
                            <button className={btn("ghost", "sm", "text-stone")}>No-show</button>
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
          <h2 className="t-title-m">Messages</h2>
          {(messages ?? []).length === 0 && <p className="t-body-s text-stone">No messages.</p>}
          {(messages ?? []).map((m) => (
            <div key={m.id} className={`rounded-2xl px-3.5 py-2.5 ${m.author === "client" ? "bg-paper" : m.author === "assistant" ? "bg-lavender-soft" : "bg-sage-soft"}`}>
              <p className="t-caption text-stone">
                {m.author === "client" ? client.full_name.split(" ")[0] : m.author === "assistant" ? "Assistant" : "You"} · {timeAgo(m.created_at)}
              </p>
              <p className="t-body-s whitespace-pre-line">{m.body}</p>
            </div>
          ))}
          <Link href="/inbox" className="t-label-m text-sage">
            Open inbox →
          </Link>
        </Card>
      </div>
    </div>
  );
}
