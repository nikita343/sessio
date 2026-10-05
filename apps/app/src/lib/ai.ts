import { gateway } from "@ai-sdk/gateway";
import { createAnthropic } from "@ai-sdk/anthropic";

export const FAST_MODEL = process.env.AI_MODEL_FAST ?? "anthropic/claude-haiku-4.5";
export const SMART_MODEL = process.env.AI_MODEL ?? "anthropic/claude-sonnet-4.5";

/**
 * AI runs only when explicitly configured: ANTHROPIC_API_KEY (direct), AI_GATEWAY_API_KEY, or AI_GATEWAY=1
 * (Vercel AI Gateway with project auth). Otherwise every caller uses its local, labelled fallback —
 * no text is sent anywhere just to fail.
 */
export function aiAvailable() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.AI_GATEWAY === "1");
}

const DIRECT: Record<string, string> = {
  "anthropic/claude-haiku-4.5": "claude-haiku-4-5",
  "anthropic/claude-sonnet-4.5": "claude-sonnet-4-5",
};

export function model(id: string) {
  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic(DIRECT[id] ?? id.replace(/^anthropic\//, "").replace(/\./g, "-"));
  }
  return gateway(id);
}
