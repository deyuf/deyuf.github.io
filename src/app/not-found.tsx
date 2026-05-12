import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">404 · Off the manifold</p>
      <h1 className="display text-5xl md:text-7xl">Page not found</h1>
      <p className="muted max-w-md">
        This route isn&apos;t in the world model. It may have moved, or never
        existed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium hover:bg-surface"
      >
        Return home →
      </Link>
    </main>
  );
}
