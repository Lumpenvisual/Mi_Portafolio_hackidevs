import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollFX from './components/ScrollFX'
import Interactions from './components/Interactions'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Fotografia from './sections/Fotografia'
import DesignWork from './sections/DesignWork'
import Contact from './sections/Contact'
import './App.css'

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Fotografia />
        <DesignWork />
        <Contact />
      </main>
      <Footer />
      <ScrollFX />
      <Interactions />
    </>
  )
}
