import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { aiAvailable, model, SMART_MODEL } from "@/lib/ai";

const Body = z.object({
  transcript: z.string().min(5).max(20000),
  lang: z.enum(["pl", "uk", "en"]),
  sessionNumber: z.number().int().min(1).max(999),
  form: z.string().max(80),
});

const LANG_NAME = { pl: "Polish", uk: "Ukrainian", en: "English" } as const;

function localDraft(transcript: string, sessionNumber: number, form: string) {
  const clean = transcript.replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const working = sentences.filter((x) => /^(check|consider|maybe|next time i|remember|sprawdzi|rozważ|перевір)/i.test(x)).join(" ");
  const record = sentences.filter((x) => !working.includes(x)).join(" ");
  return {
    record: `Individual session (${sessionNumber}), ${form.toLowerCase()}. ${record.charAt(0).toUpperCase()}${record.slice(1)}`,
    working,
    offline: true,
  };
}

export async function POST(req: Request) {
  const { user } = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "The memo is too short to draft from." }, { status: 400 });
  const { transcript, lang, sessionNumber, form } = parsed.data;

  if (!aiAvailable()) return NextResponse.json(localDraft(transcript, sessionNumber, form));

  try {
    const { output } = await generateText({
      model: model(SMART_MODEL),
      output: Output.object({
        schema: z.object({
          record: z
            .string()
            .describe("The formal session record: 3–6 plain sentences, past tense, third person, professional and neutral."),
          working: z
            .string()
            .describe("Optional: the psychologist's own hypotheses or reminders found in the memo (things like 'check…', 'consider…'). Empty string if none."),
        }),
      }),
      system: `You turn a psychologist's dictated post-session memo into the formal entry for psychological documentation (Polish Psychologist Act 2026, art. 28).
Rules:
- Write in ${LANG_NAME[lang]}.
- Use ONLY facts in the memo. Never add diagnoses, ICD codes, risk judgements, interpretations or recommendations that the psychologist did not say.
- Names are already replaced with [client] / [psychologist]; keep those placeholders or say "the client". Never invent names.
- Structure (as flowing text, no headings): type and number of session; what was worked on; methods used; the client's reported progress or state; agreed homework and plan for next time.
- The record states what happened. The psychologist's own thinking goes into "working", never into the record: hypotheses ("I wonder whether…", "maybe it's…", "zastanawiam się…", "może…", "hipoteza"), reminders to self ("check next time…", "ask about…", "next time I should…", "sprawdzić następnym razem…", "zapytać o…"), and impressions of the therapeutic relationship. Move each such sentence to "working", in ${LANG_NAME[lang]}.
- If the memo mentions risk (self-harm, harm to others), include it factually as stated.`,
      prompt: `Session number: ${sessionNumber}\nForm: ${form}\n\nMemo:\n"""${transcript}"""`,
    });
    return NextResponse.json(output);
  } catch (e) {
    console.error(e);
    // AI unavailable — fall back to a local, rule-based draft so the therapist is never blocked.
    return NextResponse.json(localDraft(transcript, sessionNumber, form));
  }
}
