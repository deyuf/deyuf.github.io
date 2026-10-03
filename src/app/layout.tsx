import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteContent } from "@/lib/content";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const interTight = localFont({
  src: "../../public/fonts/inter-tight-latin.woff2",
  weight: "100 900",
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrains-mono-latin.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://me.deyuf.org"),
  title: {
    default: `${siteContent.name} — ${siteContent.eyebrow}`,
    template: `%s — ${siteContent.name}`,
  },
  description: siteContent.tagline,
  keywords: [
    "Deyu Fu",
    "Robotics Engineer",
    "AI Engineer",
    "Reinforcement Learning",
    "Dexterous Manipulation",
    "Sim2Real",
    "Humanoid Robotics",
    "ROS 2",
    "Munich",
  ],
  authors: [{ name: siteContent.name, url: "https://me.deyuf.org" }],
  creator: siteContent.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteContent.name} — ${siteContent.eyebrow}`,
    description: siteContent.tagline,
    url: "https://me.deyuf.org",
    siteName: siteContent.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.name} — ${siteContent.eyebrow}`,
    description: siteContent.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

// Runs before React hydrates to set data-theme on <html>, avoiding FOUC.
const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var p=s||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=p;}catch(e){}})();`;

// Hard-redirect the legacy GitHub Pages host to the canonical custom
// domain. Runs synchronously in <head> so the user never sees the wrong
// URL render. Search engine consolidation is handled separately by the
// canonical <link>.
const canonicalRedirectScript = `(function(){try{if(location.hostname==='deyuf.github.io'){location.replace('https://me.deyuf.org'+location.pathname+location.search+location.hash);}}catch(e){}})();`;

const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

// JSON-LD structured data so search engines can render a rich Person card.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteContent.name,
  url: "https://me.deyuf.org",
  image: "https://me.deyuf.org/avatar.webp",
  jobTitle: siteContent.eyebrow,
  description: siteContent.tagline,
  worksFor: { "@type": "Organization", name: "Agile Robots SE" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Technical University of Munich" },
    { "@type": "CollegeOrUniversity", name: "Tongji University" },
  ],
  knowsAbout: [
    "Robotics",
    "Reinforcement Learning",
    "Dexterous Manipulation",
    "Sim2Real",
    "Physical Simulation",
    "Computer Vision",
  ],
  sameAs: [
    "https://github.com/deyuf",
    siteContent.contact.linkedin,
    "https://deyuf.github.io",
    "https://urdf.deyuf.org",
    "https://historyofrobotics.deyuf.org",
  ],
};

// CSP — meta http-equiv works for everything except frame-ancestors. Allow
// only the third-party origins this site actually depends on:
// - GitHub raw for project images + drei HDRIs via raw.githack.com
// - LinkedIn: platform.linkedin.com (bootstrap profile.js) +
//   badges.linkedin.com (the second-stage script that profile.js
//   dynamically loads to render the badge content) + *.licdn.com for
//   the avatar / branding assets the badge embeds
// - Cloudflare Web Analytics beacon.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://platform.linkedin.com https://badges.linkedin.com https://static.cloudflareinsights.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://platform.linkedin.com",
  "img-src 'self' data: blob: https://raw.githubusercontent.com https://*.licdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://platform.linkedin.com https://www.linkedin.com https://badges.linkedin.com https://raw.githack.com https://raw.githubusercontent.com https://cloudflareinsights.com",
  "frame-src https://platform.linkedin.com https://www.linkedin.com",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const permissionsPolicy = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "interest-cohort=()",
  "payment=()",
  "usb=()",
  "magnetometer=()",
  "gyroscope=()",
  "accelerometer=()",
].join(", ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Security headers (set via meta because GitHub Pages cannot set HTTP headers) */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content={permissionsPolicy} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        {/* Warm up third-party origins the page will fetch from */}
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link
          rel="preconnect"
          href="https://raw.githubusercontent.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://platform.linkedin.com" />

        <script
          dangerouslySetInnerHTML={{ __html: canonicalRedirectScript }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
      {cfBeaconToken && (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
        />
      )}
    </html>
  );
}
