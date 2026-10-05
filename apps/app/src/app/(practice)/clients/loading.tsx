import { Card } from "@/components/ui";
import { Skeleton, SkeletonAvatar, SkeletonHeader, SkeletonLine, SkeletonScreen } from "@/components/skeleton";

const ROWS = ["w-32", "w-40", "w-28", "w-36", "w-44", "w-32", "w-36", "w-28"];

/** Mirrors clients/page.tsx: header, search pill, table card with column header + rows. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonHeader eyebrow="w-20" title="w-36" />
      <Skeleton className="h-10 w-full max-w-sm rounded-full" />
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_0.6fr_0.8fr_0.8fr] gap-4 border-b border-line px-6 py-3 md:grid">
          {["w-12", "w-10", "w-16", "w-8", "w-8"].map((w, i) => (
            <SkeletonLine key={i} variant="overline" className={w} />
          ))}
        </div>
        <ul className="divide-y divide-line">
          {ROWS.map((w, i) => (
            <li key={i} className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 md:grid-cols-[1.4fr_1fr_0.6fr_0.8fr_0.8fr]">
              <span className="flex items-center gap-3">
                <SkeletonAvatar size={32} />
                <span className="flex flex-col">
                  <SkeletonLine variant="label" className={w} />
                  <SkeletonLine variant="caption" className="w-14" />
                </span>
              </span>
              <span className="hidden md:block">
                <SkeletonLine variant="body-s" className="w-4/5" />
              </span>
              <SkeletonLine variant="body-s" className="w-5" />
              <span className="hidden md:block">
                <SkeletonLine variant="body-s" className="w-12" />
              </span>
              <span className="hidden md:block">
                <SkeletonLine variant="body-s" className="w-28" />
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </SkeletonScreen>
  );
}
