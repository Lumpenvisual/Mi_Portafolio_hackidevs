import { Suspense, lazy } from 'react';
import Hero from './components/UI/Hero.jsx';

/*
  App.jsx — composition root for the isolated Allan Pinot hero.

  Lean-bundle strategy (project convention): the Hero HTML is a normal static
  import so it ships in the entry chunk and paints immediately. The entire 3D
  subtree (R3F Canvas + three + drei + postprocessing) is React.lazy-loaded, so
  its large vendor chunks are fetched in parallel AFTER the hero is on screen,
  and never block first paint. The <Suspense fallback> is a plain black box
  matching the scene background, so there's no flash before the canvas mounts.

  Phases still to come (Carousel, Cursor, GSAP/Lenis scroll, WebGPU particles)
  will plug in here — the folders already exist as placeholders.
*/
const Scene = lazy(() => import('./components/Scene/Scene.jsx'));

export default function App() {
  return (
    <>
      {/* Decorative 3D background, lazy-loaded behind the hero text. */}
      <Suspense fallback={<div className="scene scene--fallback" aria-hidden="true" />}>
        <Scene />
      </Suspense>

      {/* Accessible, immediately-painted hero content on top of the canvas. */}
      <Hero />
    </>
  );
}
