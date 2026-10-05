"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

export type NavItem = [label: string, href: string, hint: string];

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
export function HeaderChrome({ items, current }: { items: NavItem[]; current?: string }) {
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
            <nav className="hidden items-center gap-6 lg:flex">
              {items.map(([label, href]) => (
                <Link key={href} href={href} tabIndex={bar ? 0 : -1} className={`t-label-m ${current === href ? "text-ink" : "text-ink/70 hover:text-ink"}`}>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1.5">
              <Link href="/#waitlist" tabIndex={bar ? 0 : -1} className="t-label-m inline-flex h-11 items-center rounded-full bg-sage px-5 text-white hover:bg-sage-hover">
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">Join the waitlist</span>
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

        <nav className="relative flex flex-1 flex-col px-5 pt-4" aria-label="Main">
          {items.map(([label, href, hint], i) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              aria-current={current === href ? "page" : undefined}
              className={`group flex items-center justify-between border-b border-line py-4 transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
            >
              <span className="flex flex-col gap-0.5">
                <span className={`font-display text-[32px] font-medium leading-tight tracking-[-0.05em] ${current === href ? "text-sage" : "text-ink"}`}>{label}</span>
                <span className="t-body-s text-stone">{hint}</span>
              </span>
              <span aria-hidden className="flex size-10 items-center justify-center rounded-full border border-line-strong text-ink transition-transform group-active:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
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
