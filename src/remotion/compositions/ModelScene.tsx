import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 5 (7s - 10s): Retrato de marca — el avatar pixel-art de hackidevs
// (/public/hackidevs-avatar.webp) en el lado derecho, en lugar de un modelo 3D.
//
// Entrada por DISOLUCIÓN (opacity) con un efecto sutil: escala de entrada
// (spring), float vertical continuo y un glow morado que respira. Todo va con
// useCurrentFrame() (nada se anima solo) para no causar flicker en el render.
//
// Nota: se monta dentro de un <Sequence from={210}>, por lo que useCurrentFrame()
// ya es relativo (0 = segundo 7).
// ───────────────────────────────────────────────────────────────────────────
export const ModelScene: React.FC<{ modelUrl?: string }> = () => {
  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()

  // disolvencia: aparece (0→25) y se desvanece al final de la escena (165→205)
  const opacity = interpolate(frame, [0, 25, 165, 205], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // escala de entrada suave desde 0.86
  const s = spring({ frame, fps, config: { damping: 16, mass: 0.7 } })
  const scale = interpolate(s, [0, 1], [0.86, 1])
  // float vertical sutil y continuo
  const floatY = Math.sin(frame / 28) * 14
  // glow morado que respira (radio sutil)
  const glow = 22 + Math.sin(frame / 22) * 10

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center', // vertical (AbsoluteFill es flex column)
        alignItems: 'flex-end',
        paddingRight: 180,
        opacity,
      }}
    >
      <Img
        src={staticFile('hackidevs-avatar.webp')}
        style={{
          width: 600,
          height: 600,
          objectFit: 'contain',
          transform: `translateY(${floatY}px) scale(${scale})`,
          filter: `drop-shadow(0 14px ${glow}px rgba(167, 139, 250, 0.55))`,
        }}
      />
    </AbsoluteFill>
  )
}
