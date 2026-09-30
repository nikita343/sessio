"use client";

import { useEffect, useState } from "react";

export function JoinButton({ href, startsAt, label }: { href: string; startsAt: string; label: string }) {
  const opensAt = new Date(startsAt).getTime() - 10 * 60_000;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(i);
  }, []);
  const open = now >= opensAt;
  const mins = Math.max(0, Math.round((opensAt - now) / 60_000));
  const wait = mins > 1440 ? `${Math.round(mins / 1440)} d` : mins > 90 ? `${Math.round(mins / 60)} h` : `${mins} min`;
  return open ? (
    <a href={href} className="t-label-m flex h-11 items-center justify-center rounded-full bg-sage text-white hover:bg-sage-hover">
      {label}
    </a>
  ) : (
    <span className="t-label-m flex h-11 items-center justify-center rounded-full bg-sunken text-stone" title="Opens 10 minutes before the session">
      {label} · {wait}
    </span>
  );
}
