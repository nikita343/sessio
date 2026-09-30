"use client";

import { useActionState, useEffect, useState } from "react";
import { addSession, type AddState } from "@/lib/booking-actions";
import { Button, Field, Input, inputCls } from "@/components/ui";

export function AddSession({ open: initial, clients, defaultDate }: { open: boolean; clients: { id: string; full_name: string }[]; defaultDate: string }) {
  const [open, setOpen] = useState(initial);
  const [state, action, pending] = useActionState<AddState, FormData>(addSession, {});
  const [clientId, setClientId] = useState("");
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Add session</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center" onClick={() => setOpen(false)}>
          <form action={action} onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[440px] flex-col gap-4 rounded-[20px] bg-surface p-6 shadow-[var(--shadow-float)]">
            <div className="flex items-center justify-between">
              <h2 className="t-title-m">Add a session</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-stone" aria-label="Close">
                ✕
              </button>
            </div>
            <Field label="Client" htmlFor="client_id">
              <select id="client_id" name="client_id" value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputCls}>
                <option value="">New client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </Field>
            {!clientId && (
              <div className="grid grid-cols-2 gap-3">
                <Input name="name" placeholder="Name" aria-label="Name" />
                <Input name="email" type="email" placeholder="Email" aria-label="Email" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" htmlFor="date">
                <Input id="date" name="date" type="date" required defaultValue={defaultDate} />
              </Field>
              <Field label="Time" htmlFor="time">
                <Input id="time" name="time" type="time" required step={900} defaultValue="10:00" />
              </Field>
            </div>
            <Field label="Where" htmlFor="format">
              <select id="format" name="format" className={inputCls} defaultValue="online">
                <option value="online">Online — private video room</option>
                <option value="in_person">In person</option>
              </select>
            </Field>
            <label className="t-body-s flex items-center gap-2.5">
              <input type="checkbox" name="paid" className="size-4 accent-[#3F6B5E]" /> Already paid (cash or transfer)
            </label>
            {state.error && <p className="t-body-s text-warn">{state.error}</p>}
            <Button disabled={pending}>{pending ? "Adding…" : "Add session"}</Button>
          </form>
        </div>
      )}
    </>
  );
}
