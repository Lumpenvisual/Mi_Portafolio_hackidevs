import Nav from './components/Nav'
import Marquee from './components/Marquee'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Career from './sections/Career'
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
        <Marquee />
        <About />
        <Services />
        <Projects />
        <Career />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
