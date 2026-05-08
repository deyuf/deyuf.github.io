"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { siteContent } from "@/lib/content";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(12px)"]
  );
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(10,10,10,0)", "rgba(10,10,10,0.72)"]
  );
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"]
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
        <a href="#top" className="flex items-center gap-2 font-mono text-sm">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-md border border-border text-[10px]"
            style={{ color: "var(--color-accent)" }}
          >
            {siteContent.initials}
          </span>
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
        <a
          href={siteContent.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-border px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition hover:border-border-strong md:inline-flex"
        >
          LinkedIn
        </a>
      </nav>
    </motion.header>
  );
}
