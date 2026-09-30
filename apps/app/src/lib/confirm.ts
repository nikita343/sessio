import { publicClient, SERVER_SECRET } from "./supabase/server";
import { sendBookingEmail } from "./email";

/** Marks a booking paid (idempotent) and sends the confirmation email once. */
export async function markPaid(bookingId: string, paymentRef: string, method: string) {
  const sb = publicClient();
  const { data: before } = await sb.rpc("server_mark_paid", {
    p_secret: SERVER_SECRET(),
    p_id: bookingId,
    p_payment_intent: paymentRef,
    p_method: method,
  });
  const row = Array.isArray(before) ? before[0] : before;
  if (row) {
    try {
      await sendBookingEmail(row);
    } catch (e) {
      console.error("email failed", e);
    }
  }
  return row;
}
