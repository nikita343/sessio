import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipFrame } from "@/components/auto-video";
import { FaqList } from "@/components/faq-list";
import { GuideCard } from "@/components/guide-card";
import { Icon } from "@/components/icons";
import { ButtonLink, ClosingCta, Footer, PageHero, Photo, Pill } from "@/components/site";
import { getGuide } from "@/content/guides";
import { PRODUCTS, getProduct } from "@/content/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: `${p.name} — Sessio`, description: p.dek };
}

export default async function ProductDetail(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) notFound();
  const guide = p.guide ? getGuide(p.guide) : undefined;
  const others = PRODUCTS.filter((x) => x.slug !== p.slug);

  return (
    <main>
      <PageHero current={`/product/${p.slug}`} pill={p.name} title={p.title} body={p.dek}>
        <div className="flex flex-wrap justify-center gap-2">
          <ButtonLink href={p.demo.href}>{p.demo.label}</ButtonLink>
          <ButtonLink href="/#waitlist" variant="secondary">
            Become a founding therapist
          </ButtonLink>
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1120px] px-3 pb-[100px] md:px-8">
        <div data-reveal>
          {"video" in p.media ? (
            <ClipFrame src={p.media.video} poster={p.media.poster} label={`Screen recording: ${p.name}`} />
          ) : (
            <Photo src={p.media.photo} alt={p.media.alt} ratio="aspect-[16/9]" priority />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-8 flex flex-col gap-3">
          <p className="t-overline text-stone">How it works</p>
          <h2 className="t-heading-m">Three steps, then it runs on its own.</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {p.steps.map((s, i) => (
            <li key={s.title} data-reveal className="flex flex-col gap-3 rounded-[24px] bg-surface p-7">
              <span className="font-display text-[40px] font-medium leading-none tracking-[-0.06em] text-sage">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t-title-m md:text-[20px]">{s.title}</h3>
              <p className="t-body-m text-stone">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-8 flex flex-col gap-3">
          <p className="t-overline text-stone">What you get</p>
          <h2 className="t-heading-m">The details that matter.</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {p.features.map((f) => (
            <div key={f.title} data-reveal className="flex flex-col gap-2 bg-surface p-7">
              <h3 className="t-title-m">{f.title}</h3>
              <p className="t-body-s text-stone">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <div data-reveal className="grid gap-6 rounded-[28px] bg-ink p-8 text-white md:grid-cols-[1fr_1.4fr] md:p-12">
          <div className="flex flex-col gap-3">
            <span className="flex size-11 items-center justify-center rounded-[14px] bg-white/10">
              <Icon name="shield" />
            </span>
            <h2 className="t-heading-m">Privacy, specifically.</h2>
            <Link href="/privacy" className="t-label-m text-white/70 hover:text-white">
              How Sessio handles data →
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-white/10">
            {p.privacy.map((x) => (
              <li key={x} className="t-body-m py-3.5 text-white/85">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1312px] gap-10 px-5 pb-[110px] md:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:px-0">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Pill tone={p.tone}>Questions</Pill>
            <h2 className="t-heading-m">About {p.name.toLowerCase()}</h2>
          </div>
          {guide && (
            <div className="max-w-[420px]">
              <GuideCard g={guide} />
            </div>
          )}
        </div>
        <FaqList items={p.faq} />
      </section>

      <section className="mx-auto max-w-[1312px] px-5 pb-[110px] md:px-8 lg:px-0">
        <h2 className="t-heading-m mb-6 border-b border-line pb-5">The rest of Sessio</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/product/${o.slug}`} className="group flex items-center gap-4 rounded-[20px] bg-surface p-5 transition-shadow hover:shadow-[var(--shadow-card)]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-sage-soft text-sage">
                <Icon name={o.icon} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="t-label-m">{o.name}</span>
                <span className="t-caption truncate text-stone">{o.hint}</span>
              </span>
              <span aria-hidden className="ml-auto text-stone transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ClosingCta />
      <Footer />
    </main>
  );
}
