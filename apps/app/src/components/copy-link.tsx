"use client";

import { useState } from "react";
import { btn } from "./ui";

export function CopyLink({ url, label = "Copy booking link", className = "" }: { url: string; label?: string; className?: string }) {
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
      {done ? "Copied ✓" : label}
    </button>
  );
}
