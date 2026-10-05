export function FaqList({ items, start = 1 }: { items: { q: string; a: string }[]; start?: number }) {
  return (
    <div className="flex flex-col border-t border-line">
      {items.map((i, k) => (
        <details key={i.q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 md:gap-8 md:py-6 [&::-webkit-details-marker]:hidden">
            <span className="t-label-m w-7 shrink-0 pt-1 text-stone tabular-nums md:w-10">{String(start + k).padStart(2, "0")}</span>
            <span className="t-title-m flex-1 pt-0.5 md:text-[20px]">{i.q}</span>
            <span aria-hidden className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors group-open:border-sage group-open:bg-sage">
              <span className="absolute h-[1.5px] w-3 bg-ink group-open:bg-white" />
              <span className="absolute h-3 w-[1.5px] bg-ink transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="t-body-m max-w-[680px] pb-6 pl-11 pr-12 text-stone md:pl-[72px]">{i.a}</p>
        </details>
      ))}
    </div>
  );
}
