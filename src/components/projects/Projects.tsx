import Link from "next/link";
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
              className="group relative border-t border-border py-12 transition-colors hover:bg-surface/40 md:px-6"
              style={
                i === siteContent.projects.length - 1
                  ? { borderBottom: "1px solid var(--color-border)" }
                  : undefined
              }
            >
              <Link
                href={`/projects/${p.slug}/`}
                className="absolute inset-0 z-10"
                aria-label={`Open ${p.title} project page`}
              />
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_240px] md:gap-12">
                <div>
                  <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-widest muted">
                    <span>{p.year}</span>
                    <span className="h-px w-8 bg-border-strong" />
                    <span>0{i + 1}</span>
                  </div>
                  <h3 className="display mb-3 text-3xl transition-colors md:text-5xl group-hover:text-accent">
                    {p.title}
                  </h3>
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
                  <div className="relative z-20 mt-6 flex flex-wrap items-center gap-5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors group-hover:text-accent">
                      Read more <ArrowUpRight size={12} />
                    </span>
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

                {/* Cover thumbnail */}
                {p.coverImage && (
                  <div
                    aria-hidden
                    className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-xl border border-border md:block"
                    style={{ background: "var(--color-surface)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverImage}
                      alt=""
                      loading="lazy"
                      className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
