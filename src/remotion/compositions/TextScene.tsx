import React from 'react'
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// Escenas de texto del intro. Cada componente recibe `startFrame` (frame global
// en el que arranca su animación) y queda SIEMPRE montado para no causar saltos
// de layout; antes de su inicio simplemente es invisible.

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 2 (2s - 4s): Saludo
// "Hola soy" letra por letra con spring({ damping: 12, mass: 0.5 });
// "Jacky" en #a78bfa hace slide-in desde la derecha con spring.
// Tipografía: Inter, weight 300, tamaño grande.
// ───────────────────────────────────────────────────────────────────────────
export const NameScene: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame() - startFrame
  const letters = 'Hola, soy'.split('')

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
        Jacky
      </span>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 3 (4s - …): Tagline con EFECTO ESCRITURA (typewriter).
// "Comunicadora audiovisual," (blanco) + "IA generativa" (#a78bfa) se escriben
// carácter por carácter (string slicing, per la skill de Remotion). El cursor
// NO existe antes de que arranque la escena (el componente está siempre montado,
// así que devolvemos null mientras f < 0); es sólido mientras escribe y parpadea
// suave al terminar. NO desaparece: permanece en pantalla.
// ───────────────────────────────────────────────────────────────────────────
const TAG_L1 = 'Comunicadora audiovisual,'
const TAG_L2 = 'IA generativa'
const CHAR_FRAMES = 1.1 // frames por carácter
const CURSOR_BLINK_FRAMES = 16

export const TaglineScene: React.FC<{ startFrame: number }> = ({
  startFrame,
}) => {
  const f = useCurrentFrame() - startFrame
  // antes del inicio de la escena no renderizamos nada (ni el cursor)
  if (f < 0) return null

  const total = TAG_L1.length + TAG_L2.length
  const charsShown = Math.min(total, Math.floor(f / CHAR_FRAMES))
  const l1 = TAG_L1.slice(0, Math.min(charsShown, TAG_L1.length))
  const l2 = TAG_L2.slice(0, Math.max(0, charsShown - TAG_L1.length))
  const typingL1 = charsShown < TAG_L1.length
  const done = charsShown >= total

  // cursor sólido mientras escribe; parpadeo suave al terminar (patrón skill)
  const cursorOpacity = done
    ? interpolate(
        f % CURSOR_BLINK_FRAMES,
        [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
        [1, 0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 1

  return (
    <div
      style={{
        fontSize: 64,
        fontWeight: 300,
        color: '#ffffff',
        lineHeight: 1.15,
      }}
    >
      <div style={{ minHeight: '1.15em' }}>
        {l1}
        {typingL1 && <span style={{ opacity: cursorOpacity }}>|</span>}
      </div>
      <div style={{ minHeight: '1.15em', color: '#a78bfa', fontWeight: 500 }}>
        {l2}
        {!typingL1 && <span style={{ opacity: cursorOpacity }}>|</span>}
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
