import type { Metadata } from "next";
import { createHmac } from "node:crypto";
import { createClient, SERVER_SECRET } from "@/lib/supabase/server";
import { Logo } from "@/components/logo";
import { RoomClient } from "./room-client";
import { pick, uiLang } from "@/lib/ui-lang";
import { ROOM_T } from "@/lib/ui/room";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(ROOM_T, await uiLang()).metaTitle, robots: { index: false } };
}

type Access = { booking_id: string; role: "therapist" | "client"; display_name: string; other_name: string; starts_at: string; ends_at: string };

export default async function Room(props: PageProps<"/room/[room]">) {
  const { room } = await props.params;
  const sp = await props.searchParams;
  const token = typeof sp.t === "string" && /^[0-9a-f-]{36}$/.test(sp.t) ? sp.t : null;
  const sb = await createClient();
  const { data } = await sb.rpc("room_access", { p_room: room, p_token: token });
  const access = (Array.isArray(data) ? data[0] : data) as Access | undefined;
  const lang = await uiLang();
  const t = pick(ROOM_T, lang);

  if (!access)
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper px-5 text-center">
        <Logo size={26} />
        <h1 className="t-heading-s">{t.unavailableTitle}</h1>
        <p className="t-body-s max-w-sm text-stone">{t.unavailableBody}</p>
      </main>
    );

  // The signalling channel name is a server-signed secret handed out only after the access check,
  // so knowing the room link's name alone is not enough to listen in on call setup.
  const topic = createHmac("sha256", SERVER_SECRET()).update(`room:${room}:${access.booking_id}`).digest("hex").slice(0, 40);

  return (
    <RoomClient
      topic={topic}
      lang={lang}
      role={access.role}
      me={access.display_name}
      other={access.other_name}
      startsAt={access.starts_at}
      endsAt={access.ends_at}
      iceExtra={
        process.env.TURN_URL
          ? [{ urls: process.env.TURN_URL, username: process.env.TURN_USERNAME, credential: process.env.TURN_CREDENTIAL }]
          : []
      }
    />
  );
}
