"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Avatar } from "./ui";
import { LangSwitcher } from "./lang-switcher";
import { SoundToggle } from "./ui-sounds";
import { NAV_T } from "@/lib/ui/nav";
import type { Lang } from "@/lib/i18n";

const NAV = [
  ["today", "/dashboard"],
  ["calendar", "/calendar"],
  ["clients", "/clients"],
  ["notes", "/notes"],
  ["inbox", "/inbox"],
  ["payments", "/payments"],
  ["bookingPage", "/booking-page"],
  ["settings", "/settings"],
] as const;

export function Sidebar({ name, slug, photo, inboxCount, host, lang }: { name: string; slug: string; photo: string | null; inboxCount: number; host: string; lang: Lang }) {
  const path = usePathname();
  const t = NAV_T[lang];
  return (
    <>
      {/* desktop */}
      <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <Link href="/dashboard" className="px-2">
          <Logo size={24} />
        </Link>
        <nav className="mt-8 flex flex-col gap-0.5">
          {NAV.map(([key, href]) => {
            const on = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`t-label-m flex h-9 items-center justify-between rounded-[9px] px-3 transition-colors ${on ? "bg-sage-soft text-sage" : "text-ink/75 hover:bg-sunken hover:text-ink"}`}
              >
                {t[key]}
                {key === "inbox" && inboxCount > 0 && <span className="rounded-full bg-clay px-1.5 text-[11px] leading-[18px] text-white">{inboxCount}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <LangSwitcher lang={lang} align="left" tone="plain" up />
            <SoundToggle labelOn={t.soundsOn} labelOff={t.soundsOff} />
          </div>
          <div className="flex items-center gap-2.5 border-t border-line px-2 pt-3">
            <Avatar name={name} photo={photo} size={34} />
            <div className="min-w-0">
              <p className="t-label-m truncate">{name}</p>
              <a href={`/${slug}`} target="_blank" className="t-caption block truncate text-stone hover:text-ink">
                {host}/{slug}
              </a>
            </div>
          </div>
        </div>
      </aside>
      {/* mobile */}
      <div className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <Link href="/dashboard">
            <Logo size={22} />
          </Link>
          <div className="flex items-center gap-1">
            <LangSwitcher lang={lang} tone="plain" />
            <Avatar name={name} photo={photo} size={30} />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map(([key, href]) => {
            const on = path === href || path.startsWith(href + "/");
            return (
              <Link key={href} href={href} className={`t-label-m shrink-0 rounded-full px-3 py-1.5 ${on ? "bg-sage-soft text-sage" : "text-ink/70"}`}>
                {t[key]}
                {key === "inbox" && inboxCount > 0 && <span className="ml-1 rounded-full bg-clay px-1.5 text-[11px] text-white">{inboxCount}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
