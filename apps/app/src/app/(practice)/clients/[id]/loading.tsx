import { Card } from "@/components/ui";
import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonButton, SkeletonLine, SkeletonScreen } from "@/components/skeleton";

/** Mirrors clients/[id]/page.tsx: back link, client header, 3 stats, sessions list + messages card. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonLine variant="label" className="w-20" />
      <div className="flex flex-wrap items-center gap-4">
        <SkeletonAvatar size={56} />
        <div className="flex-1">
          <SkeletonLine variant="heading" className="w-56 max-w-full" />
          <SkeletonLine variant="body-s" className="w-[min(420px,100%)]" />
        </div>
        <SkeletonButton className="w-[84px]" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["w-24", "w-20", "w-28"].map((w, i) => (
          <Card key={i} className="p-5">
            <SkeletonLine variant="overline" className={`${w} max-w-full`} />
            <div className="mt-1 flex h-[39px] items-center">
              <Skeleton className="h-6 w-16 rounded-[10px]" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <SkeletonLine variant="title" className="w-24" />
          </div>
          <ul className="divide-y divide-line">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                <div className="min-w-[160px] flex-1">
                  <SkeletonLine variant="label" className="w-48" />
                  <SkeletonLine variant="caption" className="w-36" />
                </div>
                <SkeletonBadge className="w-14" />
                <SkeletonButton size="sm" className="w-[92px]" />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="flex flex-col gap-3 p-5">
          <SkeletonLine variant="title" className="w-24" />
          {["bg-paper", "bg-lavender-soft", "bg-sage-soft"].map((bg, i) => (
            <div key={i} className={`rounded-2xl px-3.5 py-2.5 ${bg}`}>
              <SkeletonLine variant="caption" className="w-24" />
              <SkeletonLine variant="body-s" className="w-full" />
              <SkeletonLine variant="body-s" className={i === 1 ? "w-1/2" : "w-3/4"} />
            </div>
          ))}
          <SkeletonLine variant="label" className="w-24" />
        </Card>
      </div>
    </SkeletonScreen>
  );
}
