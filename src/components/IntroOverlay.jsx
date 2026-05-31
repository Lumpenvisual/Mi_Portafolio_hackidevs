import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/AppContext'

// One-time branded intro (rendered with Remotion → /intro.mp4). Plays once per
// session, is skippable (button or Esc), and is skipped entirely under
// reduced-motion. Its background matches the hero (#15131e) so there's no flash
// when it fades out. The MP4 keeps the Remotion runtime out of the SPA bundle.
const skipCopy = { es: 'Saltar intro', en: 'Skip intro' }

export default function IntroOverlay() {
  const { lang } = useApp()
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem('introSeen')
  })
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef(0)

  const dismiss = useCallback(() => {
    setLeaving(true)
    timerRef.current = setTimeout(() => setShow(false), 600) // matches the CSS fade
  }, [])

  useEffect(() => {
    if (!show) return
    sessionStorage.setItem('introSeen', '1')
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timerRef.current)
    }
  }, [show, dismiss])

  if (!show) return null

  return (
    <div
      className={`intro-overlay${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-label="Intro"
    >
      <video
        className="intro-video"
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
      />
      <button type="button" className="intro-skip" onClick={dismiss}>
        {skipCopy[lang]} <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
