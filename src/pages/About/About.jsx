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
    title: 'Passion for Excellence',
    description:
      'Every dish is crafted with meticulous care by our award-winning chefs who bring decades of culinary expertise to your table.',
    accent: 'from-primary-400 to-primary-600',
  },
  {
    icon: HiOutlineHeart,
    title: 'Farm to Table',
    description:
      'We source the freshest ingredients from local farms and trusted suppliers, ensuring exceptional quality and sustainability in every bite.',
    accent: 'from-rose-400 to-rose-600',
  },
  {
    icon: HiOutlineGlobe,
    title: 'Global Inspiration',
    description:
      'Our menu draws from cuisines around the world, blending diverse culinary traditions into a uniquely memorable dining experience.',
    accent: 'from-sky-400 to-sky-600',
  },
  {
    icon: HiOutlineLightBulb,
    title: 'Constant Innovation',
    description:
      'We push the boundaries of modern gastronomy — experimenting with new techniques, seasonal concepts, and unexpected flavour pairings.',
    accent: 'from-amber-400 to-amber-600',
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DATA — Team Members                                             ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const teamMembers = [
  {
    name: 'Chef Antoine Moreau',
    role: 'Executive Chef',
    image:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80',
    bio: '20+ years of Michelin-star experience. Trained at Le Bernardin and Per Se. Specialises in French-Asian fusion that pushes creative boundaries.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Sofia Castellano',
    role: 'Head Pastry Chef',
    image:
      'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=500&q=80',
    bio: 'Graduated from Le Cordon Bleu Paris. Known for her innovative dessert creations that blend classic French pâtisserie with modern artistry.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Marcus Bennett',
    role: 'Head Sommelier',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80',
    bio: 'Certified Master Sommelier with expertise across 200+ wine regions. Curates our rotating cellar of 450+ labels from around the world.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Elena Vasquez',
    role: 'Restaurant Manager',
    image:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&q=80',
    bio: 'Hospitality degree from Cornell. 12 years managing fine-dining operations. Ensures every guest feels like a VIP from the moment they arrive.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Kenji Tanaka',
    role: 'Sous Chef',
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
    bio: 'Trained in Tokyo and Lyon. Bridges Japanese precision with European flair. Oversees our celebrated omakase tasting experience.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Isabelle Dupont',
    role: 'Bar Director',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
    bio: 'Award-winning mixologist. Creates seasonal cocktail menus using house-made syrups, botanical infusions, and rare spirits.',
    socials: { instagram: '#', linkedin: '#' },
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DATA — Awards & Recognitions                                    ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const awards = [
  {
    icon: FaStar,
    title: 'Michelin Star',
    year: '2018 – Present',
    description: 'Awarded and retained every year since 2018',
    color: 'text-primary-500',
  },
  {
    icon: FaTrophy,
    title: 'James Beard Award',
    year: '2022',
    description: 'Outstanding Restaurant — Northeast Region',
    color: 'text-amber-500',
  },
  {
    icon: FaMedal,
    title: 'Wine Spectator',
    year: '2023',
    description: 'Grand Award for exceptional wine program',
    color: 'text-rose-500',
  },
  {
    icon: FaCrown,
    title: 'AAA Five Diamond',
    year: '2021 – Present',
    description: 'Elite distinction for world-class dining',
    color: 'text-sky-500',
  },
  {
    icon: FaNewspaper,
    title: 'NY Times Critics\' Pick',
    year: '2024',
    description: '"One of the city\'s most thrilling tables"',
    color: 'text-emerald-500',
  },
  {
    icon: FaAward,
    title: 'Zagat Top 10',
    year: '2025',
    description: 'Ranked #4 in New York City fine dining',
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
  const teamRef    = useScrollReveal();
  const awardsRef  = useScrollReveal();
  const statsRef   = useScrollReveal();

  return (
    <>
      <SEO
        title="About"
        description="Learn about La Maison's story — 20+ years of culinary excellence, our award-winning team, Michelin-starred cuisine, and our commitment to exceptional dining."
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
            Est. 2005
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 opacity-0 animate-[fade-in_0.6s_0.4s_ease_forwards]">
            Our Story
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto opacity-0 animate-[fade-in_0.6s_0.6s_ease_forwards]">
            Two decades of culinary passion, warm hospitality, and unforgettable flavours
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
                <span className="text-gold-gradient">Culinary Art</span>
              </h2>

              <div className="space-y-5 text-gray-600 leading-relaxed text-[0.95rem]">
                <p>
                  La Maison was born in 2005 from a simple yet ambitious dream:
                  to create a space where extraordinary food, genuine warmth, and
                  lasting memories intertwine. What began as a cozy 20-seat bistro
                  on a quiet Greenwich Village corner has evolved into one of
                  New York's most celebrated dining destinations.
                </p>
                <p>
                  Our founder, Jean-Pierre Moreau, believed that a great restaurant
                  is not just about what's on the plate — it's about the stories
                  shared across the table, the laughter that fills the room, and the
                  care woven into every detail. That philosophy still guides us today.
                </p>
                <p>
                  Over two decades, we've earned a Michelin star, a James Beard Award,
                  and the trust of thousands of loyal guests — yet we've never lost
                  sight of our roots. Every ingredient is hand-selected, every recipe
                  refined with devotion, and every evening crafted to feel special.
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
                  alt="La Maison elegant dining room"
                  className="w-full h-[420px] sm:h-[480px] object-cover"
                  loading="lazy"
                />
                {/* soft overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none" />
              </div>

              {/* floating stat badge */}
              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-charcoal text-white rounded-2xl p-5 shadow-xl z-10 border border-primary-500/20">
                <p className="font-heading text-4xl font-bold text-primary-400">20+</p>
                <p className="text-gray-300 text-sm">Years of Excellence</p>
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
              { target: 20, suffix: '+', label: 'Years of Excellence', cls: 'fade-in-up stagger-1' },
              { target: 150, suffix: 'K+', label: 'Guests Served', cls: 'fade-in-up stagger-2' },
              { target: 45, suffix: '+', label: 'Awards Won', cls: 'fade-in-up stagger-3' },
              { target: 30, suffix: '+', label: 'Expert Team', cls: 'fade-in-up stagger-4' },
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


      {/* ══════════════════════════════════════════════════
         SECTION 3 — Team Members Gallery
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Meet Our Team"
            subtitle="The talented people behind every memorable meal at La Maison."
          />

          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className={`about-team-card group fade-in-up stagger-${(index % 6) + 1}`}
              >
                {/* image */}
                <div className="relative overflow-hidden rounded-t-2xl h-72 sm:h-80">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* hover overlay with bio */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end">
                    <div className="p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                      <p className="text-white/90 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* role pill */}
                  <div className="absolute top-4 left-4 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {member.role}
                  </div>
                </div>

                {/* info bar */}
                <div className="px-5 py-4 bg-white rounded-b-2xl border-t-0">
                  <h3 className="font-heading text-lg font-bold text-dark group-hover:text-primary-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
         SECTION 4 — Awards & Recognitions
         ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-charcoal">
        <div className="container-custom">
          <SectionHeader
            title="Awards & Recognition"
            subtitle="Honoured by the industry's most prestigious institutions."
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
            Ready to Experience <span className="text-primary-400">La Maison</span>?
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Join us for an evening of exceptional cuisine, impeccable service, and moments you'll treasure forever.
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
