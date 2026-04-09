import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, SEO } from '@components';
import { useScrollReveal } from '../../hooks';
import {
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineGlobe,
  HiOutlineLightBulb,
  HiOutlineStar,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import {
  FaAward,
  FaMedal,
  FaTrophy,
  FaCrown,
  FaStar,
  FaNewspaper,
} from 'react-icons/fa';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DATA — Values                                                   ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const values = [
  {
    icon: HiOutlineSparkles,
    title: 'Authentic Recipes',
    description:
      'Every dish is prepared using traditional recipes passed down through generations — the same flavours you\'d find in the streets of Lahore and Karachi.',
    accent: 'from-primary-400 to-primary-600',
  },
  {
    icon: HiOutlineHeart,
    title: '100 % Halal',
    description:
      'All our meat is certified Halal. We use the freshest ingredients sourced daily to ensure quality and taste in every single bite.',
    accent: 'from-rose-400 to-rose-600',
  },
  {
    icon: HiOutlineGlobe,
    title: 'Taste the World',
    description:
      'From smoky Karahis and slow-cooked Nihari to aromatic Biryanis and sizzling BBQ — our menu is a journey through South-Asian cuisine.',
    accent: 'from-sky-400 to-sky-600',
  },
  {
    icon: HiOutlineLightBulb,
    title: 'Warm Hospitality',
    description:
      'Whether you dine in, take away, or order online, we treat every customer like family. Great food deserves great service.',
    accent: 'from-amber-400 to-amber-600',
  },
];


/* Team Members data hidden per owner request */


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DATA — Awards & Recognitions                                    ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const awards = [
  {
    icon: FaStar,
    title: '100 % Halal',
    year: 'Always',
    description: 'All meats are certified Halal — guaranteed quality and trust',
    color: 'text-primary-500',
  },
  {
    icon: FaTrophy,
    title: '60+ Dishes',
    year: 'Full Menu',
    description: 'A wide variety of Karahi, Biryani, BBQ, Daal, and more',
    color: 'text-amber-500',
  },
  {
    icon: FaMedal,
    title: 'Fresh Ingredients',
    year: 'Daily',
    description: 'We source fresh meat and vegetables every single day',
    color: 'text-rose-500',
  },
  {
    icon: FaCrown,
    title: 'Open 24/7',
    year: '24 Hours',
    description: 'Serving breakfast, lunch, and dinner all week long',
    color: 'text-sky-500',
  },
  {
    icon: FaNewspaper,
    title: 'Dine-in & Takeaway',
    year: 'Your Choice',
    description: 'Enjoy at our restaurant or order for takeaway and delivery',
    color: 'text-emerald-500',
  },
  {
    icon: FaAward,
    title: 'Family Friendly',
    year: 'Everyone Welcome',
    description: 'A warm and welcoming space for families and large groups',
    color: 'text-violet-500',
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  STAT COUNTER — animates from 0 to target                        ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const AnimatedStat = ({ target, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    // triggered by parent visibility — start counting
    setHasAnimated(true);
    const duration = 1800;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [hasAnimated, target]);

  return (
    <div className="text-center">
      <p className="font-heading text-4xl md:text-5xl font-bold text-primary-500">
        {count}
        {suffix}
      </p>
      <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider font-medium">
        {label}
      </p>
    </div>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ABOUT PAGE                                                      ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const AboutPage = () => {
  const storyRef   = useScrollReveal();
  const valuesRef  = useScrollReveal();
  const awardsRef  = useScrollReveal();
  const statsRef   = useScrollReveal();

  return (
    <>
      <SEO
        title="About"
        description="Learn about Aresh Al Madinah Restaurant — authentic Pakistani & Indian cuisine in the heart of Dubai. Fresh Halal food, traditional recipes, and warm hospitality."
      />

      {/* ══════════════════════════════════════════════════
         PAGE BANNER
         ══════════════════════════════════════════════════ */}
      <section
        className="relative h-80 md:h-[28rem] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/80" />

        <div className="relative text-center px-4 z-10">
          <p className="text-primary-400 font-accent text-lg md:text-xl tracking-widest uppercase mb-3 opacity-0 animate-[fade-in_0.6s_0.2s_ease_forwards]">
            Dubai, UAE
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 opacity-0 animate-[fade-in_0.6s_0.4s_ease_forwards]">
            Our Story
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto opacity-0 animate-[fade-in_0.6s_0.6s_ease_forwards]">
            Authentic flavours, warm hospitality, and unforgettable meals
          </p>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>


      {/* ══════════════════════════════════════════════════
         SECTION 1 — Restaurant Story / History
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Text column ─────────────────────────── */}
            <div className="fade-in-left">
              <p className="text-primary-500 font-accent text-sm uppercase tracking-[0.2em] mb-3">
                The Beginning
              </p>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-dark leading-tight mb-6">
                A Legacy of{' '}
                <span className="text-gold-gradient">Authentic Flavours</span>
              </h2>

              <div className="space-y-5 text-gray-600 leading-relaxed text-[0.95rem]">
                <p>
                  Aresh Al Madinah Restaurant was founded with a simple mission:
                  to bring the true taste of Pakistan and India to Dubai. Located
                  on 4th St in the vibrant Al Murar area, we've become a
                  go-to destination for anyone craving authentic Desi food.
                </p>
                <p>
                  Our kitchen is led by experienced chefs who have mastered the
                  art of Karahi, Biryani, BBQ, and traditional slow-cooked dishes.
                  Every recipe is prepared with fresh, Halal ingredients and the
                  same love you’d find in a home kitchen back in Pakistan.
                </p>
                <p>
                  Whether you’re here for a quick lunch, a family dinner, or
                  late-night cravings, our doors are open 24 hours a day,
                  7 days a week. Come taste the difference — once you try our
                  food, you’ll keep coming back.
                </p>
              </div>

              {/* inline CTA */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/menu" className="btn-primary text-sm py-2.5 px-7">
                  Explore Our Menu
                </Link>
                <Link to="/reservations" className="btn-outline text-sm py-2.5 px-7">
                  Reserve a Table
                </Link>
              </div>
            </div>

            {/* ── Image column ────────────────────────── */}
            <div className="relative fade-in-right">
              {/* main image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=700&q=80"
                  alt="Aresh Al Madinah Restaurant"
                  className="w-full h-[420px] sm:h-[480px] object-cover"
                  loading="lazy"
                />
                {/* soft overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none" />
              </div>

              {/* floating stat badge */}
              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-charcoal text-white rounded-2xl p-5 shadow-xl z-10 border border-primary-500/20">
                <p className="font-heading text-4xl font-bold text-primary-400">60+</p>
                <p className="text-gray-300 text-sm">Dishes on Menu</p>
              </div>

              {/* small accent image */}
              <div className="absolute -top-4 -right-4 md:-right-8 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-lg border-4 border-white z-10 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80"
                  alt="Signature dish"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* decorative dots */}
              <div className="absolute -bottom-8 right-8 w-20 h-20 opacity-20 pointer-events-none hidden lg:block">
                <svg viewBox="0 0 80 80" fill="none">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={(i % 5) * 18 + 8}
                      cy={Math.floor(i / 5) * 18 + 8}
                      r="2.5"
                      fill="#D4AF37"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
         STATS BAR
         ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-charcoal">
        <div className="container-custom">
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
          >
            {[
              { target: 60, suffix: '+', label: 'Dishes on Menu', cls: 'fade-in-up stagger-1' },
              { target: 14, suffix: '', label: 'Food Categories', cls: 'fade-in-up stagger-2' },
              { target: 7, suffix: ' Days', label: 'Open Weekly', cls: 'fade-in-up stagger-3' },
              { target: 24, suffix: 'h', label: 'Daily Service', cls: 'fade-in-up stagger-4' },
            ].map((stat) => (
              <div key={stat.label} className={stat.cls}>
                <AnimatedStat
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                />
                <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-medium text-center">
                  {/* label already rendered inside AnimatedStat */}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
         SECTION 2 — Mission & Values
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeader
            title="Our Values"
            subtitle="The principles that guide every plate, every pour, and every guest experience."
          />

          <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description, accent }, index) => (
              <div
                key={title}
                className={`about-value-card group fade-in-up stagger-${index + 1}`}
              >
                {/* icon container */}
                <div
                  className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                    bg-gradient-to-br ${accent} shadow-md
                    group-hover:scale-110 group-hover:shadow-lg
                    transition-all duration-300
                  `}
                >
                  <Icon className="text-white text-2xl" />
                </div>

                <h3 className="font-heading text-lg font-bold text-dark mb-2.5 group-hover:text-primary-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {description}
                </p>

                {/* bottom accent bar */}
                <div
                  className={`
                    h-0.5 w-0 group-hover:w-12 mt-5 rounded-full
                    bg-gradient-to-r ${accent}
                    transition-all duration-500
                  `}
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Team Members section hidden per owner request */}


      {/* ══════════════════════════════════════════════════
         SECTION 4 — Awards & Recognitions
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-charcoal">
        <div className="container-custom">
          <SectionHeader
            title="Why Choose Us"
            subtitle="Here's what makes Aresh Al Madinah your favourite Desi restaurant in Dubai."
            light
          />

          <div ref={awardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <div
                key={award.title}
                className={`about-award-card group fade-in-up stagger-${(index % 6) + 1}`}
              >
                {/* icon */}
                <div
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center mb-4
                    bg-white/5 border border-white/10
                    group-hover:bg-white/10 group-hover:border-primary-400/30
                    transition-all duration-300
                  `}
                >
                  <award.icon className={`text-2xl ${award.color}`} />
                </div>

                {/* text */}
                <h3 className="font-heading text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {award.title}
                </h3>
                <p className="text-primary-400/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  {award.year}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {award.description}
                </p>

                {/* subtle gold border glow on hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary-500/20 transition-colors duration-400 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
         CTA BANNER
         ══════════════════════════════════════════════════ */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-charcoal/75 backdrop-blur-[2px]" />
        <div className="relative container-custom text-center z-10">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Taste <span className="text-primary-400">Aresh Al Madinah</span>?
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Join us for a meal of authentic Desi flavours, warm service, and moments you’ll savour.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/reservations" className="btn-primary">
              Reserve Your Table
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:text-charcoal">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
