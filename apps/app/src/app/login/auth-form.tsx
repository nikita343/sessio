"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { signIn, signUp, type AuthState } from "./actions";

export function AuthForm({ mode, next }: { mode: "signin" | "signup"; next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "signup" ? signUp : signIn, {});
  return (
    <form action={action} className="mt-4 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" && (
        <Field label="Your name" htmlFor="full_name">
          <Input id="full_name" name="full_name" required autoComplete="name" placeholder="Anna Kowalska" />
        </Field>
      )}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@practice.pl" />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : undefined} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
      </Field>
      {state.error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{state.error}</p>}
      {state.info && <p className="t-body-s rounded-lg bg-sage-soft px-3 py-2 text-sage">{state.info}</p>}
      <Button size="lg" disabled={pending}>
        {pending ? "One moment…" : mode === "signup" ? "Create my practice" : "Sign in"}
      </Button>
      <p className="t-body-s text-center text-stone">
        {mode === "signup" ? (
          <>
            Already have a practice? <Link className="text-ink underline underline-offset-2" href="/login">Sign in</Link>
          </>
        ) : (
          <>
            New to Sessio? <Link className="text-ink underline underline-offset-2" href="/login?mode=signup">Open your practice</Link>
          </>
        )}
      </p>
    </form>
  );
}
