import { Skeleton, SkeletonBadge, SkeletonButton, SkeletonLine, SkeletonScreen, SkeletonText } from "@/components/skeleton";

/** Mirrors notes/[id]/page.tsx + editor.tsx: breadcrumb + title, then voice memo (left) and record editor (right). */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <div>
        <SkeletonLine variant="caption" className="w-32" />
        <SkeletonLine variant="heading" className="w-[min(420px,90%)] !text-[36px]" />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
        {/* voice memo */}
        <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6">
          <Skeleton className="h-7 w-44 rounded-full" />
          <div className="flex items-center justify-between">
            <SkeletonLine variant="title" className="w-36" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-3 rounded-[14px] bg-paper p-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <SkeletonLine variant="body-s" className="w-48" />
          </div>
          <div className="flex flex-col gap-2">
            <SkeletonLine variant="overline" className="w-20" />
            <Skeleton className="h-[193px] w-full rounded-[10px]" />
            <SkeletonButton className="w-full" />
          </div>
          <SkeletonText variant="caption" lines={3} last="w-2/5" />
        </section>

        {/* record */}
        <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SkeletonLine variant="title" className="w-36" />
            <SkeletonBadge className="w-40" />
          </div>
          <SkeletonLine variant="overline" className="w-72 max-w-full" />
          <div className="grid gap-2 sm:grid-cols-2">
            {["w-28", "w-40", "w-44", "w-48"].map((w, i) => (
              <div key={i} className="rounded-[12px] bg-paper px-3.5 py-2.5">
                <SkeletonLine variant="caption" className="w-16" />
                <SkeletonLine variant="body-s" className={`${w} max-w-full`} />
              </div>
            ))}
          </div>
          <Skeleton className="h-[227px] w-full rounded-[10px]" />
          <SkeletonLine variant="overline" className="w-64 max-w-full" />
          <Skeleton className="h-[95px] w-full rounded-[10px]" />
          <SkeletonText variant="caption" lines={2} last="w-3/5" />
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
            <SkeletonButton className="w-[128px]" />
            <SkeletonButton className="w-[136px]" />
          </div>
        </section>
      </div>
    </SkeletonScreen>
  );
}
