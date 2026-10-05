import { Card } from "@/components/ui";
import { Skeleton, SkeletonBadge, SkeletonButton, SkeletonLine, SkeletonScreen } from "@/components/skeleton";

/** Mirrors dashboard/page.tsx: greeting header, 4 stat cards, today list + dark "Handled for you" panel. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SkeletonLine variant="caption" className="w-36" />
          <SkeletonLine variant="heading" className="w-[min(340px,80vw)] !text-[36px]" />
        </div>
        <div className="flex gap-2">
          <SkeletonButton className="w-[164px]" />
          <SkeletonButton className="w-[132px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {["w-12", "w-16", "w-24", "w-16"].map((w, i) => (
          <Card key={i} className="flex flex-col gap-1.5 p-5">
            <SkeletonLine variant="overline" className={w} />
            <div className="flex h-[42px] items-center">
              <Skeleton className="h-6 w-28 rounded-[10px]" />
            </div>
            <SkeletonLine variant="caption" className="w-3/4" />
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <SkeletonLine variant="title" className="w-20" />
            <SkeletonLine variant="label" className="w-28" />
          </div>
          <ul className="divide-y divide-line">
            {["w-32", "w-40", "w-28", "w-36"].map((w, i) => (
              <li key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-[30px] w-14 shrink-0 items-center">
                  <Skeleton className="h-4 w-12 rounded-[6px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <SkeletonLine variant="label" className={w} />
                  <SkeletonLine variant="caption" className="w-44 max-w-full" />
                </div>
                <SkeletonBadge className="w-12" />
                <div className="flex w-[104px] justify-end">
                  <SkeletonLine variant="label" className="w-16" />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-4 rounded-[20px] bg-ink p-6">
          <SkeletonLine variant="overline" tone="dark" className="w-32" />
          <ul className="flex flex-col divide-y divide-white/10">
            {["w-full", "w-4/5", "w-11/12"].map((w, i) => (
              <li key={i} className="py-3 first:pt-0">
                <SkeletonLine variant="body-s" tone="dark" className={w} />
                <SkeletonLine variant="caption" tone="dark" className="mt-0.5 w-16" />
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1">
            <SkeletonLine variant="caption" tone="dark" className="w-full" />
            <SkeletonLine variant="caption" tone="dark" className="w-2/3" />
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}
