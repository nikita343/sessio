import Link from "next/link";
import Image from "next/image";
import { Logo } from "./logo";
import { Avatar } from "./ui";
import { LANG_ORDER, LANG_SHORT, type Lang } from "@/lib/i18n";
import { pt, type MyProfile } from "@/lib/portal";
import { FIND_T } from "@/lib/ui/find";
import { setLang, signOutClient } from "@/app/me/actions";

export function PortalShell({
  lang,
  profile,
  current,
  path,
  children,
}: {
  lang: Lang;
  profile: MyProfile;
  current: "sessions" | "messages" | "find" | "details";
  path: string;
  children: React.ReactNode;
}) {
  const d = pt(lang);
  const tabs = [
    ["sessions", d.sessions, "/me"],
    ["messages", d.messages, "/me/messages"],
    ["find", FIND_T[lang].tab, "/find"],
    ["details", d.details, "/me/details"],
  ] as const;
  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none fixed object-cover opacity-50 mix-blend-multiply" />
      <header className="relative z-10 mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-3 px-5">
        <Link href="/me" aria-label={d.portal}>
          <Logo size={24} />
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-line bg-surface/90 p-1 sm:flex" aria-label={d.portal}>
          {tabs.map(([k, label, href]) => (
            <Link
              key={k}
              href={href}
              aria-current={current === k ? "page" : undefined}
              className={`t-label-m rounded-full px-2.5 py-1.5 sm:px-4 ${current === k ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full [&::-webkit-details-marker]:hidden">
            <Avatar name={profile.full_name || profile.email} photo={profile.avatar_url} size={34} tone="lavender" />
          </summary>
          <div className="absolute right-0 top-11 z-30 flex w-[240px] flex-col gap-1 rounded-[16px] border border-line bg-surface p-2 shadow-[var(--shadow-float)]">
            <div className="px-2.5 py-2">
              <p className="t-label-m truncate">{profile.full_name || profile.email}</p>
              <p className="t-caption truncate text-stone">{profile.email}</p>
            </div>
            <form action={setLang} className="flex items-center gap-1 px-2 py-1">
              <input type="hidden" name="back" value={path} />
              <span className="t-caption mr-auto text-stone">{d.lang}</span>
              {LANG_ORDER.map((l) => (
                <button key={l} name="lang" value={l} className={`t-label-m rounded-full px-2.5 py-1 ${l === lang ? "bg-sunken text-ink" : "text-stone hover:text-ink"}`}>
                  {LANG_SHORT[l]}
                </button>
              ))}
            </form>
            {profile.is_therapist && (
              <Link href="/dashboard" className="t-label-m rounded-[10px] px-2.5 py-2 hover:bg-sunken">
                {d.switchPractice}
              </Link>
            )}
            <form action={signOutClient}>
              <button className="t-label-m w-full rounded-[10px] px-2.5 py-2 text-left text-stone hover:bg-sunken hover:text-ink">{d.signOut}</button>
            </form>
          </div>
        </details>
      </header>
      <main className="relative mx-auto max-w-[1040px] px-5 pb-28 sm:pb-20">{children}</main>
      {/* phones: app-style tab bar */}
      <nav
        aria-label={d.portal}
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur sm:hidden"
      >
        {tabs.map(([k, label, href]) => (
          <Link
            key={k}
            href={href}
            aria-current={current === k ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-[12px] py-1.5 text-[11px] font-medium ${current === k ? "text-sage" : "text-stone"}`}
          >
            <TabIcon name={k} on={current === k} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function TabIcon({ name, on }: { name: "sessions" | "messages" | "find" | "details"; on: boolean }) {
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: on ? 2 : 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "sessions")
    return (
      <svg {...p}>
        <rect x="3.5" y="5" width="17" height="15" rx="3" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
    );
  if (name === "messages")
    return (
      <svg {...p}>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17h0A1.5 1.5 0 0 1 4 15.5z" />
      </svg>
    );
  if (name === "find")
    return (
      <svg {...p}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </svg>
  );
}
