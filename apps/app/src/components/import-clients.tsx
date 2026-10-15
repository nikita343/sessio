"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { commitImport, previewImport, type ImportState } from "@/lib/onboarding-actions";
import type { Lang } from "@/lib/i18n";
import { ONB_T } from "@/lib/ui/onboarding";
import { Badge, Button, btn, textareaCls } from "./ui";

export function ImportClients({ lang, backHref, skipHref }: { lang: Lang; backHref: string; skipHref: string }) {
  const t = ONB_T[lang] ?? ONB_T.pl;
  const [tab, setTab] = useState<"list" | "ics">("list");
  const [ics, setIcs] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, previewAction, previewing] = useActionState<ImportState, FormData>(previewImport, {});
  const [commit, commitAction, committing] = useActionState<ImportState, FormData>(commitImport, {});
  // the preview the user has dismissed (by editing the input or pressing "change"); a new action result replaces it
  const [hidden, setHidden] = useState<ImportState | null>(null);
  const showPreview = Boolean(preview.rows) && hidden !== preview;
  const hidePreview = () => setHidden(preview);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = preview.rows ?? [];
  const fresh = rows.filter((r) => r.status === "new").length;
  const existing = rows.filter((r) => r.status === "exists").length;
  const check = rows.filter((r) => r.status === "check").length;
  const sessions = preview.sessions ?? 0;
  const addable = fresh + existing;
  const error = commit.error ?? preview.error;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setIcs(String(reader.result ?? ""));
      setFileName(f.name);
      hidePreview();
    };
    reader.readAsText(f);
  }

  const tabCls = (on: boolean) => `t-label-m rounded-full px-4 py-2 transition-colors ${on ? "bg-surface text-sage shadow-[0_1px_2px_rgba(28,37,48,0.08)]" : "text-stone hover:text-ink"}`;

  return (
    <form action={previewAction} className="flex flex-col gap-6">
      <input type="hidden" name="ics" value={ics} />
      <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-5 md:p-6">
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
              placeholder={t.pastePlaceholder}
              className={`${textareaCls} font-mono text-[14px] ${tab === "list" ? "" : "hidden"}`}
              onChange={(e) => {
                setText(e.target.value);
                hidePreview();
              }}
            />
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-[12px] border border-dashed border-line-strong hover:border-ink/30 ${tab === "list" ? "px-4 py-3" : "flex-col px-6 py-10 text-center"}`}
            >
              <span className={`flex shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage ${tab === "list" ? "size-9" : "size-11"}`}>↑</span>
              <span className="min-w-0">
                <span className="t-label-m block">{fileName ? t.dropChosen(fileName) : t.dropTitle}</span>
                <span className="t-caption block text-stone">{t.dropBody}</span>
              </span>
              <input ref={fileRef} type="file" accept=".ics,text/calendar" onChange={onFile} className="sr-only" />
            </label>
            {tab === "ics" && <p className="t-caption text-stone">{t.sessionsNote}</p>}
          </div>

          {showPreview && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="t-overline text-stone">{t.previewTitle(rows.length)}</p>
                <p className="t-caption text-stone">{t.previewSummary(fresh, existing, check)}</p>
              </div>
              {rows.length > 0 ? (
                <ul className="divide-y divide-line overflow-hidden rounded-[12px] border border-line">
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={skipHref} className={btn("ghost")}>
          {t.skipNoList}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={backHref} className={btn("secondary")}>
            {t.back}
          </Link>
          {showPreview && (fresh > 0 || sessions > 0) ? (
            <>
              <Button type="button" variant="ghost" onClick={hidePreview}>
                {t.changeBtn}
              </Button>
              <Button formAction={commitAction} disabled={committing}>
                {sessions > 0 ? t.addSessionsBtn(fresh, sessions) : t.addBtn(fresh)}
              </Button>
            </>
          ) : showPreview && addable > 0 ? (
            <>
              <Button type="button" variant="ghost" onClick={hidePreview}>
                {t.changeBtn}
              </Button>
              <Link href={skipHref} className={btn("primary")}>
                {t.nextBtn}
              </Link>
            </>
          ) : (
            <Button disabled={previewing}>{t.previewBtn}</Button>
          )}
        </div>
      </div>
    </form>
  );
}
