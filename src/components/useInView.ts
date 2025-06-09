import { useState, useEffect, useRef } from 'react';

// Custom hook to detect if an element is in view (animate once)
export default function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.2): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return; // Lock once in view
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, inView]);

  return [ref, inView];
}
