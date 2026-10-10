import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { getPlatformSettings } from "@/lib/platform-settings-server";
import {
  PlatformSettingsProvider,
  PlatformAnalytics,
} from "@/lib/platform-settings-context";
import "./globals.css";
import "@/components/ui/public-page.css";
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

const weddingFont = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const baseMetadata: Metadata = {
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
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "32x32 48x48 64x64 256x256",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/images/brand/favicon-180.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
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

export async function generateMetadata(): Promise<Metadata> {
  const { general, seo } = await getPlatformSettings();
  return {
    ...baseMetadata,
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean),
    applicationName: general.siteName,
    openGraph: {
      ...baseMetadata.openGraph,
      title: seo.metaTitle,
      description: seo.metaDescription,
      siteName: general.siteName,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { Toaster } from "@/components/ui/sonner";
import { SiteMediaProvider } from "@/lib/site-media";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPlatformSettings();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${weddingFont.variable} antialiased font-sans`}
      >
        <PlatformSettingsProvider initial={settings}>
          <AuthProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: jsonLd({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: settings.general.siteName,
                  url: SITE_URL,
                  logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/images/brand/nakathata-logo.jpg`,
                    width: 2048,
                    height: 2048,
                  },
                  sameAs: Object.values(settings.social).filter((url) =>
                    /^https:\/\//i.test(url),
                  ),
                  email: settings.general.contactEmail,
                  telephone: settings.general.supportPhone || undefined,
                }),
              }}
            />
            <LanguageProvider>
              <SiteMediaProvider>
                <ShortlistProvider>{children}</ShortlistProvider>
              </SiteMediaProvider>
            </LanguageProvider>
            <Toaster />
          </AuthProvider>
          <PlatformAnalytics />
        </PlatformSettingsProvider>
      </body>
    </html>
  );
}
