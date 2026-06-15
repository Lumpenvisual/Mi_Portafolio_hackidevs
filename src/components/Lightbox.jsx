import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Reusable lightbox / gallery modal. Reuses the global `.lightbox*` styles
// (defined in App.css for the Fotografía section). Full keyboard support:
// Esc closes, ←/→ navigate, Tab is trapped inside the dialog. Focus moves to
// the close button on open; the caller restores focus to the trigger on close.
//
// Props:
//   images     — array of image src strings
//   startIndex — index to open on (default 0)
//   onClose    — called to close the modal
//   labels     — { close, prev, next }
//   alt        — (n) => string, alt/aria text for image number n (1-based)
export default function Lightbox({ images, startIndex = 0, onClose, labels, alt }) {
  const [i, setI] = useState(startIndex)
  const dialogRef = useRef(null)

  const step = useCallback(
    (dir) => setI((p) => (p + dir + images.length) % images.length),
    [images.length],
  )

  useEffect(() => {
    const dialog = dialogRef.current

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowRight') return step(1)
      if (e.key === 'ArrowLeft') return step(-1)
      if (e.key === 'Tab' && dialog) {
        const f = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    }
  }, [onClose, step])

  const altText = alt ? alt(i + 1) : `${i + 1}`

  // Portal to <body> so the modal escapes any section stacking context
  // (sections use isolation: isolate, which would otherwise trap it below the
  // fixed nav and block clicks on the top-right close button).
  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={altText}
    >
      <button
        type="button"
        className="lightbox-backdrop"
        onClick={onClose}
        aria-label={labels.close}
      />
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label={labels.close}
      >
        ✕
      </button>
      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={() => step(-1)}
          aria-label={labels.prev}
        >
          ‹
        </button>
      )}
      <img className="lightbox-img" src={images[i]} alt={altText} />
      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={() => step(1)}
          aria-label={labels.next}
        >
          ›
        </button>
      )}
      <span className="lightbox-counter">
        {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </span>
    </div>,
    document.body,
  )
}
