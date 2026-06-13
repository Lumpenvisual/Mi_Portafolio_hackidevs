import { useEffect, useRef } from 'react'

// ScrollFX — scroll-driven motion for cinematic depth:
//   • a thin scroll-progress bar pinned to the top of the viewport
//   • GSAP ScrollTrigger parallax: decorative numbers + section titles drift
//     at different rates as the page scrolls
//
// The progress bar is a passive indicator so it runs everywhere. The parallax
// is desktop + fine-pointer only and skipped under reduced motion (and touch,
// where it fights native momentum scrolling). GSAP/ScrollTrigger are lazy so
// they stay out of the initial bundle.
const LAYERS = [
  // Big faint index numbers drift the most — the clearest depth cue
  { selector: '.section-num, .project-num, .service-num', strength: 0.22 },
  // Section titles drift just slightly, so the whole page feels alive
  { selector: '.section-title', strength: 0.05 },
]

export default function ScrollFX() {
  const barRef = useRef(null)

  // Scroll-progress bar — passive scroll indicator, always on.
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Parallax — gsap ScrollTrigger; desktop + fine-pointer, no reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let killed = false
    const tweens = []

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (killed) return
        gsap.registerPlugin(ScrollTrigger)
        LAYERS.forEach(({ selector, strength }) => {
          gsap.utils.toArray(selector).forEach((el) => {
            const t = gsap.fromTo(
              el,
              { yPercent: -strength * 100 },
              {
                yPercent: strength * 100,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            )
            tweens.push(t)
          })
        })
        ScrollTrigger.refresh()
      })
      .catch(() => {
        /* gsap unavailable → no parallax, page still scrolls normally */
      })

    return () => {
      killed = true
      tweens.forEach((t) => {
        if (t?.scrollTrigger) t.scrollTrigger.kill()
        t?.kill()
      })
    }
  }, [])

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />
}
