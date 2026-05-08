# Portafolio — Jacky Gutiérrez

Sitio personal editorial de Jacky Gutiérrez, comunicadora audiovisual y desarrolladora en formación. Construido con React 19 + Vite, sin frameworks de UI ni librerías de animación: el lenguaje visual se sostiene en tipografía variable y CSS moderno.

URL local del dev server: <http://localhost:5173>

## Stack

- **Vite 8** + **React 19** (StrictMode)
- **CSS moderno** con custom properties, `color-mix`, `clamp`, `aspect-ratio`, `scroll-snap-type` y `mask-image` para los gradientes de borde
- **Google Fonts** — [Fraunces](https://fonts.google.com/specimen/Fraunces) (display, variable axis `SOFT`) e [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) (sans)
- ESLint 10 con `react-hooks` y `react-refresh`

Sin dependencias de Tailwind, MUI, GSAP, Framer Motion ni i18n libraries.

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

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#f7f5f0` | Fondo cálido crema |
| `--ink` | `#0e0e10` | Tinta principal |
| `--muted` | `#6b6b6e` | Eyebrows, meta |
| `--accent` | `#c8553d` | Terracota, italics editoriales |
| `--accent-soft` | `#f1e3dc` | Backgrounds suaves |
| `--border` / `--border-strong` | `#e4e0d6` / `#cfcabb` | Divisores |

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

| Qué | Dónde |
|---|---|
| Título principal del hero | `src/sections/Hero.jsx` → `copy.es.title` y `copy.en.title` |
| Bio y facts (Aprendiendo, Idiomas) | `src/sections/About.jsx` → `copy.es.facts` y `copy.en.facts` |
| Lista de 6 servicios | `src/sections/Services.jsx` → `data.es.services` y `data.en.services` |
| 6 proyectos largos (videoId, accent, ES/EN) | `src/sections/Projects.jsx` → `baseProjects` + `localized.[lang].items` |
| 6 reels (videoId + título por idioma) | `src/sections/Projects.jsx` → `reelsBase` + `reelTitles` |
| Hitos de trayectoria | `src/sections/Career.jsx` → `data.es.milestones` y `data.en.milestones` |
| Redes sociales | `src/sections/Contact.jsx` → `links` |
| Imagen de perfil | `public/hackidevs.png` |

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
