import { useState } from 'react'
import HeroColorPanels from '@/components/ui/hero-color-panel'
import HeroHeatmap from '@/components/ui/hero-heatmap'
import HeroLiquidMetal from '@/components/ui/hero-liquid-metal'
import HeroStaticRadialGradient from '@/components/ui/hero-static-radial-gradient'

// Temporary preview harness for comparing the cult-ui hero variants.
// Mounted only when the URL has ?preview=heroes (see main.jsx). Each hero
// renders its built-in demo content; swap in real props once you pick one.
const HEROES = [
  ['hero-color-panel', HeroColorPanels],
  ['hero-heatmap', HeroHeatmap],
  ['hero-liquid-metal', HeroLiquidMetal],
  ['hero-static-radial-gradient', HeroStaticRadialGradient],
]

export default function HeroGallery() {
  // shadcn tokens (bg-background/text-foreground) flip on the `.dark` class.
  // Toggle it on the wrapper to preview each hero in both palettes.
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'dark' : undefined}>
      <div className="bg-background text-foreground min-h-screen">
        <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
          <h1 className="font-medium text-lg">cult-ui hero preview</h1>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {dark ? 'Light' : 'Dark'} palette
          </button>
        </header>

        {HEROES.map(([name, Hero]) => (
          <section key={name} className="border-b border-border">
            <div className="px-6 py-2 font-mono text-muted-foreground text-xs">
              {name}
            </div>
            {/* Heroes are h-full/w-full sections; give them a sized box. */}
            <div className="relative h-[640px] w-full overflow-hidden">
              <Hero />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
