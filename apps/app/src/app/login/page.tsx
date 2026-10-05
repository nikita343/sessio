import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { AuthForm } from "./auth-form";
import { GoogleButton } from "@/components/google-button";
import { signInDemo } from "./actions";
import { LangSwitcher } from "@/components/lang-switcher";
import { pick, uiLang } from "@/lib/ui-lang";
import { LOGIN_T } from "@/lib/ui/login";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(LOGIN_T, await uiLang()).metaTitle };
}

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/dashboard";
  const mode = sp.mode === "signup" ? "signup" : "signin";
  const lang = await uiLang();
  const t = pick(LOGIN_T, lang);
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none object-cover mix-blend-multiply" />
      <header className="relative flex h-20 items-center justify-between px-6 md:px-10">
        <a href="https://usesessio.com">
          <Logo size={26} />
        </a>
        <LangSwitcher lang={lang} />
      </header>
      <div className="relative flex flex-1 items-center justify-center px-5 pb-20">
        <div className="w-full max-w-[400px] rounded-[24px] border border-line bg-surface/90 p-7 shadow-[var(--shadow-float)] backdrop-blur">
          <h1 className="t-heading-s">{mode === "signup" ? t.signupTitle : t.signinTitle}</h1>
          <p className="t-body-s mt-1 text-stone">
            {mode === "signup" ? t.signupBody : t.signinBody}
          </p>
          {sp.error === "demo" && (
            <p className="t-body-s mt-4 rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{t.demoResting}</p>
          )}
          {sp.error === "auth" && <p className="t-body-s mt-4 rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{t.authFailed}</p>}
          <div className="mt-6">
            <GoogleButton next={mode === "signup" ? "/start" : next === "/dashboard" ? "/start" : next} label={t.google} />
          </div>
          <div className="mt-5 flex items-center gap-3 text-stone">
            <span className="h-px flex-1 bg-line" />
            <span className="t-caption">{t.orEmail}</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <AuthForm mode={mode} next={next} lang={lang} />
          <div className="my-5 flex items-center gap-3 text-stone">
            <span className="h-px flex-1 bg-line" />
            <span className="t-caption">{t.or}</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <form action={signInDemo}>
            <button className="t-label-m flex h-11 w-full items-center justify-center rounded-full border border-line-strong bg-surface hover:border-ink/30">
              {t.demo}
            </button>
          </form>
          <p className="t-caption mt-3 text-center text-stone">{t.demoNote}</p>
          <p className="t-body-s mt-6 border-t border-line pt-4 text-center text-stone">
            {t.clientQ}{" "}
            <Link href="/me/login" className="text-ink underline underline-offset-2">
              {t.clientLink}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
