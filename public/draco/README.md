# Draco decoder

WASM decoder for Draco-compressed glTF geometry (`KHR_draco_mesh_compression`),
used by the hero's vintage SLR camera model (`/models/camera.glb`).

- `draco_wasm_wrapper.js` + `draco_decoder.wasm` — loaded at runtime by three's
  `DRACOLoader` (`setDecoderPath('/draco/')`) when the 3D hero mounts.
- Source: `three/examples/jsm/libs/draco/gltf/` (copied, JS fallback omitted —
  modern browsers use the WASM path).
- License: Apache-2.0 (Google Draco). See https://github.com/google/draco
