"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Avatar } from "./ui";

const NAV = [
  ["Today", "/dashboard"],
  ["Calendar", "/calendar"],
  ["Clients", "/clients"],
  ["Notes", "/notes"],
  ["Inbox", "/inbox"],
  ["Payments", "/payments"],
  ["Booking page", "/booking-page"],
  ["Settings", "/settings"],
] as const;

export function Sidebar({ name, slug, photo, inboxCount, host }: { name: string; slug: string; photo: string | null; inboxCount: number; host: string }) {
  const path = usePathname();
  return (
    <>
      {/* desktop */}
      <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <Link href="/dashboard" className="px-2">
          <Logo size={24} />
        </Link>
        <nav className="mt-8 flex flex-col gap-0.5">
          {NAV.map(([label, href]) => {
            const on = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`t-label-m flex h-9 items-center justify-between rounded-[9px] px-3 transition-colors ${on ? "bg-sage-soft text-sage" : "text-ink/75 hover:bg-sunken hover:text-ink"}`}
              >
                {label}
                {label === "Inbox" && inboxCount > 0 && (
                  <span className="rounded-full bg-clay px-1.5 text-[11px] leading-[18px] text-white">{inboxCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-2.5 px-2">
          <Avatar name={name} photo={photo} size={34} />
          <div className="min-w-0">
            <p className="t-label-m truncate">{name}</p>
            <a href={`/${slug}`} target="_blank" className="t-caption block truncate text-stone hover:text-ink">
              {host}/{slug}
            </a>
          </div>
        </div>
      </aside>
      {/* mobile */}
      <div className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard">
            <Logo size={22} />
          </Link>
          <Avatar name={name} photo={photo} size={30} />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map(([label, href]) => {
            const on = path === href || path.startsWith(href + "/");
            return (
              <Link key={href} href={href} className={`t-label-m shrink-0 rounded-full px-3 py-1.5 ${on ? "bg-sage-soft text-sage" : "text-ink/70"}`}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
