import { PublicSkeletonShell } from "@/components/portal-skeleton";
import { Skeleton, SkeletonLine, SkeletonText } from "@/components/skeleton";

/** Mirrors [slug]/page.tsx inside <PublicShell>: profile summary left, booking calendar card right, details below. */
export default function Loading() {
  return (
    <PublicSkeletonShell>
      <div className="grid gap-6 pt-4 md:grid-cols-[minmax(0,1fr)_420px] md:gap-x-10 md:pt-8">
        {/* summary */}
        <section className="flex min-w-0 flex-col gap-5 md:col-start-1 md:row-start-1">
          <div className="flex items-center gap-5">
            <Skeleton className="size-24 shrink-0 rounded-[28px] md:size-32" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <SkeletonLine variant="heading" className="w-[min(320px,100%)] md:!text-[40px]" />
              <SkeletonLine variant="body-s" className="w-56 max-w-full" />
              <SkeletonLine variant="caption" className="w-32" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["w-36", "w-44", "w-28"].map((w, i) => (
              <Skeleton key={i} className={`h-8 rounded-full ${w}`} />
            ))}
          </div>
          <SkeletonText variant="body-l" lines={3} last="w-2/5" className="max-w-[600px]" />
          <div className="flex h-12 items-center gap-2">
            <Skeleton className="h-7 w-28 rounded-[10px]" />
            <SkeletonLine variant="body-s" className="w-28" />
          </div>
        </section>

        {/* booking */}
        <section className="min-w-0 self-start rounded-[24px] bg-surface p-5 shadow-[var(--shadow-card)] md:sticky md:top-6 md:col-start-2 md:row-span-2 md:row-start-1 md:p-6">
          <div className="flex flex-col gap-4">
            <SkeletonLine variant="overline" className="w-28" />
            <div className="-mx-1 flex gap-1.5 overflow-hidden px-1 pb-1">
              {Array.from({ length: 7 }, (_, i) => (
                <Skeleton key={i} className="h-[62px] w-[58px] shrink-0 rounded-[14px]" />
              ))}
            </div>
            <SkeletonLine variant="body-s" className="w-56" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }, (_, i) => (
                <Skeleton key={i} className="h-11 rounded-[12px]" />
              ))}
            </div>
            <Skeleton className="mt-1 h-12 rounded-full" />
            <div className="flex justify-center">
              <SkeletonLine variant="caption" className="w-64" />
            </div>
          </div>
        </section>

        {/* details */}
        <div className="flex min-w-0 flex-col gap-8 pb-6 md:col-start-1 md:row-start-2">
          {[4, 3].map((n, i) => (
            <section key={i} className="flex flex-col gap-3 border-t border-line pt-6">
              <SkeletonLine variant="title" className="w-36" />
              <SkeletonText variant="body-m" lines={n} last="w-1/2" className="max-w-[640px]" />
            </section>
          ))}
        </div>
      </div>
    </PublicSkeletonShell>
  );
}
