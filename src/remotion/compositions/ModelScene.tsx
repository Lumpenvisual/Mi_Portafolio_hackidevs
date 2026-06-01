import React from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ThreeCanvas } from '@remotion/three'

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 5 (7s - 10s): Modelo 3D
// IcosahedronGeometry como placeholder (el GLB real TRELLIS.2-4B se swapea
// después vía `modelUrl`). Cámara/grupo orbita suavemente; iluminación
// AmbientLight #4c1d95 + PointLight #a78bfa. El modelo entra con scale spring
// desde 0 en el lado derecho.
//
// Nota: este componente se monta dentro de un <Sequence from={210}>, por lo que
// useCurrentFrame() ya es relativo (0 = segundo 7).
// ───────────────────────────────────────────────────────────────────────────
export const ModelScene: React.FC<{ modelUrl?: string }> = ({ modelUrl }) => {
  const { width, height, fps } = useVideoConfig()
  const frame = useCurrentFrame()

  // entrada: scale spring desde 0
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.6 } })
  const scale = Math.max(0.001, s)
  // órbita suave y continua
  const orbit = frame * 0.02

  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight color="#4c1d95" intensity={2.6} />
        <pointLight
          color="#a78bfa"
          position={[3, 3, 5]}
          intensity={140}
          decay={2}
        />
        <group position={[2.3, 0, 0]} rotation={[0.35, orbit, 0]} scale={scale}>
          {/* TODO TRELLIS: reemplazar este icosaedro por el GLB real —
              cargar `modelUrl` con un loader (delayRender/continueRender) y
              renderizar <primitive object={gltf.scene} />. */}
          <mesh>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial
              color={modelUrl ? '#c4b5fd' : '#a78bfa'}
              flatShading
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  )
}
