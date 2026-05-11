import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteContent } from "@/lib/content";
import { ThemeProvider } from "@/lib/theme";
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

// Runs before React hydrates to set data-theme on <html>, avoiding FOUC.
const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var p=s||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=p;}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-YFS4ZHWMV9" />
    </html>
  );
}
