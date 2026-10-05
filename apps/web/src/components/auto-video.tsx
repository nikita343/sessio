"use client";

import { useEffect, useRef } from "react";

/** A muted product clip that plays only while on screen, and never for reduced motion. */
export function AutoVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} className={className} />;
}

/** Browser-window frame around a product clip. */
export function ClipFrame({ src, poster, label, host = "app.usesessio.com" }: { src: string; poster: string; label: string; host?: string }) {
  return (
    <figure className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_30px_80px_-30px_rgba(28,37,48,.35)]">
      <div aria-hidden className="flex h-9 items-center gap-1.5 border-b border-line bg-paper px-4">
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="t-caption mx-auto rounded-full bg-surface px-4 py-0.5 text-stone">{host}</span>
      </div>
      <AutoVideo src={src} poster={poster} label={label} className="block aspect-[16/10] w-full bg-paper" />
    </figure>
  );
}
