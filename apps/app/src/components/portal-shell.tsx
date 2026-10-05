import Link from "next/link";
import Image from "next/image";
import { Logo } from "./logo";
import { Avatar } from "./ui";
import { LANG_ORDER, LANG_SHORT, type Lang } from "@/lib/i18n";
import { pt, type MyProfile } from "@/lib/portal";
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
  current: "sessions" | "messages";
  path: string;
  children: React.ReactNode;
}) {
  const d = pt(lang);
  const tabs = [
    ["sessions", d.sessions, "/me"],
    ["messages", d.messages, "/me/messages"],
  ] as const;
  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none fixed object-cover opacity-50 mix-blend-multiply" />
      <header className="relative z-10 mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-3 px-5">
        <Link href="/me" aria-label={d.portal}>
          <Logo size={24} />
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-line bg-surface/90 p-1" aria-label={d.portal}>
          {tabs.map(([k, label, href]) => (
            <Link
              key={k}
              href={href}
              aria-current={current === k ? "page" : undefined}
              className={`t-label-m rounded-full px-3.5 py-1.5 sm:px-4 ${current === k ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
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
      <main className="relative mx-auto max-w-[1040px] px-5 pb-20">{children}</main>
    </div>
  );
}
