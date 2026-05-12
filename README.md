# deyuf.github.io

Personal portfolio of **Deyu Fu** — Robotics & AI Engineer @ Agile Robots SE, Munich. Live at [deyuf.github.io](https://deyuf.github.io).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 15** App Router, static export (`output: 'export'`) |
| Language | **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** with `@theme` tokens |
| Motion | **`motion`** (Framer Motion) + native CSS scroll-driven |
| 3D | **React Three Fiber** v9 + **drei** v10 + **@react-three/postprocessing** (Bloom) |
| Icons | **lucide-react** |
| Type | **Inter Tight** + **JetBrains Mono** via `next/font/google` |
| Analytics | **Google Analytics 4** via `@next/third-parties/google` |
| Package manager | **pnpm** |
| Deploy | **GitHub Actions** → GitHub Pages |

## Develop

```bash
pnpm install
pnpm dev          # → http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build        # → ./out (static export)
pnpm preview      # serve ./out locally
```

Requires Node 22 (see `.nvmrc`).

## Content

All site copy lives in [`src/lib/content.ts`](./src/lib/content.ts) as a single
typed `SiteContent` object. Edit there — every component consumes only that
data, so re-skinning the site for a different person is one file. Types are in
[`src/lib/types.ts`](./src/lib/types.ts).

## Features

- **Hero with a live R3F manipulator** — a 6-DOF arm built from primitives, materials respond to theme, idle joint sway, and analytic 2-bone IK so the end-effector tracks the cursor anywhere on the page (`src/components/hero/RobotCanvas.tsx`).
- **Light + dark theme** — Anthropic-style warm-cream light palette and an OpenAI-style near-black dark palette. Toggle in the nav, persisted in `localStorage`, system preference auto-detected on first visit, FOUC-prevented via an inline `<head>` script (`src/lib/theme.tsx`).
- **Project subpages** — `/projects/[slug]/` dynamic route, statically pre-rendered for each entry in `siteContent.projects`. Each detail page has a cover, long-form overview, feature highlights, install command, sidebar metadata, image gallery and cross-links.
- **Email obfuscation** — the contact email is split into two base64 halves in source and only reassembled client-side on user gesture, so it never appears in plain text in the static HTML.
- **Section indicator** — sticky right-rail with intersection-observer driven active state, uniform line widths.
- **Accessibility** — `prefers-reduced-motion` honored everywhere; 3D canvas falls back to a static SVG silhouette; semantic landmarks (`<nav>`, `<main>`, `<article>`) throughout.

## Deploy

Pushes to `main` trigger
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which runs
`pnpm install --frozen-lockfile && pnpm build` and uploads `out/` as a Pages
artifact. **One-time setup:** in repo Settings → Pages, set **Source: GitHub
Actions** (otherwise GH Pages falls back to Jekyll + this README).

## Layout

```
src/
├── app/
│   ├── layout.tsx              root layout, fonts, GoogleAnalytics, ThemeProvider, FOUC script
│   ├── page.tsx                home composition
│   ├── not-found.tsx           404
│   ├── globals.css             Tailwind v4 @theme + light/dark tokens
│   └── projects/[slug]/
│       └── page.tsx            SSG project detail pages
├── components/
│   ├── nav/                    top navigation + theme toggle
│   ├── hero/                   hero section + R3F manipulator + IK
│   ├── about/                  about + avatar
│   ├── projects/               featured projects list (links to subpages)
│   ├── experience/             timeline + education
│   ├── publications/           research output
│   ├── skills/                 capability grid + marquee
│   ├── contact/                email reveal + socials
│   ├── footer/                 footer
│   └── ui/                     Reveal, ScrambleText, ThemeToggle, NoiseOverlay,
│                               GridBackdrop, MagneticButton, Marquee,
│                               SectionIndicator
└── lib/
    ├── content.ts              ★ single source of truth for all site copy
    ├── types.ts                SiteContent / Project / Experience / Skill types
    ├── motion.ts               shared motion variants + easing
    └── theme.tsx               ThemeProvider context, useTheme hook
```

## Replacing the avatar

The Nav and About sections show an avatar from `siteContent.avatar`. A stylized
SVG placeholder ships at [`public/avatar.svg`](./public/avatar.svg). To use a
real photo:

1. Save your image as `public/avatar.png` (or `.jpg` / `.webp`)
2. Change `siteContent.avatar` in `src/lib/content.ts` from `"/avatar.svg"` to
   `"/avatar.png"`

## License

MIT for the code under this repo. Project screenshots embedded on the detail
pages are hotlinked from their respective project repositories.
