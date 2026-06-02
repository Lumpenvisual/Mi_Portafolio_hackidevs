import { useEffect, useRef } from 'react'
import { useModelLoader } from '../hooks/useModelLoader'
import { useParallax } from '../hooks/useParallax'
import './CameraHero.css'

// CameraStage — the vintage SLR camera three.js scene as a self-contained,
// canvas-only component (no section/copy). Mounts its renderer into a div that
// fills its container, so it drops into both the standalone CameraHero preview
// (#camera.html) and the real Hero's .hero-stage. Vanilla three.js (no R3F),
// dynamically imported so three stays out of the initial bundle until mount.
//
// Loads the OPTIMIZED glb (1.17 MB) — the raw multi-file model (45 MB scene.bin)
// is gitignored and never deploys. Degrades to a "Modelo no disponible" message
// if the model or WebGL is unavailable; the surrounding copy still renders.
export default function CameraStage({
  basePath = '/models',
  candidates = ['camera.glb'],
  className = 'model-3d camera-stage',
}) {
  const stageRef = useRef(null)
  const pointer = useParallax() // normalized mouse [-1,1], read each frame
  const { model, loading, error } = useModelLoader(basePath, candidates)

  // shared between the scene-setup effect (A) and the model-mount effect (B)
  const mountModelRef = useRef(null) // fn(obj) → fit + add the model
  const pendingModelRef = useRef(null) // model waiting for the scene to be ready

  // ── Effect A: build the three scene once (renderer, lights, particles, loop) ──
  useEffect(() => {
    const mount = stageRef.current
    if (!mount) return
    let disposed = false
    let cleanup = () => {}

    const start = async () => {
      let THREE
      try {
        THREE = await import('three')
      } catch {
        return // no WebGL/three → the copy still renders
      }
      if (disposed || !mount) return

      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1

      // RENDERER — transparent, antialiased, soft shadows
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap // PCFSoftShadowMap is deprecated in this three version
      mount.appendChild(renderer.domElement)

      // SCENE + CAMERA
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
      camera.position.set(0, 0, 5)

      // LIGHTS — theme-aware. The intensities were tuned for three r128 (legacy
      // lighting); r0.184 is physically-based, so the point lights are scaled up
      // to read at the same hue/positions. The dark palette leans purple/pink so
      // the camera glows against the dark hero; the light palette lifts ambient
      // fill and the key light and dials the coloured points back, so the model
      // reads crisp and clean (not muddy/tinted) against the white background.
      const ambient = new THREE.AmbientLight(0x4c1d95, 0.9)
      const key = new THREE.DirectionalLight(0xffffff, 2.6)
      key.position.set(3, 4, 2)
      key.castShadow = true
      const accent = new THREE.PointLight(0xa78bfa, 26, 8)
      accent.position.set(-2, 1, 2)
      const warm = new THREE.PointLight(0xec4899, 10, 6)
      warm.position.set(2, -2, 1)
      scene.add(ambient, key, accent, warm)

      // PARTICLES — 80 white points in a -15..15 cube, slow constant spin
      const COUNT = 80
      const positions = new Float32Array(COUNT * 3)
      for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() * 2 - 1) * 15
      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        transparent: true,
        opacity: 0.4,
      })
      const particles = new THREE.Points(particleGeo, particleMat)
      scene.add(particles)

      // THEME — re-tune the lights + particles for light vs dark mode. White
      // particles vanish on a light background, so they switch to a soft violet;
      // ambient/key are lifted and the coloured points pulled back so the camera
      // reads clean on white. Re-applied live when the user toggles the theme
      // (the root <html data-theme> attribute flips).
      const THEME_LIGHTS = {
        dark: {
          ambient: { color: 0x4c1d95, intensity: 0.9 },
          key: 2.6,
          accent: 26,
          warm: 10,
          particle: { color: 0xffffff, opacity: 0.4 },
        },
        light: {
          ambient: { color: 0xeae6ff, intensity: 1.8 },
          key: 3.3,
          accent: 11,
          warm: 5,
          particle: { color: 0x6d5bd0, opacity: 0.55 },
        },
      }
      const applyTheme = () => {
        const c =
          document.documentElement.dataset.theme === 'light'
            ? THEME_LIGHTS.light
            : THEME_LIGHTS.dark
        ambient.color.setHex(c.ambient.color)
        ambient.intensity = c.ambient.intensity
        key.intensity = c.key
        accent.intensity = c.accent
        warm.intensity = c.warm
        particleMat.color.setHex(c.particle.color)
        particleMat.opacity = c.particle.opacity
      }
      applyTheme()
      const themeObserver = new MutationObserver(applyTheme)
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })

      // group holding the model (lets us rotate/position before it loads)
      const modelGroup = new THREE.Group()
      scene.add(modelGroup)

      // fit the model to ~40% of the screen height, recenter, base 3/4 pose
      const fitAndMount = (obj) => {
        while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0])
        const box = new THREE.Box3().setFromObject(obj)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        obj.position.sub(center) // recenter to origin
        const visibleH = 2 * Math.tan((45 * Math.PI) / 180 / 2) * camera.position.z
        const scale = (visibleH * 0.4) / (size.y || 1)
        obj.scale.setScalar(scale)
        obj.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true
            o.receiveShadow = true
          }
        })
        modelGroup.add(obj)
      }
      mountModelRef.current = fitAndMount
      if (pendingModelRef.current) fitAndMount(pendingModelRef.current)

      // ANIMATION — parallax with lerp smoothing
      const base = { rotY: -0.3, rotX: 0.05 } // aesthetic 3/4 pose
      const cur = { rotY: base.rotY, rotX: base.rotX, camX: 0, camY: 0, scrollY: window.scrollY || 0 }
      const lerp = (a, b, t) => a + (b - a) * t

      // pause rendering while the hero is scrolled out of view — no point
      // burning GPU/CPU on a canvas nobody can see (helps INP + battery)
      let visible = true
      const io = new IntersectionObserver(
        ([en]) => {
          visible = en.isIntersecting
        },
        { threshold: 0 },
      )
      io.observe(mount)

      let raf = 0
      const tick = () => {
        if (disposed) return
        raf = requestAnimationFrame(tick)
        if (!visible) return
        const px = pointer.current.x
        const py = pointer.current.y

        // model rotation: mouse → ±0.4 (Y) / ±0.2 (X) around the base pose, lerp 0.05
        cur.rotY = lerp(cur.rotY, base.rotY + px * 0.4, 0.05)
        cur.rotX = lerp(cur.rotX, base.rotX + py * 0.2, 0.05)
        modelGroup.rotation.y = cur.rotY
        modelGroup.rotation.x = cur.rotX

        // camera drift: ±0.3 (X) / ±0.2 (Y), lerp 0.03
        cur.camX = lerp(cur.camX, px * 0.3, 0.03)
        cur.camY = lerp(cur.camY, -py * 0.2, 0.03)
        camera.position.x = cur.camX
        camera.position.y = cur.camY
        camera.lookAt(0, 0, 0)

        // scroll parallax → translateY of the model (velocity 0.4)
        cur.scrollY = lerp(cur.scrollY, window.scrollY || 0, 0.1)
        modelGroup.position.y = -(cur.scrollY * 0.4) * 0.01

        // slow constant particle spin
        particles.rotation.y += 0.0003

        renderer.render(scene, camera)
      }
      tick()

      // RESIZE — keep camera aspect + renderer in sync with the container
      const onResize = () => {
        const nw = mount.clientWidth
        const nh = mount.clientHeight
        if (!nw || !nh) return
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
      }
      window.addEventListener('resize', onResize)

      cleanup = () => {
        window.removeEventListener('resize', onResize)
        io.disconnect()
        themeObserver.disconnect()
        cancelAnimationFrame(raf)
        particleGeo.dispose()
        particleMat.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
        mountModelRef.current = null
      }
    }

    start()
    return () => {
      disposed = true
      cleanup()
    }
  }, [pointer])

  // ── Effect B: mount the model once it has loaded ──
  useEffect(() => {
    if (!model) return
    pendingModelRef.current = model
    if (mountModelRef.current) mountModelRef.current(model)
  }, [model])

  return (
    <div className={className} ref={stageRef}>
      {loading && (
        <div className="ch-overlay">
          <div className="ch-spinner" role="status" aria-label="Cargando modelo" />
        </div>
      )}
      {error && (
        <div className="ch-overlay">
          <p className="ch-error">Modelo no disponible</p>
        </div>
      )}
    </div>
  )
}
