import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getTherapist } from "@/lib/therapist";
import { requireUser } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/format";
import { Avatar, Badge, Button, Card, Empty, PageHeader, textareaCls } from "@/components/ui";

export const metadata: Metadata = { title: "Inbox" };

async function reply(form: FormData) {
  "use server";
  const { supabase, user } = await requireUser();
  if (!user) return;
  const clientId = String(form.get("client_id"));
  const body = form.get("handled_only") ? "" : String(form.get("body") ?? "").trim();
  if (body) {
    await supabase.from("messages").insert({ therapist_id: user.id, client_id: clientId, author: "therapist", body });
    const { data: c } = await supabase.from("clients").select("email, full_name").eq("id", clientId).single();
    const { data: th } = await supabase.from("therapists").select("full_name").eq("id", user.id).single();
    if (c && process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "Sessio <bookings@usesessio.com>",
          to: [c.email],
          subject: `Reply from ${th?.full_name ?? "your therapist"}`,
          text: `${body}\n\n—\nReply or see your sessions: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com"}/me/messages`,
        }),
      }).catch(() => {});
    }
  }
  await supabase.from("activity").update({ needs_review: false, urgent: false }).eq("ref_id", clientId).eq("needs_review", true);
  await supabase.from("messages").update({ needs_review: false }).eq("client_id", clientId);
  revalidatePath("/", "layout");
}

export default async function Inbox(props: PageProps<"/inbox">) {
  const sp = await props.searchParams;
  const { supabase } = await getTherapist();
  const { data } = await supabase.from("messages").select("*, client:clients(id, full_name, email)").order("created_at", { ascending: true }).limit(400);
  const { data: flagged } = await supabase.from("activity").select("ref_id, urgent").eq("needs_review", true);
  const flaggedIds = new Set((flagged ?? []).map((f) => f.ref_id));
  const urgentIds = new Set((flagged ?? []).filter((f) => f.urgent).map((f) => f.ref_id));
  type M = { id: string; author: string; body: string; created_at: string; urgent?: boolean; client: { id: string; full_name: string; email: string } | null };
  const threads = new Map<string, { client: NonNullable<M["client"]>; msgs: M[] }>();
  for (const m of (data ?? []) as M[]) {
    if (!m.client) continue;
    const t = threads.get(m.client.id) ?? { client: m.client, msgs: [] };
    t.msgs.push(m);
    threads.set(m.client.id, t);
  }
  const list = [...threads.values()].sort((a, b) => {
    const ua = urgentIds.has(a.client.id) ? 1 : 0;
    const ub = urgentIds.has(b.client.id) ? 1 : 0;
    if (ua !== ub) return ub - ua;
    const fa = flaggedIds.has(a.client.id) ? 1 : 0;
    const fb = flaggedIds.has(b.client.id) ? 1 : 0;
    if (fa !== fb) return fb - fa;
    return b.msgs.at(-1)!.created_at.localeCompare(a.msgs.at(-1)!.created_at);
  });
  const active = list.find((t) => t.client.id === sp.c) ?? list[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inbox" eyebrow="Messages from your booking page. The assistant answers admin questions; anything personal waits for you." />
      {list.length === 0 ? (
        <Empty title="No messages yet" body="When a client asks something on your booking page, the conversation shows up here." />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
          <Card className="overflow-hidden">
            <ul className="divide-y divide-line">
              {list.map((t) => {
                const last = t.msgs.at(-1)!;
                const on = t.client.id === active?.client.id;
                return (
                  <li key={t.client.id}>
                    <Link
                      href={`/inbox?c=${t.client.id}`}
                      className={`flex gap-3 px-4 py-3 ${urgentIds.has(t.client.id) ? "border-l-4 border-warn bg-[#f6e3dc]/70" : ""} ${on ? "bg-sage-soft/60" : "hover:bg-paper"}`}
                    >
                      <Avatar name={t.client.full_name} size={32} tone="lavender" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="t-label-m truncate">{t.client.full_name}</span>
                          <span className="t-caption shrink-0 text-stone">{timeAgo(last.created_at)}</span>
                        </div>
                        <p className="t-caption truncate text-stone">{last.body}</p>
                        {urgentIds.has(t.client.id) ? (
                          <span className="t-overline mt-1 inline-flex rounded-full bg-warn px-2 py-0.5 text-white">Urgent · read now</span>
                        ) : (
                          flaggedIds.has(t.client.id) && <Badge tone="clay" className="mt-1">Needs you</Badge>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
          {active && (
            <Card className="flex flex-col gap-3 p-5">
              {urgentIds.has(active.client.id) && (
                <div role="alert" className="flex flex-col gap-1 rounded-[14px] border border-warn/30 bg-[#f6e3dc] px-4 py-3 text-warn">
                  <p className="t-label-m">This client may be at risk.</p>
                  <p className="t-body-s">Crisis lines (112, 116 123) were shared automatically. Please read their message and contact them as soon as you can.</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Link href={`/clients/${active.client.id}`} className="t-title-m hover:underline">
                  {active.client.full_name}
                </Link>
                <span className="t-caption text-stone">{active.client.email}</span>
              </div>
              <div className="flex flex-col gap-2">
                {active.msgs.map((m) => (
                  <div key={m.id} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${m.urgent && m.author === "client" ? "ring-2 ring-warn/50 " : ""}${m.author === "client" ? "self-start rounded-bl-md bg-paper" : m.author === "assistant" ? "self-end rounded-br-md bg-lavender-soft" : "self-end rounded-br-md bg-ink text-white"}`}>
                    <p className={`t-caption ${m.author === "therapist" ? "text-white/60" : "text-stone"}`}>
                      {m.author === "client" ? active.client.full_name.split(" ")[0] : m.author === "assistant" ? "Assistant" : "You"} · {timeAgo(m.created_at)}
                    </p>
                    <p className="t-body-s whitespace-pre-line">{m.body}</p>
                  </div>
                ))}
              </div>
              <form action={reply} className="mt-2 flex flex-col gap-2">
                <input type="hidden" name="client_id" value={active.client.id} />
                <textarea name="body" rows={3} className={textareaCls} placeholder={`Reply to ${active.client.full_name.split(" ")[0]} — sent by email`} />
                <div className="flex justify-end gap-2">
                  {flaggedIds.has(active.client.id) && (
                    <button name="handled_only" value="1" formNoValidate className="t-label-m px-3 text-stone hover:text-ink">
                      Mark as handled
                    </button>
                  )}
                  <Button>Send reply</Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
