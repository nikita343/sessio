import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapist } from "@/lib/therapist";
import { pick, uiLang } from "@/lib/ui-lang";
import { D_DAY, D_DAY_YEAR, D_SHORT, D_TIME, NOTES_T, noteDate } from "@/lib/ui/notes";
import { NoteEditor } from "./editor";
import { ageOn, maskPesel, missingArt28, type Identity } from "@/lib/art28";
import { ART28_T } from "@/lib/ui/art28";
import type { Note } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(NOTES_T, await uiLang()).recordTitle };
}

export default async function NotePage(props: PageProps<"/notes/[id]">) {
  const { id } = await props.params;
  const { supabase, therapist: th } = await getTherapist();
  const lang = await uiLang();
  const t = pick(NOTES_T, lang);
  const { data } = await supabase.from("notes").select("*, client:clients(id, full_name, birth_date, pesel, id_document, address, guardian_name, guardian_contact), booking:bookings(starts_at, ends_at, format, agreement_accepted_at, agreement_version)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const note = data as Note & {
    client: Identity & { id: string };
    booking: { starts_at: string; ends_at: string; format: string; agreement_accepted_at: string | null; agreement_version: string | null } | null;
  };
  const a = ART28_T[lang];
  const missing = missingArt28(note.client, { register_number: th.register_number, address: th.address, online_only: !th.formats.includes("in_person") });
  const minor = (ageOn(note.client.birth_date) ?? 99) < 18;
  const tz = th.timezone;
  const when = note.booking ? noteDate(note.booking.starts_at, tz, lang, D_SHORT) : noteDate(note.created_at, tz, lang, D_DAY);
  const clientCode = `#C-${note.client.id.slice(0, 4).toUpperCase()}`;
  const [first, last] = note.client.full_name.split(/\s+/);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-caption text-stone">
            <Link href="/notes" className="hover:text-ink">
              {t.title}
            </Link>{" "}
            /{" "}
            <Link href={`/clients/${note.client.id}`} className="hover:text-ink">
              {first} {last ? `${last[0]}.` : ""}
            </Link>
          </p>
          <h1 className="t-heading-m !text-[36px]">
            {t.session(note.session_number ?? "—")} · {when}
          </h1>
        </div>
      </div>
      <section aria-label={a.title} className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-[1fr_1fr_auto]">
        <dl className="flex flex-col gap-1.5 bg-surface px-5 py-4">
          <p className="t-overline text-stone">{a.title}</p>
          {[
            [a.name, note.client.full_name],
            [a.birth, note.client.birth_date ? noteDate(note.client.birth_date + "T12:00:00Z", "UTC", lang, D_DAY_YEAR) : null],
            [note.client.pesel ? a.pesel : a.idDoc, maskPesel(note.client.pesel) ?? note.client.id_document],
            [a.address, note.client.address],
            ...(minor ? [[a.guardian, note.client.guardian_name ? `${note.client.guardian_name}${note.client.guardian_contact ? ` · ${note.client.guardian_contact}` : ""}` : null]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3 text-[13px]">
              <dt className="w-[132px] shrink-0 text-stone">{k}</dt>
              <dd className={v ? "text-ink" : "text-clay"}>{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
        <dl className="flex flex-col gap-1.5 bg-surface px-5 py-4">
          <p className="t-overline text-stone">{a.practice}</p>
          {[
            [a.psychologist, th.full_name],
            [a.register, th.register_number],
            [a.practice, [th.practice_name ?? th.full_name, th.address ?? "online"].filter(Boolean).join(" · ")],
            [a.agreement, note.booking?.agreement_accepted_at ? a.agreementAt(noteDate(note.booking.agreement_accepted_at, tz, lang, { ...D_DAY_YEAR, ...D_TIME }), note.booking.agreement_version ?? "—") : a.noAgreement],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3 text-[13px]">
              <dt className="w-[110px] shrink-0 text-stone">{k}</dt>
              <dd className={v ? "text-ink" : "text-clay"}>{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col justify-center gap-2 bg-surface px-5 py-4 md:w-[230px]">
          {missing.length === 0 ? (
            <span className="t-label-m text-sage">✓ {a.complete}</span>
          ) : (
            <>
              <span className="t-overline text-clay">{a.missingTitle}</span>
              <span className="t-caption">{missing.map((m) => a.missing[m]).join(" · ")}</span>
              <Link href={missing.includes("register") && missing.length === 1 ? "/booking-page#profile" : `/clients/${note.client.id}#art28`} className="t-label-m text-sage hover:underline">
                {a.fillIn} →
              </Link>
            </>
          )}
        </div>
      </section>
      <NoteEditor
        id={note.id}
        lang={lang}
        signed={note.status === "signed"}
        signedAt={note.signed_at ? noteDate(note.signed_at, tz, lang, { ...D_DAY_YEAR, ...D_TIME }) : null}
        initialBody={note.body}
        initialWorking={note.fields?.working ?? ""}
        clientNames={note.client.full_name.split(/\s+/).filter((p) => p.length > 1)}
        meta={{
          client: `${first} ${last ? `${last[0]}.` : ""} · ${clientCode}`,
          date: note.booking ? `${noteDate(note.booking.starts_at, tz, lang, D_DAY_YEAR)} · ${noteDate(note.booking.starts_at, tz, lang, D_TIME)}–${noteDate(note.booking.ends_at, tz, lang, D_TIME)}` : "—",
          form: t.formLabel(note.booking?.format === "in_person"),
          psychologist: t.psychologistLabel(th.full_name, th.register_number),
        }}
        sessionNumber={note.session_number ?? 1}
        therapistNames={th.full_name.split(/\s+/).filter((p) => p.length > 1)}
      />
    </div>
  );
}
