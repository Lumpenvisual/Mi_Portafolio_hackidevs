# Allan Pinot — R3F Hero (isolated)

A self-contained **Vite + React 19 + React Three Fiber** recreation of the
Allan Pinot portfolio hero: a dense, cinematic particle sphere with a procedural
nebula backdrop, glowing colour orbs, and subtle bloom.

> **Isolation guarantee.** This project is fully separate from the live
> "cut-storytelling" portfolio in the repo root (`../src`, `../index.html`). It
> has its own `package.json`, `node_modules`, and build output. Nothing here is
> imported by the live portfolio, so the live bundle stays lean and untouched.

## Quick start

```bash
cd allan-pinot
npm install
npm run dev      # dev server (http://localhost:5173, or next free port)
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
```

The Phase 1 standalone prototype (no build step, three@0.160 via CDN importmap)
is preserved as **`prototype.html`** — open it directly in a browser.

## Architecture

```
allan-pinot/
├── index.html                 Vite entry (loads /src/main.jsx)
├── prototype.html             Phase 1 standalone reference (no build step)
├── vite.config.js             manualChunks + lazy-friendly chunking
├── package.json               isolated deps (R3F v9 / React 19 / three 0.184)
└── src/
    ├── main.jsx               React root (StrictMode)
    ├── App.jsx                composition root; lazy-loads the 3D Scene
    ├── index.css              hero typography + a11y (ported from prototype)
    ├── components/
    │   ├── UI/Hero.jsx        accessible HTML hero (paints first)
    │   ├── Scene/
    │   │   ├── Scene.jsx      <Canvas>, camera rig, bloom, dev panel wiring
    │   │   ├── Particles.jsx  the particle sphere (shaderMaterial + extend)
    │   │   ├── Nebula.jsx      procedural additive nebula planes
    │   │   ├── ColorOrbs.jsx   glowing sprite "suns" (the colour sources)
    │   │   ├── config.js       single source of truth for the look
    │   │   ├── useTuning.js    tuning state (no leva import; prod-safe)
    │   │   └── TuningPanel.jsx DEV-only leva panel (excluded from prod)
    │   ├── Carousel/          (placeholder — Phase 3 carousel / later)
    │   └── Cursor/            (placeholder — Phase 5)
    └── hooks/
        └── useReducedMotion.js  prefers-reduced-motion (drei v10 has none)
```

## Key technical decisions

- **R3F v9 / React 19 / three 0.184.** Matches the host portfolio's pins and is
  the highest mutually-compatible set. R3F 9.6.1 peer-requires `react >=19 <19.3`,
  so React is pinned to `^19.2`.
- **One draw call for the field.** A single `<points>` with three packed buffer
  attributes (position / aColor / aSize) built **once in `useMemo`** — the data
  is pure and must not reallocate per render. Uniform sphere sampling via
  inverse-CDF (`acos(2v-1)`) avoids pole clustering.
- **Custom `shaderMaterial` + `extend()`.** drei's `shaderMaterial` generates a
  ShaderMaterial subclass usable as `<particlesMaterial>`. Each point is a
  circular sprite (corners discarded) with a wide soft **halo + tight bright
  core**; **additive blending** stacks overlapping glows into bright cores.
- **Bloom amplifies the cores.** Brightness comes from additive accumulation +
  bloom, **not** large points — so points are small and the count is high.
  `<Bloom>` (intensity 0.55, threshold 0.18, radius 0.5, mipmapBlur) blooms only
  bright cores; the black background stays black.
- **The colour lives in the nebula + orbs, not the stars.** Stars are near-white;
  the faint procedural nebula and the 3 glowing sprite orbs carry the purple/blue.
  Bright/large nebula washes the frame and kills text contrast — kept faint.
- **`useFrame` for animation, `useRef` for transforms.** Never React state per
  frame. R3F passes `delta` pre-computed (no `getDelta`/`getElapsedTime` trap).

## Lean-bundle strategy

The entry chunk is **~2.9 kB** — the HTML hero paints first.

- The **entire 3D subtree** (`Scene.jsx` + three + drei + postprocessing) is
  `React.lazy` + `Suspense` loaded, so its vendor chunks fetch *after* the hero.
- **leva is fully absent from production.** It is imported only by
  `TuningPanel.jsx`, which is loaded through a `lazy()` call placed **inside an
  `import.meta.env.DEV` branch**. In prod that branch is dead code, so Rolldown
  drops the TuningPanel chunk and leva entirely. (A static `import` guarded by an
  `if` does **not** tree-shake under Rolldown — verified.)
- `manualChunks` splits vendors. three + r3f + postprocessing merge into one
  ~960 kB (~255 kB gzip) lazy chunk — three is only consumed by that lazy subtree,
  so the merge is correct and there is no duplication.

### Production chunk sizes

| chunk                | raw      | gzip     |
| -------------------- | -------- | -------- |
| entry (`index`)      | 2.9 kB   | 1.4 kB   |
| `Scene` (lazy)       | 8.2 kB   | 3.3 kB   |
| `vendor-react`       | 178 kB   | 56 kB    |
| `vendor-postprocessing` (three+r3f+pp, lazy) | 961 kB | 255 kB |

## Accessibility

- `prefers-reduced-motion`: animation loops short-circuit and the Canvas switches
  to `frameloop="demand"` (one static frame). CSS entrance animations are also
  disabled.
- The canvas is `aria-hidden="true"`; the real, selectable hero text is HTML
  rendered above it (`Hero.jsx`).

## Mobile / performance

- Particle count auto-reduces to **3000 on mobile**, 6000 on desktop.
- Pixel ratio capped at `min(devicePixelRatio, 2)`.
- Geometries, textures, and materials are disposed on unmount (Nebula/ColorOrbs).

## WebGPU vs WebGL (later phase)

This Phase 3 build uses the **WebGL** renderer (R3F default). A WebGPU particle
path (`three/webgpu` + TSL node materials) with a `navigator.gpu` capability
check and automatic WebGL fallback is planned for a later phase. The current
WebGL scene already runs everywhere (Chrome, Firefox, Safari, Edge).
