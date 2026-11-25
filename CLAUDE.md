# CLAUDE.md

Guidance for working in this repo. Keep it accurate — update it when conventions change.

## Project

Personal portfolio for **Jacky Gutiérrez** (audiovisual communicator / documentary photographer, Medellín — brand _hackidevs_). Single-page, bilingual (ES/EN), dark/light themed, deployed on Vercel.

- Live (fixed — always deploy/alias here, do not change): https://mi-portafolio-hackidevs.vercel.app/
- Branch: `react-version` (also the default/PR base)

## Stack

- **React 19 + Vite 8** SPA (not Next.js).
- **Plain CSS** — no Tailwind, no CSS-in-JS. Theme tokens in `src/index.css` (`:root` / `[data-theme='dark']`); component styles in `src/App.css`. **CSS variables are the source of truth — never hardcode colors.** (Tailwind + shadcn/cult-ui drifted in and were **fully removed 2026-06-12** along with the `?preview=heroes` gallery — the site never used Tailwind classes; this pruned ~340 npm packages and cut the CSS bundle from ~187KB → ~37KB. Runtime deps are now just `react`, `react-dom`, `gsap`, `three`.) Fonts: Space Grotesk (`--font-display`), Inter (`--font-sans`), JetBrains Mono (`--font-terminal`) — loaded via a non-blocking `<link>` in `index.html` (preload + `media=print`/`onload`), **not** an `@import` in CSS (which chained behind the stylesheet and hurt LCP).
- **Animation:** `useReveal` (IntersectionObserver scroll reveals) is the default; the global `[data-reveal]` reveal is a cinematic blur→focus + scale (App.css "Cinematic global layer"). `gsap` powers the **Hero intro** (staggered title mask-reveal, lazy `import('gsap')` in `Hero.jsx`), the Career timeline scroll-fill, the **drag-to-scroll Reels shelf** (Draggable + InertiaPlugin, off-DOM proxy onto `el.scrollLeft` — fine-pointer only), and **`ScrollFX`** (`src/components/ScrollFX.jsx`: a passive scroll-progress bar + lazy ScrollTrigger parallax drifting `.*-num` + titles, desktop/fine-pointer only). **`Interactions`** (`src/components/Interactions.jsx`) adds a custom cursor (a soft, blurred translucent-purple orb that grows over interactive targets) and magnetic pull on `[data-magnetic]` elements — vanilla, desktop/fine-pointer only, skipped under reduced motion. All gsap/three are **lazy-imported** so they stay out of the initial bundle. `three`: the hero centrepiece is a vintage SLR camera GLB (`CameraStage`, vanilla three + DRACOLoader, paused offscreen via IntersectionObserver). **`animejs`** (v4, lazy) powers the staggered entrance of the **Services** cards (IntersectionObserver-triggered, `Services.jsx`). Every animation respects `prefers-reduced-motion`.
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

- `src/App.jsx` — composes the sections in order: Hero · About · Services · Projects · Fotografia · **DesignWork** (Desarrollo only) · Contact, wrapped by Nav + Footer, plus `ScrollFX` + `Interactions`.
- `src/sections/*` — one component per page section. Each follows the pattern: `useReveal()` on `<header className="section-head">` (no delay) + on the main content (`delay: 150`), with `data-reveal` alongside the ref. **Projects** is Audiovisual (YouTube cards + drag Reels shelf). Reels live in `reelsBase` (Projects.jsx) as `{ videoId, group, es, en }`; groups render in `REEL_GROUPS` order (`ba` antes/después split-screen edits · `ai` avatares IA · `reel` the rest), each sorted alphabetically by localized title, each in its own draggable `ReelTrack`. **No numbering anywhere** (2026-11-24, user request): no 01/02 on cards/services, no N.º plates on photos, no counts or ' · 01' suffixes on reel titles — repeated titles (e.g. several 'APEX') are fine. **DesignWork** renders only the _Desarrollo_ (`#dev`) section below Fotografía — same card structure. (The _Diseño gráfico_ `#design` section + its nav link were **removed 2026-11-24**; the tejidas.co brand-book images remain in `public/projects/tejidas/` unused.) **Skills + Career** are no longer top-level sections: they render via an `embedded` prop inside **About**'s click-to-expand disclosure panels (Habilidades / Trayectoria, "Ver más"), so they're not in the nav.
- `src/components/*` — Nav, Footer, Fireflies (ambient CSS glow), ErrorBoundary, `CameraStage` (hero 3D scene) + `CameraHero` (its `/camera.html` preview), **`ProjectList`** (shared project-card list: YouTube / external-link / gallery cards, manages the lightbox), **`Lightbox`** (reusable gallery modal, reuses the `.lightbox*` styles), `ScrollFX`, `Interactions`.
- 3D model assets: optimized Draco GLB at `public/models/camera.glb` (tracked); the raw 45 MB folder is gitignored. Draco decoder served from `public/draco/`.
- `src/lib/AppContext.jsx` — theme + language state (`useApp()`); persisted to localStorage; a pre-hydration script in `index.html` prevents theme flash.
- `src/hooks/useReveal.js` — the shared scroll-reveal hook.

## Design direction (current)

**Cinematic / 3D immersive** (pivot on **2026-06-12**, replacing the prior minimal/editorial direction). Refs: Lusion, Active Theory, Bruno Simon (see `docs/UX-REFERENCES.md` + `design-inspiration/`). The language:

