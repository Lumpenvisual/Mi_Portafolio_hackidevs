import { useEffect, useState } from 'react'

// useModelLoader — loads a GLTF/GLB model from a folder, auto-detecting the main
// file. three + GLTFLoader are dynamically imported so they stay out of the
// initial bundle until a model is actually requested.
//
// Returns { model, loading, error }:
//   model   → the loaded THREE.Object3D (gltf.scene) or null
//   loading → true while probing/loading
//   error   → an Error if no file was found or loading failed
//
// `basePath` is the folder (e.g. '/models/vintage_slr_camera'); `candidates`
// are the filenames to probe in order (first one that exists wins).
const DEFAULT_CANDIDATES = [
  'scene.gltf',
  'scene.glb',
  'model.gltf',
  'model.glb',
]

export function useModelLoader(basePath, candidates = DEFAULT_CANDIDATES) {
  const [state, setState] = useState({
    model: null,
    loading: true,
    error: null,
  })
  // stable dependency for the candidate list (avoids effect re-runs on new array identity)
  const candKey = candidates.join('|')

  useEffect(() => {
    let disposed = false
    let loaded = null

    const run = async () => {
      // reset to loading (done inside the async fn, not the effect body, so it
      // doesn't trip react-hooks/set-state-in-effect)
      setState({ model: null, loading: true, error: null })

      // 1. dynamically import the loaders (keeps three out of the main bundle).
      // DRACOLoader decodes KHR_draco_mesh_compression — the camera.glb is
      // Draco-compressed (1.17 MB vs 45 MB raw); the decoder WASM is served
      // from /public/draco. Plain (non-Draco) models load fine too.
      let GLTFLoader, DRACOLoader
      try {
        ;[{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/loaders/DRACOLoader.js'),
        ])
      } catch (err) {
        if (!disposed) setState({ model: null, loading: false, error: err })
        return
      }
      if (disposed) return

      // 2. probe candidate filenames to find the actual model file
      const base = basePath.endsWith('/') ? basePath : basePath + '/'
      let url = null
      for (const name of candKey.split('|')) {
        try {
          const res = await fetch(base + name, { method: 'HEAD' })
          if (res.ok) {
            url = base + name
            break
          }
        } catch {
          /* network error → try next candidate */
        }
      }
      if (disposed) return
      if (!url) {
        setState({
          model: null,
          loading: false,
          error: new Error(`No model file found in ${base}`),
        })
        return
      }

      // 3. load it (with Draco decoding wired in)
      const draco = new DRACOLoader().setDecoderPath('/draco/')
      const loader = new GLTFLoader().setDRACOLoader(draco)
      loader.load(
        url,
        (gltf) => {
          if (disposed) return
          loaded = gltf.scene
          setState({ model: gltf.scene, loading: false, error: null })
          draco.dispose()
        },
        undefined,
        (err) => {
          if (!disposed) setState({ model: null, loading: false, error: err })
          draco.dispose()
        },
      )
    }

    run()

    return () => {
      disposed = true
      // free GPU resources of the loaded model
      if (loaded) {
        loaded.traverse((o) => {
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
      }
    }
  }, [basePath, candKey])

  return state
}
