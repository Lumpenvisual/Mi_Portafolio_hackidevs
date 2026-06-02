import React from 'react'
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// Escenas de texto del intro. Cada componente recibe `startFrame` (frame global
// en el que arranca su animación) y queda SIEMPRE montado para no causar saltos
// de layout; antes de su inicio simplemente es invisible.

const easeInOutCubic = Easing.inOut(Easing.cubic)

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 2 (2s - 4s): Saludo
// "Hola soy" letra por letra con spring({ damping: 12, mass: 0.5 });
// "Jackie" en #a78bfa hace slide-in desde la derecha con spring.
// Tipografía: Inter, weight 300, tamaño grande.
// ───────────────────────────────────────────────────────────────────────────
export const NameScene: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame() - startFrame
  const letters = 'Hola soy'.split('')

  const gut = spring({ frame: f - 12, fps, config: { damping: 16, mass: 0.7 } })
  const gutX = interpolate(gut, [0, 1], [140, 0])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.28em',
        fontSize: 124,
        fontWeight: 300,
        color: '#ffffff',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}
    >
      <span style={{ display: 'inline-flex' }}>
        {letters.map((ch, i) => {
          const s = spring({
            frame: f - i * 3,
            fps,
            config: { damping: 12, mass: 0.5 },
          })
          const y = interpolate(s, [0, 1], [44, 0])
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre', // preserve the space in "Hola soy"
                opacity: Math.min(1, s),
                transform: `translateY(${y}px)`,
              }}
            >
              {ch}
            </span>
          )
        })}
      </span>
      <span
        style={{
          color: '#a78bfa',
          opacity: Math.min(1, gut),
          transform: `translateX(${gutX}px)`,
        }}
      >
        Jackie
      </span>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 3 (4s - 5.5s): Tagline kinetic
// "Cuento historias en" fade-in rápido.
// "imágenes & código." entra con blur-in + scale 0.8 -> 1, color #a78bfa.
// ───────────────────────────────────────────────────────────────────────────
export const TaglineScene: React.FC<{ startFrame: number }> = ({
  startFrame,
}) => {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame() - startFrame

  const line1 = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  })

  const pop = spring({ frame: f - 8, fps, config: { damping: 200, mass: 0.8 } })
  const scale = interpolate(pop, [0, 1], [0.8, 1])
  const blur = interpolate(f, [8, 32], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  })
  const line2 = interpolate(f, [8, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        fontSize: 76,
        fontWeight: 300,
        color: '#ffffff',
        lineHeight: 1.1,
      }}
    >
      <div style={{ opacity: line1 }}>Cuento historias en</div>
      <div
        style={{
          opacity: line2,
          color: '#a78bfa',
          fontWeight: 500,
          transform: `scale(${scale})`,
          transformOrigin: 'left center',
          filter: `blur(${blur}px)`,
        }}
      >
        imágenes &amp; código.
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 4 (5.5s - 7s): Tag badge
// Badge "PORTAFOLIO — 2026" con scale spring desde 0 + dot pulsando en #a78bfa.
// ───────────────────────────────────────────────────────────────────────────
export const BadgeScene: React.FC<{ startFrame: number }> = ({
  startFrame,
}) => {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame() - startFrame

  const s = spring({ frame: f, fps, config: { damping: 12, mass: 0.6 } })
  const scale = Math.max(0, s)
  const pulse = interpolate(Math.sin(f * 0.2), [-1, 1], [0.45, 1])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 20px',
        borderRadius: 999,
        background: 'rgba(139,92,246,0.15)',
        border: '1px solid rgba(139,92,246,0.4)',
        opacity: Math.min(1, s),
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#a78bfa',
          opacity: pulse,
          boxShadow: `0 0 ${8 * pulse}px #a78bfa`,
        }}
      />
      <span
        style={{
          color: '#c4b5fd',
          fontSize: 22,
          letterSpacing: '0.3em',
          fontWeight: 400,
        }}
      >
        PORTAFOLIO — 2026
      </span>
    </div>
  )
}
