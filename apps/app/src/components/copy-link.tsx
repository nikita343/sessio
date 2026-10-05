"use client";

import { useState } from "react";
import { btn } from "./ui";
import type { Lang } from "@/lib/i18n";
import { COPY_T } from "@/lib/ui/booking";

export function CopyLink({ url, label, className = "", lang = "pl" }: { url: string; label?: string; className?: string; lang?: Lang }) {
  const t = COPY_T[lang] ?? COPY_T.pl;
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={btn("secondary", "md", className)}
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? t.copied : (label ?? t.copyBooking)}
    </button>
  );
}
