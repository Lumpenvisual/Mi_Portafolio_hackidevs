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
      // Front fill from the viewer side — lifts the dark front/underside of the
      // matte-black camera so it reads crisp on white. Light mode only (its
      // intensity is set to 0 in dark by applyTheme, keeping the original glow).
      const fill = new THREE.DirectionalLight(0xffffff, 0)
      fill.position.set(0, 0.6, 5)
      scene.add(ambient, key, accent, warm, fill)

      // PARTICLES — 80 white points in a -15..15 cube, slow constant spin
      const COUNT = 80
      const positions = new Float32Array(COUNT * 3)
      for (let i = 0; i < COUNT * 3; i++)
        positions[i] = (Math.random() * 2 - 1) * 15
      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      )
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        transparent: true,
        opacity: 0.4,
      })
      const particles = new THREE.Points(particleGeo, particleMat)
      scene.add(particles)

      // forward ref so fitAndMount can re-tune a freshly-loaded model for the theme
      const applyThemeRef = { current: null }

      // group holding the model (lets us rotate/position before it loads)
      const modelGroup = new THREE.Group()
      scene.add(modelGroup)

      // fit the model to ~52% of the screen height, recenter, base 3/4 pose
      const fitAndMount = (obj) => {
        while (modelGroup.children.length)
          modelGroup.remove(modelGroup.children[0])
        const box = new THREE.Box3().setFromObject(obj)
        const center = box.getCenter(new THREE.Vector3())
        const sphere = box.getBoundingSphere(new THREE.Sphere())
        obj.position.sub(center) // recenter to origin
        // Fit the WHOLE model inside the smaller frustum dimension using its
        // bounding sphere (rotation-invariant), so the wide camera never clips
        // against the square canvas edge at any parallax rotation — it only fades
        // out. 0.95 leaves a small margin so it never touches the edge.
        const visibleH =
          2 * Math.tan((45 * Math.PI) / 180 / 2) * camera.position.z
        const visibleW = visibleH * (camera.aspect || 1)
        const fitDim = Math.min(visibleH, visibleW)
        const scale = (fitDim * 0.95) / (sphere.radius * 2 || 1)
        obj.scale.setScalar(scale)
        obj.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true
            o.receiveShadow = true
          }
        })
        modelGroup.add(obj)
        applyThemeRef.current?.() // tune the freshly-mounted model for the theme
      }
      mountModelRef.current = fitAndMount
      if (pendingModelRef.current) fitAndMount(pendingModelRef.current)

      // ENVIRONMENT (IBL) — a neutral studio reflection map. On the cream light
      // background the matte-black camera read as a flat silhouette; an env map
      // gives its metal/glass real reflections and surface detail. Used in light
      // mode; dark mode keeps the original point-light glow (no IBL).
      let envTex = null
      try {
        const { RoomEnvironment } =
          await import('three/examples/jsm/environments/RoomEnvironment.js')
        const pmrem = new THREE.PMREMGenerator(renderer)
        envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
        pmrem.dispose()
      } catch {
        /* IBL is optional — without it the lights still render the model */
      }
      if (disposed) return

      // THEME — re-tune lights + particles + IBL for light vs dark. White
      // particles vanish on a light background, so they switch to a soft violet;
      // ambient/key are lifted, the coloured points pulled back, and the studio
      // env map is switched on so the camera reads crisp and textured on white.
      // Re-applied live when the user toggles the theme (root data-theme flips).
      // The model is mostly baked-texture, non-metallic materials (only 1 of 5 is
      // metal), so brightness is driven by diffuse light + exposure, not by
      // reflections. Light mode therefore lifts ambient/fill AND switches the
      // renderer to Neutral tone mapping with raised exposure for a photographic,
      // realistic product look; dark mode keeps NoToneMapping so its glow is
      // untouched. The materials are left exactly as authored (no matte hack).
      const THEME_LIGHTS = {
        dark: {
          ambient: { color: 0x4c1d95, intensity: 0.9 },
          key: 2.6,
          accent: 26,
          warm: 10,
          fill: 0,
          particle: { color: 0xffffff, opacity: 0.4 },
          env: 0, // no IBL irradiance in dark — keeps the moody dark + purple glow
          satin: 0.26, // soften the glossy trim so the purple/pink lights read as
          // a broad satin sheen (not a sharp mirror highlight)
          tone: THREE.NoToneMapping, // keep the original dark glow/exposure
          exposure: 1,
        },
        light: {
          ambient: { color: 0xfbfaff, intensity: 2.1 },
          key: 3.6,
          accent: 7,
          warm: 3,
          fill: 2.6, // strong front fill so the body reads bright, not a silhouette
          particle: { color: 0x6d5bd0, opacity: 0.55 },
          env: 1.1, // subtle reflections on the metal trim/lens — not chrome
          satin: 0, // light mode keeps the authored roughness
          tone: THREE.NeutralToneMapping, // photographic roll-off, keeps colour
          exposure: 1.55,
        },
      }
      const applyTheme = () => {
        const light = document.documentElement.dataset.theme === 'light'
        const c = light ? THEME_LIGHTS.light : THEME_LIGHTS.dark
        ambient.color.setHex(c.ambient.color)
        ambient.intensity = c.ambient.intensity
        key.intensity = c.key
        accent.intensity = c.accent
        warm.intensity = c.warm
        fill.intensity = c.fill
        particleMat.color.setHex(c.particle.color)
        particleMat.opacity = c.particle.opacity
        scene.environment = light ? envTex : null // dark stays moody (no env lift)
        renderer.toneMapping = c.tone
        renderer.toneMappingExposure = c.exposure
        // env strength + satin roughness (cached original) + recompile for tone map
        modelGroup.traverse((o) => {
          if (!o.isMesh || !o.material) return
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => {
            if ('envMapIntensity' in m) m.envMapIntensity = c.env
            if ('roughness' in m) {
              if (m.userData._or === undefined) m.userData._or = m.roughness
              m.roughness = Math.min(1, m.userData._or + c.satin)
            }
            m.needsUpdate = true
          })
        })
        particleMat.needsUpdate = true
      }
      applyThemeRef.current = applyTheme
      applyTheme()
      const themeObserver = new MutationObserver(applyTheme)
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })

      // ANIMATION — parallax with lerp smoothing
      const base = { rotY: -0.3, rotX: 0.05 } // aesthetic 3/4 pose
      const cur = { rotY: base.rotY, rotX: base.rotX, camX: 0, camY: 0 }
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

        // NOTE: no scroll-driven translateY of the model — moving it inside the
        // fixed canvas slid it past the canvas edge and clipped it on scroll.
        // The fade is handled outside (Hero opacity on mobile, opacity+sink of
        // the whole stage on desktop), so the model stays centred and uncut.

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
        if (envTex) envTex.dispose()
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
          <div
            className="ch-spinner"
            role="status"
            aria-label="Cargando modelo"
          />
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
