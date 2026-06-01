import React from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { noise2D } from '@remotion/noise'

// ESCENA 1 (0s - 2s): Hero background
// Campo de partículas blancas dispersas sobre #0d0d1a. La deriva de cada
// partícula se calcula con @remotion/noise (noise2D) para un movimiento
// orgánico y determinista. El fondo hace un fade-in suave en los primeros 30f.

// easeInOutCubic — Remotion no exporta el preset directamente; se compone así.
const easeInOutCubic = Easing.inOut(Easing.cubic)

export const Particles: React.FC<{ count?: number }> = ({ count = 70 }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  // 0s -> 1s: fade-in del campo completo
  const fieldOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0d1a', opacity: fieldOpacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const baseX = random(`px-${i}`) * width
        const baseY = random(`py-${i}`) * height
        const size = 1 + random(`ps-${i}`) * 2.5

        // deriva orgánica con ruido (amplitud ~40px), distinta por eje
        const t = frame * 0.006
        const dx = noise2D(`nx-${i}`, t, i * 0.7) * 40
        const dy = noise2D(`ny-${i}`, t, i * 1.3) * 40

        // parpadeo suave individual
        const twinkle = interpolate(
          Math.sin((frame + random(`pt-${i}`) * 120) * 0.06),
          [-1, 1],
          [0.2, 0.9],
        )

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: baseX + dx,
              top: baseY + dy,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              opacity: twinkle,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}
