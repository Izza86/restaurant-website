import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─── high-res restaurant image ──────────────────────────────────── */
const HERO_IMG =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80';

/* ================================================================= */
/*  HERO                                                              */
/* ================================================================= */
const Hero = () => {
  /* ── mount-triggered entrance animation ────────────────────────── */
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // small delay so the CSS transitions actually play
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── smooth scroll to next section ─────────────────────────────── */
  const scrollToContent = useCallback(() => {
    const hero = document.getElementById('hero');
    if (hero) {
      const next = hero.nextElementSibling;
      next?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  /* ── animation helper — stagger class builder ──────────────────── */
  const anim = (base, delay) =>
    `${base} transition-all ease-[cubic-bezier(0.22,1,0.36,1)]
     ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'}
     duration-[${delay}ms]`
      .replace(/\s+/g, ' ')
      .trim();

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] max-h-[1200px] flex items-center justify-center overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════
         LAYER 1 — Background image with slow cinematic zoom
         ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat zoom-slow will-change-transform"
        style={{ backgroundImage: `url('${HERO_IMG}')` }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════════
         LAYER 2 — Multi-stop overlay (top darker for header legibility)
         ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.72) 0%,
              rgba(0, 0, 0, 0.48) 40%,
              rgba(0, 0, 0, 0.55) 70%,
              rgba(0, 0, 0, 0.78) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════════
         LAYER 3 — Hero content
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 text-center px-5 sm:px-8 max-w-5xl mx-auto">

        {/* ── decorative line ─────────────────────────────────── */}
        <div
          className={`
            mx-auto mb-6 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent
            transition-all duration-1000 ease-out
            ${loaded ? 'w-32 sm:w-48 opacity-100' : 'w-0 opacity-0'}
          `}
        />

        {/* ── tagline ─────────────────────────────────────────── */}
        <p
          className={`
            font-accent text-primary-300 tracking-[0.35em] uppercase
            text-sm sm:text-base md:text-lg mb-4 sm:mb-5
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${loaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '200ms' }}
        >
          ✦&ensp;Welcome to La Maison&ensp;✦
        </p>

        {/* ── main heading ────────────────────────────────────── */}
        <h1
          className={`
            font-heading font-bold text-white leading-[1.08]
            text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]
            mb-5 sm:mb-6 md:mb-8
            transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${loaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'}
          `}
          style={{ transitionDelay: '400ms' }}
        >
          An Exquisite
          <br className="hidden sm:block" />{' '}
          <span className="text-gold-gradient">Dining</span>{' '}
          Experience
        </h1>

        {/* ── sub-text ────────────────────────────────────────── */}
        <p
          className={`
            text-gray-300/90 font-body leading-relaxed
            text-base sm:text-lg md:text-xl
            max-w-2xl mx-auto
            mb-8 sm:mb-10 md:mb-12
            transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${loaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'}
          `}
          style={{ transitionDelay: '600ms' }}
        >
          Indulge in a culinary journey where passion meets perfection.
          Every dish tells a story of tradition, innovation, and love.
        </p>

        {/* ── CTA buttons ─────────────────────────────────────── */}
        <div
          className={`
            flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5
            transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${loaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'}
          `}
          style={{ transitionDelay: '800ms' }}
        >
          {/* Reserve Now — primary gold */}
          <Link
            to="/reservations"
            className="
              group relative inline-flex items-center gap-2.5
              bg-primary-500 text-charcoal font-bold
              text-sm sm:text-base uppercase tracking-wider
              px-8 sm:px-10 py-3.5 sm:py-4 rounded-full
              shadow-[0_0_24px_rgba(212,175,55,0.3)]
              hover:shadow-[0_0_40px_rgba(212,175,55,0.55)]
              hover:bg-primary-400 hover:-translate-y-1
              active:translate-y-0 active:scale-[0.97]
              transition-all duration-400 overflow-hidden
            "
          >
            {/* shimmer sweep */}
            <span className="
              absolute inset-0 -translate-x-full
              bg-gradient-to-r from-transparent via-white/30 to-transparent
              group-hover:translate-x-full
              transition-transform duration-700 ease-in-out
            " />

            <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="relative z-10">Reserve Now</span>
          </Link>

          {/* Order Online — vibrant green */}
          <Link
            to="/order"
            className="
              group relative inline-flex items-center gap-2.5
              bg-green-600 text-white font-bold
              text-sm sm:text-base uppercase tracking-wider
              px-8 sm:px-10 py-3.5 sm:py-4 rounded-full
              shadow-[0_0_24px_rgba(34,197,94,0.3)]
              hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]
              hover:bg-green-500 hover:-translate-y-1
              active:translate-y-0 active:scale-[0.97]
              transition-all duration-400 overflow-hidden
            "
          >
            <span className="
              absolute inset-0 -translate-x-full
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              group-hover:translate-x-full
              transition-transform duration-700 ease-in-out
            " />
            <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="relative z-10">Order Online</span>
          </Link>

          {/* View Menu — outline white */}
          <Link
            to="/menu"
            className="
              group relative inline-flex items-center gap-2.5
              border-2 border-white/60 text-white font-bold
              text-sm sm:text-base uppercase tracking-wider
              px-8 sm:px-10 py-3.5 sm:py-4 rounded-full
              hover:border-primary-400 hover:text-primary-300
              hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]
              active:translate-y-0 active:scale-[0.97]
              transition-all duration-400 overflow-hidden
            "
          >
            {/* fill sweep on hover */}
            <span className="
              absolute inset-0 bg-white/[0.07] scale-x-0 origin-left
              group-hover:scale-x-100
              transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              rounded-full
            " />

            <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="relative z-10">View Menu</span>
          </Link>
        </div>

        {/* ── decorative bottom line ──────────────────────────── */}
        <div
          className={`
            mx-auto mt-10 sm:mt-14 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent
            transition-all duration-1000 ease-out
            ${loaded ? 'w-24 sm:w-36 opacity-100' : 'w-0 opacity-0'}
          `}
          style={{ transitionDelay: '1000ms' }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
         LAYER 4 — Animated scroll-down indicator
         ═══════════════════════════════════════════════════════════ */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll down"
        className={`
          group absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-2
          cursor-pointer
          transition-all duration-700
          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
        style={{ transitionDelay: '1200ms' }}
      >
        {/* label */}
        <span className="
          text-[0.65rem] uppercase tracking-[0.25em] text-white/50
          group-hover:text-primary-400 transition-colors duration-300
        ">
          Scroll
        </span>

        {/* mouse / pill indicator */}
        <div className="
          relative w-6 h-10 rounded-full
          border-2 border-white/30 group-hover:border-primary-400/60
          transition-colors duration-300
        ">
          {/* animated dot inside */}
          <span className="
            absolute left-1/2 -translate-x-1/2 top-2
            w-1.5 h-1.5 rounded-full bg-primary-400
            animate-[scroll-dot_2s_ease-in-out_infinite]
          " />
        </div>

        {/* chevron arrows */}
        <div className="flex flex-col items-center -space-y-1 animate-[scroll-arrows_2s_ease-in-out_infinite]">
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    </section>
  );
};

export default Hero;
