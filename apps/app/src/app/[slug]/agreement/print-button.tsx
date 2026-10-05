"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="t-label-m h-9 rounded-full border border-line-strong px-4 hover:border-ink/30">
      {label}
    </button>
  );
}
