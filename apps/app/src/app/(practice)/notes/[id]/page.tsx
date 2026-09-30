import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapist } from "@/lib/therapist";
import { inTz } from "@/lib/format";
import { NoteEditor } from "./editor";
import type { Note } from "@/lib/types";

export const metadata: Metadata = { title: "Session record" };

export default async function NotePage(props: PageProps<"/notes/[id]">) {
  const { id } = await props.params;
  const { supabase, therapist: th } = await getTherapist();
  const { data } = await supabase.from("notes").select("*, client:clients(id, full_name), booking:bookings(starts_at, ends_at, format)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const note = data as Note & { client: { id: string; full_name: string }; booking: { starts_at: string; ends_at: string; format: string } | null };
  const tz = th.timezone;
  const when = note.booking ? inTz(note.booking.starts_at, tz, "EEE d MMM, HH:mm") : inTz(note.created_at, tz, "d MMM");
  const clientCode = `#C-${note.client.id.slice(0, 4).toUpperCase()}`;
  const [first, last] = note.client.full_name.split(/\s+/);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-caption text-stone">
            <Link href="/notes" className="hover:text-ink">
              Notes
            </Link>{" "}
            /{" "}
            <Link href={`/clients/${note.client.id}`} className="hover:text-ink">
              {first} {last ? `${last[0]}.` : ""}
            </Link>
          </p>
          <h1 className="t-heading-m !text-[36px]">
            Session {note.session_number ?? "—"} · {when}
          </h1>
        </div>
      </div>
      <NoteEditor
        id={note.id}
        signed={note.status === "signed"}
        signedAt={note.signed_at ? inTz(note.signed_at, tz, "d MMM yyyy, HH:mm") : null}
        initialBody={note.body}
        initialWorking={note.fields?.working ?? ""}
        clientNames={note.client.full_name.split(/\s+/).filter((p) => p.length > 1)}
        meta={{
          client: `${first} ${last ? `${last[0]}.` : ""} · ${clientCode}`,
          date: note.booking ? `${inTz(note.booking.starts_at, tz, "d MMM yyyy · HH:mm")}–${inTz(note.booking.ends_at, tz, "HH:mm")}` : "—",
          form: `Psychological help · ${note.booking?.format === "in_person" ? "in person" : "online"}`,
          psychologist: `${th.full_name} · Reg. no. —`,
        }}
        sessionNumber={note.session_number ?? 1}
        therapistNames={th.full_name.split(/\s+/).filter((p) => p.length > 1)}
      />
    </div>
  );
}
