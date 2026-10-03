import Link from "next/link";
import { ArrowUpRight, Github, FileText, ExternalLink } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <div>
            <p className="eyebrow mb-5">01 / Selected work</p>
            <h2 className="display max-w-3xl text-4xl md:text-6xl">
              Ideas, made real.
            </h2>
          </div>
          <p className="max-w-[240px] text-sm leading-relaxed muted">
            Research, open-source tools and systems for the physical world.
          </p>
        </div>
      </Reveal>
      <ul className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-14 lg:gap-y-20">
        {siteContent.projects.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i % 2 * 0.08}>
            <article className="group relative">
              <Link href={`/projects/${project.slug}/`} className="absolute inset-0 z-10" aria-label={`Open ${project.title} project page`} />
              <div className="project-showcase-media" aria-hidden="true">
                {project.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.coverImage} alt="" loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.035]" />
                ) : (
                  <span className="font-mono text-5xl text-fg-faint">{project.title}</span>
                )}
                <span className="project-showcase-index">0{i + 1}</span>
                <span className="project-showcase-arrow"><ArrowUpRight size={20} /></span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-4 font-mono text-[10px] uppercase tracking-widest muted">
                <span>{project.year}</span>
                <span>{project.tags.slice(0, 2).join(" / ")}</span>
              </div>
              <h3 className="display mt-6 text-3xl transition-colors group-hover:text-accent md:text-4xl">{project.title}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed muted">{project.tagline}</p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed muted">{project.description}</p>
              <div className="relative z-20 mt-6 flex flex-wrap items-center gap-5">
                {project.links.code && (
                  <a href={project.links.code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs muted transition-colors hover:text-accent">
                    <Github size={13} /> Code
                  </a>
                )}
                {project.links.paper && (
                  <a href={project.links.paper} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs muted transition-colors hover:text-accent">
                    <FileText size={13} /> Paper
                  </a>
                )}
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs muted transition-colors hover:text-accent">
                    <ExternalLink size={13} /> Demo
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
