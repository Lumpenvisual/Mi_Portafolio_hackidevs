# CLAUDE.md

Guidance for working in this repo. Keep it accurate — update it when conventions change.

## Project

Personal portfolio for **Jacky Gutiérrez** (audiovisual communicator / documentary photographer, Medellín — brand *hackidevs*). Single-page, bilingual (ES/EN), dark/light themed, deployed on Vercel.

- Live (fixed — always deploy/alias here, do not change): https://mi-portafolio-hackidevs.vercel.app/
- Branch: `react-version` (also the default/PR base)

## Stack

- **React 19 + Vite 8** SPA (not Next.js).
- **Plain CSS** — no Tailwind, no CSS-in-JS. Theme tokens in `src/index.css` (`:root` / `[data-theme='dark']`); component styles in `src/App.css`. **CSS variables are the source of truth — never hardcode colors.** (Tailwind + shadcn/cult-ui drifted in and were **fully removed 2026-06-12** along with the `?preview=heroes` gallery — the site never used Tailwind classes; this pruned ~340 npm packages and cut the CSS bundle from ~187KB → ~37KB. Runtime deps are now just `react`, `react-dom`, `gsap`, `three`.) Fonts: Space Grotesk (`--font-display`), Inter (`--font-sans`), JetBrains Mono (`--font-terminal`) — loaded via a non-blocking `<link>` in `index.html` (preload + `media=print`/`onload`), **not** an `@import` in CSS (which chained behind the stylesheet and hurt LCP).
- **Animation:** `useReveal` (IntersectionObserver scroll reveals) is the default; the global `[data-reveal]` reveal is a cinematic blur→focus + scale (App.css "Cinematic global layer"). `gsap` powers the **Hero intro** (staggered title mask-reveal, lazy `import('gsap')` in `Hero.jsx`), the Career timeline scroll-fill, the **drag-to-scroll Reels shelf** (Draggable + InertiaPlugin, off-DOM proxy onto `el.scrollLeft` — fine-pointer only), and **`ScrollFX`** (`src/components/ScrollFX.jsx`: a passive scroll-progress bar + lazy ScrollTrigger parallax drifting `.*-num` + titles, desktop/fine-pointer only). **`Interactions`** (`src/components/Interactions.jsx`) adds a custom cursor (lerped ring + dot, grows over interactive targets) and magnetic pull on `[data-magnetic]` elements — vanilla, desktop/fine-pointer only, skipped under reduced motion. All gsap/three are **lazy-imported** so they stay out of the initial bundle. `three`: the hero centrepiece is a vintage SLR camera GLB (`CameraStage`, vanilla three + DRACOLoader, paused offscreen via IntersectionObserver). Every animation respects `prefers-reduced-motion`.
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

- `src/App.jsx` — composes the sections in order: Hero · About · Services · Projects · Fotografia · **DesignWork** · Contact, wrapped by Nav + Footer, plus `ScrollFX` + `Interactions`.
- `src/sections/*` — one component per page section. Each follows the pattern: `useReveal()` on `<header className="section-head">` (no delay) + on the main content (`delay: 150`), with `data-reveal` alongside the ref. **Projects** is Audiovisual (YouTube cards + drag Reels shelf). **DesignWork** renders the *Diseño gráfico* (`#design`) + *Desarrollo* (`#dev`) sections below Fotografía — same card structure. **Skills + Career** are no longer top-level sections: they render via an `embedded` prop inside **About**'s click-to-expand disclosure panels (Habilidades / Trayectoria, "Ver más"), so they're not in the nav.
- `src/components/*` — Nav, Footer, Fireflies (ambient CSS glow), ErrorBoundary, `CameraStage` (hero 3D scene) + `CameraHero` (its `/camera.html` preview), **`ProjectList`** (shared project-card list: YouTube / external-link / gallery cards, manages the lightbox), **`Lightbox`** (reusable gallery modal, reuses the `.lightbox*` styles), `ScrollFX`, `Interactions`.
- 3D model assets: optimized Draco GLB at `public/models/camera.glb` (tracked); the raw 45 MB folder is gitignored. Draco decoder served from `public/draco/`.
- `src/lib/AppContext.jsx` — theme + language state (`useApp()`); persisted to localStorage; a pre-hydration script in `index.html` prevents theme flash.
- `src/hooks/useReveal.js` — the shared scroll-reveal hook.

## Design direction (current)

**Cinematic / 3D immersive** (pivot on **2026-06-12**, replacing the prior minimal/editorial direction). Refs: Lusion, Active Theory, Bruno Simon (see `docs/UX-REFERENCES.md` + `design-inspiration/`). The language:

- **Hero** (`hero--cinematic`): full-bleed dark stage with a **dominant** 3D camera (`CameraStage`, ~56vw/80vh on the right), the kinetic title layered over it (staggered mask-reveal via gsap), an atmospheric glow + vignette backdrop (`.hero-cine-bg`, theme-aware `color-mix` on accent tokens), a CSS **firefly** layer, an animated scroll cue, and a foot meta row. The camera sinks + scales + dissolves on scroll (desktop only).
- **Every section** inherits the cinematic language from App.css's **"Cinematic global layer"** (appended last so it wins source order over the legacy retro-type block): big editorial `.section-title`s with accent words, an ambient `.section::before` glow (alternating accent/accent-2, theme-aware), the blur→focus reveal, and a unified card hover glow (`.service`/`.reel-card`/`.project-link`/`.timeline-row`).
- The earlier retro-terminal / paper-collage / risograph phases stay **removed**; the small retro-type sizing in the "RETRO / TERMINAL TYPE PIVOT" block of App.css is now **overridden** by the cinematic layer (not deleted). Skills is a clean tag grid. Reference clones live in `_repos/` (Next.js + R3F — adapt patterns, don't merge).

Earlier work (3D camera hero, CWV fixes, Playwright E2E) shipped to production on 2026-06-01. Note: Vercel's "Production Branch" isn't wired to `react-version`, so pushes deploy as *preview*; promote to prod with `vercel --prod` (or set the production branch in the Vercel dashboard).

## Conventions / guardrails

- **Before any commit:** `npm run lint` + `npm run build` + `npm run test:run` must pass. Deploy after pushing.
- **Keep heavy libs lazy-loaded** — the cinematic pivot accepts more 3D/animation weight, but gsap/three/ScrollTrigger must stay `import()`-split out of the initial bundle (they already are). Still flag the weight of *new* deps and prefer CSS/SVG when it gives the same effect.
- Form inputs are borderless (only `border-bottom`) — never add `border`/`border-radius`/`background` to them.
- Keep `_repos/`, `.claude/`, `.agents/` out of tooling (already ignored in `eslint.config.js` and Vite `server.watch.ignored`).
- Respect `prefers-reduced-motion` in every animation.

## Skills available

Installed via `autoskills` (see `.claude/skills/`): GSAP (`gsap-core`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`, …), Three.js (`threejs-fundamentals`, `threejs-shaders`, …), `react-best-practices`, `accessibility`, `seo`, `vite`, `vitest`, `frontend-design`. Use them when the task matches.
