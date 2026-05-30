# Reporte técnico — hacia un sitio con escenario 3D (Three.js + CSS + Tailwind)

Fecha: 2026-05-30 · Objetivo del usuario: crear un sitio con **escenario 3D** (Three.js), estilado con **CSS + Tailwind**, integrando **3D, video y sonido**.

---

## 1. Lo que YA tenemos

### Stack base
- **React 19 + Vite 8** (SPA, sin Next.js) — build rápido, HMR, code-splitting nativo.
- **CSS plano** con sistema de tokens en `src/index.css` (`--bg`, `--ink`, `--accent`, `--accent-2`, `--firefly`, fuentes). **Tailwind NO está instalado** todavía.
- **Tests**: Vitest + Testing Library (35 tests verdes). **ESLint** flat config. **Prettier**. **sharp** (optimización de imágenes).
- Deploy en **Vercel**. Formulario vía **Web3Forms**.

### Librerías ya instaladas (¡varias sin usar = listas para el 3D!)
| Librería | Estado | Para qué sirve en el sitio 3D |
|---|---|---|
| **three** `0.184` | instalada, **sin uso** | motor 3D (escena, cámara, luces, modelos, shaders) |
| **gsap** + `@gsap/react` | **en uso** (línea de Trayectoria, lazy) | animación + **ScrollTrigger** para coreografía por scroll |
| **lenis** `1.3` | instalada, **sin uso** | **scroll suave** (clave para experiencias 3D cinematográficas) |
| **motion** | instalada, **sin uso** | animación declarativa React (alternativa/complemento) |

> Es decir: ya tienes pagado el peso de **three + gsap + lenis**. Para un escenario 3D con scroll cinematográfico, ese trío es exactamente la base. Lo único grande que falta es **Tailwind** y, según el enfoque, **React Three Fiber + drei**.

### Componentes/lógica reutilizable
- `src/components/Fireflies.jsx` — capa ambiente CSS (luciérnagas) theme-aware → sirve como atmósfera sobre/bajo el canvas 3D.
- `src/lib/AppContext.jsx` — estado de **tema (claro/oscuro) + idioma (ES/EN)** con persistencia y anti-flash. Reutilizable tal cual.
- `src/components/Nav.jsx`, `Footer.jsx`, `Marquee.jsx`, `ErrorBoundary.jsx`.
- `src/hooks/useReveal.js` — reveals por IntersectionObserver.
- `src/sections/Fotografia.jsx` — **lightbox accesible** (focus-trap, teclado) ya resuelto.
- **Patrón Three.js ya probado** (en el `HeroCanvas` que borramos): `import('three')` dinámico, partículas con sprite redondo, niebla por tema, fallback sin WebGL, pausa fuera de viewport, `dispose()` en unmount. Recuperable del historial git (commit `f9c65f8` / `c0ab96d`).

### Skills instaladas (vía autoskills, en `.claude/skills/`) — guía oficial bajo demanda
- **Three.js (11):** `threejs-webgl` (la grande), `threejs-fundamentals`, `-geometry`, `-materials`, `-shaders`, `-lighting`, `-postprocessing`, `-textures`, `-loaders`, `-animation`, `-interaction`.
- **GSAP (8):** `gsap-core`, `-scrolltrigger`, `-react`, `-timeline`, `-performance`, `-plugins`, `-utils`, `-frameworks`.
- **Calidad/diseño:** `react-best-practices`, `accessibility`, `seo`, `ui-ux-designer`, `frontend-design`, `vite`, `vitest`, `composition-patterns`, `deploy-to-vercel`.
- Agente especializado: `.claude/agents/r3f-webgpu-portfolio-builder.md` (realineado al stack actual) — pensado justo para construir un portafolio R3F/WebGPU inmersivo.

### Assets de contenido
- **Imágenes:** 10 fotos WebP optimizadas (`public/fotos/`), retrato (`public/yo-retoque.webp`), `hackidevs.png` (OG). *(Los originales en `assests/` se borraron — si necesitas re-optimizar, hay que volver a subir fuentes.)*
- **Video:** **no hay video local.** Hoy se usan **19 referencias a YouTube** (6 proyectos + 6 reels + IDs) — solo thumbnails + enlaces, no reproducción embebida.
- **Sonido:** **no hay audio.** Cero pista ambiente, cero SFX.

---

## 2. Cómo usar lo que tenemos

1. **Reaprovecha el trío 3D ya instalado.** `three` + `gsap/ScrollTrigger` + `lenis` = escena + animación por scroll + scroll suave. No hay que instalar nada nuevo para empezar el 3D básico.
2. **Decisión clave — vanilla three vs React Three Fiber (R3F):**
   - *Vanilla three* (lo que ya hacíamos): más liviano, control total, pero más código para una escena con modelos/luces/controles.
   - *R3F + drei* (lo que usaban los repos de referencia): mucho más productivo para un **escenario** con modelos GLB, `<Environment>`, `<OrbitControls>`, carga con Suspense, etc. Cuesta ~+150–200 KB gz. **Recomendado para "escenario 3D" real con modelos.**
3. **Reutiliza Context (tema/idioma), Nav, lightbox y Fireflies** sin tocarlos.
4. **Las skills de Three.js/GSAP** se cargan bajo demanda al programar cada parte (shaders, loaders, scrolltrigger…). Úsalas como referencia oficial en vez de improvisar APIs.

---

## 3. Lo que falta DESARROLLAR

