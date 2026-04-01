import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition — wraps page content and plays a CSS fade / slide
 * animation every time the route changes.
 *
 * Technique: on route change → set state to "exiting" (opacity-0, shift),
 * wait for the CSS transition to finish, swap children, then "enter"
 * (opacity-1, shift-back).  Pure CSS + React state, no extra lib.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Same route — skip
    if (location.pathname === prevPath.current) {
      setDisplayChildren(children);
      return;
    }
    prevPath.current = location.pathname;

    // 1. Start exit animation
    setPhase('exit');

    // 2. After exit finishes → swap content & enter
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setPhase('enter');
    }, 300); // must match the CSS duration below

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div
      className={`page-transition-wrapper ${
        phase === 'enter' ? 'page-enter' : 'page-exit'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
