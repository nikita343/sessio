import type { Metadata } from "next";
import { Footer, PageHero, Photo, Pill } from "@/components/site";
import { WaitlistForm } from "@/components/waitlist-form";
import { WEBINARS } from "@/content/webinars";

function parts(iso: string) {
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", ...o }).format(new Date(iso));
  return { day: f({ day: "numeric" }), month: f({ month: "short" }), weekday: f({ weekday: "short" }), time: f({ hour: "2-digit", minute: "2-digit" }) };
}

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
      <section className="mx-auto max-w-[1240px] px-5 pb-[80px]">
        <Photo src="/photos/group.webp" alt="A small group of psychologists talking around a long table in a bright loft" ratio="aspect-[21/9]" priority />
      </section>
      <section className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 pb-[110px]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <h2 className="t-heading-m">Upcoming sessions</h2>
          <p className="t-body-s text-stone">All times are Warsaw time · free · recording sent afterwards</p>
        </div>
        {WEBINARS.map((w) => {
          const d = parts(w.date);
          return (
            <article key={w.slug} id={w.slug} data-reveal className="relative grid scroll-mt-24 overflow-hidden rounded-[28px] bg-surface lg:grid-cols-[180px_1fr_380px]">
              {/* stub */}
              <div className="relative flex items-center gap-4 border-b border-dashed border-line-strong bg-sage-soft/60 p-6 lg:flex-col lg:justify-center lg:gap-1 lg:border-b-0 lg:border-r lg:p-8">
                <span className="t-overline text-sage">{d.month}</span>
                <span className="font-display text-[56px] font-medium leading-none tracking-[-0.06em] text-ink lg:text-[72px]">{d.day}</span>
                <span className="t-label-m text-stone">{d.weekday}</span>
                <span aria-hidden className="absolute -bottom-3 -left-3 size-6 rounded-full bg-paper lg:-right-3 lg:-top-3 lg:bottom-auto lg:left-auto" />
                <span aria-hidden className="absolute -bottom-3 -right-3 size-6 rounded-full bg-paper lg:-bottom-3 lg:-right-3" />
              </div>
              {/* body */}
              <div className="flex min-w-0 flex-col gap-5 p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                  <Pill tone="sage">{w.status === "upcoming" ? "Upcoming · free" : "Replay soon"}</Pill>
                  <Pill>{w.lang}</Pill>
                </div>
                <h3 className="t-heading-m !text-[clamp(22px,2.4vw,30px)]">{w.title}</h3>
                <p className="t-body-m text-stone">{w.dek}</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-line py-4 sm:grid-cols-4">
                  {[
                    ["When", `${d.weekday}, ${d.day} ${d.month}`],
                    ["Time", `${d.time} · ${w.durationMin} min`],
                    ["Where", "Online, link by email"],
                    ["Host", w.host],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                      <dt className="t-caption text-stone">{k}</dt>
                      <dd className="t-label-m">{v}</dd>
                    </div>
                  ))}
                </dl>
                <details className="group">
                  <summary className="t-label-m flex cursor-pointer list-none items-center gap-2 text-ink [&::-webkit-details-marker]:hidden">
                    <span className="relative flex size-6 items-center justify-center rounded-full border border-line-strong">
                      <span className="absolute h-[1.5px] w-2.5 bg-ink" />
                      <span className="absolute h-2.5 w-[1.5px] bg-ink transition-transform group-open:scale-y-0" />
                    </span>
                    Agenda · {w.agenda.length} parts
                  </summary>
                  <ol className="mt-3 flex flex-col gap-2">
                    {w.agenda.map((a, i) => (
                      <li key={a} className="t-body-s flex gap-3">
                        <span className="t-caption w-5 shrink-0 pt-0.5 text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        {a}
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
              {/* register */}
              <div className="flex min-w-0 flex-col justify-center gap-3 border-t border-line bg-paper/70 p-6 md:p-8 lg:border-l lg:border-t-0">
                <p className="t-title-m">Save your seat</p>
                <p className="t-body-s text-stone">We&rsquo;ll email the link the day before and the recording afterwards.</p>
                <WaitlistForm source={`webinar:${w.slug}`} cta="Register" />
              </div>
            </article>
          );
        })}
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
