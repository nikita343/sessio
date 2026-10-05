import type { IconName } from "@/components/nav-data";

export type Product = {
  slug: string;
  name: string;
  icon: IconName;
  tone: "sage" | "lavender" | "sky" | "clay";
  hint: string;
  title: string;
  dek: string;
  media: { video: string; poster: string } | { photo: string; alt: string };
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  privacy: string[];
  faq: { q: string; a: string }[];
  guide?: string;
  demo: { label: string; href: string };
};

const APP = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com";

export const PRODUCTS: Product[] = [
  {
    slug: "booking",
    name: "Booking page",
    icon: "calendar",
    tone: "sage",
    hint: "Your own link, real free times, 0% commission",
    title: "A booking page that feels like you.",
    dek: "Your photo, your words, your price and your hours on your own link. Clients see only real free times and book in under a minute, in Polish, English or Ukrainian.",
    media: { video: "/guides/setup.mp4", poster: "/guides/setup.webp" },
    steps: [
      { title: "Set it up once", body: "Write a few words, set your price, session length and working hours. About ten minutes." },
      { title: "Share your link", body: "usesessio.com/your-name goes in your email signature, your profile and your messages to clients." },
      { title: "Clients book themselves", body: "They pick a free time, leave their details, accept your agreement and prepay. You get a notification and the session lands in your calendar." },
    ],
    features: [
      { title: "Only real free times", body: "Your hours minus existing sessions. Double booking is blocked by the database, not by luck." },
      { title: "Online or in person", body: "Offer one or both. Clients choose when they book; in-person sessions show your address." },
      { title: "Three languages", body: "The page switches between Polish, English and Ukrainian, and emails follow the client's language." },
      { title: "Your cancellation window", body: "Shown before booking. Inside it clients cancel or move on their own; after it, the session stays paid." },
      { title: "Questions before booking", body: "A message box on the page. The assistant answers practical questions; personal ones wait for you." },
      { title: "Signed-in clients", body: "Returning clients sign in with Google and their details are filled in for them." },
    ],
    privacy: ["Only the client's name, email and optional phone and note are collected.", "The page never shows who else is booked — only that a time is taken.", "Data is stored in the EU."],
    faq: [
      { q: "Can I hide my page until I'm ready?", a: "Yes. Your page goes live when you finish setup, and you can share the link only with the clients you choose." },
      { q: "Can clients book several sessions at once?", a: "Not yet — each booking is one session. Clients rebook from their portal in a few taps." },
      { q: "Does it work on phones?", a: "Yes. Most clients book on their phone; the page is built for that first." },
    ],
    guide: "set-up-your-booking-page",
    demo: { label: "Open a demo booking page", href: `${APP}/anna-kowalska` },
  },
  {
    slug: "payments",
    name: "Payments",
    icon: "card",
    tone: "sky",
    hint: "BLIK, card and Przelewy24, straight to your account",
    title: "Paid before the session. Straight to you.",
    dek: "Clients prepay with BLIK, card or Przelewy24 on Stripe's secure checkout. The money goes to your own Stripe account — Sessio never holds it and takes 0% commission.",
    media: { video: "/guides/book.mp4", poster: "/guides/book.webp" },
    steps: [
      { title: "Connect Stripe", body: "Stripe checks your details and bank account on its own pages. Sessio never sees them." },
      { title: "Clients prepay when booking", body: "The time is held while they pay. If they leave checkout, it's released for someone else straight away." },
      { title: "Get paid out", body: "Stripe pays out to your bank on its usual schedule. Refunds inside your window happen automatically." },
    ],
    features: [
      { title: "0% commission", body: "One monthly price for Sessio. Stripe's processing fee (about 2%) is charged by Stripe to your account." },
      { title: "BLIK first", body: "The way most people in Poland pay online, plus cards with Apple Pay and Google Pay, and Przelewy24." },
      { title: "Automatic refunds", body: "When a client cancels inside your free window, the refund goes back without you lifting a finger." },
      { title: "No more Friday checks", body: "Every session is paid before it happens, so there are no transfers to match by hand." },
      { title: "Your own dashboard", body: "Full access to your Stripe account for receipts, reports and payouts." },
      { title: "Right of withdrawal handled", body: "The client's request to start within 14 days is recorded with every booking." },
    ],
    privacy: ["Card and bank details are entered on Stripe's pages, never on Sessio's.", "Sessio stores only whether a session is paid, how and how much.", "Payments are direct charges to your account; Sessio is never in the money flow."],
    faq: [
      { q: "Do I need a company?", a: "No. A sole-trader registration (JDG) is enough for Stripe." },
      { q: "What happens with a late cancellation?", a: "After your free window the session stays paid, as your agreement says. You can always refund by hand in Stripe." },
      { q: "Can clients pay by bank transfer?", a: "Przelewy24 covers instant bank transfers from all major Polish banks." },
    ],
    guide: "connect-stripe",
    demo: { label: "Try a sandbox booking", href: `${APP}/anna-kowalska` },
  },
  {
    slug: "video",
    name: "Private video room",
    icon: "video",
    tone: "lavender",
    hint: "Encrypted, peer-to-peer, never recorded",
    title: "A room that opens on its own — and keeps nothing.",
    dek: "Every online session gets its own private room. Video, audio and the in-session chat go directly between you and your client, encrypted, and never pass through or rest on our servers.",
    media: { photo: "/photos/online.webp", alt: "A therapist with headphones in a video session at her home desk" },
    steps: [
      { title: "A link per session", body: "It's in the confirmation, the calendar invite and the day-before reminder." },
      { title: "Join from the browser", body: "The Join button unlocks 10 minutes before. Nothing to install, on a laptop or a phone." },
      { title: "Talk, privately", body: "The call connects directly between your two browsers. When you leave, nothing remains." },
    ],
    features: [
      { title: "End-to-end path", body: "Media is encrypted between the two browsers (WebRTC). Sessio's servers only help them find each other." },
      { title: "Locked to two people", body: "The room accepts exactly one therapist and one client; the setup channel is a secret handed out only after an access check." },
      { title: "Private chat", body: "Send a link or a word without saying it out loud. Messages go browser to browser and vanish when the call ends." },
      { title: "Never recorded", body: "There is no recording feature to switch on by mistake." },
      { title: "Camera check first", body: "A preview with mute and camera controls before joining." },
      { title: "Shows how you're connected", body: "The top bar tells you the call is encrypted and whether it runs directly or through a relay." },
    ],
    privacy: ["Only the therapist (signed in) or the client (secret link) can open the room.", "A cancelled session closes its room.", "No audio, video or chat is stored anywhere."],
    faq: [
      { q: "What if the connection drops?", a: "Both sides reconnect automatically when the network comes back; the agreement covers what happens if a session is cut short." },
      { q: "Does it work on company Wi-Fi?", a: "Usually. Very strict networks can block direct calls; switching to mobile data fixes it, and relay support is on the way." },
      { q: "Can I share my screen?", a: "Not yet. It's on the list." },
    ],
    guide: "join-a-video-session",
    demo: { label: "See the demo practice", href: `${APP}/login` },
  },
  {
    slug: "notes",
    name: "Voice-memo notes",
    icon: "mic",
    tone: "lavender",
    hint: "Two minutes of dictation, a record to sign",
    title: "Two minutes of you. A record ready to sign.",
    dek: "After the session, dictate what mattered. It's transcribed on your own device, names are removed, and your words are shaped into a record structured for the new Psychologist Act. You read, edit and sign.",
    media: { video: "/guides/notes.mp4", poster: "/guides/notes.webp" },
    steps: [
      { title: "Dictate or type", body: "Two minutes at the window. Transcription runs in your browser; the audio never leaves it." },
      { title: "Get a draft", body: "Names and contact details are replaced, then AI formats your words into the formal record and private working notes." },
      { title: "Edit and sign", body: "Nothing is saved as a record until you approve it. The audio is discarded." },
    ],
    features: [
      { title: "Art. 28 structure", body: "Who, when, what was provided, by whom — dated and signed, as the Act requires from May 2028." },
      { title: "Working notes kept apart", body: "Hypotheses and reminders to yourself stay out of the formal record and out of client exports." },
      { title: "Redaction before AI", body: "Names, emails, phone numbers, PESEL and addresses are removed on your device first." },
      { title: "Never diagnoses", body: "AI formats your own words only. No diagnoses, risk scores or treatment suggestions." },
      { title: "Works without AI", body: "If AI is unavailable you get a clearly labelled template draft, so you're never blocked." },
      { title: "Five-year retention", body: "Records are kept for the period the Act requires, counted from the end of the year your work ended." },
    ],
    privacy: ["Audio is transcribed in your browser and discarded.", "Only redacted text is sent to the model, without retention by Sessio.", "Records are stored in the EU and visible only to you."],
    faq: [
      { q: "Can I write notes without AI?", a: "Yes. Type the record yourself; the AI step is optional." },
      { q: "Which languages can I dictate in?", a: "Polish, English and Ukrainian." },
      { q: "Can a client see my notes?", a: "A client may ask for their formal record. Your working notes are excluded, as the Act allows." },
    ],
    guide: "voice-memo-to-signed-record",
    demo: { label: "Try it in the demo", href: `${APP}/login` },
  },
  {
    slug: "assistant",
    name: "Admin assistant",
    icon: "chat",
    tone: "clay",
    hint: "Answers clients in their language, day and night",
    title: "Someone to answer “what time is free?” at 11 pm.",
    dek: "Clients ask about prices, times and how sessions work. The assistant answers from your settings in their language, and anything personal waits for you in the inbox.",
    media: { photo: "/photos/desk.webp", alt: "A calm therapist's desk with tea, a planner and a phone lying face down" },
    steps: [
      { title: "A client asks", body: "From your booking page or their portal, in Polish, English or Ukrainian." },
      { title: "The assistant answers the practical part", body: "Price, length, free times, how online sessions work — straight from your settings." },
      { title: "You handle the rest", body: "Anything personal is passed to your inbox untouched, marked for your reply." },
    ],
    features: [
      { title: "Only your facts", body: "It answers from your page and calendar. If it doesn't know, it says you'll reply." },
      { title: "Never clinical", body: "No advice, no assessments, no opinions about what a client is going through." },
      { title: "Crisis lines at once", body: "Messages that may mean someone is at risk get 112 and 116 123 immediately and are flagged urgent for you." },
      { title: "In the client's language", body: "Polish, English or Ukrainian, matching how they wrote." },
      { title: "One inbox", body: "Booking-page questions and portal messages in one place, newest first." },
      { title: "You can always see what it said", body: "Every reply is in the thread, so nothing happens behind your back." },
    ],
    privacy: ["It sees your settings and free times — never your notes or session content.", "Personal messages are not processed beyond forwarding them to you.", "Messages are stored in the EU, visible to you and the client only."],
    faq: [
      { q: "Does it reply to everything?", a: "Only to practical questions it can answer from your settings. Everything else gets a short note that you'll reply personally." },
      { q: "What if it gets something wrong?", a: "It only repeats facts from your settings; keep those up to date and it stays right. You see every reply." },
      { q: "Does it book sessions for clients?", a: "It suggests free times and links to your page; the client books and pays themselves." },
    ],
    demo: { label: "Ask the demo a question", href: `${APP}/anna-kowalska` },
  },
  {
    slug: "client-portal",
    name: "Client portal",
    icon: "heart",
    tone: "clay",
    hint: "Clients see, move and message — without phoning",
    title: "Your clients' side, made simple.",
    dek: "Clients sign in with Google or the email they booked with. They see every upcoming session and how to join, move a session inside your window, and write to you directly.",
    media: { video: "/guides/portal.mp4", poster: "/guides/portal.webp" },
    steps: [
      { title: "Clients sign in", body: "Google or email. No new password, no app to install." },
      { title: "They manage their sessions", body: "Join links, payment status, and a self-service way to change the time inside your window." },
      { title: "They write to you", body: "Messages reach your inbox; you reply by email or in Sessio." },
    ],
    features: [
      { title: "Self-service moves", body: "Inside your cancellation window clients pick another free time; you see the change at once." },
      { title: "All their therapists", body: "One place for every Sessio practice a client books with." },
      { title: "Three languages", body: "Polish, English or Ukrainian, remembered for next time." },
      { title: "Crisis help built in", body: "Urgent words in a message show help lines immediately and flag the thread for you." },
      { title: "Fewer no-shows", body: "Day-before reminders link straight to the portal and the room." },
      { title: "Book again", body: "One tap back to your page for the next session." },
    ],
    privacy: ["Clients see only their own sessions and messages.", "Access is tied to the verified email they booked with.", "Signing out leaves nothing on a shared device."],
    faq: [
      { q: "Do clients need an account to book?", a: "No. The portal is there when they want it." },
      { q: "Can clients cancel outside my window?", a: "No — they can only message you. Inside the window they cancel or move on their own, with an automatic refund." },
      { q: "Can I turn the portal off?", a: "It's part of every practice so clients always have a way to reach you and join sessions." },
    ],
    guide: "the-client-portal",
    demo: { label: "Open the demo client portal", href: `${APP}/me/login?lang=en` },
  },
  {
    slug: "agreements",
    name: "Client agreements",
    icon: "shield",
    tone: "sage",
    hint: "Accepted at booking, stored with every session",
    title: "The agreement, accepted before the first session.",
    dek: "Every booking includes a clear agreement between you and your client — built from your own settings, in Polish, English or Ukrainian. Clients accept it before paying, and Sessio stores which version they accepted, and when.",
    media: { photo: "/photos/desk-2.webp", alt: "A therapist's desk with a laptop and notebook by a window" },
    steps: [
      { title: "It writes itself", body: "Your price, session length, cancellation window and address fill the template automatically." },
      { title: "Add your own terms", body: "Couples, supervision, anything specific to your practice — one term per line in Settings." },
      { title: "Clients accept at booking", body: "A required checkbox with a link to the full text; the accepted version is saved with the session." },
    ],
    features: [
      { title: "Covers the essentials", body: "Service, fee, cancellation and refunds, the 14-day withdrawal right, confidentiality, recording, online sessions, emergencies, data, minors and complaints." },
      { title: "Always matches your settings", body: "Change your price or window and the agreement updates; old bookings keep the version they accepted." },
      { title: "Proof of acceptance", body: "Date, time and a version fingerprint stored with every booking." },
      { title: "Three languages", body: "Clients read it in the language they book in." },
      { title: "Printable", body: "One click to print or save as PDF for your records." },
      { title: "Sessio isn't a party", body: "The agreement is between you and your client; Sessio is the tool, not a middleman." },
    ],
    privacy: ["The agreement states that sessions and the in-session chat are never recorded.", "It explains that you are the data controller and Sessio your processor.", "It names the help lines for emergencies."],
    faq: [
      { q: "Is it legally reviewed?", a: "It's a careful starting template based on Polish consumer law and the Psychologist Act. Have it checked if your practice has special terms." },
      { q: "Can I replace it entirely?", a: "You can add your own terms; the core sections stay so every client gets the same protections." },
      { q: "Where can I see it?", a: "Settings → Client agreement → Preview, or on any booking page." },
    ],
    demo: { label: "Read the demo agreement", href: `${APP}/anna-kowalska/agreement?lang=en` },
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
