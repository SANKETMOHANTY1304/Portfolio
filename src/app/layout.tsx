import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import "./editorial.css";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { siteUrl } from "@/lib/utils";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Sanket Mohanty — AI Engineer",
    template: "%s | Sanket Mohanty",
  },
  description:
    "AI engineering, generative AI, and thoughtful software. Explore Sanket Mohanty's projects and experience.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sanket Mohanty",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="top">
        <Providers nonce={nonce}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
