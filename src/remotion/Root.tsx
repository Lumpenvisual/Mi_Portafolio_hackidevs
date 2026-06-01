import React from 'react'
import { Composition } from 'remotion'
import { HeroIntro } from './compositions/HeroIntro'

// Remotion root — registra la composición del intro. Útil para abrir el
// Remotion Studio (`npx remotion studio src/remotion/index.ts`) o renderizar a
// MP4; en el sitio se consume vía <Player> (src/components/HeroPlayer.tsx).
// 14s @ 30fps = 420 frames, 1920x1080.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HeroIntro"
      component={HeroIntro}
      durationInFrames={420}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  )
}
