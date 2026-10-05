"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { signIn, signUp, type AuthState } from "./actions";
import type { Lang } from "@/lib/i18n";
import { LOGIN_T } from "@/lib/ui/login";

export function AuthForm({ mode, next, lang = "pl" }: { mode: "signin" | "signup"; next: string; lang?: Lang }) {
  const t = LOGIN_T[lang] ?? LOGIN_T.pl;
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "signup" ? signUp : signIn, {});
  return (
    <form action={action} className="mt-4 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" && (
        <Field label={t.yourName} htmlFor="full_name">
          <Input id="full_name" name="full_name" required autoComplete="name" placeholder="Anna Kowalska" />
        </Field>
      )}
      <Field label={t.email} htmlFor="email">
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder={t.emailPlaceholder} />
      </Field>
      <Field label={t.password} htmlFor="password">
        <Input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : undefined} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
      </Field>
      {state.error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{state.error}</p>}
      {state.info && <p className="t-body-s rounded-lg bg-sage-soft px-3 py-2 text-sage">{state.info}</p>}
      <Button size="lg" disabled={pending}>
        {pending ? t.oneMoment : mode === "signup" ? t.createPractice : t.signIn}
      </Button>
      <p className="t-body-s text-center text-stone">
        {mode === "signup" ? (
          <>
            {t.haveAccount} <Link className="text-ink underline underline-offset-2" href="/login">{t.signIn}</Link>
          </>
        ) : (
          <>
            {t.newTo} <Link className="text-ink underline underline-offset-2" href="/login?mode=signup">{t.openPractice}</Link>
          </>
        )}
      </p>
    </form>
  );
}
