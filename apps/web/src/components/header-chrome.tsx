"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";
import { DesktopMenu } from "@/components/nav-menu";
import { groupActive, type NavGroup } from "@/components/nav-data";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

function Burger({ open, onClick, className = "" }: { open: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-menu"
      className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface transition-colors hover:border-ink/30 lg:hidden ${className}`}
    >
      <span className="sr-only">Menu</span>
      <span aria-hidden className="relative block h-3 w-[18px]">
        <span className={`absolute left-0 h-[1.5px] w-full rounded-full bg-ink transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
        <span className={`absolute left-0 h-[1.5px] w-full rounded-full bg-ink transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
      </span>
    </button>
  );
}

/**
 * Mobile menu (full-screen sheet) + a compact header that slides in when the
 * reader scrolls back up. Rendered once per page by <Nav />.
 */
export function HeaderChrome({ items, current }: { items: NavGroup[]; current?: string }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [bar, setBar] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  // close on navigation
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
  }

  // lock scroll + Escape while open
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // show the compact bar when scrolling up past the hero
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const up = y < lastY.current - 4;
        const down = y > lastY.current + 4;
        if (y < 240) setBar(false);
        else if (up) setBar(true);
        else if (down) setBar(false);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  const overlay = (
    <>
      {/* compact bar */}
      <div
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${bar && !open ? "translate-y-0" : "-translate-y-full"}`}
        aria-hidden={!bar}
      >
        <div className="mx-auto mt-2 flex h-14 max-w-[1440px] items-center justify-between gap-3 px-3 md:px-12">
          <div className="flex h-14 w-full items-center justify-between gap-3 rounded-full border border-line bg-paper/95 pl-5 pr-1.5 shadow-[var(--shadow-card)]">
            <Link href="/" aria-label="Sessio home" tabIndex={bar ? 0 : -1}>
              <Logo size={24} />
            </Link>
            <DesktopMenu groups={items} current={current} tabbable={bar} className="relative hidden lg:block" />
            <div className="flex items-center gap-1.5">
              <Link href="/#waitlist" tabIndex={bar ? 0 : -1} className="t-label-m inline-flex h-11 items-center rounded-full bg-sage px-5 text-white hover:bg-sage-hover">
                <span className="sm:hidden lg:inline xl:hidden">Join</span>
                <span className="hidden sm:inline lg:hidden xl:inline">Join the waitlist</span>
              </Link>
              <Burger open={open} onClick={toggle} />
            </div>
          </div>
        </div>
      </div>

      {/* full-screen menu */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper transition-[opacity,visibility] duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/splash/hero.webp" alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-multiply" />
        <div className="relative flex h-[76px] shrink-0 items-center justify-between px-5">
          <Link href="/" aria-label="Sessio home" onClick={close}>
            <Logo size={28} />
          </Link>
          <Burger open={open} onClick={toggle} />
        </div>

        <nav className="relative flex flex-1 flex-col px-5 pt-2" aria-label="Main">
          {items.map((g, i) => {
            const on = groupActive(g, current);
            const anim = `border-b border-line transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;
            const delay = { transitionDelay: open ? `${80 + i * 50}ms` : "0ms" };
            const title = `font-display text-[30px] font-medium leading-tight tracking-[-0.05em] ${on ? "text-sage" : "text-ink"}`;
            if (!g.items) {
              return (
                <Link key={g.href} href={g.href} onClick={close} aria-current={current === g.href ? "page" : undefined} className={`group flex items-center justify-between py-3.5 ${anim}`} style={delay}>
                  <span className={title}>{g.label}</span>
                  <span aria-hidden className="flex size-9 items-center justify-center rounded-full border border-line-strong text-ink">
                    →
                  </span>
                </Link>
              );
            }
            return (
              <details key={g.label} className={`group/acc ${anim}`} style={delay} open={on || undefined}>
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 [&::-webkit-details-marker]:hidden">
                  <span className="flex flex-col">
                    <span className={title}>{g.label}</span>
                    <span className="t-body-s text-stone">{g.hint}</span>
                  </span>
                  <span aria-hidden className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink">
                    <span className="absolute h-[1.5px] w-3 bg-ink" />
                    <span className="absolute h-3 w-[1.5px] bg-ink transition-transform duration-300 group-open/acc:scale-y-0" />
                  </span>
                </summary>
                <ul className="grid gap-1 pb-4">
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <Link href={it.href} onClick={close} className="flex items-center gap-3 rounded-[14px] p-2 active:bg-surface">
                        {it.icon && (
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-sage">
                            <Icon name={it.icon} className="size-[18px]" />
                          </span>
                        )}
                        <span className="flex min-w-0 flex-col">
                          <span className="t-label-m text-ink">{it.label}</span>
                          <span className="t-caption truncate text-stone">{it.hint}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </nav>

        <div
          className={`relative flex flex-col gap-2.5 px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-8 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: open ? `${80 + items.length * 50}ms` : "0ms" }}
        >
          <Link href="/#waitlist" onClick={close} className="t-label-m flex h-12 items-center justify-center rounded-full bg-sage text-white">
            Become a founding therapist
          </Link>
          <div className="grid grid-cols-2 gap-2.5">
            <a href={`${APP_URL}/login`} className="t-label-m flex h-12 items-center justify-center rounded-full border border-line-strong bg-surface text-ink">
              Sign in
            </a>
            <a href={`${APP_URL}/anna-kowalska`} className="t-label-m flex h-12 items-center justify-center rounded-full border border-line-strong bg-surface text-ink">
              Try a booking page
            </a>
          </div>
          <p className="t-caption pt-2 text-center text-stone">149 zł a month, all-in · 0% commission · hosted in the EU</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Burger open={open} onClick={toggle} />
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
