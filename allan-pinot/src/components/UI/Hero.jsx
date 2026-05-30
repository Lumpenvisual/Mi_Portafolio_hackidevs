/*
  Hero.jsx — the real, accessible hero content.

  This is plain HTML (an <h1> + subtitle), rendered ABOVE the 3D canvas in the
  DOM. It is the accessible source of truth: screen readers and SEO crawlers see
  this text, never the aria-hidden canvas. It also paints immediately (the 3D
  scene is lazy-loaded behind it), so first contentful paint is text, not WebGL.
*/
export default function Hero() {
  return (
    <main className="hero">
      <h1 className="hero__title">Allan Pinot</h1>
      <p className="hero__subtitle">Creative Developer (Web &amp; Real-time 3D)</p>
    </main>
  );
}
