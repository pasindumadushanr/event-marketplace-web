import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import { BRAND_DESCRIPTION, jsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nakathata.lk | Plan Your Next Celebration",
  description: BRAND_DESCRIPTION,
  applicationName: "Nakathata.lk",
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  icons: {
    icon: [
      {
        url: "/images/brand/favicon-96.png",
        type: "image/png",
        sizes: "96x96",
      },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32 48x48 64x64 256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/brand/favicon-180.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: "Nakathata.lk",
    title: "Nakathata.lk | Plan Your Next Celebration",
    description:
      "Discover event venues and service providers across Sri Lanka with Nakathata.lk.",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: "/images/brand/nakathata-logo.jpg",
        width: 2048,
        height: 2048,
        alt: "Nakathata.lk — Weddings, Events, Everything Together",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Nakathata.lk | Plan Your Next Celebration",
    description:
      "Discover event venues and service providers across Sri Lanka with Nakathata.lk.",
    images: ["/images/brand/nakathata-logo.jpg"],
  },
};

import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Nakathata.lk",
                url: SITE_URL,
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/images/brand/nakathata-logo.jpg`,
                  width: 2048,
                  height: 2048,
                },
                sameAs: [
                  "https://web.facebook.com/profile.php?id=61595001868271",
                  "https://www.instagram.com/nakathata.lk/",
                  "https://www.tiktok.com/@nakathata.lk",
                  "https://www.youtube.com/channel/UCYSC4gU8KyQuhFn7p3RUjMw",
                ],
              }),
            }}
          />
          <LanguageProvider>
            <ShortlistProvider>{children}</ShortlistProvider>
          </LanguageProvider>
          <Toaster />
        </AuthProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
