import type { Metadata } from "next";
import { Footer, PageHero, Photo, Pill } from "@/components/site";
import { WaitlistForm } from "@/components/waitlist-form";
import { WEBINARS, fmtWhen } from "@/content/webinars";

export const metadata: Metadata = {
  title: "Webinars — Sessio",
  description: "Free live sessions for psychologists and therapists: Art. 28 documentation in practice, leaving a marketplace calmly, and ethical AI notes.",
};

export default function Webinars() {
  return (
    <main>
      <PageHero
        current="/webinars"
        pill="Webinars"
        title={
          <>
            Live, free, and
            <br />
            <span className="text-stone">about your practice.</span>
          </>
        }
        body="Short evening sessions for psychologists and therapists. Bring questions — every webinar ends with open Q&A, and the recording goes to everyone who registers."
      />
      <section className="mx-auto max-w-[1312px] px-5 pb-[80px] md:px-0">
        <Photo src="/photos/group.webp" alt="A small group of psychologists talking around a long table in a bright loft" ratio="aspect-[21/9]" priority />
      </section>
      <section className="mx-auto flex max-w-[1120px] flex-col gap-6 px-5 pb-[110px]">
        {WEBINARS.map((w) => (
          <article key={w.slug} id={w.slug} className="grid gap-6 rounded-[28px] bg-surface p-6 md:grid-cols-[1.3fr_1fr] md:p-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Pill tone="sage">{w.status === "upcoming" ? "Upcoming · free" : "Replay soon"}</Pill>
                <Pill>{w.lang}</Pill>
              </div>
              <h2 className="t-heading-m">{w.title}</h2>
              <p className="t-body-m text-stone">{w.dek}</p>
              <p className="t-label-m first-letter:uppercase">
                {fmtWhen(w.date)} (Warsaw) · {w.durationMin} min · {w.host}
              </p>
              <ul className="flex flex-col gap-2">
                {w.agenda.map((a) => (
                  <li key={a} className="t-body-s flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-[20px] bg-paper p-6">
              <p className="t-title-m">Save your seat</p>
              <p className="t-body-s text-stone">We&rsquo;ll email the link the day before and the recording afterwards.</p>
              <WaitlistForm source={`webinar:${w.slug}`} cta="Register" />
            </div>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-[760px] px-5 pb-[110px] text-center">
        <h2 className="t-heading-m">Run a community or a training school?</h2>
        <p className="t-body-l mt-3 text-stone">
          We&rsquo;re happy to run a session on the new Act or on documentation for your members or trainees, in Polish or Ukrainian — no sales pitch.
        </p>
        <a href="mailto:hello@usesessio.com?subject=Webinar%20for%20our%20community" className="t-label-m mt-5 inline-flex h-11 items-center rounded-full border border-line-strong bg-surface px-6 hover:border-ink/30">
          Write to us
        </a>
      </section>
      <Footer />
    </main>
  );
}
