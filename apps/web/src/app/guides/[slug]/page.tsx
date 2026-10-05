import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClosingCta, Footer, Nav, Pill } from "@/components/site";
import { GuideCard } from "@/components/guide-card";
import { GUIDES, getGuide } from "@/content/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const g = getGuide(slug);
  if (!g) return {};
  return { title: `${g.title} — Sessio guides`, description: g.dek, openGraph: { title: g.title, description: g.dek, images: g.poster ? [g.poster] : undefined } };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const g = getGuide(slug);
  if (!g) notFound();
  const more = GUIDES.filter((x) => x.slug !== g.slug)
    .sort((a, b) => Number(b.audience === g.audience) - Number(a.audience === g.audience))
    .slice(0, 3);
  const tone = g.tone === "sky" ? "sky" : g.tone === "clay" ? "clay" : g.tone === "lavender" ? "lavender" : "sage";

  return (
    <main>
      <Nav current="/guides" />
      <article>
        <header className="mx-auto flex max-w-[860px] flex-col items-center gap-5 px-5 pb-10 pt-10 text-center md:pt-16">
          <Link href="/guides" className="t-label-m text-stone hover:text-ink">
            ← All guides
          </Link>
          <div data-hero-fade className="flex flex-wrap justify-center gap-2">
            <Pill tone={tone}>{g.audience}</Pill>
            <Pill>{g.kind === "Video" ? `Video · ${g.minutes}` : `${g.minutes} read`}</Pill>
          </div>
          <h1 data-split className="t-display-l !text-[clamp(36px,5.5vw,64px)]">
            {g.title}
          </h1>
          <p data-hero-fade className="t-body-l max-w-[620px] text-stone">
            {g.dek}
          </p>
        </header>

        {g.video && (
          <div className="mx-auto max-w-[1120px] px-3 pb-14 md:px-8">
            <figure data-reveal className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_30px_80px_-30px_rgba(28,37,48,.35)] md:rounded-[28px]">
              <div aria-hidden className="flex h-9 items-center gap-1.5 border-b border-line bg-paper px-4 md:h-11">
                <span className="size-2.5 rounded-full bg-line-strong" />
                <span className="size-2.5 rounded-full bg-line-strong" />
                <span className="size-2.5 rounded-full bg-line-strong" />
                <span className="t-caption mx-auto rounded-full bg-surface px-4 py-1 text-stone">app.usesessio.com</span>
              </div>
              <video src={g.video} poster={g.poster} controls playsInline muted preload="none" className="block aspect-[16/10] w-full bg-paper" aria-label={`Screen recording: ${g.title}`} />
            </figure>
            <figcaption className="t-caption mt-3 text-center text-stone">Recorded on the live demo practice — no sound. Names and sessions are made up.</figcaption>
          </div>
        )}

        <div className="mx-auto grid max-w-[1120px] gap-10 px-5 pb-[110px] md:px-8 lg:grid-cols-[1fr_320px] lg:gap-16">
          <ol className="flex flex-col">
            {g.steps.map((s, i) => (
              <li key={s.title} data-reveal className="grid grid-cols-[44px_1fr] gap-4 border-t border-line py-6 md:grid-cols-[64px_1fr]">
                <span className="font-display text-[28px] font-medium leading-none tracking-[-0.05em] text-sage md:text-[36px]">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-1.5">
                  <h2 className="t-title-m md:text-[20px]">{s.title}</h2>
                  <p className="t-body-m text-stone">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            {g.tips && (
              <div className="rounded-[20px] bg-surface p-6">
                <p className="t-overline text-stone">Good to know</p>
                <ul className="mt-3 flex flex-col gap-3">
                  {g.tips.map((t) => (
                    <li key={t} className="t-body-s flex gap-3">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sage" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {g.tryIt && (
              <div className="flex flex-col gap-3 rounded-[20px] bg-ink p-6 text-white">
                <p className="t-title-m">Try it yourself</p>
                <p className="t-body-s text-white/70">The demo practice resets itself, so click anything.</p>
                <a href={g.tryIt.href} className="t-label-m inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-ink hover:bg-white/90">
                  {g.tryIt.label} →
                </a>
              </div>
            )}
            <p className="t-body-s px-1 text-stone">
              Stuck? <Link href="/faq" className="text-ink underline decoration-1 underline-offset-4">Read the FAQ</Link> or write to{" "}
              <a href="mailto:hello@usesessio.com" className="text-ink underline decoration-1 underline-offset-4">
                hello@usesessio.com
              </a>
              .
            </p>
          </aside>
        </div>
      </article>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <h2 className="t-heading-m mb-8 border-b border-line pb-5">More guides</h2>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((x) => (
            <GuideCard key={x.slug} g={x} />
          ))}
        </div>
      </section>
      <ClosingCta />
      <Footer />
    </main>
  );
}
