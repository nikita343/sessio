import { Card } from "@/components/ui";
import { SkeletonBadge, SkeletonHeader, SkeletonLine, SkeletonScreen } from "@/components/skeleton";

/** Mirrors notes/page.tsx: header, then the list of session records. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonHeader eyebrow="w-[min(380px,80%)]" title="w-28" />
      <Card className="overflow-hidden">
        <ul className="divide-y divide-line">
          {["w-52", "w-44", "w-56", "w-48", "w-40", "w-52"].map((w, i) => (
            <li key={i} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
              <div className="min-w-[180px] flex-1">
                <SkeletonLine variant="label" className={`${w} max-w-full`} />
                <SkeletonLine variant="caption" className="w-40" />
              </div>
              <SkeletonBadge className={i % 3 === 1 ? "w-12" : "w-[84px]"} />
            </li>
          ))}
        </ul>
      </Card>
    </SkeletonScreen>
  );
}
