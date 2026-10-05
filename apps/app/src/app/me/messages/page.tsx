import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/format";
import { portalLang, pt, requireClient, type MyThread } from "@/lib/portal";
import { sendMessage } from "../actions";
import { CRISIS_HELP } from "@/lib/crisis";

export const metadata: Metadata = { title: "Messages", robots: { index: false } };

type Msg = { id: string; author: "client" | "therapist" | "assistant"; body: string; created_at: string };

export default async function Messages(props: PageProps<"/me/messages">) {
  const sp = await props.searchParams;
  const { supabase, profile } = await requireClient("/me/messages");
  const lang = await portalLang(sp.lang);
  const d = pt(lang);
  const { data } = await supabase.rpc("my_threads");
  const threads = ((data ?? []) as MyThread[]).sort((a, b) => (b.last_at ?? "").localeCompare(a.last_at ?? ""));
  const want = typeof sp.with === "string" ? sp.with : null;
  const active = threads.find((t) => t.therapist_slug === want) ?? (want ? null : threads[0]) ?? null;
  const { data: mData } = active ? await supabase.rpc("my_messages", { p_slug: active.therapist_slug }) : { data: [] };
  const msgs = (mData ?? []) as Msg[];

  return (
    <PortalShell lang={lang} profile={profile} current="messages" path={`/me/messages${active ? `?with=${active.therapist_slug}` : ""}`}>
      <h1 className="t-display-l pt-6 !text-[clamp(32px,4.5vw,44px)] md:pt-10">{d.messages}</h1>
      {sp.crisis && (
        <div role="alert" className="mt-6 flex flex-col gap-2 rounded-[18px] border border-warn/30 bg-[#f6e3dc] p-5 text-warn">
          <p className="t-title-m">112 · 116 123</p>
          <p className="t-body-m">{CRISIS_HELP[sp.crisis === "pl" || sp.crisis === "uk" || sp.crisis === "en" ? sp.crisis : lang]}</p>
        </div>
      )}
      {threads.length === 0 ? (
        <p className="t-body-m mt-6 text-stone">{d.noThreads}</p>
      ) : (
        <div className="mt-6 grid items-start gap-4 md:grid-cols-[280px_1fr]">
          <nav aria-label={d.threads} className={`overflow-hidden rounded-[20px] border border-line bg-surface ${want ? "hidden md:block" : ""}`}>
            <ul className="divide-y divide-line">
              {threads.map((t) => {
                const on = t.therapist_slug === active?.therapist_slug;
                return (
                  <li key={t.therapist_slug}>
                    <Link href={`/me/messages?with=${t.therapist_slug}`} className={`flex gap-3 px-4 py-3.5 ${on ? "bg-sage-soft/60" : "hover:bg-paper"}`}>
                      <Avatar name={t.therapist_name} photo={t.therapist_photo} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="t-label-m truncate">{t.therapist_name}</span>
                          {t.last_at && <span className="t-caption shrink-0 text-stone">{timeAgo(t.last_at, lang)}</span>}
                        </div>
                        <p className="t-caption truncate text-stone">{t.last_body ?? ""}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {active && (
            <section className={`flex min-w-0 flex-col rounded-[20px] border border-line bg-surface ${want ? "" : "hidden md:flex"}`}>
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Link href="/me/messages" className="t-label-m pr-1 text-stone md:hidden" aria-label="Back">
                  ←
                </Link>
                <Avatar name={active.therapist_name} photo={active.therapist_photo} size={32} />
                <p className="t-title-m">{active.therapist_name}</p>
                <a href={`/${active.therapist_slug}?lang=${lang}`} className="t-label-m ml-auto text-sage hover:underline">
                  {d.bookAgain}
                </a>
              </div>
              <div className="flex max-h-[56vh] min-h-[240px] flex-col gap-2 overflow-y-auto px-4 py-4">
                {msgs.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${m.author === "client" ? "self-end rounded-br-md bg-ink text-white" : m.author === "assistant" ? "self-start rounded-bl-md bg-lavender-soft" : "self-start rounded-bl-md bg-paper"}`}
                  >
                    <p className={`t-caption ${m.author === "client" ? "text-white/60" : "text-stone"}`}>
                      {m.author === "client" ? d.you : m.author === "assistant" ? d.assistant : active.therapist_name} · {timeAgo(m.created_at, lang)}
                    </p>
                    <p className="t-body-s whitespace-pre-line">{m.body}</p>
                  </div>
                ))}
                <span id="end" />
              </div>
              <form action={sendMessage} className="flex flex-col gap-2 border-t border-line p-3">
                <input type="hidden" name="slug" value={active.therapist_slug} />
                <textarea
                  name="body"
                  required
                  rows={2}
                  maxLength={4000}
                  placeholder={d.writeTo(active.therapist_name)}
                  className="t-body-m w-full resize-none rounded-[14px] border border-line-strong bg-paper px-3.5 py-2.5 outline-none focus:border-sage"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="t-caption text-stone">{d.replyNote}</p>
                  <button className="t-label-m h-10 shrink-0 rounded-full bg-sage px-5 text-white hover:bg-sage-hover">{d.send}</button>
                </div>
              </form>
            </section>
          )}
        </div>
      )}
    </PortalShell>
  );
}
