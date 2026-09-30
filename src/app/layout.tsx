import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nakathata.lk'),
  title: 'Nakathata.lk | Plan Your Next Celebration',
  description: 'Discover event venues and service providers across Sri Lanka. Find your setting, connect with vendors, and plan your celebration with Nakathata.lk.',
  applicationName: 'Nakathata.lk',
  openGraph: {
    siteName: 'Nakathata.lk',
    title: 'Nakathata.lk | Plan Your Next Celebration',
    description: 'Discover event venues and service providers across Sri Lanka with Nakathata.lk.',
    locale: 'en_LK',
    type: 'website',
  },
};

import { AuthProvider } from "@/lib/auth-context";
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
          {children}
          <Toaster />
        </AuthProvider>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
