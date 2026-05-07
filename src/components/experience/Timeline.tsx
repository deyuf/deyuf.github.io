import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Timeline() {
  return (
    <section id="experience" className="section">
      <Reveal>
        <p className="eyebrow mb-4">Experience</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display mb-12 max-w-3xl text-4xl md:text-5xl">
          A path through robotics, simulation and systems.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <h3 className="font-mono text-xs uppercase tracking-widest muted mb-6">
              Roles
            </h3>
          </Reveal>
          <ol className="space-y-px">
            {siteContent.experience.map((e, i) => (
              <Reveal as="li" key={i} delay={i * 0.05}>
                <div className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-6 md:gap-10">
                  <span
                    className="font-mono text-[11px] uppercase tracking-widest"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {e.period}
                  </span>
                  <div>
                    <p className="text-base font-medium md:text-lg">
                      {e.role}
                    </p>
                    <p className="mt-0.5 text-sm muted">
                      {e.org}
                      {e.location ? ` · ${e.location}` : ""}
                    </p>
                    <p className="mt-3 max-w-prose text-sm leading-relaxed muted">
                      {e.summary}
                    </p>
                    {e.tags.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {e.tags.map((t) => (
                          <li
                            key={t}
                            className="font-mono text-[10px] uppercase tracking-wider muted"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div>
          <Reveal>
            <h3 className="font-mono text-xs uppercase tracking-widest muted mb-6">
              Education
            </h3>
          </Reveal>
          <ol className="space-y-px">
            {siteContent.education.map((e, i) => (
              <Reveal as="li" key={i} delay={i * 0.05}>
                <div className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-6 md:gap-10">
                  <span
                    className="font-mono text-[11px] uppercase tracking-widest"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {e.period}
                  </span>
                  <div>
                    <p className="text-base font-medium md:text-lg">
                      {e.institution}
                    </p>
                    <p className="mt-0.5 text-sm muted">
                      {e.degree} · {e.field}
                    </p>
                    {e.highlight && (
                      <p
                        className="mt-2 text-sm"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {e.highlight}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-widest muted">
                  Honors
                </h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {siteContent.honors.map((h, i) => (
                    <li key={i}>
                      <span className="block">{h.title}</span>
                      <span className="block text-xs muted">
                        {h.org} · {h.year}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-widest muted">
                  Languages
                </h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {siteContent.languages.map((l) => (
                    <li key={l.name}>
                      <span className="block">{l.name}</span>
                      <span className="block text-xs muted">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
