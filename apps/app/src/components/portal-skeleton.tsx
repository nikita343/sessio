import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "./logo";
import { Skeleton, SkeletonAvatar, SkeletonScreen } from "./skeleton";

/**
 * Loading-state twin of <PortalShell>: same splash backdrop, header bar (logo · tab pill · avatar)
 * and content width, so the real portal page swaps in without the frame moving.
 */
export function PortalSkeletonShell({ current, children }: { current: "sessions" | "messages"; children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none fixed object-cover opacity-50 mix-blend-multiply" />
      <header className="relative z-10 mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-3 px-5" aria-hidden="true">
        <Logo size={24} />
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/90 p-1">
          {(["sessions", "messages"] as const).map((k) => (
            <div key={k} className={`h-8 w-[84px] rounded-full sm:w-[96px] ${current === k ? "bg-ink" : ""}`} />
          ))}
        </div>
        <SkeletonAvatar size={34} />
      </header>
      <SkeletonScreen className="relative mx-auto max-w-[1040px] px-5 pb-20">{children}</SkeletonScreen>
    </div>
  );
}

/** Loading-state twin of <PublicShell> (public booking pages): splash, logo left, language pill right. */
export function PublicSkeletonShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-paper">
      <Image src="/splash/hero.webp" alt="" fill priority className="pointer-events-none fixed object-cover opacity-70 mix-blend-multiply" />
      <header className="relative mx-auto flex h-16 max-w-[1040px] items-center justify-between px-5" aria-hidden="true">
        <Logo size={24} />
        <Skeleton className="h-9 w-[92px] rounded-full" />
      </header>
      <SkeletonScreen className="relative mx-auto max-w-[1040px] px-5 pb-16">{children}</SkeletonScreen>
    </div>
  );
}
