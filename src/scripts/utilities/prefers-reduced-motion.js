export default function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {
    return false;
  }
}

export const PREFERS_REDUCED_MOTION = prefersReducedMotion();
