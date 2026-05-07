import { ArrowUpRight, Github, FileText, ExternalLink } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <p className="eyebrow mb-4">Selected work</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display mb-16 max-w-3xl text-4xl md:text-6xl">
          Things I&apos;ve built and shipped.
        </h2>
      </Reveal>

      <ul className="space-y-px">
        {siteContent.projects.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={0.05 + i * 0.05}>
            <article
              className="group relative grid grid-cols-1 gap-8 border-t border-border py-12 transition-colors hover:bg-surface/40 md:grid-cols-[1fr_auto] md:gap-16 md:px-6"
              style={
                i === siteContent.projects.length - 1
                  ? { borderBottom: "1px solid var(--color-border)" }
                  : undefined
              }
            >
              <div>
                <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-widest muted">
                  <span>{p.year}</span>
                  <span className="h-px w-8 bg-border-strong" />
                  <span>0{i + 1}</span>
                </div>
                <h3 className="display mb-3 text-3xl md:text-5xl">{p.title}</h3>
                <p className="mb-4 text-lg muted">{p.tagline}</p>
                <p className="max-w-2xl leading-relaxed muted">
                  {p.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wider"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-4">
                  {p.links.code && (
                    <a
                      href={p.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                  {p.links.paper && (
                    <a
                      href={p.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
                    >
                      <FileText size={14} /> Paper
                    </a>
                  )}
                  {p.links.demo && (
                    <a
                      href={p.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
                    >
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </div>
              <div
                aria-hidden
                className="hidden self-center text-fg-faint transition-all group-hover:translate-x-1 group-hover:translate-y-[-2px] group-hover:text-fg md:block"
                style={{ color: "var(--color-fg-faint)" }}
              >
                <ArrowUpRight size={48} strokeWidth={1.2} />
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
