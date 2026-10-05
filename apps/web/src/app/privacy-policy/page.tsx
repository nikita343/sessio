import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Nav } from "@/components/site";

export const metadata: Metadata = {
  title: "Privacy policy — Sessio",
  description: "How Sessio collects, uses and protects personal data of therapists, their clients and visitors to usesessio.com, and how to exercise your GDPR rights.",
};

const UPDATED = "5 October 2026";

type Block = { id: string; h: string; p?: string[]; ul?: string[]; table?: [string, string, string][] };

const BLOCKS: Block[] = [
  {
    id: "who",
    h: "1. Who we are and what this policy covers",
    p: [
      "Sessio is practice software for psychologists and therapists, run from Warsaw, Poland. This policy explains how personal data is handled on usesessio.com, app.usesessio.com and in emails we send.",
      "There are two different roles, and it matters which one applies to you:",
    ],
    ul: [
      "For therapists who use Sessio, visitors to our website and people who join our waitlist or webinars, Sessio is the data controller.",
      "For clients of a therapist (people who book sessions), the therapist is the controller. Sessio processes that data only on the therapist's behalf and on their instructions, under a data processing agreement (Art. 28 GDPR). Questions about your therapy data should go to your therapist first; we will help them answer.",
    ],
  },
  {
    id: "data",
    h: "2. What data we process, why, and on what legal basis",
    table: [
      ["Website visitors", "Technical data needed to deliver pages (IP address, browser, requested page) in short-lived server logs. No analytics or advertising trackers.", "Legitimate interest in running a secure website (Art. 6(1)(f))"],
      ["Waitlist and webinar sign-ups", "Email address and which form you used.", "Your consent (Art. 6(1)(a)); withdraw any time"],
      ["Therapists (account holders)", "Name, email, sign-in details, practice details (title, city, bio, photo, address, prices, hours, languages), Stripe account status, subscription and support messages.", "Performing our contract with you (Art. 6(1)(b)); legal obligations such as accounting (Art. 6(1)(c))"],
      ["Clients of therapists (processed for the therapist)", "Name, email, optional phone and note, bookings, payment status, accepted agreement version, messages, and the records the therapist writes.", "The therapist's legal basis as controller; health data under Art. 9(2)(h) GDPR"],
      ["Everyone who writes to us", "Your message and contact details.", "Legitimate interest in answering you (Art. 6(1)(f))"],
    ],
  },
  {
    id: "never",
    h: "3. What we never do",
    ul: [
      "We never record therapy sessions. Video, audio and in-session chat travel directly between the two participants' browsers, encrypted, and are not stored anywhere.",
      "We never upload voice memos. They are transcribed in the therapist's browser and discarded.",
      "We never sell personal data, never use it for advertising, and never use clients' records to train AI models.",
      "Our AI never diagnoses or recommends treatment. Before a therapist's dictation is sent for formatting, names and contact details are replaced on their device. The booking assistant receives only the text a client types, never their name or email.",
    ],
  },
  {
    id: "processors",
    h: "4. Who processes data for us",
    p: ["We use a small number of providers, each under a data processing agreement. Data is stored in the European Union."],
    table: [
      ["Supabase (database, sign-in)", "Stores accounts, bookings, messages and records.", "EU — Ireland"],
      ["Vercel (hosting)", "Serves the website and app; runs server code.", "EU — Dublin region"],
      ["Stripe (payments)", "Processes client payments directly into the therapist's own account. Card and bank details are entered only on Stripe's pages.", "EU entity; Stripe's own privacy policy applies to payment data"],
      ["Resend (email)", "Sends booking confirmations, reminders and replies.", "Sends from the EU (Ireland) region"],
      ["Anthropic (AI formatting)", "Formats a therapist's de-identified dictation into a draft record, when the therapist uses that feature.", "Provider in the USA, under Standard Contractual Clauses; inputs are not used to train models"],
      ["Anthropic (booking assistant)", "Answers practical questions typed on a therapist's booking page or in the client portal — prices, free times, how sessions work. Only the message text and the therapist's public page details are sent; never the client's name or email.", "Provider in the USA, under Standard Contractual Clauses; inputs are not used to train models"],
      ["Google (sign-in, connection setup)", "“Continue with Google” sign-in, and public STUN servers that help two browsers find a direct route for video.", "Google sign-in sees your Google account email; STUN servers see only network addresses"],
    ],
  },
  {
    id: "retention",
    h: "5. How long we keep data",
    ul: [
      "Waitlist and webinar sign-ups: until you unsubscribe or ask us to delete them, and at most 24 months after our last contact.",
      "Therapist accounts: while the account is active. After closing, we delete practice data within 30 days, except what accounting law requires us to keep (usually 5 years).",
      "Clients' records: as the therapist instructs. The Psychologist Act requires records to be kept for 5 years from the end of the year in which services ended; after that they can be destroyed with a protocol.",
      "Server logs: a few days to a few weeks, for security and debugging.",
    ],
  },
  {
    id: "rights",
    h: "6. Your rights",
    p: ["Under the GDPR you can ask us to:"],
    ul: [
      "give you access to your data and a copy of it;",
      "correct inaccurate data, or complete incomplete data;",
      "delete your data, or restrict how we use it;",
      "move your data to another service in a common format;",
      "stop processing based on our legitimate interest;",
      "withdraw consent you gave, at any time, without affecting earlier processing.",
    ],
  },
  {
    id: "how",
    h: "7. How to use your rights or complain",
    p: [
      "Write to hello@usesessio.com. We answer within one month. If you are a therapist's client, we'll pass your request to your therapist, who decides as controller, and help them answer.",
      "You can also complain to the Polish data protection authority: Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl.",
    ],
  },
  {
    id: "cookies",
    h: "8. Cookies",
    p: ["We use only cookies that are needed for the service to work. There are no analytics, advertising or tracking cookies, so there is no cookie banner to click."],
    table: [
      ["Sign-in session (sb-…)", "Keeps you signed in to app.usesessio.com.", "Until you sign out or the session expires"],
      ["sessio_lang", "Remembers the language you chose (Polish, English or Ukrainian).", "1 year"],
    ],
  },
  {
    id: "security",
    h: "9. Security",
    ul: [
      "Encryption in transit (HTTPS) everywhere and encryption at rest for stored data.",
      "Row-level security in the database: each therapist can reach only their own practice; each client only their own sessions and messages.",
      "Video rooms open only for the signed-in therapist or the client's secret link, are locked to those two people, and close when a session is cancelled.",
      "Access to production systems is limited to the people who run Sessio.",
    ],
  },
  {
    id: "children",
    h: "10. Children",
    p: ["Sessio's accounts are for adults. Sessions with anyone under 18 are booked by a legal guardian, as the therapist's agreement requires."],
  },
  {
    id: "changes",
    h: "11. Changes to this policy",
    p: ["If we change how we handle data, we'll update this page and the date at the top. Significant changes are emailed to therapists before they take effect."],
  },
];

