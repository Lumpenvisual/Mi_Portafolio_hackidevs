import { useCallback, useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSpotlight } from '../hooks/useSpotlight'
import Lightbox from './Lightbox'

// Shared project card list. Used by the Videos section (YouTube cards) and the
// Diseño / Desarrollo sections (design + dev cards). Each item:
//   { num, role, name, subtitle, description, tags, accent }
//   + optional: videoId (YouTube thumb + link) | href (external link) |
//     thumb (image src) | images (array → opens a lightbox gallery) | cta
//
// A card is a link when it has `href`, opens a gallery when it has `images`,
// otherwise renders as a static, non-interactive card.
//
// `horizontal` turns the list into a pinned horizontal scroll (Videos): the
// section pins and the cards slide sideways as you scroll vertically. Desktop +
// fine-pointer only and skipped under reduced motion — it falls back to the
// normal vertical list everywhere else.

const handleThumbError = (e, videoId) => {
  e.currentTarget.onerror = null
  e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export default function ProjectList({
  items,
  galleryLabels,
  emptyLabel,
  horizontal = false,
}) {
  const listRef = useReveal({ delay: 150 })
  const spot = useSpotlight()

  // Lightbox gallery (cards with an `images` array). Stores the trigger so
  // focus can be restored on close (WCAG 2.4.3).
  const [gallery, setGallery] = useState(null)
  const triggerRef = useRef(null)
  const openGallery = useCallback((p, el) => {
    triggerRef.current = el
    setGallery(p)
  }, [])
  const closeGallery = useCallback(() => {
    setGallery(null)
    triggerRef.current?.focus()
  }, [])

  // Horizontal-scroll mode: decided once at mount (capable device + motion ok).
  // Computed synchronously so the horizontal DOM renders on the first paint;
  // the effect below then wires the pinned ScrollTrigger to it.
  const [horizOn] = useState(
    () =>
      horizontal &&
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(min-width: 901px) and (pointer: fine)').matches,
  )
  const pinRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    if (!horizOn) return
    const track = trackRef.current
    const pin = pinRef.current
    if (!track || !pin) return
    let killed = false
    let st = null
    let gsapRef = null
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (killed) return
        gsapRef = gsap
        gsap.registerPlugin(ScrollTrigger)
        const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth)
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        st = tween.scrollTrigger
        ScrollTrigger.refresh()
      })
      .catch(() => {
        /* gsap unavailable → stays a static horizontal row (clipped); harmless */
      })
    return () => {
      killed = true
      if (st) st.kill()
      if (gsapRef) gsapRef.killTweensOf?.(track)
    }
  }, [horizOn])

  const cards = items.map((p) => {
    const hasGallery = !p.href && Array.isArray(p.images) && p.images.length > 0
    const clickable = Boolean(p.href) || hasGallery
    const Tag = p.href ? 'a' : 'div'
    const interactionProps = p.href
      ? { href: p.href, target: '_blank', rel: 'noreferrer' }
      : hasGallery
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: (e) => openGallery(p, e.currentTarget),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openGallery(p, e.currentTarget)
              }
            },
          }
        : {}
    const thumbSrc = p.videoId
      ? `https://i.ytimg.com/vi/${p.videoId}/maxresdefault.jpg`
      : hasGallery
        ? p.images[0]
        : p.thumb || null
    return (
      <li key={p.num} className="project">
        <Tag
          className={`project-link card-spotlight${clickable ? '' : ' project-link--static'}`}
          {...interactionProps}
          {...spot}
        >
          <div className="project-meta">
            <span className="project-num">{p.num}</span>
            <span className="project-year">{p.role}</span>
          </div>

          <div className="project-main">
            <h3 className="project-name">{p.name}</h3>
            <p className="project-role">{p.subtitle}</p>
            <p className="project-desc">{p.description}</p>
            <ul className="project-tags">
              {p.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>

          <div
            className={`project-thumb${hasGallery ? ' project-thumb--gallery' : ''}`}
            style={{ '--thumb-accent': p.accent }}
          >
            {thumbSrc && (
              <img
                src={thumbSrc}
                alt={p.name}
                loading="lazy"
                decoding="async"
                onError={
                  p.videoId ? (e) => handleThumbError(e, p.videoId) : undefined
                }
                onLoad={(e) => e.currentTarget.classList.add('loaded')}
              />
            )}
            <span className="project-cta">
              {clickable ? (
                <>
                  {p.cta} <span className="arr">{p.href ? '↗' : '⤢'}</span>
                </>
              ) : (
                p.role
              )}
            </span>
          </div>
        </Tag>
      </li>
    )
  })

  const list = (
    <ul
      ref={horizOn ? trackRef : listRef}
      data-reveal={horizOn ? undefined : true}
      className={`projects-list${horizOn ? ' projects-list--horizontal' : ''}`}
    >
      {cards}
      {items.length === 0 && <li className="projects-empty">{emptyLabel}</li>}
    </ul>
  )

  return (
    <>
      {horizOn ? (
        <div className="videos-h" ref={pinRef}>
          {list}
        </div>
      ) : (
        list
      )}

      {gallery && (
        <Lightbox
          images={gallery.images}
          onClose={closeGallery}
          labels={galleryLabels}
          alt={galleryLabels?.alt}
        />
      )}
    </>
  )
}