### A. Tailwind (lo pides explícitamente)
- Instalar **Tailwind v4** con el plugin oficial de Vite:
  `npm i -D tailwindcss @tailwindcss/vite` → añadir `@tailwindcss/vite` a `vite.config.js` y `@import "tailwindcss";` al CSS.
- **Mapear tus tokens actuales** (`--bg`, `--accent`, fuentes…) al `@theme` de Tailwind para que las utilidades respeten tu paleta y el dark/light por `data-theme`.
- Decidir: **convivencia** (Tailwind para layout nuevo + tu `App.css` actual) o **migración** gradual. Recomiendo convivencia al principio.

### B. 3D (Three.js / R3F)
Lo que hay que crear desde cero:
1. **Concepto de escenario** — definir QUÉ es la escena (p.ej.: una sala/estudio audiovisual, un espacio abstracto de partículas, una "mesa de montaje" flotante con cámara/carrete, etc.). Esto manda todo lo demás.
2. **Modelos 3D (GLB/GLTF):** sourcing o creación (cámara, carrete de cine, claqueta, objetos de set…). Optimizar con **Draco/meshopt**; pesos < 1–2 MB por modelo. *(No tenemos modelos hoy.)*
3. **Entorno e iluminación:** HDRI para reflejos/ambiente (`<Environment>` de drei o `RoomEnvironment`), luces, sombras suaves.
4. **Materiales/shaders:** PBR para realismo, o **GLSL custom** (skills `threejs-shaders`) para el sello visual (partículas, disolves, grano).
5. **Cámara + coreografía:** recorrido por scroll con **GSAP ScrollTrigger + Lenis** (pin, scrub, transiciones entre secciones).
6. **Interacción:** `OrbitControls` o raycasting para objetos clicables; cursor custom opcional.
7. **Rendimiento y fallbacks (no negociable):** cap `devicePixelRatio` a 2, `dispose()` en unmount, pausa fuera de viewport, **fallback sin WebGL**, y respeto a **`prefers-reduced-motion`** (escena estática). Auto-reducir conteo/calidad en móvil.

### C. Video
1. **Conseguir los archivos** (tus reels/documentales) — hoy solo hay enlaces a YouTube.
2. **Decidir hosting/formato:**
   - *Self-host* `MP4 (H.264) + WebM`, con **poster** y `preload="none"`; o **HLS** para piezas largas.
   - *Embebido* (YouTube/Vimeo) si no quieres pagar ancho de banda.
3. **Integración:**
   - **Video como textura 3D** (`THREE.VideoTexture` sobre un plano/pantalla dentro de la escena) — muy potente para un "estudio".
   - o **video HTML5 en overlay** (DOM) sincronizado con la escena.
4. **Restricciones móviles:** autoplay solo si **muted + playsinline**; lazy-load; pósters para no pagar descarga hasta interacción.

### D. Sonido
1. **Librería:** **Howler.js** (simple, sprites de SFX) o **Web Audio API** (control fino / audio espacial 3D que acompañe la cámara).
2. **Assets:** pista **ambiente** (loop), **SFX** de UI (hover/click/whoosh de transición), opcional **voz/intro**. *(No tenemos ninguno.)*
3. **Gating de autoplay:** el navegador bloquea audio sin gesto del usuario → **toggle de sonido** (los repos de referencia traían `Sound.jsx`) y arrancar tras el primer click/scroll.
4. **Accesibilidad:** mute por defecto o recordar preferencia; respetar `prefers-reduced-motion` para no forzar audio/movimiento.

---

## 4. Stack recomendado para el sitio 3D

```
Base:        React 19 + Vite 8  (ya lo tienes)
Estilos:     Tailwind v4 (@tailwindcss/vite) + tus tokens CSS actuales
3D:          @react-three/fiber + @react-three/drei  (sobre three 0.184 ya instalado)
Scroll:      GSAP ScrollTrigger + Lenis  (ya instalados)
Sonido:      Howler.js  (o Web Audio API)
Video:       <video> + THREE.VideoTexture / o embed
Estado:      tu AppContext (tema/idioma) reutilizable
```

Peso extra estimado a sumar: **R3F+drei (~150–200 KB gz, lazy)** + **Howler (~10 KB)** + **Tailwind (CSS, tree-shaken)**. Todo **code-split / lazy** para no penalizar la carga inicial (tu prioridad de bundle ligero se mantiene).

---

## 5. Lo que NECESITO de ti para arrancar (decisiones/insumos)
1. **¿Sitio nuevo o evolución del portafolio actual?** (rama aparte vs. reemplazo).
2. **Concepto del escenario 3D** (1–2 frases) — o elijo 2–3 propuestas y decides.
3. **¿R3F+drei o vanilla three?** (recomiendo R3F para escenario con modelos).
4. **Modelos 3D:** ¿los consigues (Sketchfab/encargo) o los hago procedurales?
5. **Video:** ¿archivos propios o seguimos con YouTube/Vimeo embebido?
6. **Sonido:** ¿tienes pista ambiente/SFX o los busco (libres de derechos)?
7. **Confirmar Tailwind** y si conviven con el CSS actual o migramos.

---

## 6. Limpieza/deuda detectada (aparte)
- `three` y `motion` están en `package.json` **sin uso real** hoy (three se reusará en el 3D; **motion** se puede desinstalar).
- `lenis` instalada sin uso → se usará en el scroll cinematográfico.
- Los repos de referencia (`_repos/`) y `assests/` (712 MB) **se borraron**; si necesitas volver a verlos, hay que re-clonar / re-subir fuentes.
