import { useCallback } from 'react'

/**
 * Pointer-tracking spotlight for interactive cards.
 *
 * Returns pointer handlers that write CSS custom properties (--spot-x/-y/-o)
 * directly onto the hovered element. There's no React state, so moving the
 * cursor does NOT trigger re-renders -- the CSS turns the variables into a
 * radial accent glow that follows the pointer (see `.card-spotlight` in
 * App.css). Decorative only: the layer is pointer-events:none and aria-hidden
 * via the pseudo-element, and the opacity transition inherits the global
 * prefers-reduced-motion guard.
 *
 * Usage: const spot = useSpotlight(); <div className="card-spotlight" {...spot} />
 */
export function useSpotlight() {
  const onPointerMove = useCallback((e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-o', '1')
  }, [])

  const onPointerLeave = useCallback((e) => {
    e.currentTarget.style.setProperty('--spot-o', '0')
  }, [])

  return { onPointerMove, onPointerLeave }
}
