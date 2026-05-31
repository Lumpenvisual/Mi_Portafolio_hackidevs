import { useEffect, useRef } from 'react'

// Lean GLB viewer for the 3D portrait piece.
// Vanilla three.js (no R3F/drei) so it adds zero deps beyond `three`, which is
// already installed; the whole thing is lazy-imported so it stays out of the
// initial bundle. Loads a .glb (default /models/jacky.glb), recenters + fits it
// to the frame, lights it with a soft room environment, and lets the cursor
// orbit it. If the model is missing or WebGL is unavailable it shows a faceted
// placeholder so the viewer is still obviously "working" while you generate the
// real asset (see scripts/image-to-3d.mjs).

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Model3D({
  src = '/models/jacky.glb',
  color = '#8e86f0',
  onStatus,
}) {
  const mountRef = useRef(null)
  // keep the latest callback without re-running the WebGL setup effect
  const statusRef = useRef(onStatus)
  useEffect(() => {
    statusRef.current = onStatus
  }, [onStatus])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    let cleanup = () => {}
    let visible = true
    const setStatus = (s) => statusRef.current && statusRef.current(s)

    const start = async () => {
      const fail = () => {
        if (mount) mount.classList.add('is-fallback')
        setStatus('fallback')
      }

      let THREE, GLTFLoader, OrbitControls, RoomEnvironment
      try {
        ;[THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }] =
          await Promise.all([
            import('three'),
            import('three/addons/loaders/GLTFLoader.js'),
            import('three/addons/controls/OrbitControls.js'),
            import('three/addons/environments/RoomEnvironment.js'),
          ])
      } catch {
        fail()
        return
      }
      if (disposed || !mount) return

      const w = mount.clientWidth || window.innerWidth
      const h = mount.clientHeight || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        fail()
        return
      }
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
      camera.position.set(0, 0, 4)

      // soft, dependency-free image-based lighting from a procedural room
      const pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      // a key light so the form reads even on flat materials
      const key = new THREE.DirectionalLight(0xffffff, 1.4)
      key.position.set(2, 3, 4)
      scene.add(key)
      scene.add(new THREE.AmbientLight(0xffffff, 0.25))

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.enablePan = false
      controls.minDistance = 2
      controls.maxDistance = 8
      const reduce = prefersReduced()
      controls.autoRotate = !reduce
      controls.autoRotateSpeed = 0.8

      const root = new THREE.Group()
      scene.add(root)

      // Frame any object3d: recenter to origin and scale so its largest
      // dimension fits a fixed view size, then place the camera to suit.
      const frame = (obj) => {
        const box = new THREE.Box3().setFromObject(obj)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const target = 2.4
        obj.scale.setScalar(target / maxDim)
        obj.position.sub(center.multiplyScalar(target / maxDim))
        const dist = target / (2 * Math.tan((camera.fov * Math.PI) / 360))
        camera.position.set(0, 0, dist * 1.5)
        camera.lookAt(0, 0, 0)
        controls.update()
      }

      const addPlaceholder = () => {
        const geo = new THREE.IcosahedronGeometry(1, 1)
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          metalness: 0.35,
          roughness: 0.25,
          flatShading: true,
        })
        const mesh = new THREE.Mesh(geo, mat)
        root.add(mesh)
        frame(root)
        setStatus('placeholder')
      }

      const loader = new GLTFLoader()
      loader.load(
        src,
        (gltf) => {
          if (disposed) return
          root.add(gltf.scene)
          frame(root)
          setStatus('model')
        },
        undefined,
        () => {
          // no model yet (404) → show the placeholder, viewer still works
          if (!disposed) addPlaceholder()
        },
      )

      let raf = 0
      const tick = () => {
        if (disposed) return
        raf = requestAnimationFrame(tick)
        if (!visible) return
        controls.update()
        renderer.render(scene, camera)
      }
      tick()

      const onResize = () => {
        const nw = mount.clientWidth
        const nh = mount.clientHeight
        if (!nw || !nh) return
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
      }
      const io = new IntersectionObserver(
        ([en]) => {
          visible = en.isIntersecting
        },
        { threshold: 0 },
      )
      window.addEventListener('resize', onResize)
      io.observe(mount)

      cleanup = () => {
        window.removeEventListener('resize', onResize)
        io.disconnect()
        cancelAnimationFrame(raf)
        controls.dispose()
        pmrem.dispose()
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) {
            const mats = Array.isArray(o.material) ? o.material : [o.material]
            mats.forEach((m) => {
              for (const k in m) {
                const v = m[k]
                if (v && v.isTexture) v.dispose()
              }
              m.dispose()
            })
          }
        })
        renderer.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    }

    setStatus('loading')
    start()
    return () => {
      disposed = true
      cleanup()
    }
  }, [src, color])

  return (
    <div className="model-3d" ref={mountRef}>
      {/* Static fallback if WebGL is unavailable; the canvas paints over it */}
      <div className="model-3d-fallback" aria-hidden="true" />
    </div>
  )
}
