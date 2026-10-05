import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { loadPublic } from "@/lib/public";
import { pickLang, t } from "@/lib/i18n";
import { money, LANGS, tzLabel } from "@/lib/format";
import { Avatar, Badge } from "@/components/ui";
import { PublicShell } from "@/components/public-shell";
import { Picker } from "./picker";
import { AskBox } from "./ask";

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await loadPublic(slug);
  if (!data) return { title: "Not found" };
  return {
    title: `${data.therapist.full_name} — book a session`,
    description: data.therapist.bio.slice(0, 150),
  };
}

export default async function BookingPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const data = await loadPublic(slug);
  if (!data) notFound();
  const { therapist: th, service, days } = data;
  const lang = pickLang(sp.lang, (await cookies()).get("sessio_lang")?.value);
  const d = t(lang);
  const formats = th.formats.length > 1 ? d.onlineAndInPerson : d[th.formats[0] ?? "online"];
  const langs = th.languages.map((l) => LANGS[l] ?? l).join(" · ");
  const evenings = days.some((day) => day.slots.some((s) => new Date(s.start).getUTCHours() >= 15));

  return (
    <PublicShell lang={lang} path={`/${slug}`}>
      <div className="grid gap-6 pt-4 md:grid-cols-[1fr_440px] md:gap-10 md:pt-10">
        <section className="flex min-w-0 flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={th.full_name} photo={th.photo_url} size={72} />
            <div>
              <h1 className="t-heading-m">{th.full_name}</h1>
              <p className="t-body-s text-stone">{[th.title, th.city && `${th.city}${th.formats.includes("online") ? " & online" : ""}`].filter(Boolean).join(" · ")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="sage">{formats}</Badge>
            <Badge tone="stone">{langs}</Badge>
            {evenings && <Badge tone="clay">{lang === "pl" ? "Terminy wieczorne" : lang === "uk" ? "Вечірній час" : "Evenings available"}</Badge>}
          </div>
          {th.bio && <p className="t-body-m max-w-[520px] whitespace-pre-line">{th.bio}</p>}
          {service && (
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[28px] font-medium tracking-[-0.04em]">{money(service.price_minor, th.currency)}</span>
              <span className="t-body-s text-stone">{d.perSession(service.duration_min)}</span>
            </p>
          )}
          <div className="hidden md:block">
            <AskBox slug={slug} lang={lang} />
          </div>
        </section>

        <section className="min-w-0 rounded-[24px] bg-surface p-5 shadow-[var(--shadow-card)] md:p-6">
          {service ? (
            <Picker
              slug={slug}
              days={days}
              lang={lang}
              tz={th.timezone}
              tzText={d.timesIn(tzLabel(th.timezone))}
              price={money(service.price_minor, th.currency)}
              footnote={d.footnote(th.cancellation_hours)}
            />
          ) : (
            <p className="t-body-s text-stone">{d.noTimes}</p>
          )}
        </section>
        <div className="md:hidden">
          <AskBox slug={slug} lang={lang} />
        </div>
      </div>
    </PublicShell>
  );
}
