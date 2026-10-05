import { PortalSkeletonShell } from "@/components/portal-skeleton";
import { Skeleton, SkeletonAvatar, SkeletonButton, SkeletonLine } from "@/components/skeleton";

// therapist / assistant on the left, the client ("you") on the right
const BUBBLES: ["start" | "end", string[]][] = [
  ["start", ["w-60", "w-40"]],
  ["end", ["w-52"]],
  ["start", ["w-64", "w-56", "w-28"]],
  ["end", ["w-44", "w-36"]],
];

/** Mirrors me/messages/page.tsx inside <PortalShell>: title, thread list and the open conversation. */
export default function Loading() {
  return (
    <PortalSkeletonShell current="messages">
      <div className="pt-6 md:pt-10">
        <SkeletonLine variant="display" className="w-[min(280px,70%)] !text-[clamp(32px,4.5vw,44px)]" />
      </div>
      <div className="mt-6 grid items-start gap-4 md:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
          <ul className="divide-y divide-line">
            {["w-32", "w-28", "w-36"].map((w, i) => (
              <li key={i} className={`flex gap-3 px-4 py-3.5 ${i === 0 ? "bg-sage-soft/60" : ""}`}>
                <SkeletonAvatar size={36} />
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
        </div>

        <section className="hidden min-w-0 flex-col rounded-[20px] border border-line bg-surface md:flex">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <SkeletonAvatar size={32} />
            <SkeletonLine variant="title" className="w-40" />
            <SkeletonLine variant="label" className="ml-auto w-24" />
          </div>
          <div className="flex min-h-[240px] flex-col gap-2 px-4 py-4">
            {BUBBLES.map(([side, lines], i) => (
              <div
                key={i}
                className={`flex max-w-[85%] flex-col rounded-2xl px-3.5 py-2.5 ${side === "end" ? "self-end rounded-br-md bg-ink" : "self-start rounded-bl-md bg-paper"}`}
              >
                <SkeletonLine variant="caption" tone={side === "end" ? "dark" : "default"} className="w-24" />
                {lines.map((w, j) => (
                  <SkeletonLine key={j} variant="body-s" tone={side === "end" ? "dark" : "default"} className={`${w} max-w-full`} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-line p-3">
            <Skeleton className="h-[70px] w-full rounded-[14px]" />
            <div className="flex items-center justify-between gap-3">
              <SkeletonLine variant="caption" className="w-[min(300px,60%)]" />
              <SkeletonButton className="w-24" />
            </div>
          </div>
        </section>
      </div>
    </PortalSkeletonShell>
  );
}
