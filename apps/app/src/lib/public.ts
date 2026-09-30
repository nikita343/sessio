import { cache } from "react";
import { publicClient } from "./supabase/server";
import type { Availability, Service, Therapist } from "./types";
import { buildDays } from "./slots";

export const loadPublic = cache(async (slug: string) => {
  const sb = publicClient();
  const { data: therapist } = await sb.from("therapists").select("*").eq("slug", slug).eq("published", true).maybeSingle<Therapist>();
  if (!therapist) return null;
  const from = new Date();
  const to = new Date(Date.now() + 22 * 86400_000);
  const [{ data: services }, { data: availability }, { data: busy }] = await Promise.all([
    sb.from("services").select("*").eq("therapist_id", therapist.id).eq("active", true).order("sort"),
    sb.rpc("public_availability", { p_slug: slug }),
    sb.rpc("busy_slots", { p_slug: slug, p_from: from.toISOString(), p_to: to.toISOString() }),
  ]);
  const service = (services?.[0] as Service) ?? null;
  const days = service
    ? buildDays({
        availability: (availability as Availability[]) ?? [],
        busy: (busy as { starts_at: string; ends_at: string }[]) ?? [],
        durationMin: service.duration_min,
        tz: therapist.timezone,
      })
    : [];
  return { therapist, service, days };
});
