import Link from "next/link";
import Image from "next/image";
import { Logo } from "./logo";
import { LANG_ORDER, LANG_SHORT, type Lang } from "@/lib/i18n";

export function PublicShell({ lang, path, children, back }: { lang: Lang; path: string; children: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none fixed object-cover opacity-70 mix-blend-multiply" />
      <header className="relative mx-auto flex h-16 max-w-[1040px] items-center justify-between px-5">
        {back ? (
          <Link href={back.href} className="t-label-m text-stone hover:text-ink">
            ← {back.label}
          </Link>
        ) : (
          <a href="https://usesessio.com" aria-label="Sessio">
            <Logo size={24} />
          </a>
        )}
        {back ? (
          <Logo size={24} />
        ) : (
          <nav className="t-label-m flex gap-1 text-stone" aria-label="Language">
            {LANG_ORDER.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>·</span>}
                <Link href={`${path}?lang=${l}`} className={l === lang ? "text-ink" : "hover:text-ink"} hrefLang={l}>
                  {LANG_SHORT[l]}
                </Link>
              </span>
            ))}
          </nav>
        )}
      </header>
      <div className="relative mx-auto max-w-[1040px] px-5 pb-16">{children}</div>
    </div>
  );
}
