export type FaqGroup = { id: string; title: string; items: { q: string; a: string }[] };

export const FAQ: FaqGroup[] = [
  {
    id: "therapists",
    title: "For therapists",
    items: [
      {
        q: "Who is Sessio for?",
        a: "Independent psychologists, psychotherapists and counsellors in Poland who already have clients and want booking, payments, video and notes in one calm place. It works in Polish, Ukrainian and English.",
      },
      {
        q: "Do you bring me new clients?",
        a: "No — and that is deliberate. Sessio runs the practice you already have. There is no marketplace, no ranking and no ban on sharing your own contacts. Many therapists keep a marketplace profile for reviews and send clients to their own Sessio link to book.",
      },
      {
        q: "How long does it take to set up?",
        a: "About ten minutes: sign in with Google or email, write a few words about yourself, set your price and hours, and connect Stripe. The guide “Set up your booking page” shows each step.",
      },
      {
        q: "Can I move my existing clients over?",
        a: "Yes. Send them your booking link once. When they book, their client file is created automatically, and from then on they can rebook, move sessions and write to you from the client portal.",
      },
      {
        q: "Does Sessio record my sessions?",
        a: "Never. Video goes directly between you and your client, encrypted, and nothing is stored on our servers. Voice memos for notes are transcribed in your browser and the audio is discarded.",
      },
      {
        q: "Can a clinic or a group practice use Sessio?",
        a: "Not yet. Sessio is built for one therapist and their clients. Multi-therapist practices with shared calendars are next on our list — write to us and we'll let you know.",
      },
    ],
  },
  {
    id: "clients",
    title: "For clients",
    items: [
      {
        q: "Do I need an account to book?",
        a: "No. You pick a time, leave your name and email, and prepay. If you'd like to see your sessions, move one or write to your therapist later, you can sign in to the client portal with Google or with the same email.",
      },
      {
        q: "How do I join an online session?",
        a: "Open the link from your confirmation email, calendar invite or day-before reminder. The Join button unlocks 10 minutes before the session and works in the browser — there's nothing to install.",
      },
      {
        q: "Can I change the time of my session?",
        a: "Yes, inside your therapist's cancellation window. Sign in to the client portal, open the session and choose Change time — you'll see your therapist's free times.",
      },
      {
        q: "Who reads my messages?",
        a: "Your therapist. A simple assistant may answer practical questions — prices, free times, how sessions work — from your therapist's settings. Anything personal waits for your therapist.",
      },
      {
        q: "What if I'm in crisis?",
        a: "Sessio is not an emergency service. If you are in danger, call 112. In Poland you can also call 116 123 (adults) or 116 111 (children and young people), free and around the clock.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & pricing",
    items: [
      {
        q: "How much does Sessio cost?",
        a: "149 zł a month or 1,490 zł a year, all-in. No commission, no per-client fees and no 12-month contract. Founding therapists keep that price for life.",
      },
      {
        q: "Do you take a share of my sessions?",
        a: "No. Clients pay into your own Stripe account and Sessio never holds the money. Stripe charges its processing fee (about 2% per session) directly to your account.",
      },
      {
        q: "Which payment methods can clients use?",
        a: "BLIK, cards (including Apple Pay and Google Pay where available) and Przelewy24, on Stripe's own secure checkout page.",
      },
      {
        q: "What happens when a client cancels?",
        a: "Inside your free-cancellation window, Sessio cancels the session and refunds the client automatically. After the window, the session stays paid, as your policy says.",
      },
      {
        q: "Why do I need my own Stripe account?",
        a: "So the money is legally and practically yours from the first second. You get payouts to your bank, your own dashboard and your own reports; Sessio only tells Stripe what to charge.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & the law",
    items: [
      {
        q: "Is Sessio ready for the new Psychologist Act?",
        a: "The documentation duties in Art. 28 apply from 19 May 2028. Sessio already structures every record around the Act's minimum content and keeps your private working notes separate, as the Act allows.",
      },
      {
        q: "Where is my data stored?",
        a: "In the European Union, encrypted at rest. Emails go through an EU region. We sign a data-processing agreement with every therapist: you are the controller, Sessio is your processor.",
      },
      {
        q: "Does AI read my clients' records?",
        a: "Only if you use voice-memo notes, and only after names and contact details are replaced with placeholders on your device. The AI formats your own words into a draft; it never diagnoses, scores risk or suggests treatment, and nothing is saved until you sign.",
      },
      {
        q: "How long are records kept?",
        a: "Five years from the end of the year in which services ended, as the Act requires. After that, records can be destroyed with a written protocol.",
      },
      {
        q: "Can I export or delete everything?",
        a: "Yes. You can export your data at any time. When you leave, we keep nothing beyond what the law requires.",
      },
    ],
  },
];
