import React, { useEffect, useRef } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { HeroIntro } from '../remotion/compositions/HeroIntro'

// Embeddable <Player> for the Remotion HeroIntro. Default export so it can be
// React.lazy()'d from the Hero — this keeps @remotion/player + three out of the
// initial bundle (they load as a separate chunk only when the intro plays).
//
// `modelUrl` flows through to ModelScene for when the TRELLIS GLB is ready.

export type HeroPlayerProps = {
  modelUrl?: string
  className?: string
  onEnded?: () => void
}

const HeroPlayer: React.FC<HeroPlayerProps> = ({
  modelUrl,
  className,
  onEnded,
}) => {
  const ref = useRef<PlayerRef>(null)

  useEffect(() => {
    const player = ref.current
    if (!player || !onEnded) return
    const handler = () => onEnded()
    player.addEventListener('ended', handler)
    return () => player.removeEventListener('ended', handler)
  }, [onEnded])

  // Ensure playback starts: autoPlay can be swallowed by the browser's
  // autoplay policy (the Player is muted, which normally satisfies it). Call
  // play() explicitly on mount, and fall back to the first user gesture if the
  // browser still blocked it.
  useEffect(() => {
    const player = ref.current
    if (!player) return
    const tryPlay = () => {
      try {
        player.play()
      } catch {
        /* blocked — the gesture listeners below will retry */
      }
    }
    tryPlay()
    window.addEventListener('pointerdown', tryPlay, { once: true })
    window.addEventListener('keydown', tryPlay, { once: true })
    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    }
  }, [])

  return (
    <Player
      ref={ref}
      component={HeroIntro}
      inputProps={{ modelUrl }}
      durationInFrames={420}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      autoPlay
      initiallyMuted
      loop={false}
      controls={false}
      acknowledgeRemotionLicense
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default HeroPlayer
