import { gateway } from "@ai-sdk/gateway";

export const FAST_MODEL = process.env.AI_MODEL_FAST ?? "anthropic/claude-haiku-4.5";
export const SMART_MODEL = process.env.AI_MODEL ?? "anthropic/claude-sonnet-4.5";

export function aiAvailable() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL);
}

export const model = (id: string) => gateway(id);
