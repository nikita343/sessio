import type { MetadataRoute } from "next";
import { POSTS } from "@/content/posts";
import { GUIDES } from "@/content/guides";

const SITE = "https://www.usesessio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/product", "/pricing", "/for-therapists", "/for-clients", "/use-cases", "/blog", "/guides", "/webinars", "/faq", "/about", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...POSTS.map((p) => ({ url: `${SITE}/blog/${p.slug}`, lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...GUIDES.map((g) => ({ url: `${SITE}/guides/${g.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
