"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { ScrambleText } from "@/components/ui/ScrambleText";

function decodeEmail() {
  if (typeof window === "undefined") return "";
  const u = atob(siteContent.contact.emailParts.user);
  const d = atob(siteContent.contact.emailParts.domain);
  return `${u}@${d}`;
}

export function Contact() {
  const [revealed, setRevealed] = useState(false);
  const [email, setEmail] = useState<string>("");

  const reveal = () => {
    setEmail(decodeEmail());
    setRevealed(true);
  };

  return (
    <section id="contact" className="section">
      <div className="text-center">
        <Reveal>
          <p className="eyebrow mb-6">Let&apos;s talk</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display mx-auto max-w-4xl text-5xl md:text-7xl">
            Building something at the boundary of physical and digital?
            <br />
            <span style={{ color: "var(--color-accent)" }}>
              Get in touch.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-md">
            {!revealed ? (
              <button
                type="button"
                onClick={reveal}
                className="group inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all hover:border-border-strong hover:bg-surface"
              >
                <Mail size={16} />
                <span>Reveal email</span>
              </button>
            ) : (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 font-mono text-base transition-colors hover:text-accent md:text-xl"
              >
                <Mail size={18} />
                <ScrambleText text={email} duration={700} trigger="hover" />
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-3">
            {siteContent.contact.github.map((g) => (
              <li key={g.handle}>
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
                >
                  <Github size={14} /> @{g.handle}
                  <span className="font-mono text-[10px] uppercase tracking-widest muted">
                    {g.label}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={siteContent.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
