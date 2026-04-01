import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import SectionHeader from '../../common/SectionHeader';
import {
  HiStar,
  HiOutlineStar,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import { useScrollReveal } from '../../../hooks';

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  REVIEW DATA — 10 authentic-sounding testimonials                ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Food Critic, The Herald',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'An extraordinary dining experience from start to finish. The Wagyu tenderloin was cooked to absolute perfection — melt-in-your-mouth tender with a sublime red wine jus. The ambiance, service, and attention to detail made this an unforgettable evening.',
    date: 'March 2026',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Regular Guest',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    text: 'La Maison has become our go-to spot for celebrations. The staff remembers our preferences and always recommends something wonderful. The crème brûlée is a must-try — the best I\'ve had outside Paris. Truly a gem.',
    date: 'February 2026',
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Lifestyle Blogger',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'From the moment you walk in, you feel transported to a Parisian bistro. The truffle bruschetta alone is worth the visit. Impeccable wine pairing suggestions from the sommelier elevated every course to another level.',
    date: 'March 2026',
  },
  {
    id: 4,
    name: 'Michael Thompson',
    role: 'Wine Enthusiast',
    avatar: 'https://i.pravatar.cc/150?img=8',
    rating: 4,
    text: 'Outstanding wine selection curated with genuine expertise. Marcus, the sommelier, guided us through a delightful tasting journey. The 2018 Barolo paired with the lamb was a revelation. Will definitely return.',
    date: 'January 2026',
  },
  {
    id: 5,
    name: 'Olivia Hartwell',
    role: 'Anniversary Dinner',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    text: 'We celebrated our 10th anniversary here and it was nothing short of magical. The private dining room, personalised menu, and the surprise dessert with our names written in chocolate — they truly went above and beyond.',
    date: 'February 2026',
  },
  {
    id: 6,
    name: 'Daniel Park',
    role: 'Chef & Food Writer',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 5,
    text: 'As a fellow chef, I appreciate the craftsmanship here. Chef Antoine\'s French-Asian fusion is inventive without being gimmicky. The miso-glazed black cod was a masterclass in balance. Highest recommendation.',
    date: 'March 2026',
  },
  {
    id: 7,
    name: 'Isabella Rossi',
    role: 'Business Traveller',
    avatar: 'https://i.pravatar.cc/150?img=16',
    rating: 4,
    text: 'I dine at fine restaurants across Europe and La Maison holds its own against the best. The Pan-Seared Salmon with beurre blanc was exceptional. Service was polished and attentive without being intrusive.',
    date: 'January 2026',
  },
  {
    id: 8,
    name: 'Alexander Novak',
    role: 'First-Time Visitor',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Walked in without a reservation on a friend\'s suggestion and was warmly accommodated. Every dish was a work of art — the wild mushroom risotto had incredible depth of flavour. The chocolate lava cake was the perfect finale.',
    date: 'March 2026',
  },
  {
    id: 9,
    name: 'Priya Sharma',
    role: 'Vegan Foodie',
    avatar: 'https://i.pravatar.cc/150?img=25',
    rating: 5,
    text: 'Finally, a fine dining restaurant that takes vegan cuisine seriously! The Buddha Bowl was beautifully composed and genuinely delicious — not an afterthought. The staff were knowledgeable about every ingredient.',
    date: 'February 2026',
  },
  {
    id: 10,
    name: 'Robert Kessler',
    role: 'Corporate Event Host',
    avatar: 'https://i.pravatar.cc/150?img=14',
    rating: 4,
    text: 'Hosted a team dinner for 12 and the private dining experience was flawless. The set menu was beautifully curated, and the bar team crafted custom cocktails for our group. Professional, seamless, and delicious.',
    date: 'January 2026',
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  STAR RATING                                                     ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const StarRating = ({ rating, size = 'text-lg' }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) =>
      i < rating ? (
        <HiStar key={i} className={`${size} star-filled`} />
      ) : (
        <HiOutlineStar key={i} className={`${size} star-empty`} />
      )
    )}
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  REVIEW CARD                                                     ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const ReviewCard = ({ review }) => (
  <div className="review-card flex flex-col h-full group">
    {/* top: stars + date */}
    <div className="flex items-center justify-between mb-4">
      <StarRating rating={review.rating} />
      <span className="text-xs text-gray-400 font-body">{review.date}</span>
    </div>

    {/* quote mark */}
    <span
      className="
        text-primary-400/20 font-heading text-6xl leading-none
        select-none -mb-4 -mt-1
        group-hover:text-primary-400/35 transition-colors duration-300
      "
      aria-hidden="true"
    >
      "
    </span>

    {/* text */}
    <p className="text-gray-600 leading-relaxed text-[0.92rem] flex-1 mb-6">
      {review.text}
    </p>

    {/* divider */}
    <div className="h-px bg-gradient-to-r from-transparent via-primary-300/40 to-transparent mb-4" />

    {/* author */}
    <div className="flex items-center gap-3">
      <img
        src={review.avatar}
        alt={review.name}
        className="
          w-11 h-11 rounded-full object-cover
          ring-2 ring-primary-300/30
          group-hover:ring-primary-500/50
          transition-all duration-300
        "
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="font-heading font-semibold text-dark text-sm truncate">{review.name}</p>
        <p className="text-gray-400 text-xs truncate">{review.role}</p>
      </div>
    </div>
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  AGGREGATE RATING BADGE                                          ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const AggregateRating = () => {
  const avg = useMemo(() => {
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-10">
      <div className="flex items-center gap-2">
        <span className="font-heading text-4xl font-bold text-dark">{avg}</span>
        <div>
          <StarRating rating={Math.round(Number(avg))} size="text-base" />
          <p className="text-xs text-gray-400 mt-0.5">
            Based on {reviews.length} reviews
          </p>
        </div>
      </div>
      <div className="hidden sm:block w-px h-10 bg-gray-200" />
      <p className="text-sm text-gray-500 italic max-w-xs text-center sm:text-left">
        Rated <span className="text-primary-600 font-semibold">Exceptional</span> by our guests
      </p>
    </div>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  REVIEWS SECTION — main component                                ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const DESKTOP_PER_PAGE = 4;  // 2×2 grid
const MOBILE_PER_PAGE  = 1;

const Reviews = () => {
  /* ── state ──────────────────────────────────────────── */
  const [page, setPage]         = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [slideDir, setSlideDir] = useState('right'); // 'left' | 'right'
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef(null);
  const revealRef   = useScrollReveal();

  /* ── derived ────────────────────────────────────────── */
  const totalDesktopPages = Math.ceil(reviews.length / DESKTOP_PER_PAGE);
  const totalMobilePages  = reviews.length;

  const desktopSlice = useMemo(() => {
    const start = page * DESKTOP_PER_PAGE;
    return reviews.slice(start, start + DESKTOP_PER_PAGE);
  }, [page]);

  const mobileReview = reviews[mobilePage];

  /* ── navigation helpers ─────────────────────────────── */
  const animateTransition = useCallback((dir, callback) => {
    setSlideDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 300);
  }, []);

  const nextDesktop = useCallback(() => {
    animateTransition('right', () =>
      setPage((p) => (p + 1) % totalDesktopPages)
    );
  }, [totalDesktopPages, animateTransition]);

  const prevDesktop = useCallback(() => {
    animateTransition('left', () =>
      setPage((p) => (p - 1 + totalDesktopPages) % totalDesktopPages)
    );
  }, [totalDesktopPages, animateTransition]);

  const nextMobile = useCallback(() => {
    animateTransition('right', () =>
      setMobilePage((p) => (p + 1) % totalMobilePages)
    );
  }, [totalMobilePages, animateTransition]);

  const prevMobile = useCallback(() => {
    animateTransition('left', () =>
      setMobilePage((p) => (p - 1 + totalMobilePages) % totalMobilePages)
    );
  }, [totalMobilePages, animateTransition]);

  /* ── autoplay for mobile carousel ───────────────────── */
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setMobilePage((p) => (p + 1) % totalMobilePages);
    }, 6000);
    return () => clearInterval(autoplayRef.current);
  }, [totalMobilePages]);

  const pauseAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
  }, []);

  /* ── animation class ────────────────────────────────── */
  const slideClass = isAnimating
    ? slideDir === 'right'
      ? 'opacity-0 translate-x-4'
      : 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0';

  /* ── nav button component ───────────────────────────── */
  const NavBtn = ({ onClick, label, children }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="
        w-11 h-11 rounded-full
        bg-white border border-gray-200
        flex items-center justify-center
        text-gray-500 hover:text-primary-600
        hover:border-primary-400 hover:shadow-gold
        hover:-translate-y-0.5
        active:translate-y-0 active:scale-95
        transition-all duration-300
      "
    >
      {children}
    </button>
  );

  /* ── dot indicators ─────────────────────────────────── */
  const Dots = ({ count, active, onSelect }) => (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => {
            pauseAutoplay();
            const dir = i > active ? 'right' : 'left';
            animateTransition(dir, () => onSelect(i));
          }}
          aria-label={`Go to review ${i + 1}`}
          className={`
            h-2 rounded-full transition-all duration-400
            ${i === active
              ? 'bg-primary-500 w-7 shadow-[0_0_8px_rgba(212,175,55,0.4)]'
              : 'bg-gray-300 hover:bg-gray-400 w-2.5'}
          `}
        />
      ))}
    </div>
  );

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <SectionHeader
          title="What Our Guests Say"
          subtitle="Don't just take our word for it — hear from those who've experienced the magic."
        />

        {/* ── Aggregate rating ────────────────────────── */}
        <AggregateRating />

        {/* ══════════════════════════════════════════════
           DESKTOP — 2×2 grid with page navigation
           ══════════════════════════════════════════════ */}
        <div ref={revealRef} className="hidden md:block">
          <div
            className={`
              grid grid-cols-2 gap-6 lg:gap-8
              transition-all duration-300 ease-out
              ${slideClass}
            `}
          >
            {desktopSlice.map((review, index) => (
              <div
                key={review.id}
                className={`fade-in-up stagger-${index + 1}`}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          {/* desktop controls */}
          {totalDesktopPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-10">
              <NavBtn onClick={prevDesktop} label="Previous reviews">
                <HiChevronLeft className="w-5 h-5" />
              </NavBtn>
              <Dots
                count={totalDesktopPages}
                active={page}
                onSelect={(i) => setPage(i)}
              />
              <NavBtn onClick={nextDesktop} label="Next reviews">
                <HiChevronRight className="w-5 h-5" />
              </NavBtn>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════
           MOBILE — single-card carousel with autoplay
           ══════════════════════════════════════════════ */}
        <div className="md:hidden" onTouchStart={pauseAutoplay}>
          <div
            className={`
              transition-all duration-300 ease-out
              ${slideClass}
            `}
          >
            <ReviewCard review={mobileReview} />
          </div>

          {/* mobile controls */}
          <div className="flex items-center justify-center gap-5 mt-8">
            <NavBtn onClick={() => { pauseAutoplay(); prevMobile(); }} label="Previous review">
              <HiChevronLeft className="w-5 h-5" />
            </NavBtn>
            <Dots
              count={totalMobilePages}
              active={mobilePage}
              onSelect={(i) => setMobilePage(i)}
            />
            <NavBtn onClick={() => { pauseAutoplay(); nextMobile(); }} label="Next review">
              <HiChevronRight className="w-5 h-5" />
            </NavBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
