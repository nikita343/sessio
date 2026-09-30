"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

export function WaitlistForm({ source = "landing-cta" }: { source?: string }) {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, {
    status: "idle",
  });

  if (state.status === "ok") {
    return (
      <p
        role="status"
        className="t-label-m mx-auto flex h-14 max-w-[400px] items-center justify-center rounded-full bg-sage-soft px-6 text-sage"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="mx-auto w-full max-w-[400px]">
      <input type="hidden" name="source" value={source} />
      <div className="flex h-14 items-center rounded-full border border-line-strong bg-surface p-1.5 pl-5 focus-within:border-sage">
        <label htmlFor={`email-${source}`} className="sr-only">
          Your work email
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your work email"
          className="t-body-m min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-stone"
        />
        <button
          type="submit"
          disabled={pending}
          className="t-label-m h-full shrink-0 rounded-full bg-sage px-5 text-white transition-colors hover:bg-sage-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Reserve my spot"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="t-caption mt-2 text-warn">
          {state.message}
        </p>
      )}
    </form>
  );
}
