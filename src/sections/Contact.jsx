import { useState } from 'react'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import Fireflies from '../components/Fireflies'

const copy = {
  es: {
    sectionLabel: 'Contacto',
    title: (
      <>
        ¿Tienes algo
        <br />
        <em>que contar</em>?
      </>
    ),
    email: 'lumpenvisual@gmail.com',
    findMe: 'Encuéntrame en',
    availability: 'Disponibilidad',
    availabilityCopy: (
      <>
        Abierta a colaboraciones, proyectos y conversaciones interesantes.
        <br />
        Tel <em className="contact-phone">+57&nbsp;323&nbsp;437&nbsp;42&nbsp;00</em>.
      </>
    ),
    form: {
      heading: 'Escríbeme',
      name: 'Nombre',
      namePlaceholder: 'Tu nombre',
      email: 'Correo',
      emailPlaceholder: 'tu@correo.com',
      message: 'Mensaje',
      messagePlaceholder: '¿En qué te puedo ayudar?',
      submit: 'Enviar mensaje',
      submitting: 'Enviando…',
      success: 'Mensaje enviado. Te respondo pronto.',
      error: 'Algo salió mal. Intenta de nuevo o escríbeme directo al correo.',
    },
  },
  en: {
    sectionLabel: 'Contact',
    title: (
      <>
        Got something
        <br />
        <em>to tell</em>?
      </>
    ),
    email: 'lumpenvisual@gmail.com',
    findMe: 'Find me at',
    availability: 'Availability',
    availabilityCopy: (
      <>
        Open to collaborations, projects and interesting conversations.
        <br />
        Phone <em className="contact-phone">+57&nbsp;323&nbsp;437&nbsp;42&nbsp;00</em>.
      </>
    ),
    form: {
      heading: 'Write to me',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      message: 'Message',
      messagePlaceholder: 'How can I help you?',
      submit: 'Send message',
      submitting: 'Sending…',
      success: 'Message sent. I\'ll get back to you soon.',
      error: 'Something went wrong. Try again or write directly to the email above.',
    },
  },
}

const links = [
  { label: 'Instagram', href: 'https://www.instagram.com/jacky.visual/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jackygutierrez/' },
  { label: 'GitHub', href: 'https://github.com/Lumpenvisual' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Jackie.visual' },
]

const newTabLabel = { es: 'abre en nueva pestaña', en: 'opens in new tab' }

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

export default function Contact() {
  const { lang } = useApp()
  const t = copy[lang]
  const headRef = useReveal()
  const formRef = useReveal({ delay: 75 })
  const bodyRef = useReveal({ delay: 200 })

  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = (e) => {
    if (status === 'error') setStatus('idle')
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
      })
      if (res.ok) {
        setStatus('success')
        setFields({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact" id="contact">
      <Fireflies count={10} />
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="contact-title">{t.title}</h2>

      <form
        ref={formRef}
        data-reveal
        className="contact-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="contact-form-row">
          <div className="contact-field">
            <label htmlFor="cf-name">{t.form.name}</label>
            <input
              id="cf-name"
              type="text"
              name="name"
              value={fields.name}
              onChange={handleChange}
              placeholder={t.form.namePlaceholder}
              required
              autoComplete="name"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="cf-email">{t.form.email}</label>
            <input
              id="cf-email"
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              placeholder={t.form.emailPlaceholder}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="contact-field">
          <label htmlFor="cf-message">{t.form.message}</label>
          <textarea
            id="cf-message"
            name="message"
            value={fields.message}
            onChange={handleChange}
            placeholder={t.form.messagePlaceholder}
            required
          />
        </div>

        <div className="contact-form-footer">
          <button
            className="contact-submit"
            type="submit"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? t.form.submitting : t.form.submit}
            {status !== 'loading' && (
              <span className="arr" aria-hidden="true">↗</span>
            )}
          </button>
          {(status === 'success' || status === 'error') && (
            <p className={`contact-form-status ${status}`} role="status">
              {status === 'success' ? t.form.success : t.form.error}
            </p>
          )}
        </div>
      </form>

      <div ref={bodyRef} data-reveal className="contact-grid">
        <div className="contact-col">
          <span className="label">{t.findMe}</span>
          <ul className="contact-links">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${l.label} (${newTabLabel[lang]})`}
                >
                  {l.label}
                  <span className="arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact-col">
          <span className="label">{t.availability}</span>
          <p>{t.availabilityCopy}</p>
          <a className="contact-mail" href={`mailto:${t.email}`}>
            {t.email}
            <span className="arr" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
