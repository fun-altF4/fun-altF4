import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import { site } from "@/lib/site";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import JsonLd from "@/components/json-ld";
import CursorGlyphTrailLoader from "@/components/cursor-glyph-trail-loader";
import LenisProvider from "@/components/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.shortBio,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.shortBio,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.shortBio,
    creator: "@bhaveshvarma",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <JsonLd />
        <CursorGlyphTrailLoader />
        <LenisProvider>
          <Nav />
          <main className="flex-1 w-full">
            <ViewTransition
              enter="route-enter"
              exit="route-exit"
              default="none"
            >
              {children}
            </ViewTransition>
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
