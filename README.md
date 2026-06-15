# Portafolio — Jacky Gutiérrez

[![React](https://img.shields.io/badge/React-19.2-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![CSS Moderno](https://img.shields.io/badge/CSS-Moderno-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Web](https://img.shields.io/badge/Producción-mi--portafolio--hackidevs.vercel.app-c8553d)](https://mi-portafolio-hackidevs.vercel.app)

> Sitio personal editorial de Jacky Gutiérrez — comunicadora audiovisual y desarrolladora en formación. Construido como una pieza de diseño tipográfico: serif italic para los acentos, sans tight para el cuerpo, paleta crema con acento terracota y modo oscuro cálido. Sin frameworks de UI, sin librerías de animación — el lenguaje visual se sostiene en CSS moderno, jerarquía editorial y tipografía variable.

**Producción:** <https://mi-portafolio-hackidevs.vercel.app>
**Dev local:** <http://localhost:5173>

## Resumen

Portafolio de una sola página con **seis secciones** (Hero, Sobre mí, Servicios, Proyectos + Reels, Trayectoria, Contacto). El sitio narra la transición profesional de Jacky desde la comunicación audiovisual hacia el desarrollo de software con una voz de crónica.

**Características técnicas relevantes:**

- **Bilingüe ES/EN** sin librerías de i18n — un objeto `localized = { es: {...}, en: {...} }` por sección, con detección automática de `navigator.language` y persistencia en `localStorage`.
- **Modo claro / oscuro** con detección de `prefers-color-scheme` y persistencia. Toggle disponible en el navbar (☀ / ☾).
- **Línea de tiempo** vertical compuesta con un solo eje + marcadores circulares animados, sin librerías externas.
- **Shelf horizontal de Reels** con `scroll-snap-type: x mandatory` y máscara `linear-gradient` en los bordes para indicar continuidad.
- **Miniaturas de YouTube en vivo** vía la API pública de thumbnails (`i.ytimg.com/vi/{id}/maxresdefault.jpg` con fallback a `hqdefault.jpg`).
- **Marquee** de palabras clave con animación CSS pura.
- **Responsive** con tres breakpoints (1024px y 768px). En mobile los proyectos pasan a columna única con thumbs `aspect-ratio: 16/9`.

**Performance:** ~218 KB de JavaScript (68 KB gzipped) y ~18 KB de CSS (~4 KB gzipped). Build en ~270 ms. **0 dependencias** de runtime más allá de React y ReactDOM.

## Tecnologías

| Capa               | Stack                                                                                                                                                        | Versión      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Build & dev server | [Vite](https://vite.dev)                                                                                                                                     | 8.0.11       |
| Framework          | [React](https://react.dev) (StrictMode)                                                                                                                      | 19.2         |
| Estilos            | CSS moderno con custom properties, `color-mix`, `clamp`, `aspect-ratio`, `scroll-snap-type`, `mask-image`, `backdrop-filter`                                 | —            |
| Tipografía         | [Fraunces](https://fonts.google.com/specimen/Fraunces) (display, axis variable `SOFT`) + [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) (sans) | Google Fonts |
| Linting            | [ESLint](https://eslint.org) + plugins `react-hooks` y `react-refresh`                                                                                       | 10           |
| Deploy             | [Vercel](https://vercel.com) (build estático desde Vite)                                                                                                     | —            |

**Lo que NO usa el proyecto** (intencional): Tailwind, MUI, Bootstrap, styled-components, GSAP, Framer Motion, i18next, react-i18next, Three.js, Lottie, ni ninguna librería de iconos. Todo se resuelve con primitivas web.

## Cómo correrlo

```bash
npm install
npm run dev      # dev server en http://localhost:5173
npm run build    # bundle de producción a dist/
npm run preview  # sirve el bundle compilado
npm run lint     # ESLint
```

Build actual: ~218 KB JS (68 KB gzip), 18 KB CSS, 27 módulos transformados, ~270 ms.

## Estructura

```
src/
├── App.jsx                # Composición de secciones
├── App.css                # Sistema de diseño completo (~750 líneas)
├── index.css              # Tokens de tema (light/dark) + tipografía base
├── main.jsx               # Entry point con AppProvider
├── lib/
│   └── AppContext.jsx     # Estado global: idioma + tema, persistido en localStorage
├── components/
│   ├── Nav.jsx            # Navbar sticky con toggles de idioma y tema
│   ├── Marquee.jsx        # Cinta horizontal animada
│   └── Footer.jsx         # Pie con ubicación y firma
└── sections/
    ├── Hero.jsx           # Portada editorial con título tipográfico
    ├── About.jsx          # Imagen + texto a dos columnas + facts
    ├── Services.jsx       # Grilla 2×3 de servicios
    ├── Projects.jsx       # 6 proyectos largos + shelf de 6 reels
    ├── Career.jsx         # Línea de tiempo vertical con marcadores
    └── Contact.jsx        # Email, redes y disponibilidad
```

## Sistema de diseño

### Paleta

Modo claro (default):

| Token                          | Valor                 | Uso                            |
| ------------------------------ | --------------------- | ------------------------------ |
| `--bg`                         | `#f7f5f0`             | Fondo cálido crema             |
| `--ink`                        | `#0e0e10`             | Tinta principal                |
| `--muted`                      | `#6b6b6e`             | Eyebrows, meta                 |
| `--accent`                     | `#c8553d`             | Terracota, italics editoriales |
| `--accent-soft`                | `#f1e3dc`             | Backgrounds suaves             |
| `--border` / `--border-strong` | `#e4e0d6` / `#cfcabb` | Divisores                      |

Modo oscuro: paleta cálida invertida (`--bg: #16140f`, `--ink: #f0ece2`, `--accent: #e8704f`). Las variables se intercambian via `[data-theme='dark']` en `<html>`.

### Tipografía

- **Fraunces** para display, headings y números editoriales. Italic con axis `SOFT: 100` para los acentos en terracota.
- **Inter Tight** para body, navegación y meta.
- Tamaños fluidos con `clamp()` para mantener jerarquía a través de breakpoints.

### Internacionalización

Sin libraría externa. Cada sección define un objeto `localized = { es: {...}, en: {...} }` con copy y fragmentos JSX (para preservar markup `<em>` en titulares). El hook `useApp()` expone `lang` y `toggleLang`. Persiste en `localStorage` y autodetecta `navigator.language` la primera vez.

### Tema light/dark

Mismo patrón: `useApp().theme` y `toggleTheme`. Persiste en `localStorage`. Autodetecta `prefers-color-scheme` la primera vez. Aplica `data-theme="dark|light"` al `<html>`.

## Datos editables

Para cambiar contenido sin tocar layout:

| Qué                                         | Dónde                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Título principal del hero                   | `src/sections/Hero.jsx` → `copy.es.title` y `copy.en.title`             |
| Bio y facts (Aprendiendo, Idiomas)          | `src/sections/About.jsx` → `copy.es.facts` y `copy.en.facts`            |
| Lista de 6 servicios                        | `src/sections/Services.jsx` → `data.es.services` y `data.en.services`   |
| 6 proyectos largos (videoId, accent, ES/EN) | `src/sections/Projects.jsx` → `baseProjects` + `localized.[lang].items` |
| 6 reels (videoId + título por idioma)       | `src/sections/Projects.jsx` → `reelsBase` + `reelTitles`                |
| Hitos de trayectoria                        | `src/sections/Career.jsx` → `data.es.milestones` y `data.en.milestones` |
| Redes sociales                              | `src/sections/Contact.jsx` → `links`                                    |
| Imagen de perfil                            | `public/hackidevs.png`                                                  |

## Convenciones de proyectos

- **Largos:** YouTube 16:9, miniatura `maxresdefault.jpg` con fallback `hqdefault.jpg`
- **Reels (Shorts):** YouTube vertical 9:16, miniatura `hqdefault.jpg` (siempre disponible)
- Todos los enlaces externos abren en pestaña nueva con `rel="noreferrer"`

## Accesibilidad

- 1 `h1`, 5 `h2`, jerarquía consistente
- Todas las imágenes con `alt` descriptivo
- Botones de toggle con `aria-label` y `title` que cambian según estado
- Atributos `lang` y `data-theme` en el documento
- Respeta `prefers-color-scheme` en la primera visita
- Colores cumplen contraste AA en ambos modos

## Performance

- 0 dependencias en runtime más allá de React/ReactDOM
- Imágenes con `loading="lazy"` excepto la marca del About
- Tipografías cargadas con `display=swap` para evitar flash invisible
- Build producción ≈ 68 KB JS gzip — primer pintado rápido sin frameworks de animación

## Despliegue

```bash
npm run build
# servir dist/ desde cualquier static host
```

Compatible out-of-the-box con Vercel, Netlify, GitHub Pages y Cloudflare Pages. Sin variables de entorno requeridas.

## Crédito

Diseño y desarrollo: Jacky Gutiérrez · hackidevs · Medellín, Colombia · 2026
