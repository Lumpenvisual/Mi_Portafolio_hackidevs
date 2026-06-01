import React, { Suspense, useMemo } from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Box3, Vector3 } from 'three'

// ───────────────────────────────────────────────────────────────────────────
// ESCENA 5 (7s - 10s): Modelo 3D — la cámara SLR vintage (la misma /models/
// camera.glb del hero real, comprimida con Draco → decoder en /public/draco).
// Entra con scale spring desde 0 en el lado derecho y orbita suavemente.
// Toda la animación va con useCurrentFrame() (nada se anima solo) para no
// causar flicker durante el render de Remotion.
//
// Nota: este componente se monta dentro de un <Sequence from={210}>, por lo que
// useCurrentFrame() ya es relativo (0 = segundo 7).
// ───────────────────────────────────────────────────────────────────────────
const CAMERA_URL = '/models/camera.glb'

const CameraModel: React.FC<{ scale: number; orbit: number }> = ({
  scale,
  orbit,
}) => {
  const gltf = useLoader(GLTFLoader, CAMERA_URL, (loader) => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    ;(loader as GLTFLoader).setDRACOLoader(draco)
  })

  // Recenter to origin and normalize the largest dimension to a fixed size, so
  // the camera frames consistently regardless of the glb's authored scale.
  const { fitScale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(gltf.scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const s = 2.6 / maxDim
    return { fitScale: s, offset: center.multiplyScalar(s) }
  }, [gltf])

  return (
    <group position={[2.3, 0, 0]} rotation={[0.35, orbit, 0]} scale={scale}>
      <group scale={fitScale} position={[-offset.x, -offset.y, -offset.z]}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  )
}

export const ModelScene: React.FC<{ modelUrl?: string }> = () => {
  const { width, height, fps } = useVideoConfig()
  const frame = useCurrentFrame()

  // entrada: scale spring desde 0
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.6 } })
  const scale = Math.max(0.001, s)
  // órbita suave y continua (driven by frame)
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
        <pointLight
          color="#ec4899"
          position={[-2, -2, 3]}
          intensity={60}
          decay={2}
        />
        <Suspense fallback={null}>
          <CameraModel scale={scale} orbit={orbit} />
        </Suspense>
      </ThreeCanvas>
    </AbsoluteFill>
  )
}
