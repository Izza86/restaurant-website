import { Link } from 'react-router-dom';
import { Hero, MenuSection, Reviews, SectionHeader, SEO } from '@components';
import { useScrollReveal } from '../../hooks';
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlineCalendar,
  HiArrowRight,
  HiStar,
} from 'react-icons/hi';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ABOUT SNAPSHOT DATA                                             ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const aboutHighlights = [
  { stat: '20+', label: 'Years of Excellence' },
  { stat: '150K+', label: 'Happy Guests' },
  { stat: '1', label: 'Michelin Star' },
  { stat: '45+', label: 'Awards Won' },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  CONTACT PREVIEW DATA                                            ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const contactItems = [
  {
    icon: HiOutlineLocationMarker,
    label: 'Visit Us',
    value: '123 Gourmet Avenue, Culinary District, NY 10001',
    href: 'https://www.google.com/maps/search/?api=1&query=123+Gourmet+Avenue,+New+York,+NY+10001',
    external: true,
  },
  {
    icon: HiOutlinePhone,
    label: 'Call Us',
    value: '(212) 555-1234',
    href: 'tel:+12125551234',
    external: false,
  },
  {
    icon: HiOutlineMail,
    label: 'Email',
    value: 'hello@lamaison.com',
    href: 'mailto:hello@lamaison.com',
    external: false,
  },
  {
    icon: HiOutlineClock,
    label: 'Hours',
    value: 'Mon–Fri 11AM–10PM · Sat 10AM–11PM · Sun 10AM–9PM',
    href: null,
    external: false,
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  HOME PAGE                                                       ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const HomePage = () => {
  const aboutRef   = useScrollReveal();
  const ctaRef     = useScrollReveal();
  const contactRef = useScrollReveal();

  return (
    <>
      <SEO
        title={null}
        description="La Maison — Award-winning fine dining restaurant in New York. Michelin-starred cuisine, unforgettable atmosphere, and impeccable service. Reserve your table today."
      />

      {/* ══════════════════════════════════════════════════
         1. HERO
         ══════════════════════════════════════════════════ */}
      <Hero />


      {/* ══════════════════════════════════════════════════
         2. FEATURED MENU — 6 signature dishes
         ══════════════════════════════════════════════════ */}
      <MenuSection limit={6} />


      {/* ══════════════════════════════════════════════════
         3. ABOUT US SNIPPET
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-white overflow-hidden">
        <div className="container-custom">
          <div
            ref={aboutRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* ── Image side ──────────────────────────── */}
            <div className="relative fade-in-left">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=700&q=80"
                  alt="La Maison dining interior"
                  className="w-full h-[350px] sm:h-[420px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/25 to-transparent pointer-events-none" />
              </div>

              {/* floating accent image */}
              <div className="absolute -bottom-5 -right-3 md:-right-6 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white z-10 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80"
                  alt="Signature dish"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Michelin badge */}
              <div className="absolute top-4 left-4 bg-charcoal/90 backdrop-blur-sm text-white rounded-xl px-4 py-3 shadow-lg z-10">
                <div className="flex items-center gap-2">
                  <HiStar className="w-5 h-5 text-primary-400" />
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-primary-400">Michelin Star</p>
                    <p className="text-[0.6rem] text-gray-400">Since 2018</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Text side ───────────────────────────── */}
            <div className="fade-in-right">
              <p className="text-primary-500 font-accent text-sm uppercase tracking-[0.2em] mb-3">
                Our Story
              </p>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-dark leading-tight mb-5">
                Two Decades of{' '}
                <span className="text-gold-gradient">Culinary Excellence</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[0.92rem] mb-8">
                <p>
                  Founded in 2005, La Maison began as a cozy Greenwich Village bistro
                  with a simple dream — to create a space where extraordinary food,
                  genuine warmth, and lasting memories come together.
                </p>
                <p>
                  Under the guidance of Executive Chef Antoine Moreau, our kitchen
                  pushes the boundaries of modern cuisine while honouring time-honoured
                  French traditions. Every ingredient is hand-selected, every recipe
                  refined with passion.
                </p>
              </div>

              {/* stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {aboutHighlights.map((h) => (
                  <div
                    key={h.label}
                    className="text-center py-3 px-2 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <p className="font-heading text-2xl font-bold text-primary-500">
                      {h.stat}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{h.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="btn-outline inline-flex items-center gap-2 text-sm"
              >
                Learn More About Us
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
         4. REVIEWS / TESTIMONIALS
         ══════════════════════════════════════════════════ */}
      <Reviews />


      {/* ══════════════════════════════════════════════════
         5. RESERVE NOW — CTA
         ══════════════════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-[2px]" />

        <div className="relative container-custom z-10">
          <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
            {/* decorative line */}
            <div className="w-12 h-px bg-primary-400 mx-auto mb-6 fade-in-up stagger-1" />

            <p className="text-primary-400 font-accent text-sm uppercase tracking-[0.25em] mb-4 fade-in-up stagger-1">
              Your Table Awaits
            </p>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5 fade-in-up stagger-2">
              An Unforgettable{' '}
              <span className="text-gold-gradient">Evening</span>{' '}
              Begins Here
            </h2>

            <p className="text-gray-300/90 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10 fade-in-up stagger-3">
              Whether it's a romantic dinner for two, a celebration with friends,
              or an intimate gathering — let us craft the perfect experience for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up stagger-4">
              <Link
                to="/reservations"
                className="
                  group relative inline-flex items-center gap-2.5
                  bg-primary-500 text-charcoal font-bold
                  text-sm uppercase tracking-wider
                  px-9 py-4 rounded-full
                  shadow-[0_0_28px_rgba(212,175,55,0.3)]
                  hover:shadow-[0_0_44px_rgba(212,175,55,0.5)]
                  hover:bg-primary-400 hover:-translate-y-1
                  active:translate-y-0 active:scale-[0.97]
                  transition-all duration-400 overflow-hidden
                "
              >
                <span className="
                  absolute inset-0 -translate-x-full
                  bg-gradient-to-r from-transparent via-white/25 to-transparent
                  group-hover:translate-x-full transition-transform duration-700
                " />
                <HiOutlineCalendar className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Reserve Your Table</span>
              </Link>

              <Link
                to="/menu"
                className="
                  inline-flex items-center gap-2
                  border-2 border-white/40 text-white font-semibold
                  text-sm uppercase tracking-wider
                  px-8 py-3.5 rounded-full
                  hover:border-primary-400/60 hover:text-primary-300
                  hover:-translate-y-0.5
                  transition-all duration-400
                "
              >
                Explore The Menu
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* decorative line */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent mx-auto mt-12 fade-in-up stagger-5" />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
         6. CONTACT INFO PREVIEW
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeader
            title="Visit La Maison"
            subtitle="We'd love to welcome you. Find us in the heart of New York's Culinary District."
          />

          <div ref={contactRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactItems.map(({ icon: Icon, label, value, href, external }, idx) => (
              <div
                key={label}
                className={`home-contact-card group fade-in-up stagger-${idx + 1}`}
              >
                <div className="
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  bg-primary-100 group-hover:bg-primary-500
                  transition-colors duration-300
                ">
                  <Icon className="text-2xl text-primary-500 group-hover:text-white transition-colors duration-300" />
                </div>

                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                  {label}
                </p>

                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-gray-600 hover:text-primary-600 transition-colors text-sm leading-snug"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-gray-600 text-sm leading-snug">{value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Map + CTA row */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            {/* map */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-sm border border-gray-100 fade-in-left">
              <iframe
                title="La Maison restaurant location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2!2d-73.99!3d40.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzI0LjAiTiA3M8KwNTknMjQuMCJX!5e0!3m2!1sen!2sus!4v1"
                className="w-full h-56 md:h-64 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* quick CTA card */}
            <div className="lg:col-span-2 bg-charcoal rounded-2xl p-7 md:p-8 flex flex-col justify-center text-center shadow-lg fade-in-right">
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
                Ready to Dine?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Book your table online in seconds, or give us a call for
                private events and special requests.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/reservations"
                  className="btn-primary text-sm py-2.5 px-7 inline-flex items-center gap-2"
                >
                  <HiOutlineCalendar className="w-4 h-4" />
                  Reserve Now
                </Link>
                <Link
                  to="/contact"
                  className="
                    text-sm text-gray-400 hover:text-primary-400
                    inline-flex items-center gap-1.5
                    transition-colors duration-300
                  "
                >
                  Contact Us
                  <HiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
