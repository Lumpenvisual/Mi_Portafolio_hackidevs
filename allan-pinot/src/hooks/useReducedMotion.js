import { useEffect, useState } from 'react';

/*
  useReducedMotion — reactive prefers-reduced-motion hook.

  drei does not export a reduced-motion hook in v10, so we implement the small
  matchMedia listener ourselves. It returns true when the user has requested
  reduced motion, and updates live if the OS setting changes. Used by Scene.jsx
  to short-circuit the animation loops and switch the Canvas to frameloop="demand"
  (one static frame), satisfying the accessibility rule.
*/
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
