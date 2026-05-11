import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteContent } from "@/lib/content";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deyuf.github.io"),
  title: {
    default: `${siteContent.name} — ${siteContent.eyebrow}`,
    template: `%s — ${siteContent.name}`,
  },
  description: siteContent.tagline,
  openGraph: {
    title: `${siteContent.name} — ${siteContent.eyebrow}`,
    description: siteContent.tagline,
    url: "https://deyuf.github.io",
    siteName: siteContent.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.name} — ${siteContent.eyebrow}`,
    description: siteContent.tagline,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-YFS4ZHWMV9" />
    </html>
  );
}
