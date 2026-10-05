import { Card } from "@/components/ui";
import { Skeleton, SkeletonButton, SkeletonHeader, SkeletonLine, SkeletonScreen, SkeletonText } from "@/components/skeleton";

function Field({ label = "w-24", tall = false }: { label?: string; tall?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <SkeletonLine variant="label" className={label} />
      <Skeleton className={`w-full rounded-[10px] ${tall ? "h-[120px]" : "h-11"}`} />
    </div>
  );
}

function SectionTitle({ title = "w-28", body = "w-72" }: { title?: string; body?: string }) {
  return (
    <div>
      <SkeletonLine variant="title" className={title} />
      <SkeletonLine variant="body-s" className={`${body} max-w-full`} />
    </div>
  );
}

/** Mirrors booking-page/page.tsx: header with link actions, PracticeForm cards (about / session / hours), then the profile card. */
export default function Loading() {
  return (
    <SkeletonScreen className="flex flex-col gap-6">
      <SkeletonHeader eyebrow="w-48" title="w-56" actions={["w-[108px]", "w-[124px]"]} />

      <div className="flex max-w-[820px] flex-col gap-6">
        <Card className="flex flex-col gap-5 p-6">
          <SectionTitle title="w-24" body="w-64" />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="w-20" />
            <Field label="w-24" />
            <Field label="w-16" />
            <Field label="w-28" />
          </div>
          <Field label="w-20" tall />
          <div className="grid gap-5 md:grid-cols-2">
            {[3, 2].map((n, i) => (
              <div key={i} className="flex flex-col gap-2">
                <SkeletonLine variant="label" className="mb-1.5 w-20" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: n }, (_, j) => (
                    <Skeleton key={j} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-5 p-6">
          <SectionTitle title="w-28" body="w-80" />
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="w-16" />
            <Field label="w-20" />
            <Field label="w-24" />
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <SectionTitle title="w-32" body="w-[22rem]" />
          <div className="flex flex-col divide-y divide-line">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex min-h-12 flex-wrap items-center gap-3 py-2">
                <div className="flex w-28 items-center gap-2.5">
                  <Skeleton className="size-4 rounded-[4px]" />
                  <SkeletonLine variant="label" className="w-16" />
                </div>
                {i < 5 ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-11 w-28 rounded-[10px]" />
                    <Skeleton className="h-11 w-28 rounded-[10px]" />
                  </div>
                ) : (
                  <SkeletonLine variant="body-s" className="w-20" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="max-w-[820px]">
        <Card className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-1">
            <SkeletonLine variant="title" className="w-28" />
            <SkeletonText lines={2} last="w-1/2" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="w-40" />
            <Field label="w-36" />
          </div>
          <Field label="w-48" tall />
          <div className="flex justify-end">
            <SkeletonButton className="w-28" />
          </div>
        </Card>
      </div>
    </SkeletonScreen>
  );
}
