import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'

// Collage object cutouts layered on the About frame. Drop transparent PNGs in
// /public with these names; missing files hide in prod, show labels in dev.
const ABOUT_OBJECTS = [
  { key: 'pc', src: '/pc-clasico.png', label: 'PC clásico', cls: 'obj-pc' },
  { key: 'libreta', src: '/libreta.png', label: 'Libreta', cls: 'obj-libreta' },
  { key: 'lapiz', src: '/lapiz.png', label: 'Lápiz', cls: 'obj-lapiz' },
]

const handleAssetError = (e) => {
  e.currentTarget.parentElement.classList.add('is-empty')
}

const handleAssetLoad = (e) => {
  e.currentTarget.classList.add('loaded')
}

const copy = {
  es: {
    sectionLabel: 'Sobre mí',
    imgAlt: 'Marca hackidevs',
    title: (
      <>
        Comunicadora <em>narrando</em> historias que <em>importan</em>.
      </>
    ),
    body: (
      <>
        <p>
          Antes estaba detrás de la cámara editando, escribiendo,
          fotografiando, componiendo. Ahora aplico las{' '}
          <strong>humanidades digitales</strong> para contar historias con
          sentido humano. El oficio no cambia. Sigo eligiendo qué se cuenta,
          en qué orden y para quién.
        </p>
        <p>
          En la era de la <strong>inteligencia artificial</strong>, los
          modelos pueden generar imágenes infinitas. Lo que todavía no
          saben es cuál vale la pena. Esa parte &mdash; saber contar &mdash;
          sigue siendo nuestra.
        </p>
      </>
    ),
    facts: [
      {
        label: 'Aprendiendo',
        value: 'HTML · CSS · JavaScript · Python · Git',
      },
      { label: 'Idiomas', value: 'ES nativo · EN - B1' },
    ],
  },
  en: {
    sectionLabel: 'About',
    imgAlt: 'hackidevs mark',
    title: (
      <>
        Storyteller <em>telling</em> stories that <em>matter</em>.
      </>
    ),
    body: (
      <>
        <p>
          I used to be behind the camera &mdash; editing, writing,
          photographing, composing. Now I apply{' '}
          <strong>digital humanities</strong> to tell stories with human
          meaning. The craft hasn&apos;t changed. I&apos;m still choosing
          what gets told, in what order, and for whom.
        </p>
        <p>
          In the era of <strong>artificial intelligence</strong>, models can
          generate infinite images. What they still don&apos;t know is which
          ones are worth it. That part &mdash; knowing how to tell &mdash;
          is still ours.
        </p>
      </>
    ),
    facts: [
      {
        label: 'Learning',
        value: 'HTML · CSS · JavaScript · Python · Git',
      },
      { label: 'Languages', value: 'Native ES · EN - B1' },
    ],
  },
}

export default function About() {
  const { lang } = useApp()
  const t = copy[lang]
  const headRef = useReveal()
  const bodyRef = useReveal({ delay: 150 })

  return (
    <section className="section about" id="about">
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <div ref={bodyRef} data-reveal className="about-layout">
        <figure className="about-mark">
          <picture>
            <source srcSet="/hackidevs.webp" type="image/webp" />
            <img
              src="/hackidevs.png"
              alt={t.imgAlt}
              width="640"
              height="640"
              loading="lazy"
              decoding="async"
            />
          </picture>

          <div
            className={`about-objects${import.meta.env.DEV ? ' show-placeholders' : ''}`}
            aria-hidden="true"
          >
            <span className="collage-tape" />
            {ABOUT_OBJECTS.map((o) => (
              <span key={o.key} className={`collage-item ${o.cls}`} data-label={o.label}>
                <img
                  src={o.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={handleAssetError}
                  onLoad={handleAssetLoad}
                />
              </span>
            ))}
          </div>
        </figure>

        <div className="about-text">
          <h2 className="section-title about-title">{t.title}</h2>
          <div className="about-body">{t.body}</div>
        </div>

        <ul className="about-facts">
          {t.facts.map((f) => (
            <li key={f.label}>
              <span className="label">{f.label}</span>
              <span className="value">{f.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
