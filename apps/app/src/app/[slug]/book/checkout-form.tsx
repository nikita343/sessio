"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { bookAndPay, type BookState } from "./actions";
import { t, type Lang } from "@/lib/i18n";
import { Field, Input, Textarea } from "@/components/ui";
import type { SessionFormat } from "@/lib/types";

export function CheckoutForm(p: {
  slug: string;
  lang: Lang;
  start: string;
  serviceId: string;
  formats: SessionFormat[];
  address: string | null;
  price: string;
  therapist: string;
  cancellationHours: number;
  summary: string;
  /** Signed-in client: name and email come from their account. */
  account?: { name: string; email: string } | null;
  /** [before, link text, after] for the agreement checkbox. */
  agreementLabel: [string, string, string];
}) {
  const d = t(p.lang);
  const [state, action, pending] = useActionState<BookState, FormData>(bookAndPay, {});
  const [method, setMethod] = useState("blik");
  const [format, setFormat] = useState<SessionFormat>(p.formats.includes("online") ? "online" : "in_person");

  if (state.error === "taken")
    return (
      <div className="flex flex-col gap-3 rounded-[16px] bg-clay-soft p-5">
        <p className="t-body-m text-clay">{d.slotTaken}</p>
        <Link href={`/${p.slug}?lang=${p.lang}`} className="t-label-m text-ink underline">
          ← {d.back}
        </Link>
      </div>
    );

  const methods = [
    ["blik", d.blik],
    ["card", d.card],
    ["p24", d.p24],
  ] as const;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="slug" value={p.slug} />
      <input type="hidden" name="lang" value={p.lang} />
      <input type="hidden" name="start" value={p.start} />
      <input type="hidden" name="service_id" value={p.serviceId} />
      <input type="hidden" name="summary" value={p.summary} />
      <input type="hidden" name="format" value={format} />
      <input type="hidden" name="method" value={method} />

      {p.formats.length > 1 && (
        <Field label={d.where}>
          <div className="grid grid-cols-2 gap-2">
            {p.formats.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFormat(f)}
                className={`t-label-m h-11 rounded-[12px] border ${format === f ? "border-sage bg-sage-soft text-sage" : "border-line-strong bg-surface"}`}
              >
                {d[f]}
              </button>
            ))}
          </div>
          {format === "in_person" && p.address && <p className="t-caption text-stone">{p.address}</p>}
        </Field>
      )}
      {p.formats.length === 1 && (
        <p className="t-body-s -mt-2 text-stone">{format === "online" ? d.videoRoom : d.inPersonAt(p.address ?? "")}</p>
      )}

      <Field label={d.yourName} htmlFor="name">
        <Input id="name" name="name" required autoComplete="name" placeholder="Marta Nowak" defaultValue={p.account?.name ?? ""} />
      </Field>
      <Field label={d.email} htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="marta@example.com"
          defaultValue={p.account?.email ?? ""}
          readOnly={!!p.account}
          className={p.account ? "bg-sunken! text-ink/80" : undefined}
        />
      </Field>
      <Field label={d.phone} htmlFor="phone">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+48 …" />
      </Field>
      <Field label={d.note} htmlFor="note">
        <Textarea id="note" name="note" rows={2} />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="t-overline mb-2 text-stone">{d.payment}</legend>
        {methods.map(([id, [label, hint]]) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 transition-colors ${method === id ? "border-sage bg-sage-soft" : "border-line bg-surface"}`}
          >
            <input type="radio" name="method_ui" checked={method === id} onChange={() => setMethod(id)} className="size-4 accent-[#3F6B5E]" />
            <span className="flex flex-col">
              <span className="t-label-m">{label}</span>
              <span className="t-caption text-stone">{hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="agreement" required className="mt-0.5 size-4 shrink-0 accent-[#3F6B5E]" />
        <span className="t-caption text-stone">
          {p.agreementLabel[0]}
          <a href={`/${p.slug}/agreement?lang=${p.lang}`} target="_blank" rel="noopener" className="text-ink underline decoration-1 underline-offset-2 hover:text-sage">
            {p.agreementLabel[1]}
          </a>
          {p.agreementLabel[2]}
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="consent" required className="mt-0.5 size-4 shrink-0 accent-[#3F6B5E]" />
        <span className="t-caption text-stone">{d.consent(p.cancellationHours)}</span>
      </label>

      {state.error && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{state.error}</p>}

      <button disabled={pending} className="t-label-m h-12 rounded-full bg-sage text-white transition-colors hover:bg-sage-hover disabled:opacity-60">
        {pending ? "…" : d.pay(p.price)}
      </button>
      <p className="t-caption text-center text-stone">{d.paidDirect(p.therapist)}</p>
    </form>
  );
}
