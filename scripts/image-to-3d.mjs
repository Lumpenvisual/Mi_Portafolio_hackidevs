#!/usr/bin/env node
// One-time image → 3D (.glb) generation for the portrait viewer.
//
// This is the corrected, server-side version of the original lib/trellis.js
// snippet. Key fixes:
//   • Runs in Node, where the token actually lives in the environment — NEVER
//     ship an HF/Replicate token in the Vite client bundle; it would be public.
//   • TRELLIS-image-large is NOT served by the free HF serverless API
//     (api-inference.huggingface.co). Use a provider that actually hosts it:
//       - Replicate  (REPLICATE_API_TOKEN) — default below, works out of the box
//       - a dedicated HF Inference Endpoint (HF_3D_ENDPOINT + HF_TOKEN)
//   • Writes the binary GLB to public/models/jacky.glb (the viewer's default).
//
// Usage:
//   REPLICATE_API_TOKEN=r8_xxx node scripts/image-to-3d.mjs public/retrato.webp
//   # or against a dedicated HF endpoint:
//   HF_TOKEN=hf_xxx HF_3D_ENDPOINT=https://xxxx.endpoints.huggingface.cloud \
//     node scripts/image-to-3d.mjs public/retrato.webp

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

const OUT = resolve('public/models/jacky.glb')
const REPLICATE_MODEL =
  process.env.REPLICATE_MODEL ||
  // image-to-3D TRELLIS port on Replicate; override via REPLICATE_MODEL
  'firtoz/trellis:e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function viaReplicate(imgPath) {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) return null
  const bytes = await readFile(imgPath)
  const dataUrl = `data:image/webp;base64,${bytes.toString('base64')}`

  const create = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL.split(':')[1],
      input: { images: [dataUrl], texture_size: 1024, mesh_simplify: 0.9 },
    }),
  })
  if (!create.ok)
    throw new Error(`Replicate create: ${create.status} ${await create.text()}`)
  let pred = await create.json()

  // poll until the prediction settles
  while (pred.status !== 'succeeded' && pred.status !== 'failed') {
    await sleep(2000)
    const poll = await fetch(pred.urls.get, {
      headers: { Authorization: `Bearer ${token}` },
    })
    pred = await poll.json()
    process.stdout.write(`  …${pred.status}\n`)
  }
  if (pred.status === 'failed')
    throw new Error(`Replicate failed: ${pred.error}`)

  // output shape varies by model; find the GLB url
  const out = pred.output
  const glbUrl =
    out?.model_file ||
    out?.glb ||
    (Array.isArray(out) ? out.find((u) => String(u).endsWith('.glb')) : null)
  if (!glbUrl) throw new Error(`No .glb in output: ${JSON.stringify(out)}`)
  const glb = await fetch(glbUrl)
  return Buffer.from(await glb.arrayBuffer())
}

async function viaHfEndpoint(imgPath) {
  const endpoint = process.env.HF_3D_ENDPOINT
  const token = process.env.HF_TOKEN
  if (!endpoint || !token) return null
  const body = await readFile(imgPath)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
    },
    body,
  })
  if (!res.ok) throw new Error(`HF endpoint: ${res.status} ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const img = process.argv[2] || 'public/retrato.webp'
  console.log(`→ generating 3D from ${img}`)

  const glb = (await viaReplicate(img)) ?? (await viaHfEndpoint(img))
  if (!glb) {
    console.error(
      'No provider configured. Set REPLICATE_API_TOKEN, or HF_TOKEN + HF_3D_ENDPOINT.\n' +
        '(The free HF serverless API does not host TRELLIS — see the header of this file.)',
    )
    process.exit(1)
  }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, glb)
  console.log(`✓ saved ${OUT} (${(glb.length / 1024).toFixed(0)} KB)`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
