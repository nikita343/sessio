"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { commitImport, previewImport, type ImportState } from "@/lib/onboarding-actions";
import type { Lang } from "@/lib/i18n";
import { ONB_T } from "@/lib/ui/onboarding";
import { Badge, Button, btn, textareaCls } from "./ui";

/**
 * Step 2: paste a list and/or drop an .ics. The preview is a server action that runs by itself
 * ~400 ms after the input settles, so the therapist never presses "preview" — only "Dodaj".
 */
export function ImportClients({ lang, backHref, skipHref }: { lang: Lang; backHref: string; skipHref: string }) {
  const t = ONB_T[lang] ?? ONB_T.pl;
  const [tab, setTab] = useState<"list" | "ics">("list");
  const [ics, setIcs] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [preview, previewAction, previewing] = useActionState<ImportState, FormData>(previewImport, {});
  const [commit, commitAction, committing] = useActionState<ImportState, FormData>(commitImport, {});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInput = text.trim().length > 0 || ics.length > 0;

  // debounce → server preview; the latest input always wins
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!hasInput) return;
    timer.current = setTimeout(() => {
      const fd = new FormData();
      fd.set("text", text);
      fd.set("ics", ics);
      startTransition(() => previewAction(fd));
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text, ics, hasInput, previewAction]);

  const rows = hasInput ? (preview.rows ?? []) : [];
  const fresh = rows.filter((r) => r.status === "new").length;
  const existing = rows.filter((r) => r.status === "exists").length;
  const check = rows.filter((r) => r.status === "check").length;
  const sessions = hasInput ? (preview.sessions ?? 0) : 0;
  const addable = fresh + existing;
  const showPreview = hasInput && Boolean(preview.rows);
  const canAdd = fresh > 0 || sessions > 0;
  const error = commit.error;

  function readFile(f: File | undefined) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setIcs(String(reader.result ?? ""));
      setFileName(f.name);
    };
    reader.readAsText(f);
  }

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      readFile(e.dataTransfer.files?.[0]);
    },
  };

  const tabCls = (on: boolean) => `t-label-m rounded-full px-4 py-2 transition-colors ${on ? "bg-surface text-sage shadow-[0_1px_2px_rgba(28,37,48,0.08)]" : "text-stone hover:text-ink"}`;
  const dropCls = `flex cursor-pointer items-center gap-3 rounded-[12px] border border-dashed transition-colors ${dragging ? "border-sage bg-sage-soft/60" : ics ? "border-sage/60 bg-sage-soft/30" : "border-line-strong hover:border-ink/30"} ${tab === "list" ? "px-4 py-3" : "flex-col px-6 py-10 text-center"}`;

  return (
    <form action={commitAction} className="flex flex-col gap-6">
      <input type="hidden" name="ics" value={ics} />
      <div className="onb-rise onb-rise-1 flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-5 md:p-6">
        <div className="inline-flex w-fit gap-0.5 rounded-full bg-sunken p-1" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "list"} onClick={() => setTab("list")} className={tabCls(tab === "list")}>
            {t.tabPaste}
          </button>
          <button type="button" role="tab" aria-selected={tab === "ics"} onClick={() => setTab("ics")} className={tabCls(tab === "ics")}>
            {t.tabIcs}
          </button>
        </div>

        <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
          <div className="flex flex-col gap-3">
            <label htmlFor="text" className={`t-label-m text-ink ${tab === "list" ? "" : "hidden"}`}>
              {t.pasteLabel}
            </label>
            <textarea
              id="text"
              name="text"
              rows={7}
              value={text}
              autoFocus
              placeholder={t.pastePlaceholder}
              className={`${textareaCls} font-mono text-[14px] ${tab === "list" ? "" : "hidden"}`}
              onChange={(e) => setText(e.target.value)}
            />
            <label className={dropCls} {...dropHandlers}>
              <span className={`flex shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage ${tab === "list" ? "size-9" : "size-11"}`}>
                {ics ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 12V4m0 0L4.5 7.5M8 4l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="min-w-0">
                <span className="t-label-m block">{fileName ? t.dropChosen(fileName) : t.dropTitle}</span>
                <span className="t-caption block text-stone">{t.dropBody}</span>
              </span>
              <input type="file" accept=".ics,text/calendar" onChange={(e) => readFile(e.target.files?.[0])} className="sr-only" />
            </label>
            {tab === "ics" && <p className="t-caption text-stone">{t.sessionsNote}</p>}
          </div>

          {showPreview && (
            <div className="onb-rise flex flex-col gap-3" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <p className="t-overline text-stone">{t.previewTitle(rows.length)}</p>
                <p className={`t-caption text-stone transition-opacity ${previewing ? "opacity-50" : ""}`}>{t.previewSummary(fresh, existing, check)}</p>
              </div>
              {rows.length > 0 ? (
                <ul className={`divide-y divide-line overflow-hidden rounded-[12px] border border-line transition-opacity ${previewing ? "opacity-60" : ""}`}>
                  {rows.map((r, i) => (
                    <li key={i} className="flex items-center gap-3 px-3.5 py-2.5">
                      <span className="min-w-0 flex-1">
                        <span className="t-label-m block truncate">{r.name || "—"}</span>
                        <span className={`t-caption block truncate ${r.status === "check" ? "text-clay" : "text-stone"}`}>
                          {r.email || "—"}
                          {r.phone ? ` · ${r.phone}` : ""}
                          {r.sessions ? ` · ${r.sessions}×` : ""}
                        </span>
                      </span>
                      <span className="t-caption text-stone">{r.language === "uk" ? "UA" : r.language.toUpperCase()}</span>
                      <Badge tone={r.status === "new" ? "sage" : r.status === "exists" ? "stone" : "clay"}>{r.status === "new" ? t.statusNew : r.status === "exists" ? t.statusExists : t.statusCheck}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="t-body-s rounded-[12px] bg-paper px-4 py-3 text-stone">{t.nothingFound}</p>
              )}
              {sessions > 0 || (preview.skippedSessions ?? 0) > 0 ? <p className="t-caption text-sage">{t.sessionsFound(sessions, preview.skippedSessions ?? 0)}</p> : null}
              <p className="t-caption text-stone">{t.dedupeNote}</p>
              {sessions > 0 && <p className="t-caption text-stone">{t.remindersNote}</p>}
            </div>
          )}
        </div>
        {error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{error}</p>}
      </div>

      <div className="onb-rise onb-rise-2 flex flex-wrap items-center justify-between gap-3">
        <Link href={skipHref} className={btn("ghost")}>
          {t.skipNoList}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={backHref} className={btn("secondary")}>
            {t.back}
          </Link>
          {canAdd ? (
            <Button disabled={committing || previewing}>{sessions > 0 ? t.addSessionsBtn(fresh, sessions) : t.addBtn(fresh)}</Button>
          ) : showPreview && addable > 0 ? (
            <Link href={skipHref} className={btn("primary")}>
              {t.nextBtn}
            </Link>
          ) : (
            <Button disabled>{t.addBtn(0)}</Button>
          )}
        </div>
      </div>
    </form>
  );
}
