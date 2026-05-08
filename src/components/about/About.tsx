import { ArrowRight, Github } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="section pt-12 md:pt-20">
      <Reveal>
        <p className="eyebrow">{siteContent.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="display mt-6 text-[clamp(3rem,9vw,7.5rem)] font-medium">
          {siteContent.name.split(" ").map((part, i) => (
            <span key={i} className="block">
              {part}
            </span>
          ))}
        </h1>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.6fr] lg:gap-20">
        <div className="space-y-7">
          <Reveal delay={0.05}>
            <h2 className="display text-3xl md:text-5xl">
              {siteContent.tagline}
            </h2>
          </Reveal>
          <div className="space-y-5 text-lg leading-relaxed muted">
            {siteContent.about.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  background: "var(--color-fg)",
                  color: "var(--color-bg)",
                }}
              >
                View work <ArrowRight size={16} />
              </a>
              <a
                href="https://github.com/deyuf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-border-strong hover:bg-surface"
              >
                <Github size={16} /> GitHub
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <dl className="space-y-6 lg:pt-4">
            {siteContent.quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="border-t border-border pt-4 first:border-t-0 first:pt-0"
              >
                <dt className="font-mono text-[11px] uppercase tracking-widest muted">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm md:text-base">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
