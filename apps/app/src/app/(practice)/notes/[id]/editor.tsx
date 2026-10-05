"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { discardNote, saveNote, signNote } from "@/lib/note-actions";
import { Badge, Button, textareaCls } from "@/components/ui";
import type { Lang } from "@/lib/i18n";
import { NOTES_T } from "@/lib/ui/notes";

type Phase = "idle" | "recording" | "loading-model" | "transcribing" | "drafting";

const ESC = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const VOWEL_END = /[aeiouyąęóаеєиіїоуюяй]+$/iu;

/** Stems that catch Polish/Ukrainian inflections: Marek → Mark(iem), Ewa → Ew(ą), Олена → Олен(ою). */
function stems(name: string) {
  const out = new Set<string>([name]);
  const bare = name.replace(VOWEL_END, "");
  if (bare.length >= 2) out.add(bare);
  // fleeting "e" before the last consonant: Marek → Mark-, Wojciech stays
  const m = name.match(/^(.*\p{L})[eе](\p{L})$/u);
  if (m && name.length >= 4) out.add(m[1] + m[2]);
  // -ski/-cki adjectives: Wiśniewski → Wiśniewsk-
  if (/(sk|ck|dzk)[iy]$/iu.test(name)) out.add(name.slice(0, -1));
  const min = name.length <= 4 ? 2 : 3;
  return [...out].filter((x) => x.length >= min).sort((a2, b2) => b2.length - a2.length);
}

