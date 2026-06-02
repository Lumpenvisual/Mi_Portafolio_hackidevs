import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'

// foto-02 y foto-04 quedaron fuera de la selección (los archivos siguen en
// /public/fotos por si se reincorporan). Quedan 8 → grid 4×2 parejo.
const PHOTO_NUMS = [1, 3, 5, 6, 7, 8, 9, 10]
const PHOTOS = PHOTO_NUMS.map((n) => ({
  src: `/fotos/foto-${String(n).padStart(2, '0')}.webp`,
}))

const copy = {
  es: {
    sectionLabel: 'Fotografía',
    title: (
      <>
        Mirar es <em>elegir</em> qué contar.
      </>
    ),
    alt: (n) => `Fotografía documental de Jacky Gutiérrez (${n})`,
    open: 'Ver fotografía',
    close: 'Cerrar',
    prev: 'Anterior',
    next: 'Siguiente',
  },
  en: {
    sectionLabel: 'Photography',
    title: (
      <>
        To look is to <em>choose</em> what to tell.
      </>
    ),
    alt: (n) => `Documentary photograph by Jacky Gutiérrez (${n})`,
    open: 'View photograph',
    close: 'Close',
    prev: 'Previous',
    next: 'Next',
  },
}

const handleThumbLoad = (e) => e.currentTarget.classList.add('loaded')

export default function Fotografia() {
  const { lang } = useApp()
  const t = copy[lang]
  const headRef = useReveal()
  const gridRef = useReveal({ delay: 150 })
  const [active, setActive] = useState(null) // index | null
  const dialogRef = useRef(null)
  const triggerRef = useRef(null) // thumbnail that opened the lightbox

  const isOpen = active !== null
  const open = useCallback((i, el) => {
    triggerRef.current = el
    setActive(i)
  }, [])
  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir) => setActive((i) => (i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length)),
    []
  )

  // Modal dialog behaviour: trap focus inside the lightbox, move focus in on
  // open, and restore it to the triggering thumbnail on close (WCAG 2.4.3 /
  // 2.1.2). Keyed on isOpen so arrow navigation doesn't re-run / steal focus.
  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const trigger = triggerRef.current

    const onKey = (e) => {
      if (e.key === 'Escape') return close()
      if (e.key === 'ArrowRight') return step(1)
      if (e.key === 'ArrowLeft') return step(-1)
      if (e.key === 'Tab' && dialog) {
        const f = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    dialog?.querySelector('.lightbox-close')?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      trigger?.focus()
    }
  }, [isOpen, close, step])

  return (
    <section className="section fotografia" id="fotografia" aria-label={t.sectionLabel}>
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>
      <h2 className="section-title">{t.title}</h2>

      <ul ref={gridRef} data-reveal className="foto-bento">
        {PHOTOS.map((p, i) => (
          <li key={p.src} className="foto-item">
            <button
              type="button"
              className="foto-btn"
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`${t.open} ${i + 1}`}
            >
              <img
                className="foto-thumb"
                src={p.src}
                alt={t.alt(i + 1)}
                loading="lazy"
                decoding="async"
                onLoad={handleThumbLoad}
              />
            </button>
          </li>
        ))}
      </ul>

      {isOpen && (
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.alt(active + 1)}
        >
          <button
            type="button"
            className="lightbox-backdrop"
            onClick={close}
            aria-label={t.close}
          />
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label={t.close}
          >
            ✕
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={() => step(-1)}
            aria-label={t.prev}
          >
            ‹
          </button>
          <img className="lightbox-img" src={PHOTOS[active].src} alt={t.alt(active + 1)} />
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={() => step(1)}
            aria-label={t.next}
          >
            ›
          </button>
          <span className="lightbox-counter">
            {String(active + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  )
}
