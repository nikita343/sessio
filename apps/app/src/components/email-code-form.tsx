"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { playSound } from "./ui-sounds";
import type { Lang } from "@/lib/i18n";

const T: Record<Lang, Record<string, string>> = {
  pl: {
    email: "Adres e-mail",
    send: "Wyślij kod",
    sending: "Wysyłanie…",
    sent: "Wysłaliśmy 6-cyfrowy kod na",
    code: "Kod z e-maila",
    verify: "Zaloguj się",
    checking: "Sprawdzanie…",
    again: "Wyślij ponownie",
    change: "Zmień adres",
    wrong: "Kod jest nieprawidłowy lub wygasł. Spróbuj ponownie.",
    limit: "Za dużo prób. Odczekaj chwilę i spróbuj ponownie.",
    fail: "Nie udało się wysłać kodu. Spróbuj ponownie za chwilę.",
    hint: "Bez hasła. Kod jest ważny przez godzinę.",
  },
  en: {
    email: "Email address",
    send: "Email me a code",
    sending: "Sending…",
    sent: "We sent a 6-digit code to",
    code: "Code from the email",
    verify: "Sign in",
    checking: "Checking…",
    again: "Send again",
    change: "Use another email",
    wrong: "That code is wrong or has expired. Try again.",
    limit: "Too many tries. Wait a moment and try again.",
    fail: "We couldn’t send the code. Try again in a moment.",
    hint: "No password. The code works for one hour.",
  },
  uk: {
    email: "Адреса e-mail",
    send: "Надіслати код",
    sending: "Надсилаємо…",
    sent: "Ми надіслали 6-значний код на",
    code: "Код з листа",
    verify: "Увійти",
    checking: "Перевіряємо…",
    again: "Надіслати ще раз",
    change: "Інша адреса",
    wrong: "Код неправильний або застарів. Спробуйте ще раз.",
    limit: "Забагато спроб. Зачекайте трохи й спробуйте знову.",
    fail: "Не вдалося надіслати код. Спробуйте трохи пізніше.",
    hint: "Без пароля. Код діє одну годину.",
  },
};

export function EmailCodeForm({ lang, next }: { lang: Lang; next: string }) {
  const t = T[lang];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    setBusy(true);
    setErr("");
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, data: { role: "client", lang } },
    });
    setBusy(false);
    if (error) {
      playSound("error");
      setErr(error.status === 429 ? t.limit : t.fail);
      return;
    }
    playSound("success");
    setStep("code");
    setTimeout(() => codeRef.current?.focus(), 50);
  };

  const verify = async () => {
    setBusy(true);
    setErr("");
    const { error } = await createClient().auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
    if (error) {
      setBusy(false);
      playSound("error");
      setErr(error.status === 429 ? t.limit : t.wrong);
      return;
    }
    playSound("success");
    router.replace(next);
    router.refresh();
  };

  const input = "t-body-m h-12 w-full rounded-[14px] border border-line-strong bg-surface px-4 outline-none transition-colors focus:border-sage";
  const btn = "t-label-m flex h-12 w-full items-center justify-center rounded-full bg-sage text-white transition-colors hover:bg-sage/90 disabled:opacity-60";

  return (
    <div className="flex flex-col gap-3">
      {step === "email" ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) send();
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="t-caption text-stone">{t.email}</span>
            <input type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ty@example.com" className={input} />
          </label>
          <button disabled={busy || !email.includes("@")} className={btn}>
            {busy ? t.sending : t.send}
          </button>
          <p className="t-caption text-center text-stone">{t.hint}</p>
        </form>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) verify();
          }}
        >
          <p className="t-body-s text-stone">
            {t.sent} <span className="font-medium text-ink">{email}</span>
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="t-caption text-stone">{t.code}</span>
            <input
              ref={codeRef}
              required
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]{6,10}"
              maxLength={10}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className={`${input} text-center font-mono text-[22px] tracking-[0.4em]`}
            />
          </label>
          <button disabled={busy || code.length < 6} className={btn}>
            {busy ? t.checking : t.verify}
          </button>
          <div className="flex justify-between">
            <button type="button" disabled={busy} onClick={send} className="t-caption text-stone underline-offset-2 hover:text-ink hover:underline">
              {t.again}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setErr("");
              }}
              className="t-caption text-stone underline-offset-2 hover:text-ink hover:underline"
            >
              {t.change}
            </button>
          </div>
        </form>
      )}
      {err && (
        <p role="alert" className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">
          {err}
        </p>
      )}
    </div>
  );
}
