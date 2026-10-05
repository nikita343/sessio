import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClosingCta, Footer, Nav, Pill } from "@/components/site";
import { POSTS, fmtDate, getPost, type Block } from "@/content/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: `${p.title} — Sessio`, description: p.dek, openGraph: { title: p.title, description: p.dek, images: [p.image] } };
}

function Render({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <p className="t-body-l text-ink/90">{b.text}</p>;
    case "h2":
      return <h2 className="t-heading-s mt-6">{b.text}</h2>;
    case "ul":
      return (
        <ul className="flex flex-col gap-2.5">
          {b.items.map((i) => (
            <li key={i} className="t-body-l flex gap-3 text-ink/90">
              <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-sage" />
              {i}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote className="t-heading-s border-l-2 border-sage pl-6 text-sage">{b.text}</blockquote>;
    case "note":
      return <p className="t-body-m rounded-[16px] bg-sage-soft px-5 py-4 text-sage">{b.text}</p>;
  }
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();
  const more = POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  return (
    <main>
      <Nav current="/blog" />
      <article className="mx-auto max-w-[760px] px-5 pb-20 pt-8">
        <Link href="/blog" className="t-label-m text-stone hover:text-ink">
          ← All posts
        </Link>
        <div className="mt-6 flex flex-col gap-4">
          <Pill tone="sage">{post.category}</Pill>
          <h1 data-split className="t-display-l !text-[clamp(34px,4.4vw,52px)]">{post.title}</h1>
          <p className="t-body-l text-stone">{post.dek}</p>
          <p className="t-caption text-stone">
            {post.author} · {fmtDate(post.date)} · {post.readMin} min read
          </p>
        </div>
      </article>
      <div className="mx-auto max-w-[1100px] px-5">
        <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-[22px] sm:aspect-[16/8] sm:rounded-[28px]">
          <Image src={post.image} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div className="mx-auto flex max-w-[680px] flex-col gap-5 px-5 py-16">
        {post.body.map((b, i) => (
          <Render key={i} b={b} />
        ))}
        {post.sources && (
          <div className="mt-8 border-t border-line pt-6">
            <p className="t-overline text-stone">Sources</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {post.sources.map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noreferrer" className="t-body-s text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="t-caption mt-4 text-stone">This article is general information, not legal advice.</p>
          </div>
        )}
      </div>
      <section className="mx-auto max-w-[1100px] px-5 pb-[100px]">
        <p className="t-overline text-stone">Keep reading</p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {more.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-sunken">
                <Image src={p.image} alt="" fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <h3 className="t-title-m group-hover:underline group-hover:underline-offset-4">{p.title}</h3>
            </Link>
          ))}
        </div>
      </section>
      <ClosingCta />
      <Footer />
    </main>
  );
}
