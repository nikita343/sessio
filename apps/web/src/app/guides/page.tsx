import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, Footer, PageHero, Pill } from "@/components/site";
import { GuideCard, GuideThumb } from "@/components/guide-card";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guides — Sessio",
  description: "Short video guides to every part of Sessio: setting up your booking page, how clients book and prepay, notes from a voice memo, the client portal and connecting Stripe.",
};

export default function Guides() {
  const [lead, ...rest] = GUIDES;
  const forTherapists = rest.filter((g) => g.audience === "Therapists");
  const forClients = rest.filter((g) => g.audience === "Clients");
  return (
    <main>
      <PageHero
        current="/guides"
        pill="Guides"
        title={
          <>
            See it once,
            <br />
            <span className="text-stone">then do it yourself.</span>
          </>
        }
        body="Every flow in Sessio as a half-minute screen recording of the real product, with the steps written out underneath. No sound needed."
      />
      <section className="mx-auto max-w-[1312px] px-5 pb-[90px] md:px-8 lg:px-0">
        <Link href={`/guides/${lead.slug}`} data-reveal className="group grid items-center gap-8 rounded-[28px] bg-surface p-4 md:grid-cols-[1.35fr_1fr] md:p-6">
          <GuideThumb g={lead} sizes="(min-width: 768px) 60vw, 100vw" priority />
          <div className="flex flex-col gap-4 p-2 md:pr-6">
            <Pill tone="sage">Start here</Pill>
            <h2 className="t-heading-m group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{lead.title}</h2>
            <p className="t-body-m text-stone">{lead.dek}</p>
            <ol className="flex flex-col gap-1.5">
              {lead.steps.map((s, i) => (
                <li key={s.title} className="t-body-s flex gap-3">
                  <span className="t-caption flex size-5 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">{i + 1}</span>
                  {s.title}
                </li>
              ))}
            </ol>
          </div>
        </Link>
      </section>
      <section id="therapists" className="mx-auto max-w-[1312px] scroll-mt-24 px-5 pb-[90px] md:px-8 lg:px-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <h2 className="t-heading-m">For therapists</h2>
          <p className="t-body-s text-stone">{forTherapists.length + 1} guides</p>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {forTherapists.map((g) => (
            <GuideCard key={g.slug} g={g} />
          ))}
        </div>
      </section>
      <section id="clients" className="mx-auto max-w-[1312px] scroll-mt-24 px-5 pb-[110px] md:px-8 lg:px-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <h2 className="t-heading-m">For clients</h2>
          <p className="t-body-s text-stone">Share these with the people you work with.</p>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {forClients.map((g) => (
            <GuideCard key={g.slug} g={g} />
          ))}
        </div>
      </section>
      <ClosingCta />
      <Footer />
    </main>
  );
}
