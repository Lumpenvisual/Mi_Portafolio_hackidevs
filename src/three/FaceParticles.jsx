import { useEffect, useRef } from 'react'

// Interactive stippled-portrait particle piece.
// Samples a photo into points (denser/brighter where the source is darker),
// morphs from an ordered lattice ("code") into the face ("human"), and lets the
// cursor push the points around. Vanilla three.js (no R3F), lazy-imported so it
// stays out of the initial bundle. Degrades to the plain <img> without WebGL.

const VERT = /* glsl */ `
  attribute vec3 aGrid;
  attribute vec3 aFace;
  attribute float aSize;
  attribute float aBright;
  uniform float uMorph;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform float uScale;
  varying float vBright;
  void main() {
    vBright = aBright;
    vec3 pos = mix(aGrid, aFace, uMorph);
    pos.z += sin(uTime * 0.6 + pos.x * 2.0 + pos.y) * 0.04 * uMorph;
    // cursor repulsion in the xy plane
    vec2 d = pos.xy - uPointer;
    float dist = length(d);
    float r = 0.9;
    if (dist < r) {
      float f = 1.0 - dist / r;
      pos.xy += normalize(d + 0.0001) * f * f * 0.7;
      pos.z += f * f * 0.4;
    }
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale * uPixelRatio / -mv.z;
  }
`

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vBright;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.12, d);
    // alpha follows true luminance so the lit face is solid and the dark hair
    // fades toward the background (portrait "emerging from the dark")
    float a = soft * (0.25 + vBright * 0.95);
    gl_FragColor = vec4(uColor * (0.45 + vBright * 0.85), a);
  }
`

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function FaceParticles({ src = '/yo-retoque.webp', color = '#f3f0ea' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    let cleanup = () => {}
    // start off-screen so the cursor-repulsion field is dormant until the
    // user actually moves the pointer (otherwise it eats the face at center)
    const pointer = { x: 999, y: 999, tx: 999, ty: 999 }
    let visible = true

    const start = async () => {
      const showFallback = () => mount && mount.classList.add('is-fallback')

      let THREE
      try {
        THREE = await import('three')
      } catch {
        showFallback()
        return
      }
      if (disposed || !mount) return

      // --- sample the photo into a point set ---
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      try {
        await img.decode()
      } catch {
        showFallback() // image failed → show the <img> fallback
        return
      }
      if (disposed) return

      const SAMPLE_W = window.innerWidth < 768 ? 130 : 190
      const ar = img.naturalHeight / img.naturalWidth
      const SW = SAMPLE_W
      const SH = Math.max(1, Math.round(SAMPLE_W * ar))
      const cvs = document.createElement('canvas')
      cvs.width = SW
      cvs.height = SH
      const cx = cvs.getContext('2d', { willReadFrequently: true })
      cx.drawImage(img, 0, 0, SW, SH)
      const px = cx.getImageData(0, 0, SW, SH).data

      // world size (fit height ~7 units), keep aspect
      const worldH = 7
      const worldW = worldH / ar

      const faceArr = []
      const sizeArr = []
      const brightArr = []
      for (let y = 0; y < SH; y++) {
        for (let x = 0; x < SW; x++) {
          const i = (y * SW + x) * 4
          const lum =
            (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255
          // drop the background: near-white studio sweeps AND the near-black
          // surround of dark-backed portraits. The figure (incl. hair, which
          // keeps some sheen) sits comfortably inside the band.
          if (lum > 0.9 || lum < 0.1) continue
          const u = x / (SW - 1)
          const v = y / (SH - 1)
          faceArr.push(
            (u - 0.5) * worldW,
            -(v - 0.5) * worldH,
            (Math.random() - 0.5) * 0.15
          )
          // brightness = TRUE luminance → lit face reads, dark hair sinks into the void
          sizeArr.push(0.9 + (1 - lum) * 0.5)
          brightArr.push(lum)
        }
      }

      const COUNT = brightArr.length
      if (!COUNT) return

      // ordered lattice ("code") — same count, rectangular grid
      const cols = Math.round(Math.sqrt(COUNT / ar))
      const rows = Math.ceil(COUNT / cols)
      const gridArr = new Float32Array(COUNT * 3)
      for (let k = 0; k < COUNT; k++) {
        const gx = k % cols
        const gy = Math.floor(k / cols)
        gridArr[k * 3] = (gx / (cols - 1) - 0.5) * worldW
        gridArr[k * 3 + 1] = -(gy / (rows - 1) - 0.5) * worldH
        gridArr[k * 3 + 2] = 0
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(faceArr), 3))
      geo.setAttribute('aFace', new THREE.BufferAttribute(new Float32Array(faceArr), 3))
      geo.setAttribute('aGrid', new THREE.BufferAttribute(gridArr, 3))
      geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(sizeArr), 1))
      geo.setAttribute('aBright', new THREE.BufferAttribute(new Float32Array(brightArr), 1))

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        geo.dispose()
        showFallback()
        return
      }
      const w = mount.clientWidth || window.innerWidth
      const h = mount.clientHeight || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h)
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
      camera.position.z = 9

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uMorph: { value: 0 },
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(999, 999) },
          uPixelRatio: { value: dpr },
          uScale: { value: 34 },
          uColor: { value: new THREE.Color(color) },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      })
      const points = new THREE.Points(geo, mat)
      scene.add(points)

      const reduce = prefersReduced()
      const t0 = performance.now()
      let raf = 0

      // world half-extents at z=0 plane, to map the pointer
      const halfH = Math.tan((50 * Math.PI) / 180 / 2) * camera.position.z
      let halfW = halfH * (w / h)

      const frame = () => {
        if (disposed) return
        raf = requestAnimationFrame(frame)
        if (!visible) return
        const t = (performance.now() - t0) / 1000
        mat.uniforms.uTime.value = t
        // assemble: grid -> face over ~2.6s (instant if reduced motion)
        const m = reduce ? 1 : Math.min(1, t / 2.6)
        mat.uniforms.uMorph.value = m * m * (3 - 2 * m) // smoothstep
        pointer.x += (pointer.tx - pointer.x) * 0.08
        pointer.y += (pointer.ty - pointer.y) * 0.08
        mat.uniforms.uPointer.value.set(pointer.x * halfW, pointer.y * halfH)
        points.rotation.y = reduce ? 0 : Math.sin(t * 0.3) * 0.06
        renderer.render(scene, camera)
      }
      frame()

      const onPointer = (e) => {
        const r = mount.getBoundingClientRect()
        pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1
        pointer.ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
      }
      const onLeave = () => {
        pointer.tx = 999
        pointer.ty = 999
      }
      const onResize = () => {
        const nw = mount.clientWidth
        const nh = mount.clientHeight
        if (!nw || !nh) return
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
        halfW = halfH * (nw / nh)
      }
      const io = new IntersectionObserver(
        ([en]) => {
          visible = en.isIntersecting
        },
        { threshold: 0 }
      )

      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerleave', onLeave)
      window.addEventListener('resize', onResize)
      io.observe(mount)

      cleanup = () => {
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('resize', onResize)
        io.disconnect()
        cancelAnimationFrame(raf)
        geo.dispose()
        mat.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    }

    start()
    return () => {
      disposed = true
      cleanup()
    }
  }, [src, color])

  return (
    <div className="face-particles" ref={mountRef}>
      {/* Fallback when WebGL/image is unavailable; the canvas paints over it */}
      <img src={src} alt="" aria-hidden="true" className="face-particles-fallback" />
    </div>
  )
}
