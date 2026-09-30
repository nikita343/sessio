import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://app.usesessio.com"),
  title: { default: "Sessio", template: "%s · Sessio" },
  description: "Your whole practice, in one quiet place.",
};

export const viewport: Viewport = { themeColor: "#F4F3EF" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
