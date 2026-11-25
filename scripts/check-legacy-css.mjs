// Guards the production CSS against syntax older phones silently ignore.
// Run after `npm run build`:  node scripts/check-legacy-css.mjs
//
// - Media Queries Level 4 range syntax `(width<=768px)` → Chrome <104 /
//   Safari <16.4 drop the whole block (the site rendered its desktop layout
//   on such phones). The build must emit `max-width` / `min-width`.
// - Every declaration using color-mix() / svh must be preceded, in the same
//   rule, by a fallback declaration of the same property.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist/assets'
const files = readdirSync(dir).filter((f) => f.endsWith('.css'))
if (!files.length) {
  console.error('No CSS in dist/assets — run `npm run build` first.')
  process.exit(1)
}

const MODERN = /color-mix\(|\d(?:s|d|l)vh\b/
// Decorative-only uses that may simply drop out on old browsers.
const ALLOWED_WITHOUT_FALLBACK = new Set(['box-shadow', 'filter'])
// Selectors where dropping is harmless: the card spotlight is pure decoration,
// and the hovered cursor orb inherits the base `.cursor-ring` fallback.
const OK_TO_DROP = ['.card-spotlight', 'cursor-hover .cursor-ring']

let problems = 0
for (const f of files) {
  const css = readFileSync(join(dir, f), 'utf8')

  const ranges =
    css.match(/@media[^{]*\((?:width|height)\s*[<>]=?[^)]*\)/g) || []
  for (const r of ranges) {
    console.error(`${f}: range-syntax media query → ${r}`)
    problems++
  }

  // Walk innermost blocks: "selector{decl;decl}".
  for (const m of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const [, selector, body] = m
    const decls = []
    let depth = 0
    let cur = ''
    for (const ch of body) {
      if (ch === '(') depth++
      if (ch === ')') depth--
      if (ch === ';' && depth === 0) {
        decls.push(cur)
        cur = ''
      } else cur += ch
    }
    if (cur.trim()) decls.push(cur)
    const seen = new Map()
    for (const d of decls) {
      const i = d.indexOf(':')
      if (i < 0) continue
      const prop = d.slice(0, i).trim()
      const value = d.slice(i + 1)
      if (MODERN.test(value)) {
        const hasFallback = seen.get(prop)
        const hover = /:hover/.test(selector)
        const harmless = OK_TO_DROP.some((s) => selector.includes(s))
        if (
          !hasFallback &&
          !ALLOWED_WITHOUT_FALLBACK.has(prop) &&
          !hover &&
          !harmless
        ) {
          console.error(
            `${f}: no fallback for "${prop}" in ${selector.trim().slice(0, 80)}`,
          )
          problems++
        }
      } else {
        seen.set(prop, true)
      }
    }
  }
}

if (problems) {
  console.error(`\n${problems} legacy-CSS problem(s).`)
  process.exit(1)
}
console.log(
  `legacy CSS OK (${files.length} file(s)): classic media queries, fallbacks present.`,
)
