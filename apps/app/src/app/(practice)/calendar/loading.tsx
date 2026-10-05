import { Skeleton, SkeletonHeader, SkeletonLine, SkeletonScreen } from "@/components/skeleton";

// keep in sync with calendar/page.tsx
const START_H = 8;
const END_H = 21;
const PX = 56;
const HOURS = Array.from({ length: END_H - START_H }, (_, i) => START_H + i);

// a few placeholder sessions so the week doesn't read as empty: [day, start hour, length in h]
const BLOCKS: [number, number, number][] = [
  [0, 10, 0.85],
  [1, 14, 0.85],
  [2, 9, 0.85],
  [2, 16, 0.85],
  [3, 12, 0.85],
  [4, 17, 0.85],
];

/** Mirrors calendar/page.tsx: header with week nav, then the 7-day hour grid. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonHeader eyebrow="w-36" title="w-40" actions={["w-10", "w-[104px]", "w-10", "w-[132px]"]} />
      <div className="overflow-x-auto rounded-[16px] border border-line bg-surface">
        <div className="grid min-w-[760px] grid-cols-[52px_repeat(7,1fr)]">
          <div className="border-b border-line" />
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="border-b border-l border-line px-3 py-2.5">
              <SkeletonLine variant="caption" className="w-7" />
              <div className="flex h-[27px] items-center">
                <Skeleton className="h-4 w-5 rounded-[6px]" />
              </div>
            </div>
          ))}
          <div className="relative" style={{ height: HOURS.length * PX }}>
            {HOURS.slice(1).map((h) => (
              <Skeleton key={h} className="absolute right-2 h-2.5 w-7 -translate-y-1/2 rounded-full" style={{ top: (h - START_H) * PX }} />
            ))}
          </div>
          {Array.from({ length: 7 }, (_, d) => (
            <div key={d} className="relative border-l border-line" style={{ height: HOURS.length * PX }}>
              {HOURS.map((h) => (
                <div key={h} className="absolute inset-x-0 border-t border-line/60" style={{ top: (h - START_H) * PX }} />
              ))}
              {BLOCKS.filter(([day]) => day === d).map(([, h, len]) => (
                <Skeleton key={h} className="absolute inset-x-1 rounded-[10px]" style={{ top: (h - START_H) * PX + 1, height: len * PX - 2 }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <SkeletonLine variant="caption" className="w-[min(520px,90%)]" />
    </SkeletonScreen>
  );
}
