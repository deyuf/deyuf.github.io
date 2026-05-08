import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="section">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.6fr] lg:gap-20">
        <div className="space-y-7">
          <Reveal>
            <p className="eyebrow">About</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display text-4xl md:text-6xl">
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
        </div>
        <Reveal delay={0.1}>
          <dl className="space-y-6 lg:pt-16">
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
