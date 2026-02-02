import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks scroll position
 * @param {number} threshold - scroll position threshold in pixels (default: 50)
 * @returns {boolean} isScrolled - true when scrollY exceeds threshold
 */
export default function useScrollPosition(threshold = 50) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
