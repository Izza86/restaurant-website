import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

/* ── navigation data ─────────────────────────────────────────────── */
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Order Online', path: '/order' },
  { name: 'About', path: '/about' },
  { name: 'Reservations', path: '/reservations' },
  { name: 'Contact', path: '/contact' },
];

/* ================================================================= */
/*  HEADER                                                            */
/* ================================================================= */
const Header = () => {
  /* ── state ──────────────────────────────────────────────────────── */
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  /* ── scroll detection ───────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();                              // run once on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close mobile menu on route change ──────────────────────────── */
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  /* ── lock body scroll when mobile menu is open ──────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── handlers ───────────────────────────────────────────────────── */
  const toggleMenu = useCallback(() => setIsOpen((o) => !o), []);
  const closeMenu  = useCallback(() => setIsOpen(false), []);

  /* ── active-link helper for hash links like /contact#reservations ─ */
  const isLinkActive = (path) => {
    if (path.includes('#')) {
      return location.pathname + location.hash === path;
    }
    return location.pathname === path;
  };

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <header
      ref={headerRef}
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-500 ease-in-out
        ${scrolled
          ? 'bg-dark/95 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.35)] py-2'
          : 'bg-charcoal py-4'}
      `}
    >
      {/* ── top gold accent line ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-gradient" />

      <div className="container-custom flex items-center justify-between">
        {/* ══════════════════════════════════════════════════════════
           LOGO
           ══════════════════════════════════════════════════════════ */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group relative flex items-center gap-3 z-50"
        >
          {/* decorative gold dot */}
          <span className="
            hidden sm:flex items-center justify-center
            w-10 h-10 rounded-full border-2 border-primary-500
            text-primary-500 font-accent text-xl font-bold
            group-hover:bg-primary-500 group-hover:text-white
            transition-all duration-300
          ">
            LM
          </span>

          <div className="flex flex-col leading-none">
            <span className="font-heading text-2xl md:text-[1.7rem] font-bold text-white tracking-wide
                             group-hover:text-primary-400 transition-colors duration-300">
              La&nbsp;
              <span className="text-gold-gradient">Maison</span>
            </span>
            <span className="hidden sm:block text-[0.6rem] uppercase tracking-[0.35em] text-gray-400
                             font-body mt-[2px]">
              Fine Dining &amp; Bar
            </span>
          </div>
        </Link>

        {/* ══════════════════════════════════════════════════════════
           DESKTOP NAVIGATION  (hidden below lg breakpoint)
           ══════════════════════════════════════════════════════════ */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={() => `
                  nav-link-desktop relative px-3 xl:px-4 py-2
                  text-[0.8rem] uppercase tracking-[0.15em] font-semibold font-body
                  transition-colors duration-300
                  ${active
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'}
                `}
              >
                {link.name}
                {/* animated gold underline */}
                <span
                  className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2
                    h-[2px] rounded-full bg-primary-500
                    transition-all duration-400 ease-in-out
                    ${active ? 'w-3/4' : 'w-0 group-hover:w-1/2'}
                  `}
                />
              </NavLink>
            );
          })}

          {/* CTA Button */}
          <Link
            to="/reservations"
            className="
              ml-4 inline-flex items-center gap-2
              bg-primary-500 hover:bg-primary-600
              text-charcoal font-bold text-sm uppercase tracking-wider
              px-6 py-2.5 rounded-full
              shadow-[0_0_20px_rgba(212,175,55,0.25)]
              hover:shadow-[0_0_30px_rgba(212,175,55,0.45)]
              hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]
              transition-all duration-300
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reserve Now
          </Link>
        </nav>

        {/* ══════════════════════════════════════════════════════════
           MOBILE HAMBURGER TOGGLE (visible below lg)
           ══════════════════════════════════════════════════════════ */}
        <button
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          className="
            lg:hidden relative z-50
            w-11 h-11 flex items-center justify-center rounded-lg
            border border-gray-600 hover:border-primary-500
            text-white hover:text-primary-400
            transition-all duration-300
          "
        >
          <span className="sr-only">{isOpen ? 'Close' : 'Menu'}</span>
          {isOpen ? (
            <HiX className="w-6 h-6 animate-[spin-slow_0.3s_ease]" />
          ) : (
            <HiMenuAlt3 className="w-6 h-6" />
          )}
        </button>

        {/* ══════════════════════════════════════════════════════════
           MOBILE NAVIGATION OVERLAY
           ══════════════════════════════════════════════════════════ */}
        {/* Backdrop */}
        <div
          onClick={closeMenu}
          className={`
            fixed inset-0 bg-black/60 backdrop-blur-sm z-40
            transition-opacity duration-500 lg:hidden
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div
          className={`
            fixed top-0 right-0 h-full w-[85%] max-w-sm z-40
            bg-gradient-to-b from-charcoal via-dark to-dark-light
            shadow-[-8px_0_40px_rgba(0,0,0,0.5)]
            flex flex-col
            transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            lg:hidden
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* ── panel header ───────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-700/50">
            <span className="font-heading text-xl text-white">
              La <span className="text-gold-gradient">Maison</span>
            </span>
          </div>

          {/* ── nav links ──────────────────────────────────────── */}
          <nav className="flex-1 flex flex-col gap-1 px-4 py-6 overflow-y-auto">
            {navLinks.map((link, i) => {
              const active = isLinkActive(link.path);
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  style={{
                    transitionDelay: isOpen ? `${(i + 1) * 70}ms` : '0ms',
                  }}
                  className={() => `
                    group flex items-center gap-3 px-4 py-3.5 rounded-xl
                    text-[0.95rem] font-semibold tracking-wide
                    transition-all duration-300
                    ${isOpen
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-8 opacity-0'}
                    ${active
                      ? 'bg-primary-500/10 text-primary-400 border-l-[3px] border-primary-500'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'}
                  `}
                >
                  {/* gold dot on active */}
                  <span className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${active ? 'bg-primary-500 scale-100' : 'bg-transparent scale-0 group-hover:bg-gray-500 group-hover:scale-100'}
                  `} />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* ── CTA & extras ───────────────────────────────────── */}
          <div
            className={`
              px-6 pb-8 pt-4 border-t border-gray-700/50
              transition-all duration-500
              ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            style={{ transitionDelay: isOpen ? '420ms' : '0ms' }}
          >
            <Link
              to="/reservations"
              onClick={closeMenu}
              className="
                flex items-center justify-center gap-2 w-full
                bg-primary-500 hover:bg-primary-600
                text-charcoal font-bold text-sm uppercase tracking-wider
                px-6 py-3.5 rounded-full
                shadow-[0_0_24px_rgba(212,175,55,0.3)]
                active:scale-[0.97]
                transition-all duration-300
              "
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reserve Now
            </Link>

            {/* contact info */}
            <div className="mt-5 flex flex-col items-center gap-1 text-center">
              <a href="tel:+15551234567" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                (555) 123-4567
              </a>
              <span className="text-xs text-gray-600">
                Mon – Sun &nbsp;·&nbsp; 11 AM – 11 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
