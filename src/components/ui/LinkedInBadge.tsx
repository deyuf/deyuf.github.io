import { Linkedin } from "lucide-react";

interface LinkedInBadgeProps {
  vanity: string;
  /** Subdomain for the deep link — e.g. "www" (default) or "de" for de.linkedin.com */
  host?: string;
  name: string;
  headline: string;
  location?: string;
  avatar?: string;
}

/**
 * A self-hosted LinkedIn "profile badge". LinkedIn's official
 * platform.linkedin.com/badges/js/profile.js bootstrap loads a
 * second-stage script from badges.linkedin.com that the browser refuses
 * to execute because LinkedIn serves it with `content-type: text/html`
 * + `x-content-type-options: nosniff` — Chromium ORB blocks it and the
 * badge stays empty. Verified against the live deployed site, not just
 * a sandbox proxy.
 *
 * Rather than ship a broken third-party widget, we render an
 * equivalent card from local data. No external JS, no ORB risk, native
 * theming via our existing CSS variables, and a single round-trip to
 * GitHub Pages.
 */
export function LinkedInBadge({
  vanity,
  host = "www",
  name,
  headline,
  location,
  avatar,
}: LinkedInBadgeProps) {
  const href = `https://${host}.linkedin.com/in/${vanity}?trk=profile-badge`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${name}'s LinkedIn profile`}
      className="linkedin-card group relative block w-full max-w-[300px] overflow-hidden rounded-2xl border border-border text-left transition-colors"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Banner strip */}
      <div
        aria-hidden
        className="h-16 w-full"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent) 0%, color-mix(in oklab, var(--color-accent) 60%, var(--color-surface-2)) 100%)",
          opacity: 0.55,
        }}
      />

      {/* Avatar — overlapping the banner */}
      {avatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt=""
          aria-hidden
          className="relative mx-5 -mt-10 h-20 w-20 rounded-full border-4 object-cover"
          style={{
            borderColor: "var(--color-surface)",
            background: "var(--color-surface-2)",
          }}
        />
      )}

      <div className="px-5 pb-5 pt-3">
        <p className="text-lg font-semibold leading-tight">{name}</p>
        <p
          className="mt-1 text-sm leading-snug"
          style={{ color: "var(--color-fg-muted)" }}
        >
          {headline}
        </p>
        {location && (
          <p
            className="mt-2 font-mono text-[11px] uppercase tracking-widest"
            style={{ color: "var(--color-fg-faint)" }}
          >
            {location}
          </p>
        )}

        <span
          className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors group-hover:bg-accent group-hover:text-bg"
          style={{
            borderColor: "var(--color-border-strong)",
          }}
        >
          <Linkedin size={14} strokeWidth={2} />
          <span>View profile</span>
        </span>
      </div>
    </a>
  );
}
