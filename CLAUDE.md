# CLAUDE.md

Guidance for working in this repo. Keep it accurate — update it when conventions change.

## Project

Personal portfolio for **Jacky Gutiérrez** (audiovisual communicator / documentary photographer, Medellín — brand *hackidevs*). Single-page, bilingual (ES/EN), dark/light themed, deployed on Vercel.

- Live: https://mi-portafolio-liard-omega.vercel.app/
- Branch: `react-version` (also the default/PR base)

## Stack

- **React 19 + Vite 8** SPA (not Next.js).
- **Plain CSS** — no Tailwind, no CSS-in-JS. Theme tokens live in `src/index.css` (`:root` / `[data-theme='dark']`); component styles in `src/App.css`. **CSS variables are the source of truth — never hardcode colors.** Fonts: Space Grotesk (`--font-display`), Inter (`--font-sans`), JetBrains Mono (`--font-terminal`).
- **Animation:** `useReveal` (IntersectionObserver scroll reveals) is the default. `gsap` + ScrollTrigger power the Career timeline scroll-fill — **lazy-imported** so they stay out of the initial bundle. `three` and `motion` are still in `package.json` but currently **unused** in `src/` (the hero particle field was replaced by CSS fireflies); lazy-load them if reintroduced, or prune.
- Contact form posts to **Web3Forms** (`VITE_WEB3FORMS_KEY`).

## Commands

```bash
npm run dev            # Vite dev server (localhost:5173)
npm run build          # production build to dist/
npm run lint           # ESLint (flat config)
npm run test:run       # Vitest (run once)
npm run format         # Prettier write
npm run optimize:images # WebP optimization (scripts/)
```

## Architecture

- `src/App.jsx` — composes the sections in order: Hero · Marquee · About · Services · Skills · Projects · Fotografia · Career · Contact, wrapped by Nav + Footer.
- `src/sections/*` — one component per page section. Each new section follows the pattern: `useReveal()` on `<header className="section-head">` (no delay) + on the main content (`delay: 150`), with `data-reveal` alongside the ref.
- `src/components/*` — Nav, Footer, Marquee, Fireflies (ambient CSS glow), ErrorBoundary.
- `src/lib/AppContext.jsx` — theme + language state (`useApp()`); persisted to localStorage; a pre-hydration script in `index.html` prevents theme flash.
- `src/hooks/useReveal.js` — the shared scroll-reveal hook.

## Design direction (current)

Minimal / editorial. The earlier retro-terminal and paper-collage phases were **removed** — no texture overlays, washi tape, REC icons, or collage cutouts. The hero is clean type over a subtle **CSS firefly** layer (guava glow, theme-aware via `--firefly`, hidden under reduced-motion). Skills is a clean tag grid (no % bars). Reference clones live in `_repos/` (Next.js + R3F — a different stack; adapt patterns, don't merge).

## Conventions / guardrails

- **Before any commit:** `npm run lint` + `npm run build` + `npm run test:run` must pass. Deploy after pushing.
- **Lean bundle is a priority** — flag the weight of new deps; code-split / lazy-load heavy animation/3D libs; prefer CSS/SVG over libraries.
- Form inputs are borderless (only `border-bottom`) — never add `border`/`border-radius`/`background` to them.
- Keep `_repos/`, `.claude/`, `.agents/` out of tooling (already ignored in `eslint.config.js` and Vite `server.watch.ignored`).
- Respect `prefers-reduced-motion` in every animation.

## Skills available

Installed via `autoskills` (see `.claude/skills/`): GSAP (`gsap-core`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`, …), Three.js (`threejs-fundamentals`, `threejs-shaders`, …), `react-best-practices`, `accessibility`, `seo`, `vite`, `vitest`, `frontend-design`. Use them when the task matches.
