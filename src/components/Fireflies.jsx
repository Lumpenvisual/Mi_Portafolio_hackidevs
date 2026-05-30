import { useMemo } from 'react'

// Ambient firefly layer — adapted from codebucks27's Creative Portfolio
// (originally Tailwind + setInterval spawning) to plain React + CSS for this
// stack. A fixed set is generated once (no re-render churn); each drifts on a
// CSS keyframe. Tinted with the brand guava accent, not the original yellow.
const make = (i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${Math.round((4 + Math.random() * 7) * 10) / 10}px`,
  duration: `${Math.random() * 5 + 6}s`,
  delay: `${Math.random() * 6}s`,
  scale: 0.5 + Math.random() * 0.9,
  dx: `${Math.round(Math.random() * 60 - 30)}px`,
  dy: `${Math.round(-30 - Math.random() * 50)}px`,
})

export default function Fireflies({ count = 12 }) {
  const flies = useMemo(
    () => Array.from({ length: count }, (_, i) => make(i)),
    [count]
  )

  return (
    <div className="fireflies" aria-hidden="true">
      {flies.map((f) => (
        <span
          key={f.id}
          className="firefly"
          style={{
            top: f.top,
            left: f.left,
            animationDuration: f.duration,
            animationDelay: f.delay,
            '--fly-size': f.size,
            '--fly-scale': f.scale,
            '--fly-dx': f.dx,
            '--fly-dy': f.dy,
          }}
        />
      ))}
    </div>
  )
}
