// One-off asset optimizer: source art in assests/ is huge (grunge ~17MB,
// cinta ~11MB each). This downscales + converts to WebP into public/ so the
// site ships kilobytes, not hundreds of megabytes. Only ships used variants.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const A = 'assests'
const GR = `${A}/20-grunge-distressed-textures-2026-03-27-00-32-36-utc`
const CI = `${A}/cinta amarilla`

const jobs = []

// --- Profile photo ---
jobs.push({
  in: `${A}/yo-retoque.png`,
  out: 'public/yo-retoque.webp',
  width: 900,
  quality: 78,
})

// --- Grunge 1..12 (low-opacity overlays → aggressive compression) ---
for (let n = 1; n <= 12; n++) {
  const nn = String(n).padStart(2, '0')
  jobs.push({
    in: `${GR}/Grunge_Distressed (${n}).jpg`,
    out: `public/textures/grunge/grunge-${nn}.webp`,
    width: 1280,
    quality: 56,
  })
}

// --- Washi tapes (only the variants actually used) ---
const tapes = {
  1: 'fold_right',
  3: 'h_medium',
  5: 'h_wide',
  8: 'square_sm',
  16: 'fold_left',
}
for (const [n, name] of Object.entries(tapes)) {
  jobs.push({
    in: `${CI}/Paper (${n}).png`,
    out: `public/cinta/tape-${name}.webp`,
    width: 700,
    quality: 82,
  })
}

// --- Documentary photos 1..10 ---
for (let n = 1; n <= 10; n++) {
  const nn = String(n).padStart(2, '0')
  jobs.push({
    in: `${A}/fotos/foto_${n}.jpg`,
    out: `public/fotos/foto-${nn}.webp`,
    width: 1400,
    quality: 74,
  })
}

await mkdir('public/textures/grunge', { recursive: true })
await mkdir('public/cinta', { recursive: true })
await mkdir('public/fotos', { recursive: true })

let total = 0
for (const j of jobs) {
  const info = await sharp(j.in)
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: j.quality })
    .toFile(j.out)
  total += info.size
  console.log(`${j.out}  ${(info.size / 1024).toFixed(0)} KB`)
}
console.log(
  `\nTOTAL: ${(total / 1024).toFixed(0)} KB across ${jobs.length} files`,
)
