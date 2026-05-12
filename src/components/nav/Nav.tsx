"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { siteContent } from "@/lib/content";
import { useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(12px)"]
  );

  const bgFrom = theme === "light" ? "rgba(244,240,232,0)" : "rgba(10,10,10,0)";
  const bgTo =
    theme === "light" ? "rgba(244,240,232,0.78)" : "rgba(10,10,10,0.72)";
  const borderTo =
    theme === "light"
      ? "rgba(30,25,20,0.10)"
      : "rgba(255,255,255,0.08)";

  const bg = useTransform(scrollY, [0, 80], [bgFrom, bgTo]);
  const border = useTransform(
    scrollY,
    [0, 80],
    [theme === "light" ? "rgba(30,25,20,0)" : "rgba(255,255,255,0)", borderTo]
  );

  return (
    <motion.header
      style={{
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        backgroundColor: bg,
        borderBottom: "1px solid",
        borderColor: border,
      }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-12">
        <a href="#hero" className="flex items-center gap-2.5 font-mono text-sm">
          {siteContent.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={siteContent.avatar}
              alt={`${siteContent.name} avatar`}
              className="h-7 w-7 rounded-full border border-border object-cover"
              style={{ background: "var(--color-surface)" }}
            />
          ) : (
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-md border border-border text-[10px]"
              style={{ color: "var(--color-accent)" }}
            >
              {siteContent.initials}
            </span>
          )}
          <span className="font-medium">{siteContent.name}</span>
        </a>
        <ul className="hidden items-center gap-8 text-sm md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="transition-colors hover:text-fg"
                style={{ color: "var(--color-fg-muted)" }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={siteContent.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-border px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition hover:border-border-strong md:inline-flex"
          >
            LinkedIn
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
