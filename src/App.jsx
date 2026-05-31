import Nav from './components/Nav'
import Marquee from './components/Marquee'
import Footer from './components/Footer'
import IntroOverlay from './components/IntroOverlay'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Fotografia from './sections/Fotografia'
import Career from './sections/Career'
import Contact from './sections/Contact'
import './App.css'

export default function App() {
  return (
    <>
      <IntroOverlay />
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Skills />
        <Projects />
        <Fotografia />
        <Career />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
