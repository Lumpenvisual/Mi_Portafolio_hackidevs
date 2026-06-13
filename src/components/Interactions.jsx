import { useEffect, useRef } from 'react'

// Interactions — premium pointer interactions for the cinematic direction:
//   • a custom cursor (lerped ring + dot) that grows over interactive elements
//   • magnetic pull on any [data-magnetic] element (CTAs, etc.)
//
// Desktop + fine-pointer only, and fully skipped under reduced motion. On touch
// the native cursor is left untouched and nothing renders. Vanilla (no deps).
const HOVER_SELECTOR =
  'a, button, [role="button"], input, textarea, label, .card-spotlight'

export default function Interactions() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const ring = ringRef.current
    const dot = dotRef.current
    const root = document.documentElement
    root.classList.add('cursor-custom')

    // pointer + lerped ring position
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }
    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    // hover state via event delegation (grows the ring over interactive targets)
    const onOver = (e) => {
      if (e.target.closest?.(HOVER_SELECTOR)) root.classList.add('cursor-hover')
    }
    const onOut = (e) => {
      if (
        e.target.closest?.(HOVER_SELECTOR) &&
        !e.relatedTarget?.closest?.(HOVER_SELECTOR)
      ) {
        root.classList.remove('cursor-hover')
      }
    }

    // magnetic pull on [data-magnetic] elements
    const magnets = Array.from(document.querySelectorAll('[data-magnetic]'))
    const magHandlers = magnets.map((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3
      const onMagMove = (e) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - (r.left + r.width / 2)
        const y = e.clientY - (r.top + r.height / 2)
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      }
      const onMagLeave = () => {
        el.style.transform = ''
      }
      el.addEventListener('mousemove', onMagMove)
      el.addEventListener('mouseleave', onMagLeave)
      return { el, onMagMove, onMagLeave }
    })

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      magHandlers.forEach(({ el, onMagMove, onMagLeave }) => {
        el.removeEventListener('mousemove', onMagMove)
        el.removeEventListener('mouseleave', onMagLeave)
        el.style.transform = ''
      })
      root.classList.remove('cursor-custom', 'cursor-hover')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