- **Hero** (`hero--cinematic`): full-bleed dark stage with a **dominant** 3D camera (`CameraStage`, ~56vw/80vh on the right), the kinetic title layered over it (staggered mask-reveal via gsap), an atmospheric glow + vignette backdrop (`.hero-cine-bg`, theme-aware `color-mix` on accent tokens), a CSS **firefly** layer, an animated scroll cue, and a foot meta row. The camera sinks + scales + dissolves on scroll (desktop only).
- **Every section** inherits the cinematic language from App.css's **"Cinematic global layer"** (appended last so it wins source order over the legacy retro-type block): big editorial `.section-title`s with accent words, an ambient `.section::before` glow (alternating accent/accent-2, theme-aware), the blur→focus reveal, and a unified card hover glow (`.service`/`.reel-card`/`.project-link`/`.timeline-row`).
- The earlier retro-terminal / paper-collage / risograph phases stay **removed**. The old "RETRO / TERMINAL TYPE PIVOT" block was **replaced on 2026-11-24** by a single **TYPE SYSTEM** block in App.css: Space Grotesk for all titles (section, card, contact), Inter for body/nav/forms, JetBrains Mono **only** for small uppercase metadata (eyebrows, labels, roles). Don't reintroduce mono card titles or sub-13px nav.
- **Design refresh (2026-11-24):** **single accent** — `--accent-2` is now an alias of `--accent` (the guava pink is retired; fireflies are lavender) and the per-section `.section::before` glows were removed. A static **film-grain** layer (`body::after`, inline SVG noise) sits over the page. **Fotografía** is an editorial montage on a 12-col grid with slot shapes (`lead`/`wide`/`land`/`tall`/`square`/`pano`) set per photo in `Fotografia.jsx` (+ `pos` crop and optional `caption: { es, en }`). **Services** is a ruled editorial index (`<ol>` rows: title · description/tags), titles in sentence case. `html, body { overflow-x: clip }` stops full-bleed pieces adding sideways scroll.
- **Videos** is a pinned horizontal scroll (desktop/fine-pointer): the section title renders _inside_ the pinned stage via `ProjectList`'s `head` prop, with a scrub progress bar (`.videos-h-progress`). Skills is a clean tag grid. Reference clones live in `_repos/` (Next.js + R3F — adapt patterns, don't merge).

Earlier work (3D camera hero, CWV fixes, Playwright E2E) shipped to production on 2026-06-01.

## Deploy (Vercel)

- Live project: **`mi-portafolio-hackidevs`** (scope `jacky-s-projects-e67fc5a7`). A second project, `mi-portafolio`, is also hooked to this repo and builds every push — not the live site.
- Vercel's Production Branch isn't `react-version`, so a push only creates a **Preview**. `VITE_WEB3FORMS_KEY` exists in Production/Development but **not Preview**, so never just "promote" a preview (the contact form would ship without its key). Instead, once the git preview of the commit is ready:
  `vercel redeploy <preview-url> --target production --scope jacky-s-projects-e67fc5a7` — rebuilds with Production env and aliases the fixed domain. Find the preview URL with `gh api repos/Lumpenvisual/Mi_Portafolio_hackidevs/deployments`.
- The stored key starts with an invisible BOM; `Contact.jsx` strips it with a runtime regex (a plain `.trim()` is constant-folded by the minifier and does nothing).
- Push / deploy only after Jacky's explicit OK; then verify the live bundle.

## Outside the site

- `reel-presentacion/` (gitignored, ~1 GB) — her code-generated presentation reel (Python + ffmpeg). See its `README.md`; not part of the web build.

## Conventions / guardrails

- **Before any commit:** `npm run lint` + `npm run build` + `npm run test:run` must pass (plus `npx playwright test` for UI changes). Push/deploy with her OK (see Deploy).
- **Keep heavy libs lazy-loaded** — the cinematic pivot accepts more 3D/animation weight, but gsap/three/ScrollTrigger must stay `import()`-split out of the initial bundle (they already are). Still flag the weight of _new_ deps and prefer CSS/SVG when it gives the same effect.
- Form inputs are borderless (only `border-bottom`) — never add `border`/`border-radius`/`background` to them.
- Keep `_repos/`, `.claude/`, `.agents/` out of tooling (already ignored in `eslint.config.js` and Vite `server.watch.ignored`).
- Respect `prefers-reduced-motion` in every animation.
- **Old phones must get the mobile layout (2026-11-25).** With `build.target: 'esnext'` the CSS minifier rewrote every `@media (max-width: …)` into range syntax `(width<=…)`, which Chrome <104 / Safari <16.4 ignore — Jacky's own phone (Chrome that can't update) showed the cropped desktop layout. Now `vite.config.js` targets `BROWSERS` (es2020 · chrome87 · edge88 · firefox78 · safari14) for JS **and** CSS, and `npm run build` runs `scripts/check-legacy-css.mjs`, which fails on range queries or on any `color-mix()` / `svh` declaration without a plain fallback declared just before it in the same rule (decorative hover/shadow uses are exempt). When adding `color-mix()`, put a token-based fallback line first.
- **Nav:** solid `var(--bg)` background (no translucency/backdrop blur — content must never show through while scrolling); hamburger menu up to **960px** (six links + tools need ~850–890px), and `--nav-h: 64px` in `index.css` uses the same breakpoint. The closed dropdown is `visibility: hidden` (not focusable).

## Skills available

Installed via `autoskills` (see `.claude/skills/`): GSAP (`gsap-core`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`, …), Three.js (`threejs-fundamentals`, `threejs-shaders`, …), `react-best-practices`, `accessibility`, `seo`, `vite`, `vitest`, `frontend-design`. Use them when the task matches.
