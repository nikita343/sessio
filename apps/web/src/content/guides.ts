export type Guide = {
  slug: string;
  title: string;
  dek: string;
  audience: "Therapists" | "Clients";
  kind: "Video" | "Step by step";
  minutes: string;
  video?: string;
  poster?: string;
  tone: "sage" | "lavender" | "sky" | "clay";
  steps: { title: string; body: string }[];
  tips?: string[];
  tryIt?: { label: string; href: string };
};

const APP = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

export const GUIDES: Guide[] = [
  {
    slug: "set-up-your-booking-page",
    title: "Set up your booking page",
    dek: "Your name, your words, your price and your hours — the page clients book from, ready in about ten minutes.",
    audience: "Therapists",
    kind: "Video",
    minutes: "0:23",
    video: "/guides/setup.mp4",
    poster: "/guides/setup.webp",
    tone: "sage",
    steps: [
      { title: "Open Booking page", body: "In the sidebar, choose Booking page. At the top you'll see your own link — usesessio.com/your-name — with buttons to copy it or open the page as a client sees it." },
      { title: "Write a few words for clients", body: "Add your title (for example “Psychologist · CBT”), the city, and two or three sentences on who you work with and how. Plain language works best." },
      { title: "Set your session", body: "Choose the length and the price in złoty. Clients prepay this amount when they book, straight into your own Stripe account." },
      { title: "Choose when you work", body: "Tick the days you work and set the hours. Clients can only pick times inside these hours, shown in Warsaw time. Existing sessions are blocked out automatically." },
      { title: "Pick your languages and save", body: "Your page switches between Polish, Ukrainian and English. Save, then open the page to see it exactly as a client would." },
    ],
    tips: [
      "Put your link in your email signature and on your marketplace profile.",
      "Send existing clients the link once — after that they rebook on their own.",
    ],
    tryIt: { label: "Explore the demo practice", href: `${APP}/login` },
  },
  {
    slug: "how-clients-book-and-prepay",
    title: "How a client books and prepays",
    dek: "The whole booking flow from your client's side: a free time, their details, consent, and BLIK on Stripe's secure page.",
    audience: "Therapists",
    kind: "Video",
    minutes: "0:36",
    video: "/guides/book.mp4",
    poster: "/guides/book.webp",
    tone: "sky",
    steps: [
      { title: "Pick a day and a time", body: "Your page shows only real free times. The client taps a day, then a time — the price and length are always on screen." },
      { title: "Leave their details", body: "Name and email are required; phone and a short note are optional. They choose online or in person if you offer both." },
      { title: "Agree to start before 14 days", body: "Because the session may happen within the 14-day withdrawal period, the client ticks a consent box. Sessio stores that consent with the booking." },
      { title: "Prepay on Stripe", body: "The client pays with BLIK, card or Przelewy24 on Stripe's own checkout page. The money goes to your Stripe account, not to Sessio." },
      { title: "Confirmation arrives on its own", body: "The client gets a confirmation email with a calendar invite and the video link, plus a reminder the day before. You see the session appear on your Today screen." },
    ],
    tips: ["If a client leaves the payment page, the time is released straight away for someone else."],
    tryIt: { label: "Book on the demo page", href: `${APP}/anna-kowalska?lang=en` },
  },
  {
    slug: "a-tour-of-your-practice",
    title: "A 30-second tour of your practice",
    dek: "Today, Calendar, Clients, Inbox and Payments — where everything lives once clients start booking.",
    audience: "Therapists",
    kind: "Video",
    minutes: "0:33",
    video: "/guides/tour.mp4",
    poster: "/guides/tour.webp",
    tone: "lavender",
    steps: [
      { title: "Today", body: "Your sessions for the day, who has paid, notes still to write, and what happened while you were in session — new bookings, moves and messages." },
      { title: "Calendar", body: "The week at a glance. Sessions clients booked and ones you added yourself sit side by side." },
      { title: "Clients", body: "One file per client: upcoming and past sessions, payments, signed records and messages." },
      { title: "Inbox", body: "Questions from your booking page and the client portal. The assistant answers simple ones from your settings; anything personal waits here for you." },
      { title: "Payments", body: "What's been paid, refunded or is still outstanding — and the status of your Stripe payouts." },
    ],
    tryIt: { label: "Explore the demo practice", href: `${APP}/login` },
  },
  {
    slug: "voice-memo-to-signed-record",
    title: "From a voice memo to a signed record",
    dek: "Two minutes of dictation after a session becomes a record structured for Art. 28 — with your working notes kept apart.",
    audience: "Therapists",
    kind: "Video",
    minutes: "0:33",
    video: "/guides/notes.mp4",
    poster: "/guides/notes.webp",
    tone: "lavender",
    steps: [
      { title: "Open the session", body: "Go to Notes. Sessions without a record are listed at the top — choose one and press Dictate note." },
      { title: "Speak, or type", body: "Record what matters in your own words. Transcription happens in your browser, so the audio never leaves your device. You can also type straight into the transcript." },
      { title: "Draft the record", body: "Sessio removes names and contact details, then shapes your words into the formal record. Hypotheses and reminders to yourself go into private working notes." },
      { title: "Read, edit and sign", body: "Nothing is saved as a record until you approve it. Change any sentence, then Approve & sign. The audio is discarded." },
    ],
    tips: [
      "The formal record is what a client may ask to see; working notes are excluded from that, as the Act allows.",
      "AI only formats your own words. It never diagnoses, scores risk or suggests treatment.",
    ],
    tryIt: { label: "Try it in the demo", href: `${APP}/login` },
  },
  {
    slug: "the-client-portal",
    title: "The client portal: see, move and message",
    dek: "What your clients see when they sign in: their sessions, a self-service way to change the time, and a direct line to you.",
    audience: "Clients",
    kind: "Video",
    minutes: "0:39",
    video: "/guides/portal.mp4",
    poster: "/guides/portal.webp",
    tone: "clay",
    steps: [
      { title: "Sign in with Google or email", body: "Clients sign in with the same email they booked with. Every session they've booked with any therapist on Sessio appears in one place." },
      { title: "See what's next", body: "Upcoming sessions show the date and time, how to join, and whether the session is paid." },
      { title: "Change the time", body: "Inside the therapist's window, a client can pick another free time on their own. The therapist sees the change straight away, and the old time is freed for someone else." },
      { title: "Write to the therapist", body: "Messages go to the therapist's inbox and they reply by email or in the portal. Sessio is not an emergency service — in an emergency, call 112." },
    ],
    tryIt: { label: "Open the demo client portal", href: `${APP}/me/login?lang=en` },
  },
  {
    slug: "connect-stripe",
    title: "Connect Stripe and get paid directly",
    dek: "Clients pay into your own Stripe account. Sessio never holds your money and takes 0% commission.",
    audience: "Therapists",
    kind: "Step by step",
    minutes: "5 min",
    tone: "sage",
    steps: [
      { title: "Open Payments", body: "In the sidebar, choose Payments and find the Payouts card. Until Stripe is connected, your booking page can't take paid bookings." },
      { title: "Connect Stripe", body: "Press Connect Stripe. You'll go to Stripe's own secure pages — Sessio never sees your bank or identity details." },
      { title: "Tell Stripe about your practice", body: "Stripe asks for your details as a sole trader or company, your bank account for payouts, and a quick identity check. Have your NIP and IBAN ready." },
      { title: "Come back to Sessio", body: "When Stripe is done, you return to Payments and the card says Connected. Your booking page starts taking BLIK, card and Przelewy24 straight away." },
      { title: "Get paid out", body: "Stripe pays out to your bank on its usual schedule. Stripe's processing fees apply; Sessio adds nothing on top of your 149 zł monthly plan." },
    ],
    tips: [
      "You keep full access to your own Stripe dashboard for invoices, refunds and reports.",
      "If a client cancels inside your free-cancellation window, Sessio refunds them automatically.",
    ],
  },
  {
    slug: "join-a-video-session",
    title: "Joining a video session",
    dek: "For clients: how to join your online session from a phone or a laptop, with nothing to install.",
    audience: "Clients",
    kind: "Step by step",
    minutes: "2 min",
    tone: "sky",
    steps: [
      { title: "Find your link", body: "The video link is in your confirmation email, in the calendar invite and in the reminder you get the day before. It's also on your session in the client portal." },
      { title: "Open it ten minutes early", body: "The Join button unlocks 10 minutes before the session. Use a recent Chrome, Safari, Edge or Firefox — there's no app to install." },
      { title: "Allow camera and microphone", body: "Your browser will ask for permission. If you said no by accident, allow access in the browser settings and reload the page." },
      { title: "Check yourself, then join", body: "You'll see a preview of your camera. When you're ready, press Join — your therapist joins from their side." },
    ],
    tips: [
      "Headphones help with privacy and echo. A quiet room with a closed door helps more.",
      "Video goes directly between you and your therapist, encrypted, and nothing is recorded.",
      "If the picture won't connect, switching off a VPN or moving from office Wi-Fi to mobile data usually fixes it.",
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
