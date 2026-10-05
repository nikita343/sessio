"use client";

import { useActionState, useEffect, useState } from "react";
import { addSession, type AddState } from "@/lib/booking-actions";
import { Button, Field, Input, inputCls } from "@/components/ui";
import type { Lang } from "@/lib/i18n";
import { CALENDAR_T } from "@/lib/ui/calendar";

export function AddSession({ open: initial, clients, defaultDate, lang = "pl" }: { open: boolean; clients: { id: string; full_name: string }[]; defaultDate: string; lang?: Lang }) {
  const t = CALENDAR_T[lang] ?? CALENDAR_T.pl;
  const [open, setOpen] = useState(initial);
  const [state, action, pending] = useActionState<AddState, FormData>(addSession, {});
  const [clientId, setClientId] = useState("");
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t.addSession}</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center" onClick={() => setOpen(false)}>
          <form action={action} onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[440px] flex-col gap-4 rounded-[20px] bg-surface p-6 shadow-[var(--shadow-float)]">
            <div className="flex items-center justify-between">
              <h2 className="t-title-m">{t.addTitle}</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-stone" aria-label={t.close}>
                ✕
              </button>
            </div>
            <Field label={t.clientLabel} htmlFor="client_id">
              <select id="client_id" name="client_id" value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputCls}>
                <option value="">{t.newClient}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </Field>
            {!clientId && (
              <div className="grid grid-cols-2 gap-3">
                <Input name="name" placeholder={t.name} aria-label={t.name} />
                <Input name="email" type="email" placeholder={t.email} aria-label={t.email} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.date} htmlFor="date">
                <Input id="date" name="date" type="date" required defaultValue={defaultDate} />
              </Field>
              <Field label={t.time} htmlFor="time">
                <Input id="time" name="time" type="time" required step={900} defaultValue="10:00" />
              </Field>
            </div>
            <Field label={t.where} htmlFor="format">
              <select id="format" name="format" className={inputCls} defaultValue="online">
                <option value="online">{t.whereOnline}</option>
                <option value="in_person">{t.whereInPerson}</option>
              </select>
            </Field>
            <label className="t-body-s flex items-center gap-2.5">
              <input type="checkbox" name="paid" className="size-4 accent-[#3F6B5E]" /> {t.alreadyPaid}
            </label>
            {state.error && <p className="t-body-s text-warn">{t.errors[state.error] ?? state.error}</p>}
            <Button disabled={pending}>{pending ? t.adding : t.submit}</Button>
          </form>
        </div>
      )}
    </>
  );
}
