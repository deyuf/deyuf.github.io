"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    LIRenderAll?: () => void;
  }
}

interface LinkedInBadgeProps {
  vanity: string;
  size?: "medium" | "large";
  type?: "HORIZONTAL" | "VERTICAL";
}

/**
 * LinkedIn's official profile badge — a self-hosted iframe rendered by
 * platform.linkedin.com/badges/js/profile.js. The script scans the DOM for
 * `.LI-profile-badge` containers on load and swaps them for the rendered
 * widget. We track our own theme (data-theme on <html>) and force the badge
 * to remount on toggle so the iframe pulls a fresh render in the matching
 * palette.
 */
export function LinkedInBadge({
  vanity,
  size = "medium",
  type = "VERTICAL",
}: LinkedInBadgeProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => {
      const t =
        (document.documentElement.dataset.theme as "dark" | "light") ?? "dark";
      setTheme(t);
    };
    sync();
    setMounted(true);
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined" && window.LIRenderAll) {
      window.LIRenderAll();
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <>
      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        strategy="afterInteractive"
      />
      <div
        key={theme}
        className="badge-base LI-profile-badge inline-block"
        data-locale="en_US"
        data-size={size}
        data-theme={theme}
        data-type={type}
        data-vanity={vanity}
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href={`https://www.linkedin.com/in/${vanity}?trk=profile-badge`}
        >
          LinkedIn profile
        </a>
      </div>
    </>
  );
}
