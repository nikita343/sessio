import { Card } from "@/components/ui";
import { Skeleton, SkeletonAvatar, SkeletonButton, SkeletonHeader, SkeletonLine, SkeletonScreen } from "@/components/skeleton";

// [side, line widths] — client bubbles on the left, assistant / you on the right
const BUBBLES: ["start" | "end", string[]][] = [
  ["start", ["w-64", "w-48"]],
  ["end", ["w-56"]],
  ["start", ["w-72", "w-60", "w-32"]],
  ["end", ["w-52", "w-40"]],
];

/** Mirrors inbox/page.tsx: header, thread list (left) and the open conversation with reply box (right). */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonHeader eyebrow="w-[min(560px,90%)]" title="w-28" />
      <div className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {["w-28", "w-32", "w-24", "w-36", "w-28"].map((w, i) => (
              <li key={i} className={`flex gap-3 px-4 py-3 ${i === 0 ? "bg-sage-soft/60" : ""}`}>
                <SkeletonAvatar size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <SkeletonLine variant="label" className={w} />
                    <SkeletonLine variant="caption" className="w-10" />
                  </div>
                  <SkeletonLine variant="caption" className="w-full" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <SkeletonLine variant="title" className="w-40" />
            <SkeletonLine variant="caption" className="w-36" />
          </div>
          <div className="flex flex-col gap-2">
            {BUBBLES.map(([side, lines], i) => (
              <div
                key={i}
                className={`flex max-w-[85%] flex-col rounded-2xl px-3.5 py-2.5 ${side === "start" ? "self-start rounded-bl-md bg-paper" : "self-end rounded-br-md bg-lavender-soft"}`}
              >
                <SkeletonLine variant="caption" className="w-24" />
                {lines.map((w, j) => (
                  <SkeletonLine key={j} variant="body-s" className={`${w} max-w-full`} />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-[95px] w-full rounded-[10px]" />
            <div className="flex justify-end">
              <SkeletonButton className="w-[116px]" />
            </div>
          </div>
        </Card>
      </div>
    </SkeletonScreen>
  );
}
