import { Card } from "@/components/ui";
import { Skeleton, SkeletonButton, SkeletonHeader, SkeletonLine, SkeletonScreen, SkeletonText } from "@/components/skeleton";

/** Mirrors settings/page.tsx: key/value card, client agreement card, privacy card, sign-out button. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex max-w-[720px] flex-col gap-6">
      <SkeletonHeader eyebrow={false} title="w-36" />
      <Card className="divide-y divide-line">
        {[
          ["w-16", "w-44"],
          ["w-20", "w-28"],
          ["w-16", "w-10"],
          ["w-28", "w-36"],
          ["w-24", "w-52"],
          ["w-28", "w-64"],
        ].map(([k, v], i) => (
          <div key={i} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
            <SkeletonLine variant="body-s" className={k} />
            <SkeletonLine variant="label" className={`${v} max-w-full`} />
          </div>
        ))}
      </Card>
      <Card className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <SkeletonLine variant="title" className="w-40" />
            <SkeletonText lines={4} last="w-2/5" className="mt-1" />
          </div>
          <SkeletonLine variant="label" className="w-16" />
        </div>
        <div className="flex flex-col gap-2">
          <SkeletonLine variant="label" className="w-64 max-w-full" />
          <Skeleton className="h-[120px] w-full rounded-[10px]" />
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine variant="caption" className="w-[min(380px,60%)]" />
            <SkeletonButton className="w-[76px]" />
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-2 p-6">
        <SkeletonLine variant="title" className="w-20" />
        <SkeletonText lines={4} last="w-1/3" />
      </Card>
      <SkeletonButton className="w-[96px]" />
    </SkeletonScreen>
  );
}
