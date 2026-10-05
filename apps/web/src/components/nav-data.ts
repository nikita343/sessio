export const APP = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

export type NavLink = { label: string; href: string; hint: string; icon?: IconName };
export type NavFeature = { eyebrow: string; title: string; href: string; image: string; cta: string };
export type NavGroup = {
  label: string;
  href: string;
  hint: string;
  items?: NavLink[];
  feature?: NavFeature;
};

export type IconName = "calendar" | "video" | "mic" | "chat" | "shield" | "card" | "user" | "heart" | "compass" | "book" | "play" | "live" | "help" | "spark";

export const NAV: NavGroup[] = [
  {
    label: "Product",
    href: "/product",
    hint: "Booking, video, notes and the assistant",
    items: [
      { label: "Booking page", href: "/product/booking", hint: "Your own link, real free times", icon: "calendar" },
      { label: "Payments", href: "/product/payments", hint: "BLIK, card, P24 — straight to you", icon: "card" },
      { label: "Private video room", href: "/product/video", hint: "Encrypted, direct, never recorded", icon: "video" },
      { label: "Voice-memo notes", href: "/product/notes", hint: "Two minutes, a record to sign", icon: "mic" },
      { label: "Admin assistant", href: "/product/assistant", hint: "Answers clients day and night", icon: "chat" },
      { label: "Client portal", href: "/product/client-portal", hint: "Clients move sessions and write to you", icon: "heart" },
      { label: "Client agreements", href: "/product/agreements", hint: "Accepted at booking, stored per session", icon: "book" },
      { label: "Privacy & security", href: "/privacy", hint: "EU hosting, DPA, no recordings", icon: "shield" },
    ],
    feature: {
      eyebrow: "Live demo",
      title: "Book a session the way your clients will.",
      href: `${APP}/anna-kowalska`,
      image: "/photos/booking.webp",
      cta: "Open a booking page",
    },
  },
  {
    label: "Who it's for",
    href: "/use-cases",
    hint: "Therapists, clients and the stories behind them",
    items: [
      { label: "For therapists", href: "/for-therapists", hint: "Psychologists, psychotherapists, coaches in private practice", icon: "user" },
      { label: "For clients", href: "/for-clients", hint: "What booking and sessions look like from your side", icon: "heart" },
      { label: "Use cases", href: "/use-cases", hint: "Four practices, the same quiet Monday", icon: "compass" },
    ],
    feature: {
      eyebrow: "Client portal",
      title: "Clients see their sessions, move them and write to you.",
      href: "/for-clients",
      image: "/photos/online.webp",
      cta: "See the client side",
    },
  },
  {
    label: "Resources",
    href: "/guides",
    hint: "Blog, video guides, webinars and FAQ",
    items: [
      { label: "Blog", href: "/blog", hint: "The new Act, money and privacy", icon: "book" },
      { label: "Guides", href: "/guides", hint: "Short videos of every flow", icon: "play" },
      { label: "Webinars", href: "/webinars", hint: "Free live sessions, with Q&A", icon: "live" },
      { label: "FAQ", href: "/faq", hint: "Answers for therapists and clients", icon: "help" },
    ],
    feature: {
      eyebrow: "New on the blog",
      title: "The new Psychologist Act, without the panic.",
      href: "/blog/psychologist-act-2026-art-28-documentation",
      image: "/photos/desk.webp",
      cta: "Read the article",
    },
  },
  { label: "Pricing", href: "/pricing", hint: "149 zł a month, all-in" },
  { label: "About", href: "/about", hint: "Why we're building Sessio" },
];

/** True when `current` is the group's page or one of its children. */
export function groupActive(g: NavGroup, current?: string) {
  if (!current) return false;
  const base = (h: string) => h.split("#")[0];
  return base(g.href) === current || (g.items ?? []).some((i) => base(i.href) === current);
}
