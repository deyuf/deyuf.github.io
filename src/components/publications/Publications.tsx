import { ExternalLink, Github } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Publications() {
  return (
    <section id="publications" className="section">
      <Reveal>
        <p className="eyebrow mb-4">Publications</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display mb-12 max-w-3xl text-4xl md:text-5xl">
          Peer-reviewed research.
        </h2>
      </Reveal>

      <ul className="space-y-px">
        {siteContent.publications.map((p, i) => (
          <Reveal as="li" key={i} delay={i * 0.05}>
            <article className="grid grid-cols-1 gap-6 border-t border-b border-border py-8 md:grid-cols-[auto_1fr] md:gap-16">
              <div className="flex flex-col gap-1">
                <span
                  className="rounded-full border px-3 py-1 text-center font-mono text-[11px] uppercase tracking-widest"
                  style={{
                    color: "var(--color-accent)",
                    borderColor: "color-mix(in oklab, var(--color-accent) 30%, transparent)",
                  }}
                >
                  {p.venue} {p.year}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-medium md:text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm muted">{p.authors}</p>
                <p className="mt-4 max-w-3xl leading-relaxed muted">
                  {p.tldr}
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  {p.links.arxiv && (
                    <a
                      href={p.links.arxiv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
                    >
                      <ExternalLink size={14} /> arXiv
                    </a>
                  )}
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
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
