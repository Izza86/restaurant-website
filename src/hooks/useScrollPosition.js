import { useState, useEffect } from 'react';

/**
 * Hook to detect scroll position.
 * Returns true when the page is scrolled past the given threshold.
 */
const useScrollPosition = (threshold = 50) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

export default useScrollPosition;
