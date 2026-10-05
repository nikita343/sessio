import type { Metadata } from "next";
import { Footer, PageHero } from "@/components/site";
import { FAQ } from "@/content/faq";
import { FaqList } from "@/components/faq-list";

export const metadata: Metadata = {
  title: "FAQ — Sessio",
  description: "Answers for therapists and clients: setting up, payments and Stripe, video sessions, the new Psychologist Act, privacy and AI notes.",
};

export default function Faq() {
  const starts = FAQ.map((_, i) => 1 + FAQ.slice(0, i).reduce((t, g) => t + g.items.length, 0));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        current="/faq"
        pill="FAQ"
        title={
          <>
            Questions,
            <br />
            <span className="text-stone">answered plainly.</span>
          </>
        }
        body="For therapists thinking about Sessio, and for clients who were sent a booking link. If yours isn't here, write to us — a person answers."
      />
      <section className="mx-auto grid max-w-[1312px] gap-10 px-5 pb-[110px] md:px-8 lg:grid-cols-[300px_1fr] lg:gap-20 lg:px-0">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="FAQ topics" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
            {FAQ.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="t-label-m flex shrink-0 items-center justify-between gap-3 rounded-full border border-line bg-surface px-4 py-2.5 hover:border-ink/30 lg:rounded-[14px] lg:border-transparent lg:bg-transparent lg:px-3 lg:hover:bg-surface">
                {g.title}
                <span className="t-caption hidden text-stone lg:inline">{g.items.length}</span>
              </a>
            ))}
          </nav>
          <div className="mt-6 hidden flex-col gap-3 rounded-[20px] bg-ink p-6 text-white lg:flex">
            <p className="t-title-m">Still wondering?</p>
            <p className="t-body-s text-white/70">Write to us and Nick, who builds Sessio, will answer — usually the same day.</p>
            <a href="mailto:hello@usesessio.com" className="t-label-m mt-1 inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-ink hover:bg-white/90">
              hello@usesessio.com
            </a>
          </div>
        </aside>
        <div className="flex flex-col gap-14">
          {FAQ.map((g, gi) => (
            <div key={g.id} id={g.id} className="scroll-mt-24">
              <h2 data-reveal className="t-heading-m">{g.title}</h2>
              <div className="mt-5">
                <FaqList items={g.items} start={starts[gi]} />
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-3 rounded-[20px] bg-ink p-6 text-white lg:hidden">
            <p className="t-title-m">Still wondering?</p>
            <p className="t-body-s text-white/70">Write to us and Nick, who builds Sessio, will answer — usually the same day.</p>
            <a href="mailto:hello@usesessio.com" className="t-label-m mt-1 inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-ink">
              hello@usesessio.com
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
