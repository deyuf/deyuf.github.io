import { siteContent } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 py-10 md:flex-row md:items-center md:px-12">
        <p className="font-mono text-xs uppercase tracking-widest muted">
          © {year} {siteContent.name}. All rights reserved.
        </p>
        <nav aria-label="Deyu Fu websites" className="flex flex-wrap gap-4 text-sm">
          <a href="https://me.deyuf.org/">Personal site</a>
          <a href="https://urdf.deyuf.org/">URDF Studio</a>
          <a href="https://historyofrobotics.deyuf.org/">History of Robotics</a>
        </nav>
        <p className="font-mono text-xs uppercase tracking-widest muted">
          Built with Next.js · {" "}
          <a
            href="https://github.com/deyuf/deyuf.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg"
          >
            Source
          </a>
        </p>
      </div>
    </footer>
  );
}
