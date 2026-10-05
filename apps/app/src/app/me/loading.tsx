import { PortalSkeletonShell } from "@/components/portal-skeleton";
import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonButton, SkeletonLine, SkeletonText } from "@/components/skeleton";

/** Mirrors me/page.tsx inside <PortalShell>: greeting, next-session card, past list, therapists aside. */
export default function Loading() {
  return (
    <PortalSkeletonShell current="sessions">
      <div className="flex flex-col gap-1 pt-6 md:pt-10">
        <SkeletonLine variant="display" className="w-[min(360px,80%)] !text-[clamp(34px,5vw,48px)]" />
        <SkeletonLine variant="body-m" className="w-48" />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* next session */}
          <section className="overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-6 p-5 sm:flex-row sm:p-7">
              <div className="flex shrink-0 flex-row items-center gap-4 sm:w-[132px] sm:flex-col sm:items-start sm:gap-1">
                <SkeletonLine variant="overline" className="w-16" />
                <div className="flex h-14 items-center">
                  <Skeleton className="h-11 w-14 rounded-[12px]" />
                </div>
                <div className="flex flex-col">
                  <SkeletonLine variant="body-s" className="w-20" />
                  <span className="hidden sm:block">
                    <SkeletonLine variant="body-s" className="w-16" />
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex h-[39px] items-center">
                    <Skeleton className="h-6 w-36 rounded-[10px]" />
                  </div>
                  <SkeletonBadge className="w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size={44} />
                  <div className="min-w-0 flex-1">
                    <SkeletonLine variant="title" className="w-44" />
                    <SkeletonLine variant="body-s" className="w-56 max-w-full" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SkeletonButton size="lg" className="w-full sm:w-[220px]" />
                  <SkeletonButton size="lg" className="w-[148px]" />
                  <SkeletonButton size="lg" className="w-[96px]" />
                </div>
                <SkeletonLine variant="caption" className="w-64 max-w-full" />
              </div>
            </div>
          </section>

          {/* past */}
          <section className="flex flex-col gap-3">
            <SkeletonLine variant="overline" className="w-24" />
            <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
              {["w-44", "w-40", "w-48"].map((w, i) => (
                <li key={i} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <SkeletonLine variant="label" className={w} />
                    <SkeletonLine variant="caption" className="w-32" />
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden sm:inline">
                      <SkeletonBadge className="w-14" />
                    </span>
                    <SkeletonLine variant="label" className="w-14" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* therapists */}
        <aside className="flex flex-col gap-3">
          <SkeletonLine variant="overline" className="w-32" />
          <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <SkeletonAvatar size={44} />
              <SkeletonLine variant="title" className="w-36" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SkeletonButton className="w-full" />
              <SkeletonButton className="w-full" />
            </div>
          </div>
          <div className="flex gap-2 rounded-[16px] bg-sage-soft/70 p-4">
            <SkeletonText variant="caption" lines={3} last="w-1/2" className="flex-1" />
          </div>
        </aside>
      </div>
    </PortalSkeletonShell>
  );
}
