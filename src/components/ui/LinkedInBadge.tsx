"use client";

import { useEffect, useState } from "react";

interface LinkedInBadgeProps {
  vanity: string;
  size?: "medium" | "large";
  type?: "HORIZONTAL" | "VERTICAL";
  /** Subdomain for the deep link — e.g. "www" (default) or "de" for de.linkedin.com */
  host?: string;
  /** Display text inside the anchor — defaults to the vanity slug */
  label?: string;
}

const SCRIPT_SRC = "https://platform.linkedin.com/badges/js/profile.js";

/**
 * LinkedIn's official profile badge.
 *
 * Why this is messier than a single <Script>: profile.js scans for
 * `.LI-profile-badge` elements *once*, on script load. It has no public
 * re-render API. So if the badge container is rendered AFTER script load
 * (typical in a Next.js client component), it never gets processed.
 *
 * Workaround: render the badge container synchronously on every render
 * (no `if (!mounted) return null` guard), and on every theme change
 * detach + re-inject the script tag. The fresh script load triggers a
 * new DOM scan that finds the freshly-keyed badge container.
 *
 * We listen to the ThemeProvider's `themechange` custom event so the
 * badge re-renders in the matching palette without a page reload.
 */
export function LinkedInBadge({
  vanity,
  size = "medium",
  type = "VERTICAL",
  host = "www",
  label,
}: LinkedInBadgeProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Sync local state to the documentElement's theme attribute.
  useEffect(() => {
    const sync = () => {
      const t =
        (document.documentElement.dataset.theme as "dark" | "light") ?? "dark";
      setTheme(t);
    };
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  // Detach any existing profile.js, then re-inject so it does a fresh DOM
  // scan and picks up the badge container with the current data-theme.
  useEffect(() => {
    document
      .querySelectorAll(`script[src="${SCRIPT_SRC}"]`)
      .forEach((s) => s.remove());
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, [theme]);

  return (
    <div
      key={theme}
      className="badge-base LI-profile-badge inline-block"
      data-locale="en_US"
      data-size={size}
      data-theme={theme}
      data-type={type}
      data-vanity={vanity}
      data-version="v1"
      suppressHydrationWarning
    >
      <a
        className="badge-base__link LI-simple-link"
        href={`https://${host}.linkedin.com/in/${vanity}?trk=profile-badge`}
      >
        {label ?? vanity}
      </a>
    </div>
  );
}
