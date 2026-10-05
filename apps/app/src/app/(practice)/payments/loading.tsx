import { Card } from "@/components/ui";
import { Skeleton, SkeletonBadge, SkeletonButton, SkeletonHeader, SkeletonLine, SkeletonScreen, SkeletonText } from "@/components/skeleton";

/** Mirrors payments/page.tsx: header, two totals + payouts card, then the payment rows. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonHeader eyebrow={false} title="w-40" />
      <div className="grid gap-3 md:grid-cols-3">
        {["w-20", "w-16"].map((w, i) => (
          <Card key={i} className="p-5">
            <SkeletonLine variant="overline" className={w} />
            <div className="mt-1 flex h-[42px] items-center">
              <Skeleton className="h-6 w-28 rounded-[10px]" />
            </div>
          </Card>
        ))}
        <Card className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between gap-2">
            <SkeletonLine variant="overline" className="w-16" />
            <SkeletonBadge className="w-20" />
          </div>
          <SkeletonText variant="label" lines={2} last="w-2/3" />
          <SkeletonText variant="caption" lines={2} last="w-1/2" />
          <SkeletonButton size="sm" className="mt-1 w-32" />
        </Card>
      </div>
      <Card className="overflow-hidden">
        <ul className="divide-y divide-line">
          {["w-36", "w-28", "w-40", "w-32", "w-36", "w-28"].map((w, i) => (
            <li key={i} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
              <div className="min-w-[160px] flex-1">
                <SkeletonLine variant="label" className={w} />
                <SkeletonLine variant="caption" className="w-40" />
              </div>
              <span className="hidden md:block">
                <SkeletonLine variant="caption" className="w-16" />
              </span>
              <SkeletonBadge className="w-12" />
              <div className="flex w-24 justify-end">
                <SkeletonLine variant="label" className="w-16" />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </SkeletonScreen>
  );
}
