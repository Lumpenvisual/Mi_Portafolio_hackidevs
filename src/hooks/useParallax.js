import { useEffect, useRef } from 'react'

// useParallax — reusable mouse-parallax source.
// Tracks the pointer on window `mousemove` and exposes a ref holding the
// normalized position in [-1, 1] (0 = centre). The CONSUMER reads this ref each
// animation frame and applies its own lerp/smoothing, which keeps the hook
// cheap (no re-renders) and reusable for camera, model, layers, etc.
export function useParallax() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      // map clientX/Y → [-1, 1]
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return pointer
}
