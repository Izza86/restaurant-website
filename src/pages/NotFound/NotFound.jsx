import { Link } from 'react-router-dom';
import { SEO } from '@components';
import { HiOutlineHome, HiOutlineBookOpen, HiOutlineCalendar } from 'react-icons/hi';

const quickLinks = [
  { name: 'Home',         path: '/',              icon: HiOutlineHome,     desc: 'Back to the main page' },
  { name: 'Our Menu',     path: '/menu',          icon: HiOutlineBookOpen, desc: 'Explore our dishes' },
  { name: 'Reservations', path: '/reservations',  icon: HiOutlineCalendar, desc: 'Book a table' },
];

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-light to-white px-4 py-20">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="text-center max-w-xl mx-auto">
        {/* ── large 404 ────────────────────────────────────── */}
        <p className="font-accent text-primary-400 tracking-[0.3em] uppercase text-sm mb-4">
          Oops — page not found
        </p>
        <h1 className="font-heading text-[7rem] sm:text-[9rem] font-bold leading-none mb-2">
          <span className="text-gold-gradient">4</span>
          <span className="text-dark">0</span>
          <span className="text-gold-gradient">4</span>
        </h1>
        <h2 className="font-heading text-xl sm:text-2xl font-semibold text-dark mb-3">
          This page seems to have left the kitchen
        </h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let us guide you back to something delicious.
        </p>

        {/* ── decorative divider ───────────────────────────── */}
        <div className="divider-gold mb-10" />

        {/* ── quick links ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {quickLinks.map(({ name, path, icon: Icon, desc }) => (
            <Link
              key={name}
              to={path}
              className="
                group flex flex-col items-center gap-2
                p-5 rounded-2xl border border-gray-200
                bg-white shadow-card
                hover:border-primary-400 hover:shadow-gold
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <Icon className="w-7 h-7 text-gray-400 group-hover:text-primary-500 transition-colors" />
              <span className="font-semibold text-dark group-hover:text-primary-600 transition-colors">
                {name}
              </span>
              <span className="text-xs text-gray-400">{desc}</span>
            </Link>
          ))}
        </div>

        {/* ── home button ──────────────────────────────────── */}
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <HiOutlineHome className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
