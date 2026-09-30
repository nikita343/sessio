"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { inputCls, textareaCls } from "@/components/ui";

type Msg = { from: "me" | "assistant"; text: string };

export function AskBox({ slug, lang }: { slug: string; lang: Lang }) {
  const d = t(lang);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setErr("");
    const mine = text.trim();
    setMsgs((m) => [...m, { from: "me", text: mine }]);
    setText("");
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, name, email, message: mine, lang }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setMsgs((m) => [...m, { from: "assistant", text: j.reply }]);
    } catch (e) {
      setErr((e as Error).message || "Could not send");
    } finally {
      setBusy(false);
    }
  }

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="t-label-m inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-surface/80 px-4 hover:border-ink/30">
        <span aria-hidden>💬</span> {d.ask}
      </button>
    );

  return (
    <div className="flex max-w-[520px] flex-col gap-3 rounded-[20px] border border-line bg-surface/90 p-4 backdrop-blur">
      <div>
        <p className="t-title-m">{d.ask}</p>
        <p className="t-body-s text-stone">{d.askBody}</p>
      </div>
      {msgs.length > 0 && (
        <div className="flex flex-col gap-2" aria-live="polite">
          {msgs.map((m, i) => (
            <p key={i} className={`t-body-s max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 ${m.from === "me" ? "self-end rounded-br-md bg-ink text-white" : "self-start rounded-bl-md bg-paper"}`}>
              {m.text}
            </p>
          ))}
          {busy && <p className="t-caption self-start text-stone">…</p>}
        </div>
      )}
      <form onSubmit={send} className="flex flex-col gap-2">
        {msgs.length === 0 && (
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} placeholder={d.yourName} aria-label={d.yourName} />
            <input className={inputCls} required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={d.yourEmail} aria-label={d.yourEmail} />
          </div>
        )}
        <textarea className={textareaCls} rows={2} required value={text} onChange={(e) => setText(e.target.value)} placeholder={d.message} aria-label={d.message} />
        {err && <p className="t-caption text-warn">{err}</p>}
        <button disabled={busy} className="t-label-m h-10 self-end rounded-full bg-ink px-5 text-white disabled:opacity-50">
          {d.send}
        </button>
      </form>
    </div>
  );
}
