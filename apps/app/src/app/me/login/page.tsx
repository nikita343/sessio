import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { GoogleButton } from "@/components/google-button";
import { LangSwitcher } from "@/components/lang-switcher";
import { portalLang, pt } from "@/lib/portal";
import { signInDemoClient } from "../actions";

export const metadata: Metadata = { title: "Sign in — your sessions" };

export default async function ClientLogin(props: PageProps<"/me/login">) {
  const sp = await props.searchParams;
  const lang = await portalLang(sp.lang);
  const d = pt(lang);
  const next = typeof sp.next === "string" && sp.next.startsWith("/me") ? sp.next : "/me";
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-paper">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none object-cover mix-blend-multiply" />
      <header className="relative flex h-20 items-center justify-between px-6 md:px-10">
        <a href="https://usesessio.com">
          <Logo size={26} />
        </a>
        <LangSwitcher lang={lang} />
      </header>
      <div className="relative flex flex-1 items-center justify-center px-5 pb-20">
        <div className="w-full max-w-[420px] rounded-[24px] border border-line bg-surface/95 p-7 shadow-[var(--shadow-float)]">
          <p className="t-overline text-sage">{d.portal}</p>
          <h1 className="t-heading-s mt-2">{d.signInTitle}</h1>
          <p className="t-body-s mt-2 text-stone">{d.signInBody}</p>
          {sp.error === "demo" && <p className="t-body-s mt-4 rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">The demo is resting. Try again in a minute.</p>}
          {sp.error === "auth" && <p className="t-body-s mt-4 rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">Sign-in didn’t finish. Please try again.</p>}
          <div className="mt-6">
            <GoogleButton next={next} label={d.google} />
          </div>
          <div className="my-5 flex items-center gap-3 text-stone">
            <span className="h-px flex-1 bg-line" />
            <span className="t-caption">{d.or}</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <form action={signInDemoClient}>
            <button className="t-label-m flex h-12 w-full items-center justify-center rounded-full bg-ink text-white hover:bg-ink/90">{d.demo}</button>
          </form>
          <p className="t-caption mt-2 text-center text-stone">{d.demoNote}</p>
          <p className="t-caption mt-6 border-t border-line pt-4 text-center text-stone">{d.orBook}</p>
          <p className="t-body-s mt-3 text-center text-stone">
            {d.therapistQ}{" "}
            <Link href="/login" className="text-ink underline underline-offset-2">
              {d.therapistLink}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
