"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type PostCard = { slug: string; title: string; dek: string; category: string; date: string; readMin: number; image: string; author: string };

/** Blog index grid with category filter chips (Figma "news" layout). */
export function BlogGrid({ posts }: { posts: PostCard[] }) {
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  return (
    <>
      <div role="toolbar" aria-label="Filter by topic" className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {cats.map((c) => {
          const n = c === "All" ? posts.length : posts.filter((p) => p.category === c).length;
          const on = c === cat;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setCat(c)}
              className={`t-label-m inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 transition-colors ${on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink hover:border-ink/40"}`}
            >
              {c}
              <span className={`t-caption ${on ? "text-white/60" : "text-stone"}`}>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-sunken">
              <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="t-caption absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-ink backdrop-blur-sm">{p.category}</span>
            </div>
            <h3 className="t-title-m pt-1 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{p.title}</h3>
            <p className="t-body-s line-clamp-2 text-stone">{p.dek}</p>
            <div className="mt-1 flex items-center gap-2.5">
              <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-sage text-[12px] font-semibold text-white">
                s
              </span>
              <span className="t-caption text-ink">{p.author}</span>
              <span aria-hidden className="size-1 rounded-full bg-line-strong" />
              <span className="t-caption text-stone">
                {p.date} · {p.readMin} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
