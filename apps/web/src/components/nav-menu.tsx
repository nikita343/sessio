import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { groupActive, type NavGroup } from "@/components/nav-data";

/**
 * Desktop navigation with dropdown panels. Pure CSS (hover + focus-within), so it works before
 * hydration and needs no state. Panels position against the <nav> itself and stay centred under it.
 */
export function DesktopMenu({ groups, current, className = "", tabbable = true }: { groups: NavGroup[]; current?: string; className?: string; tabbable?: boolean }) {
  const tab = tabbable ? undefined : -1;
  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center gap-1">
        {groups.map((g) => {
          const on = groupActive(g, current);
          const label = `t-label-m inline-flex h-9 items-center gap-1 rounded-full px-3.5 transition-colors ${on ? "text-ink" : "text-ink/70 hover:text-ink"}`;
          if (!g.items) {
            return (
              <li key={g.label}>
                <Link href={g.href} tabIndex={tab} aria-current={current === g.href ? "page" : undefined} className={label}>
                  {g.label}
                </Link>
              </li>
            );
          }
          const wide = g.items.length > 4;
          return (
            <li key={g.label} className="group/item">
              <button type="button" tabIndex={tab} aria-haspopup="true" className={`${label} group-hover/item:bg-sunken/80 group-focus-within/item:bg-sunken/80`}>
                {g.label}
                <svg viewBox="0 0 12 12" aria-hidden className="size-3 transition-transform duration-300 group-hover/item:rotate-180 group-focus-within/item:rotate-180">
                  <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,translate,visibility] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100 ${wide ? "w-[860px]" : "w-[680px]"}`}
              >
                <div className="grid grid-cols-[1fr_260px] gap-2 rounded-[24px] border border-line bg-surface p-2 shadow-[0_24px_60px_-20px_rgba(28,37,48,.28)]">
                  <ul className={`grid content-start gap-1 p-2 ${wide ? "grid-cols-2" : "grid-cols-1"}`}>
                    {g.items.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} tabIndex={tab} className="group/link flex gap-3.5 rounded-[16px] p-3 transition-colors hover:bg-paper focus-visible:bg-paper">
                          {it.icon && (
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-paper text-sage transition-colors group-hover/link:border-sage/30 group-hover/link:bg-sage-soft">
                              <Icon name={it.icon} />
                            </span>
                          )}
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="t-label-m text-ink">{it.label}</span>
                            <span className="t-caption text-stone">{it.hint}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {g.feature && (
                    <a href={g.feature.href} tabIndex={tab} className="group/feat relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[18px] p-4 text-white">
                      <Image src={g.feature.image} alt="" fill sizes="260px" className="object-cover transition-transform duration-700 group-hover/feat:scale-[1.04]" />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/0" />
                      <span className="relative t-overline text-white/70">{g.feature.eyebrow}</span>
                      <span className="relative t-title-m mt-1">{g.feature.title}</span>
                      <span className="relative t-label-m mt-3 inline-flex items-center gap-1.5 text-white/90">
                        {g.feature.cta} <span aria-hidden className="transition-transform group-hover/feat:translate-x-0.5">→</span>
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
