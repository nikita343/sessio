import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { publicClient, SERVER_SECRET } from "@/lib/supabase/server";

/**
 * One-time Stripe setup, run by the operator (guarded by the server secret):
 * creates the two webhook destinations (platform + connected accounts) for this deployment and stores their
 * signing secrets server-side, so nobody has to copy webhook secrets around. Also reports what the account supports.
 */
export async function POST(req: Request) {
  if (!SERVER_SECRET() || req.headers.get("x-sessio-secret") !== SERVER_SECRET()) return NextResponse.json({ error: "not allowed" }, { status: 403 });
  const s = stripe();
  if (!s) return NextResponse.json({ error: "STRIPE_SECRET_KEY is not set" }, { status: 400 });
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";
  const url = `${app}/api/stripe/webhook`;
  const sb = publicClient();

  // replace any destinations we created before (signing secrets are only shown at creation)
  const existing = await s.webhookEndpoints.list({ limit: 100 });
  for (const ep of existing.data) if (ep.url === url) await s.webhookEndpoints.del(ep.id);

  const checkoutEvents = ["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.expired"] as const;
  const platform = await s.webhookEndpoints.create({ url, enabled_events: [...checkoutEvents], description: "Sessio — platform payments" });
  await sb.rpc("server_put_stripe_secret", { p_secret: SERVER_SECRET(), p_name: "stripe_whsec", p_value: platform.secret });

  let connect: string | null = null;
  try {
    const ep = await s.webhookEndpoints.create({ url, connect: true, enabled_events: [...checkoutEvents, "account.updated"], description: "Sessio — therapists' connected accounts" });
    await sb.rpc("server_put_stripe_secret", { p_secret: SERVER_SECRET(), p_name: "stripe_connect_whsec", p_value: ep.secret });
    connect = "webhook created";
  } catch (e) {
    connect = e instanceof Error ? e.message : "failed";
  }

  let connectReady = false;
  let connectNote = "";
  try {
    await s.accounts.list({ limit: 1 });
    connectReady = true;
  } catch (e) {
    connectNote = e instanceof Error ? e.message : "Connect not available";
  }
  const account = await s.accounts.retrieveCurrent();
  return NextResponse.json({
    ok: true,
    livemode: !/^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY ?? ""),
    account: { id: account.id, country: account.country, currency: account.default_currency, charges_enabled: account.charges_enabled },
    webhooks: { platform: platform.id, connect },
    connect: { ready: connectReady, note: connectNote },
  });
}
