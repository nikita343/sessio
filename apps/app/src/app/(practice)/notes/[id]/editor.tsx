"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { discardNote, saveNote, signNote } from "@/lib/note-actions";
import { Badge, Button, textareaCls } from "@/components/ui";

type Phase = "idle" | "recording" | "loading-model" | "transcribing" | "drafting";

/** Replace the client's and therapist's names before any text leaves the device. */
function redact(text: string, client: string[], therapist: string[]) {
  let out = text;
  const swap = (names: string[], label: string) => {
    for (const n of names) {
      if (n.length < 2) continue;
      // match the name and common Polish/Ukrainian inflections (Marek → Markiem, Marka…)
      const stem = n.length > 4 ? n.slice(0, -1) : n;
      out = out.replace(new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\p{L}{0,4}\\b`, "giu"), label);
    }
  };
  swap(client, "[client]");
  swap(therapist, "[psychologist]");
  return out
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]")
    .replace(/\b\d{11}\b/g, "[PESEL]")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, "[phone]")
    .replace(/\b(ul\.|ulica|al\.|aleja|os\.|osiedle|pl\.|plac|вул\.|вулиця)\s+[\p{L}\d .-]{2,40}?\d+[a-z]?(\/\d+)?/giu, "[address]");
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

async function toMono16k(blob: Blob) {
  const buf = await blob.arrayBuffer();
  const ctx = new AudioContext({ sampleRate: 16000 });
  const audio = await ctx.decodeAudioData(buf);
  const ch = audio.numberOfChannels > 1 ? audio.getChannelData(0).map((v, i) => (v + audio.getChannelData(1)[i]!) / 2) : audio.getChannelData(0);
  await ctx.close();
  return { data: new Float32Array(ch), seconds: audio.duration };
}

export function NoteEditor(p: {
  id: string;
  signed: boolean;
  signedAt: string | null;
  initialBody: string;
  initialWorking: string;
  clientNames: string[];
  therapistNames: string[];
  meta: { client: string; date: string; form: string; psychologist: string };
  sessionNumber: number;
}) {
  const router = useRouter();
  const [body, setBody] = useState(p.initialBody);
  const [working, setWorking] = useState(p.initialWorking);
  const [transcript, setTranscript] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lang, setLang] = useState<"pl" | "uk" | "en">("en");
  const [aiDraft, setAiDraft] = useState<false | "ai" | "template">(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<"" | "saving" | "saved">("");
  const [pending, start] = useTransition();
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const worker = useRef<Worker | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => worker.current?.terminate(), []);

  // autosave drafts
  useEffect(() => {
    if (p.signed) return;
    if (body === p.initialBody && working === p.initialWorking) return;
    setSaved("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveNote(p.id, { body, working });
      setSaved("saved");
    }, 900);
  }, [body, working, p.id, p.signed, p.initialBody, p.initialWorking]);

  async function startRec() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType });
        setAudioUrl(URL.createObjectURL(blob));
        transcribe(blob);
      };
      mr.start();
      rec.current = mr;
      setSeconds(0);
      setPhase("recording");
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Microphone access was blocked. Allow it in the browser, or type your memo below.");
    }
  }

  function stopRec() {
    if (timer.current) clearInterval(timer.current);
    rec.current?.stop();
  }

  async function transcribe(blob: Blob) {
    try {
      setPhase("loading-model");
      const { data, seconds: dur } = await toMono16k(blob);
      setSeconds(dur);
      if (!worker.current) worker.current = new Worker("/whisper-worker.js", { type: "module" });
      const w = worker.current;
      const files = new Map<string, [number, number]>();
      w.onmessage = (e) => {
        const m = e.data;
        if (m.type === "progress") {
          files.set(m.file, [m.loaded, m.total]);
          const [l, t] = [...files.values()].reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]);
          setProgress(t ? Math.round((l / t) * 100) : 0);
        } else if (m.type === "transcribing") setPhase("transcribing");
        else if (m.type === "done") {
          setTranscript((prev) => (prev ? prev + "\n" : "") + m.text);
          setPhase("idle");
        } else if (m.type === "error") {
          setError(`Transcription failed on this device (${m.message}). You can type the memo instead.`);
          setPhase("idle");
        }
      };
      w.postMessage({ audio: data, language: lang }, [data.buffer]);
    } catch (e) {
      setError(`Could not read the recording: ${(e as Error).message}`);
      setPhase("idle");
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAudioUrl(URL.createObjectURL(f));
    transcribe(f);
  }

  async function draft() {
    if (!transcript.trim()) return;
    setError("");
    setPhase("drafting");
    try {
      const safe = redact(transcript, p.clientNames, p.therapistNames);
      const r = await fetch("/api/notes/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript: safe, lang, sessionNumber: p.sessionNumber, form: p.meta.form }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setBody(j.record);
      if (j.working && !working) setWorking(j.working);
      setAiDraft(j.offline ? "template" : "ai");
    } catch (e) {
      setError((e as Error).message || "Drafting failed");
    } finally {
      setPhase("idle");
    }
  }

  const busy = phase !== "idle" && phase !== "recording";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
      {/* voice memo */}
      <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6">
        <span className="t-caption inline-flex w-fit items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-sage">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          Privacy mode · transcribed on this device
        </span>
        <div className="flex items-center justify-between">
          <h2 className="t-title-m">Your voice memo</h2>
          {!p.signed && (
            <select value={lang} onChange={(e) => setLang(e.target.value as typeof lang)} className="t-caption rounded-full border border-line-strong bg-surface px-2 py-1" aria-label="Memo language">
              <option value="en">English</option>
              <option value="pl">Polski</option>
              <option value="uk">Українська</option>
            </select>
          )}
        </div>

        {!p.signed && (
          <div className="flex items-center gap-3 rounded-[14px] bg-paper p-3">
            {phase === "recording" ? (
              <button onClick={stopRec} className="flex size-10 items-center justify-center rounded-full bg-warn text-white" aria-label="Stop recording">
                <span className="size-3.5 rounded-sm bg-white" />
              </button>
            ) : (
              <button onClick={startRec} disabled={busy} className="flex size-10 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40" aria-label="Record a memo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <div className="flex-1">
              {phase === "recording" ? (
                <p className="t-label-m flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-warn" /> Recording · {fmt(seconds)}
                </p>
              ) : phase === "loading-model" ? (
                <p className="t-body-s text-stone">Preparing on-device transcription{progress ? ` · ${progress}%` : "…"}</p>
              ) : phase === "transcribing" ? (
                <p className="t-body-s text-stone">Transcribing {fmt(seconds)} of audio on this device…</p>
              ) : audioUrl ? (
                <audio src={audioUrl} controls className="h-9 w-full" />
              ) : (
                <p className="t-body-s text-stone">Tap to record what matters from the session.</p>
              )}
            </div>
          </div>
        )}
        {!p.signed && phase === "idle" && (
          <label className="t-caption -mt-2 cursor-pointer text-stone hover:text-ink">
            or upload an audio file
            <input type="file" accept="audio/*" onChange={onFile} className="sr-only" />
          </label>
        )}

        <div className="flex flex-col gap-2">
          <p className="t-overline text-stone">Transcript</p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={7}
            disabled={p.signed}
            className={textareaCls}
            placeholder={p.signed ? "The transcript was deleted when the record was signed." : "Your memo appears here. You can also type or paste it."}
          />
          {!p.signed && (
            <Button variant="dark" onClick={draft} disabled={!transcript.trim() || busy}>
              {phase === "drafting" ? "Drafting the record…" : "Draft the record"}
            </Button>
          )}
        </div>
        {error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{error}</p>}
        <p className="t-caption text-stone">
          Audio never leaves this device and is not saved. Your client&rsquo;s and your own name, phone numbers, emails, PESEL and street addresses are removed before any AI step, and the transcript is discarded when you sign.
        </p>
      </section>

      {/* record */}
      <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="t-title-m">Session record</h2>
          {p.signed ? <Badge tone="sage">Signed · {p.signedAt}</Badge> : aiDraft === "ai" ? <Badge tone="clay">AI draft · review before signing</Badge> : aiDraft === "template" ? <Badge tone="stone">Template draft · AI is off · review before signing</Badge> : <Badge tone="stone">Draft</Badge>}
        </div>
        <p className="t-overline text-stone">
          Formal record <span className="normal-case tracking-normal text-stone/80">· Art. 28 · visible to the client on request</span>
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["Client", p.meta.client],
            ["Date", p.meta.date],
            ["Form", p.meta.form],
            ["Psychologist", p.meta.psychologist],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[12px] bg-paper px-3.5 py-2.5">
              <p className="t-caption text-stone">{k}</p>
              <p className="t-body-s">{v}</p>
            </div>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          readOnly={p.signed}
          rows={8}
          className={`${textareaCls} !text-[16px] !leading-[1.6]`}
          placeholder="Draft the record from your memo, or write it here."
        />
        <p className="t-overline text-stone">
          Working notes <span className="normal-case tracking-normal text-stone/80">· private · not shared with the client</span>
        </p>
        <textarea
          value={working}
          onChange={(e) => setWorking(e.target.value)}
          readOnly={p.signed}
          rows={3}
          className={`${textareaCls} border-transparent !bg-clay-soft/70`}
          placeholder="Hypotheses, things to check next time…"
        />
        <p className="t-caption text-stone">Signed records are kept for 5 years from the end of the year in which your work with the client ended (art. 28), then Sessio prepares a destruction protocol for you to confirm.</p>
        {!p.signed && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
            <span className="t-caption mr-auto text-stone">{saved === "saving" ? "Saving…" : saved === "saved" ? "Draft saved" : ""}</span>
            <Button variant="secondary" disabled={pending} onClick={() => start(() => discardNote(p.id))}>
              Discard draft
            </Button>
            <Button
              disabled={pending || !body.trim()}
              onClick={() =>
                start(async () => {
                  const r = await signNote(p.id, body, working);
                  if (!r.ok) setError(r.error ?? "Could not sign");
                  else {
                    setTranscript("");
                    router.refresh();
                  }
                })
              }
            >
              Approve &amp; sign
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
