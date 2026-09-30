import { notFound, redirect } from "next/navigation";
import { getTherapist } from "@/lib/therapist";
import { sessionNumbers } from "@/lib/queries";

export default async function NewNote(props: PageProps<"/notes/new">) {
  const sp = await props.searchParams;
  const bookingId = String(sp.booking ?? "");
  const { supabase, therapist } = await getTherapist();
  const { data: b } = await supabase.from("bookings").select("id, client_id").eq("id", bookingId).maybeSingle();
  if (!b) notFound();
  const { data: existing } = await supabase.from("notes").select("id").eq("booking_id", b.id).maybeSingle();
  if (existing) redirect(`/notes/${existing.id}`);
  const nums = await sessionNumbers(supabase, [b.client_id]);
  const { data: created } = await supabase
    .from("notes")
    .insert({ therapist_id: therapist.id, client_id: b.client_id, booking_id: b.id, session_number: nums.get(b.id) ?? 1 })
    .select("id")
    .single();
  redirect(`/notes/${created!.id}`);
}
