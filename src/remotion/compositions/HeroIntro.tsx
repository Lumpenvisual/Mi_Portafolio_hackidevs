import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { Particles } from './Particles'
import { NameScene, TaglineScene, BadgeScene } from './TextScene'
import { ModelScene } from './ModelScene'

// HeroIntro — composición maestra del intro (14s @ 30fps = 420 frames, 1920x1080).
// Orquesta las 7 escenas. Todas las transiciones usan interpolate() con
// Easing.easeInOutCubic (compuesto como Easing.inOut(Easing.cubic)) o spring()
// con configuraciones específicas por elemento.

// Load ONLY the weights/subset actually used — the default loads every Inter
// weight+subset (126 requests) and blocks the Player via delayRender.
const { fontFamily } = loadFont('normal', {
  weights: ['300', '400', '500'],
  subsets: ['latin'],
})
const easeInOutCubic = Easing.inOut(Easing.cubic)

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 6 (10s - 12s): Cards de módulos
// 5 pills en stagger (8 frames entre cada una), entran desde abajo con
// translateY spring. Montado en <Sequence from={300}> → frame relativo.
// ───────────────────────────────────────────────────────────────────────────
const MODULES = [
  'Servicios',
  'Proyectos',
  'Habilidades',
  'Fotografía',
  'Contacto',
]

const ModuleCards: React.FC = () => {
  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 96,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      {MODULES.map((label, i) => {
        const s = spring({
          frame: frame - i * 8,
          fps,
          config: { damping: 14, mass: 0.6 },
        })
        const y = interpolate(s, [0, 1], [40, 0])
        return (
          <div
            key={label}
            style={{
              opacity: Math.min(1, s),
              transform: `translateY(${y}px)`,
              padding: '14px 26px',
              borderRadius: 999,
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              color: '#c4b5fd',
              fontSize: 24,
              fontWeight: 400,
            }}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}

export type HeroIntroProps = { modelUrl?: string }

export const HeroIntro: React.FC<HeroIntroProps> = ({ modelUrl }) => {
  const frame = useCurrentFrame()

  // ESCENA 7 (12s - 14s): Outro — todas las capas hacen fade out suave; la
  // última frame queda en negro listo para la transición al sitio real.
  const outro = interpolate(frame, [360, 420], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  })

  return (
    <AbsoluteFill
      style={{ backgroundColor: '#0d0d1a', fontFamily, opacity: outro }}
    >
      {/* ESCENA 1 (0s - 2s): fondo de partículas (persiste todo el intro) */}
      <Particles />

      {/* ESCENA 5 (7s - 10s): modelo 3D a la derecha */}
      <Sequence from={210} name="ModelScene">
        <ModelScene modelUrl={modelUrl} />
      </Sequence>

      {/* Columna de texto izquierda — siempre montada, cada bloque anima desde
          su propio frame de inicio para evitar saltos de layout. */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0 140px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 34,
            maxWidth: '58%',
          }}
        >
          {/* ESCENA 4 (5.5s - 7s) */}
          <BadgeScene startFrame={165} />
          {/* ESCENA 2 (2s - 4s) */}
          <NameScene startFrame={60} />
          {/* ESCENA 3 (4s - 5.5s) */}
          <TaglineScene startFrame={120} />
        </div>
      </AbsoluteFill>

      {/* ESCENA 6 (10s - 12s): cards de módulos */}
      <Sequence from={300} name="ModuleCards">
        <ModuleCards />
      </Sequence>
    </AbsoluteFill>
  )
}
