import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  FileText,
  Github,
  Package,
} from "lucide-react";
import type { Metadata } from "next";
import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

export const dynamicParams = false;

export async function generateStaticParams() {
  return siteContent.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = siteContent.projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${siteContent.name}`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — ${siteContent.name}`,
      description: project.tagline,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = siteContent.projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <NoiseOverlay />
      <Nav />
      <main className="relative pt-32 pb-24">
        <article className="mx-auto max-w-[1080px] px-5 md:px-12">
          {/* Back link */}
          <Reveal>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest muted transition hover:text-accent"
            >
              <ArrowLeft size={14} /> All projects
            </Link>
          </Reveal>

          {/* Header */}
          <header className="mt-8">
            <Reveal delay={0.05}>
              <p className="eyebrow">
                {project.year} · {project.tags[0]}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="display mt-4 text-5xl md:text-7xl">
                {project.title}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed muted md:text-2xl">
                {project.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wider"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-4">
                {project.links.code && (
                  <a
                    href={project.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
                  >
                    <Github size={14} /> Code
                  </a>
                )}
                {project.links.paper && (
                  <a
                    href={project.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
                  >
                    <FileText size={14} /> Paper
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
                  >
                    <ExternalLink size={14} /> Demo
                  </a>
                )}
                {project.links.marketplace && (
                  <a
                    href={project.links.marketplace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
                  >
                    <Package size={14} /> Marketplace
                  </a>
                )}
                {project.links.pypi && (
                  <a
                    href={project.links.pypi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:border-border-strong hover:bg-surface"
                  >
                    <Package size={14} /> PyPI
                  </a>
                )}
              </div>
            </Reveal>
          </header>

          {/* Cover */}
          {project.coverImage && (
            <Reveal delay={0.1}>
              <figure className="mt-16 overflow-hidden rounded-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImage}
                  alt={`${project.title} cover`}
                  loading="lazy"
                  className="block h-auto w-full"
                  style={{ background: "var(--color-surface)" }}
                />
              </figure>
            </Reveal>
          )}

          {/* Body */}
          <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
            {/* Long description + features */}
            <div className="space-y-10">
              {project.longDescription && (
                <section>
                  <Reveal>
                    <h2 className="eyebrow mb-6">Overview</h2>
                  </Reveal>
                  <div className="space-y-5 text-lg leading-relaxed muted">
                    {project.longDescription.map((p, i) => (
                      <Reveal key={i} delay={i * 0.05}>
                        <p>{p}</p>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {project.features && project.features.length > 0 && (
                <section>
                  <Reveal>
                    <h2 className="eyebrow mb-6">Highlights</h2>
                  </Reveal>
                  <ul className="space-y-3">
                    {project.features.map((f, i) => (
                      <Reveal key={i} delay={i * 0.03}>
                        <li className="flex items-start gap-3 text-base leading-relaxed">
                          <span
                            aria-hidden
                            className="mt-2 block h-1.5 w-1.5 flex-none rounded-full"
                            style={{ background: "var(--color-accent)" }}
                          />
                          <span className="muted">{f}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </section>
              )}

              {project.install && (
                <section>
                  <Reveal>
                    <h2 className="eyebrow mb-6">Install</h2>
                  </Reveal>
                  <Reveal>
                    <pre
                      className="overflow-x-auto rounded-xl border border-border p-5 font-mono text-sm"
                      style={{ background: "var(--color-surface)" }}
                    >
                      <code>{project.install}</code>
                    </pre>
                  </Reveal>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:pt-2">
              {project.meta && project.meta.length > 0 && (
                <Reveal>
                  <dl className="space-y-5 border-t border-border pt-6">
                    {project.meta.map((m) => (
                      <div key={m.label}>
                        <dt className="font-mono text-[11px] uppercase tracking-widest muted">
                          {m.label}
                        </dt>
                        <dd className="mt-1.5 text-sm md:text-base">
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              )}
            </aside>
          </div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 1 && (
            <section className="mt-24">
              <Reveal>
                <h2 className="eyebrow mb-8">Gallery</h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {project.gallery.slice(1).map((img, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <figure className="overflow-hidden rounded-xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.caption ?? `${project.title} image ${i + 2}`}
                        loading="lazy"
                        className="block h-auto w-full"
                        style={{ background: "var(--color-surface)" }}
                      />
                      {img.caption && (
                        <figcaption className="px-4 py-3 text-xs muted">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* Next projects */}
          <section className="mt-28 border-t border-border pt-12">
            <Reveal>
              <h2 className="eyebrow mb-8">Other projects</h2>
            </Reveal>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {siteContent.projects
                .filter((p) => p.slug !== project.slug)
                .map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.05}>
                    <li>
                      <Link
                        href={`/projects/${p.slug}/`}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-border p-5 transition hover:bg-surface"
                      >
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-widest muted">
                            {p.year}
                          </p>
                          <p className="mt-1 text-lg font-medium">{p.title}</p>
                          <p className="mt-1 text-sm muted">{p.tagline}</p>
                        </div>
                        <ArrowUpRight
                          size={20}
                          strokeWidth={1.4}
                          className="flex-none transition group-hover:translate-x-1 group-hover:translate-y-[-2px]"
                          style={{ color: "var(--color-fg-faint)" }}
                        />
                      </Link>
                    </li>
                  </Reveal>
                ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
