"use client";

import Script from "next/script";

interface LinkedInBadgeProps {
  vanity: string;
  size?: "small" | "medium" | "large" | "extra-large";
  type?: "HORIZONTAL" | "VERTICAL";
  /** Subdomain for the deep link — e.g. "www" (default) or "de" for de.linkedin.com */
  host?: string;
  /** Display text inside the anchor — defaults to the vanity slug */
  label?: string;
}

const SCRIPT_SRC = "https://platform.linkedin.com/badges/js/profile.js";

/**
 * LinkedIn's official profile badge — wired the way LinkedIn's own builder
 * tells you to: one global script, plus the static badge `<div>` snippet
 * pasted into your page. profile.js scans for `.LI-profile-badge`
 * containers exactly once at script load and has no public re-render hook,
 * so we render BOTH a light and a dark badge at build time and let CSS
 * decide which one is visible based on the current `html[data-theme]`.
 * Each variant is independently processed by profile.js on initial load,
 * so toggling the theme is just a paint change — no script reload, no
 * remount, no flicker.
 */
export function LinkedInBadge({
  vanity,
  size = "medium",
  type = "VERTICAL",
  host = "www",
  label,
}: LinkedInBadgeProps) {
  const href = `https://${host}.linkedin.com/in/${vanity}?trk=profile-badge`;
  const text = label ?? vanity;

  return (
    <>
      {/* One global load of profile.js, afterInteractive so it doesn't block first paint */}
      <Script src={SCRIPT_SRC} strategy="afterInteractive" />

      <div className="linkedin-badge-light">
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size={size}
          data-theme="light"
          data-type={type}
          data-vanity={vanity}
          data-version="v1"
        >
          <a className="badge-base__link LI-simple-link" href={href}>
            {text}
          </a>
        </div>
      </div>

      <div className="linkedin-badge-dark">
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size={size}
          data-theme="dark"
          data-type={type}
          data-vanity={vanity}
          data-version="v1"
        >
          <a className="badge-base__link LI-simple-link" href={href}>
            {text}
          </a>
        </div>
      </div>
    </>
  );
}
