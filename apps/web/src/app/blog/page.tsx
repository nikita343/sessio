import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClosingCta, Footer, PageHero, Pill } from "@/components/site";
import { POSTS, fmtDate } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog — Sessio",
  description: "Plain-language guides for independent psychologists and therapists in Poland: the new Psychologist Act, documentation, prepayment, privacy and running a practice.",
};

export default function Blog() {
  const [lead, ...rest] = POSTS;
  return (
    <main>
      <PageHero
        current="/blog"
        pill="Blog"
        title={
          <>
            Notes on running
            <br />
            <span className="text-stone">a calm practice.</span>
          </>
        }
        body="The new Act, documentation, money and privacy — written plainly, with sources, for therapists who would rather be doing therapy."
      />
      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-0">
        <Link href={`/blog/${lead.slug}`} className="group grid items-center gap-8 rounded-[28px] bg-surface p-4 md:grid-cols-[1.2fr_1fr] md:p-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
            <Image src={lead.image} alt="" fill priority sizes="(min-width: 768px) 60vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
          <div className="flex flex-col gap-4 p-2 md:pr-6">
            <Pill tone="sage">{lead.category}</Pill>
            <h2 className="t-heading-m group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{lead.title}</h2>
            <p className="t-body-m text-stone">{lead.dek}</p>
            <p className="t-caption text-stone">
              {fmtDate(lead.date)} · {lead.readMin} min read
            </p>
          </div>
        </Link>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-sunken">
                <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="t-overline text-stone">{p.category}</p>
              <h3 className="t-title-m group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{p.title}</h3>
              <p className="t-caption text-stone">
                {fmtDate(p.date)} · {p.readMin} min read
              </p>
            </Link>
          ))}
        </div>
      </section>
      <ClosingCta />
      <Footer />
    </main>
  );
}
