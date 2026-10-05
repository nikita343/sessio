"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LANG_NAME, LANG_ORDER, LANG_SHORT, type Lang } from "@/lib/i18n";

function saveLang(l: Lang) {
  document.cookie = `sessio_lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/**
 * Language menu: Polski · English · Українська. Remembers the choice in a cookie
 * (read on the server by pickLang/portalLang) and keeps the rest of the URL.
 */
export function LangSwitcher({ lang, align = "right", tone = "light", up = false }: { lang: Lang; align?: "left" | "right"; tone?: "light" | "plain"; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(l: Lang) {
    saveLang(l);
    const q = new URLSearchParams(params.toString());
    q.set("lang", l);
    setOpen(false);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${LANG_NAME[lang]}`}
        className={`t-label-m inline-flex h-9 items-center gap-2 rounded-full pl-3 pr-2.5 text-ink transition-colors ${tone === "light" ? "border border-line bg-surface/80 backdrop-blur hover:border-ink/25" : "hover:bg-sunken"}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-4 text-stone" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5s1.2-6.2 3.6-8.5Z" />
        </svg>
        {LANG_SHORT[lang]}
        <svg viewBox="0 0 12 12" aria-hidden className={`size-3 text-stone transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className={`absolute ${up ? "bottom-11" : "top-11"} z-50 w-[200px] rounded-[16px] border border-line bg-surface p-1.5 shadow-[var(--shadow-float)] ${align === "right" ? "right-0" : "left-0"}`}
        >
          {LANG_ORDER.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === lang}
                lang={l}
                onClick={() => choose(l)}
                className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left transition-colors ${l === lang ? "bg-sage-soft" : "hover:bg-paper"}`}
              >
                <span className={`t-caption w-6 font-medium ${l === lang ? "text-sage" : "text-stone"}`}>{LANG_SHORT[l]}</span>
                <span className="t-label-m flex-1">{LANG_NAME[l]}</span>
                {l === lang && (
                  <svg viewBox="0 0 12 12" aria-hidden className="size-3.5 text-sage">
                    <path d="m2.5 6.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
