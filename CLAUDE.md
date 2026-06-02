# CLAUDE.md

Guidance for working in this repo. Keep it accurate — update it when conventions change.

## Project

Personal portfolio for **Jacky Gutiérrez** (audiovisual communicator / documentary photographer, Medellín — brand *hackidevs*). Single-page, bilingual (ES/EN), dark/light themed, deployed on Vercel.

- Live: https://mi-portafolio-liard-omega.vercel.app/
- Branch: `react-version` (also the default/PR base)

## Stack

- **React 19 + Vite 8** SPA (not Next.js).
- **Plain CSS** — no Tailwind, no CSS-in-JS. Theme tokens live in `src/index.css` (`:root` / `[data-theme='dark']`); component styles in `src/App.css`. **CSS variables are the source of truth — never hardcode colors.** Fonts: Space Grotesk (`--font-display`), Inter (`--font-sans`), JetBrains Mono (`--font-terminal`) — loaded via a non-blocking `<link>` in `index.html` (preload + `media=print`/`onload`), **not** an `@import` in CSS (which chained behind the stylesheet and hurt LCP).
- **Animation:** `useReveal` (IntersectionObserver scroll reveals) is the default. `gsap` + ScrollTrigger power the Career timeline scroll-fill — **lazy-imported** so they stay out of the initial bundle. `three` IS used now: the hero centrepiece is a vintage SLR camera GLB (`CameraStage`, vanilla three + DRACOLoader, all lazy-imported, paused offscreen via IntersectionObserver), and the Remotion intro uses `@remotion/*` + `@react-three/fiber` (also lazy). `motion` was **pruned** (was unused). `lenis` + `@gsap/react` are still in `package.json` but unused — prune candidates.
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

- `src/App.jsx` — composes the sections in order: Hero · About · Services · Skills · Projects · Fotografia · Career · Contact, wrapped by Nav + Footer. (The Marquee band was **removed**.)
- `src/sections/*` — one component per page section. Each new section follows the pattern: `useReveal()` on `<header className="section-head">` (no delay) + on the main content (`delay: 150`), with `data-reveal` alongside the ref.
- `src/components/*` — Nav, Footer, Fireflies (ambient CSS glow), ErrorBoundary, `CameraStage` (the hero's 3D camera scene) + `CameraHero` (its standalone `/camera.html` preview).
- `src/remotion/*` — the one-time Remotion `<Player>` intro (lazy via `HeroPlayer`): `HeroIntro` composition orchestrating the hackidevs avatar (`/hackidevs-avatar.webp`), the "Hola, soy Jacky" name scene + typewriter tagline, and the Imagen/Edición/Narrativa/Marketing cards. Plays once per session (`introSeen`), skippable, skipped under reduced-motion.
- 3D model assets: optimized Draco GLB at `public/models/camera.glb` (tracked); the raw 45 MB folder is gitignored. Draco decoder served from `public/draco/`.
- `src/lib/AppContext.jsx` — theme + language state (`useApp()`); persisted to localStorage; a pre-hydration script in `index.html` prevents theme flash.
- `src/hooks/useReveal.js` — the shared scroll-reveal hook.

## Design direction (current)

Minimal / editorial. The earlier retro-terminal and paper-collage phases were **removed** — no texture overlays, washi tape, REC icons, or collage cutouts. A risograph/grain/duotone artistic treatment was **tried on the hero and reverted** (2026-06-01) — the direction stays minimal/editorial; don't re-introduce grain/overprint unless asked. The hero is a two-column layout: bilingual copy + a 3D vintage SLR camera (`CameraStage`) that sinks and dissolves on scroll (desktop only), over a subtle **CSS firefly** layer (theme-aware, hidden under reduced-motion). The orbital quick-nav around the camera was removed. Skills is a clean tag grid (no % bars). Reference clones live in `_repos/` (Next.js + R3F — a different stack; adapt patterns, don't merge).

This work (3D camera hero, Remotion avatar intro, CWV fixes, Playwright E2E) was built on `feature/3d-set` and **shipped to production** on 2026-06-01 — merged into `react-version` and promoted via `vercel --prod`. Note: Vercel's "Production Branch" isn't wired to `react-version`, so pushes deploy as *preview*; promote to prod with `vercel --prod` (or set the production branch in the Vercel dashboard).

## Conventions / guardrails

- **Before any commit:** `npm run lint` + `npm run build` + `npm run test:run` must pass. Deploy after pushing.
- **Lean bundle is a priority** — flag the weight of new deps; code-split / lazy-load heavy animation/3D libs; prefer CSS/SVG over libraries.
- Form inputs are borderless (only `border-bottom`) — never add `border`/`border-radius`/`background` to them.
- Keep `_repos/`, `.claude/`, `.agents/` out of tooling (already ignored in `eslint.config.js` and Vite `server.watch.ignored`).
- Respect `prefers-reduced-motion` in every animation.

## Skills available

Installed via `autoskills` (see `.claude/skills/`): GSAP (`gsap-core`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`, …), Three.js (`threejs-fundamentals`, `threejs-shaders`, …), `react-best-practices`, `accessibility`, `seo`, `vite`, `vitest`, `frontend-design`. Use them when the task matches.
