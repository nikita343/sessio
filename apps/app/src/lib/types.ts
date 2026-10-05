export type SessionFormat = "online" | "in_person";
export type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "completed" | "no_show";

export type Therapist = {
  id: string;
  slug: string | null;
  full_name: string;
  title: string;
  city: string;
  bio: string;
  photo_url: string | null;
  languages: string[];
  formats: SessionFormat[];
  address: string | null;
  timezone: string;
  currency: string;
  cancellation_hours: number;
  agreement_notes?: string | null;
  specialties?: string[];
  approaches?: string[];
  works_with?: string[];
  about?: string | null;
  first_session?: string | null;
  education?: string | null;
  memberships?: string | null;
  practising_since?: number | null;
  register_number?: string | null;
  profile_i18n?: Record<string, { title?: string; city?: string; bio?: string; about?: string; first_session?: string; education?: string; memberships?: string }> | null;
  stripe_account_id: string | null;
  stripe_charges_enabled?: boolean;
  published: boolean;
};

export type Service = {
  id: string;
  therapist_id: string;
  name: string;
  duration_min: number;
  price_minor: number;
  active: boolean;
  sort: number;
};

export type Availability = { id?: string; weekday: number; start_time: string; end_time: string };

export type Client = { id: string; full_name: string; email: string; phone: string | null; language: string; created_at: string };

export type Booking = {
  id: string;
  therapist_id: string;
  service_id: string | null;
  client_id: string;
  starts_at: string;
  ends_at: string;
  format: SessionFormat;
  status: BookingStatus;
  payment_status: "unpaid" | "paid" | "refunded";
  price_minor: number;
  currency: string;
  room_name: string | null;
  manage_token: string;
  client_note: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  therapist_id: string;
  client_id: string;
  booking_id: string | null;
  session_number: number | null;
  fields: Record<string, string>;
  body: string;
  status: "draft" | "signed";
  signed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Activity = { id: string; kind: string; summary: string; needs_review: boolean; urgent?: boolean; ref_id: string | null; created_at: string };
