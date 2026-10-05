import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Motion } from "@/components/motion";

export const metadata: Metadata = {
  metadataBase: new URL("https://usesessio.com"),
  title: "Sessio — your whole practice, in one quiet place",
  description:
    "Booking, BLIK prepayment, private video and two-minute notes for psychologists and therapists in Poland. 0% commission. Your clients stay yours.",
  openGraph: {
    title: "Sessio — your whole practice, in one quiet place",
    description: "Booking, prepayment, private video and notes for independent therapists. 0% commission.",
    url: "https://usesessio.com",
    siteName: "Sessio",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = { themeColor: "#F4F3EF" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}
