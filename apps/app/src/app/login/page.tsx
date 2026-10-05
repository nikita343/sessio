import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { AuthForm } from "./auth-form";
import { GoogleButton } from "@/components/google-button";
import { signInDemo } from "./actions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/dashboard";
  const mode = sp.mode === "signup" ? "signup" : "signin";
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none object-cover mix-blend-multiply" />
      <header className="relative flex h-20 items-center px-6 md:px-10">
        <a href="https://usesessio.com">
          <Logo size={26} />
        </a>
      </header>
      <div className="relative flex flex-1 items-center justify-center px-5 pb-20">
        <div className="w-full max-w-[400px] rounded-[24px] border border-line bg-surface/90 p-7 shadow-[var(--shadow-float)] backdrop-blur">
          <h1 className="t-heading-s">{mode === "signup" ? "Open your practice" : "Welcome back"}</h1>
          <p className="t-body-s mt-1 text-stone">
            {mode === "signup" ? "Five minutes to a booking page your clients can pay on." : "Sign in to your practice."}
          </p>
          {sp.error === "demo" && (
            <p className="t-body-s mt-4 rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">The demo practice is resting. Try again in a minute.</p>
          )}
          {sp.error === "auth" && <p className="t-body-s mt-4 rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">Sign-in didn&rsquo;t finish. Please try again.</p>}
          <div className="mt-6">
            <GoogleButton next={mode === "signup" ? "/start" : next === "/dashboard" ? "/start" : next} label="Continue with Google" />
          </div>
          <div className="mt-5 flex items-center gap-3 text-stone">
            <span className="h-px flex-1 bg-line" />
            <span className="t-caption">or with email</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <AuthForm mode={mode} next={next} />
          <div className="my-5 flex items-center gap-3 text-stone">
            <span className="h-px flex-1 bg-line" />
            <span className="t-caption">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <form action={signInDemo}>
            <button className="t-label-m flex h-11 w-full items-center justify-center rounded-full border border-line-strong bg-surface hover:border-ink/30">
              Explore the demo practice
            </button>
          </form>
          <p className="t-caption mt-3 text-center text-stone">Anna Kowalska&rsquo;s practice with sample clients. Nothing real. Sample data refreshes about every hour, so test messages may disappear.</p>
          <p className="t-body-s mt-6 border-t border-line pt-4 text-center text-stone">
            Booked a session as a client?{" "}
            <Link href="/me/login" className="text-ink underline underline-offset-2">
              See your sessions
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
