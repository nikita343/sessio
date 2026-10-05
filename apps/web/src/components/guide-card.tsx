import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@/content/guides";

const TONE = {
  sage: { bg: "bg-sage-soft", ink: "text-sage", splash: "/splash/card-sage.webp" },
  lavender: { bg: "bg-lavender-soft", ink: "text-[#5b5299]", splash: "/splash/card-lavender.webp" },
  sky: { bg: "bg-[#e3eef4]", ink: "text-[#3d6a80]", splash: "/splash/card-sky.webp" },
  clay: { bg: "bg-clay-soft", ink: "text-clay", splash: "/splash/card-sage.webp" },
};

export function GuideThumb({ g, sizes, priority = false, big = false }: { g: Guide; sizes: string; priority?: boolean; big?: boolean }) {
  const t = TONE[g.tone];
  return (
    <div className={`relative aspect-[16/10] overflow-hidden rounded-[18px] ${t.bg}`}>
      {g.poster ? (
        <Image src={g.poster} alt="" fill sizes={sizes} priority={priority} className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
      ) : (
        <>
          <Image src={t.splash} alt="" fill sizes={sizes} className="object-cover opacity-70 mix-blend-multiply" />
          <ol aria-hidden className="absolute inset-0 flex flex-col justify-center gap-2 p-[8%]">
            {g.steps.slice(0, 4).map((s, i) => (
              <li key={s.title} className="flex items-center gap-3 rounded-full bg-surface/85 py-1.5 pl-1.5 pr-4 shadow-sm" style={{ marginLeft: `${i * 4}%` }}>
                <span className={`t-caption flex size-6 shrink-0 items-center justify-center rounded-full bg-paper font-medium ${t.ink}`}>{i + 1}</span>
                <span className={`truncate ${big ? "t-label-m" : "t-caption"} text-ink`}>{s.title}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      <span className="t-caption absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-white backdrop-blur-sm">
        {g.video ? (
          <svg viewBox="0 0 12 12" aria-hidden className="size-2.5">
            <path d="M3 1.8v8.4L10 6 3 1.8Z" fill="currentColor" />
          </svg>
        ) : null}
        {g.kind === "Video" ? g.minutes : `${g.minutes} read`}
      </span>
    </div>
  );
}

export function GuideCard({ g }: { g: Guide }) {
  return (
    <Link href={`/guides/${g.slug}`} data-reveal className="group flex flex-col gap-3">
      <GuideThumb g={g} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="t-overline text-stone">{g.audience}</span>
        <span aria-hidden className="size-1 rounded-full bg-line-strong" />
        <span className="t-overline text-stone">{g.kind}</span>
      </div>
      <h3 className="t-title-m group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{g.title}</h3>
      <p className="t-body-s text-stone">{g.dek}</p>
    </Link>
  );
}