/** Replace contact details, then the client's and therapist's names, before any text leaves the device. */
function redact(text: string, client: string[], therapist: string[]) {
  // identifiers first, so names inside emails don't leave a half-redacted address
  let out = text
    .replace(/[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}/gu, "[email]")
    .replace(/(?<!\d)\d{11}(?!\d)/g, "[PESEL]")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, "[phone]")
    .replace(/(?<![\p{L}])(ul\.|ulica|al\.|aleja|os\.|osiedle|pl\.|plac|вул\.|вулиця)\s+[\p{L}\d .-]{2,40}?\d+[a-z]?(\/\d+)?/giu, "[address]");
  const swap = (names: string[], label: string) => {
    for (const n of names) {
      if (n.trim().length < 2) continue;
      const alts = stems(n.trim()).map(ESC).join("|");
      if (!alts) continue;
      // Unicode-aware word edges: JavaScript's \b only knows ASCII letters (Ł, Ż, Олена…)
      out = out.replace(new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})\\p{L}{0,5}(?![\\p{L}\\p{N}])`, "giu"), label);
    }
  };
  swap(client, "[client]");
  swap(therapist, "[psychologist]");
  return out;
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
  lang: Lang;
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
  const t = NOTES_T[p.lang] ?? NOTES_T.pl;
  const [body, setBody] = useState(p.initialBody);
  const [working, setWorking] = useState(p.initialWorking);
  const [transcript, setTranscript] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lang, setLang] = useState<"pl" | "uk" | "en">(p.lang);
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
      setError(t.micBlocked);
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
          setError(t.transcriptionFailed(m.message));
          setPhase("idle");
        }
      };
      w.postMessage({ audio: data, language: lang }, [data.buffer]);
    } catch (e) {
      setError(t.readFailed((e as Error).message));
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
      setError((e as Error).message || t.draftFailed);
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
          {t.privacyMode}
        </span>
        <div className="flex items-center justify-between">
          <h2 className="t-title-m">{t.yourMemo}</h2>
          {!p.signed && (
            <select value={lang} onChange={(e) => setLang(e.target.value as typeof lang)} className="t-caption rounded-full border border-line-strong bg-surface px-2 py-1" aria-label={t.memoLanguage}>
              <option value="en">English</option>
              <option value="pl">Polski</option>
              <option value="uk">Українська</option>
            </select>
          )}
        </div>

        {!p.signed && (
          <div className="flex items-center gap-3 rounded-[14px] bg-paper p-3">
            {phase === "recording" ? (
              <button onClick={stopRec} className="flex size-10 items-center justify-center rounded-full bg-warn text-white" aria-label={t.stopRecording}>
                <span className="size-3.5 rounded-sm bg-white" />
              </button>
            ) : (
              <button onClick={startRec} disabled={busy} className="flex size-10 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40" aria-label={t.recordMemo}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <div className="flex-1">
              {phase === "recording" ? (
                <p className="t-label-m flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-warn" /> {t.recording} · {fmt(seconds)}
                </p>
              ) : phase === "loading-model" ? (
                <p className="t-body-s text-stone">{t.preparing}{progress ? ` · ${progress}%` : "…"}</p>
              ) : phase === "transcribing" ? (
                <p className="t-body-s text-stone">{t.transcribing(fmt(seconds))}</p>
              ) : audioUrl ? (
                <audio src={audioUrl} controls className="h-9 w-full" />
              ) : (
                <p className="t-body-s text-stone">{t.tapToRecord}</p>
              )}
            </div>
          </div>
        )}
        {!p.signed && phase === "idle" && (
          <label className="t-caption -mt-2 cursor-pointer text-stone hover:text-ink">
            {t.uploadAudio}
            <input type="file" accept="audio/*" onChange={onFile} className="sr-only" />
          </label>
        )}

        <div className="flex flex-col gap-2">
          <p className="t-overline text-stone">{t.transcript}</p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={7}
            disabled={p.signed}
            className={textareaCls}
            placeholder={p.signed ? t.transcriptDeleted : t.transcriptPlaceholder}
          />
          {!p.signed && (
            <Button variant="dark" onClick={draft} disabled={!transcript.trim() || busy}>
              {phase === "drafting" ? t.drafting : t.draftRecord}
            </Button>
          )}
        </div>
        {error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{error}</p>}
        <p className="t-caption text-stone">
          {t.privacyNote}
        </p>
      </section>

      {/* record */}
      <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="t-title-m">{t.recordTitle}</h2>
          {p.signed ? <Badge tone="sage">{t.signedBadge(p.signedAt)}</Badge> : aiDraft === "ai" ? <Badge tone="clay">{t.aiDraft}</Badge> : aiDraft === "template" ? <Badge tone="stone">{t.templateDraft}</Badge> : <Badge tone="stone">{t.draft}</Badge>}
        </div>
        <p className="t-overline text-stone">
          {t.formalRecord} <span className="normal-case tracking-normal text-stone/80">{t.formalRecordNote}</span>
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            [t.fieldClient, p.meta.client],
            [t.fieldDate, p.meta.date],
            [t.fieldForm, p.meta.form],
            [t.fieldPsychologist, p.meta.psychologist],
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
          placeholder={t.bodyPlaceholder}
        />
        <p className="t-overline text-stone">
          {t.workingNotes} <span className="normal-case tracking-normal text-stone/80">{t.workingNote}</span>
        </p>
        <textarea
          value={working}
          onChange={(e) => setWorking(e.target.value)}
          readOnly={p.signed}
          rows={3}
          className={`${textareaCls} border-transparent !bg-clay-soft/70`}
          placeholder={t.workingPlaceholder}
        />
        <p className="t-caption text-stone">{t.retention}</p>
        {!p.signed && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
            <span className="t-caption mr-auto text-stone">{saved === "saving" ? t.saving : saved === "saved" ? t.saved : ""}</span>
            <Button variant="secondary" disabled={pending} onClick={() => start(() => discardNote(p.id))}>
              {t.discard}
            </Button>
            <Button
              disabled={pending || !body.trim()}
              onClick={() =>
                start(async () => {
                  const r = await signNote(p.id, body, working);
                  if (!r.ok) setError(r.error ?? t.signFailed);
                  else {
                    setTranscript("");
                    router.refresh();
                  }
                })
              }
            >
              {t.approveSign}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
