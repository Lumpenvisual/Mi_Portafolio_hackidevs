# Foto para el retrato en partículas (stipple 3D)

La pieza `src/three/FaceParticles.jsx` convierte una foto en miles de puntos.
Funciona, pero el resultado depende **totalmente** del contraste de la imagen.
`yo-retoque.webp` es demasiado plana (piel aclarada, fondo blanco) → no define rasgos.

## Qué foto mandar (ideal)

- **Luz lateral / direccional:** un lado de la cara iluminado, el otro en sombra.
  El relieve (nariz, pómulos, ojos) necesita esas sombras para "dibujarse" en puntos.
- **Fondo oscuro o neutro** (no blanco). Así la figura emerge de la penumbra.
- **Primer plano del rostro** (cabeza y hombros), mirando a cámara o 3/4.
- **Nitidez** y buena resolución (≥ 1000 px de alto).
- Evitar: flash frontal plano, sobreexposición, fondo blanco brillante.

## Cómo entregarla

Déjala en `public/` (p. ej. `public/retrato.jpg` o `.webp`) y avísame el nombre.
Yo la integro cambiando el `src` en `src/three/facePreview.jsx` y, luego, en el sitio.

## Estado

- Componente listo: `src/three/FaceParticles.jsx` (vanilla three, lazy, fallback sin WebGL, reduced-motion).
- Preview aislado: `/face.html` → `npm run dev` y abrir esa ruta.
- Brillo del punto = luminancia real (cara iluminada se ve, pelo/sombra se funden al fondo).
