import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { extname, basename } from 'path'

const targets = [
  { input: 'public/hackidevs.png', maxSize: 640 },
]

for (const { input, maxSize } of targets) {
  const ext = extname(input)
  const base = basename(input, ext)
  const outWebP = `public/${base}.webp`
  const outOptPng = `public/${base}.png`

  const { width, height, size } = await sharp(input).metadata()
  const sizeBefore = (size / 1024).toFixed(0)

  await sharp(input)
    .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outWebP)

  await sharp(input)
    .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toFile(`public/${base}-opt.png`)

  const { size: webpSize } = await sharp(outWebP).metadata()
  console.log(`✓ ${input} (${width}×${height}, ${sizeBefore} KB)`)
  console.log(`  → ${outWebP} (${(webpSize / 1024).toFixed(0)} KB)`)

  // Overwrite original PNG with optimized version
  const { default: fs } = await import('fs/promises')
  await fs.rename(`public/${base}-opt.png`, outOptPng)
}
