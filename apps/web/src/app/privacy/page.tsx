import type { Metadata } from "next";
import { Footer, PageHero } from "@/components/site";

export const metadata: Metadata = {
  title: "Privacy — Sessio",
  description: "How Sessio handles therapists' and clients' data: EU storage, no recordings, on-device transcription and a data-processing agreement.",
};

const SECTIONS: [string, string, string[]][] = [
  [
    "who",
    "Who is responsible for what",
    [
      "You, the therapist, are the controller of your clients' data and documentation. Sessio processes it on your behalf.",
      "For the waitlist and our own website, Sessio is the controller of the email address you give us, and uses it only to contact you about Sessio.",
    ],
  ],
  [
    "where",
    "Where data lives",
    [
      "Client records, bookings and notes are stored in the European Union and encrypted at rest.",
      "Payments are processed by Stripe into your own account; Sessio never holds client money.",
      "Emails are sent through Resend from the EU region.",
    ],
  ],
  [
    "never",
    "What we never do",
    [
      "We never record sessions. Video runs peer-to-peer between you and your client.",
      "We never upload voice-memo audio. It is transcribed in your browser and discarded.",
      "We never sell data, and we never use your clients' records to train AI models.",
      "Our AI never diagnoses, scores risk or recommends treatment. It formats your own words.",
    ],
  ],
  [
    "ai",
    "AI steps, precisely",
    [
      "Before any text leaves your device, client and therapist names are replaced with placeholders.",
      "The de-identified text is sent to a language model only to shape it into a record, without retention by Sessio.",
      "Nothing is saved to the record until you read, edit and sign it.",
    ],
  ],
  [
    "dpa",
    "Data-processing agreement",
    [
      "Every therapist on Sessio receives a data-processing agreement (Art. 28 GDPR) listing our sub-processors and security measures.",
      "Records are kept for five years from the end of the year in which services ended, as the Psychologist Act requires, after which we prepare a destruction protocol for you.",
      "Questions or requests: hello@usesessio.com.",
    ],
  ],
];

export default function Privacy() {
  return (
    <main>
      <PageHero pill="Privacy" title="Privacy, in plain words." body="Therapy data is some of the most sensitive there is. Here is exactly what we do with it — and what we never do." />
      <div className="mx-auto flex max-w-[720px] flex-col gap-10 px-5 pb-[110px]">
        {SECTIONS.map(([id, title, items]) => (
          <section key={id} id={id} className="scroll-mt-10">
            <h2 className="t-heading-s">{title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {items.map((i) => (
                <li key={i} className="t-body-m flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="t-caption text-stone">Last updated 5 October 2026. Sessio is in early access; this page will be replaced by a full privacy policy before general availability.</p>
      </div>
      <Footer />
    </main>
  );
}
