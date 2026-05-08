"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "publications", label: "Publications" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function SectionIndicator() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section indicator"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-3">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center gap-3"
                aria-label={s.label}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest transition-opacity ${
                    isActive
                      ? "opacity-80"
                      : "opacity-0 group-hover:opacity-50"
                  }`}
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {s.label}
                </span>
                <span
                  className={`block h-px transition-all ${
                    isActive ? "w-8" : "w-4 group-hover:w-6"
                  }`}
                  style={{
                    background: isActive
                      ? "var(--color-accent)"
                      : "var(--color-border-strong)",
                  }}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
