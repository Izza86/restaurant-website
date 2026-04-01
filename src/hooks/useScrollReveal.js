import { useEffect, useRef } from 'react';

/**
 * Hook: attach an IntersectionObserver that adds the `visible` class
 * to every child with a `fade-in-*` class when it scrolls into view.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref}> … children with className="fade-in-up" … </section>
 *
 * @param {Object}  options
 * @param {number}  options.threshold  — visibility ratio to trigger (0-1)
 * @param {string}  options.rootMargin — IntersectionObserver rootMargin
 * @param {boolean} options.once       — reveal only once (default true)
 */
const useScrollReveal = ({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  once = true,
} = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      el.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale'
      ).forEach((child) => child.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const targets = el.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale'
    );
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
};

export default useScrollReveal;
