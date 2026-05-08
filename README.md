# deyuf.github.io

Personal portfolio of Deyu Fu — Robotics Software Engineer.

Live at [deyuf.github.io](https://deyuf.github.io).

## Stack

- **Next.js 15** (App Router, static export via `output: 'export'`)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@theme` tokens)
- **Motion** (Framer Motion) for component animation
- **lucide-react** for line icons
- **Inter Tight** + **JetBrains Mono** via `next/font/google`

## Develop

```bash
pnpm install
pnpm dev          # → http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build        # → ./out (static export)
pnpm preview      # serve ./out locally
```

## Content

All site copy lives in [`src/lib/content.ts`](./src/lib/content.ts) as a single
typed object. Edit there — components only consume that data.

## Deploy

Pushes to `main` trigger
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds
the static export and deploys to GitHub Pages. In repo Settings → Pages set
**Source: GitHub Actions**.

## Layout

```
src/
├── app/                 layout, page composition, not-found, globals.css
├── components/
│   ├── nav/             top navigation
│   ├── about/           page-opening intro
│   ├── projects/        featured projects
│   ├── experience/      timeline + education
│   ├── publications/    research output
│   ├── skills/          capability grid + marquee
│   ├── contact/         email reveal + socials
│   ├── footer/          footer
│   └── ui/              Reveal, ScrambleText, MagneticButton, …
└── lib/                 types, content, motion variants
```