export default function PrivacyPolicy() {
  return (
    <main>
      <Nav current="/privacy-policy" />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 pb-[110px] pt-10 md:px-8 md:pt-16 lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="t-overline text-stone">On this page</p>
          <nav className="mt-3 flex flex-col gap-1" aria-label="Sections">
            {BLOCKS.map((b) => (
              <a key={b.id} href={`#${b.id}`} className="t-body-s rounded-[10px] px-2 py-1.5 text-stone hover:bg-surface hover:text-ink">
                {b.h.replace(/^\d+\.\s*/, "")}
              </a>
            ))}
          </nav>
          <Link href="/privacy" className="t-label-m mt-6 inline-flex text-sage hover:underline">
            Privacy in plain words →
          </Link>
        </aside>
        <article className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col gap-3">
            <h1 className="t-display-l !text-[clamp(36px,5vw,60px)]">Privacy policy</h1>
            <p className="t-body-m text-stone">Last updated {UPDATED}. Questions: hello@usesessio.com</p>
          </header>
          {BLOCKS.map((b) => (
            <section key={b.id} id={b.id} className="flex scroll-mt-24 flex-col gap-3 border-t border-line pt-8">
              <h2 className="t-heading-s">{b.h}</h2>
              {b.p?.map((t) => (
                <p key={t} className="t-body-m max-w-[760px] text-ink/85">
                  {t}
                </p>
              ))}
              {b.ul && (
                <ul className="flex max-w-[760px] flex-col gap-2">
                  {b.ul.map((t) => (
                    <li key={t} className="t-body-m flex gap-3 text-ink/85">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sage" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              {b.table && (
                <div className="overflow-hidden rounded-[18px] border border-line">
                  {b.table.map(([a, c, d]) => (
                    <div key={a} className="grid gap-1 border-b border-line bg-surface p-4 last:border-b-0 md:grid-cols-[1fr_1.6fr_1.1fr] md:gap-6 md:px-6">
                      <p className="t-label-m">{a}</p>
                      <p className="t-body-s text-ink/80">{c}</p>
                      <p className="t-body-s text-stone">{d}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
      <Footer />
    </main>
  );
}
