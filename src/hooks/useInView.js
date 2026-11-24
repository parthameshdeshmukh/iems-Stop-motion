import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track when a section/canvas enters or leaves the viewport.
 * Used to set R3F frameloop="never" when off-screen, saving up to 75% GPU/CPU overhead.
 */
export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(options.initial ?? true);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: options.threshold ?? 0.01,
        rootMargin: options.rootMargin ?? '80px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [ref, isInView];
}

export default useInView;
