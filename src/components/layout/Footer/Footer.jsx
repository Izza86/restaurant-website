import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYelp,
  FaPinterestP,
  FaTiktok,
} from 'react-icons/fa';
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiCheck,
  HiExclamationCircle,
  HiArrowRight,
} from 'react-icons/hi';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DATA                                                            ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const socialLinks = [
  { icon: FaFacebookF,  href: 'https://facebook.com',  label: 'Facebook' },
  { icon: FaInstagram,  href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaTwitter,    href: 'https://twitter.com',   label: 'Twitter' },
  { icon: FaYelp,       href: 'https://yelp.com',      label: 'Yelp' },
  { icon: FaPinterestP, href: 'https://pinterest.com', label: 'Pinterest' },
  { icon: FaTiktok,     href: 'https://tiktok.com',    label: 'TikTok' },
];

const quickLinks = [
  { name: 'Home',         path: '/' },
  { name: 'Our Menu',     path: '/menu' },
  { name: 'About Us',     path: '/about' },
  { name: 'Reservations', path: '/reservations' },
  { name: 'Contact',      path: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy',  href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cookie Policy',    href: '#' },
  { name: 'Accessibility',    href: '#' },
];

const hours = [
  { days: 'Mon – Thu', time: '11 AM – 10 PM' },
  { days: 'Friday',    time: '11 AM – 11 PM' },
  { days: 'Saturday',  time: '10 AM – 11 PM' },
  { days: 'Sunday',    time: '10 AM – 9 PM' },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  NEWSLETTER FORM                                                 ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const NewsletterForm = () => {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [status, setStatus]   = useState('idle'); // idle | sending | success

  const validate = useCallback((v) => {
    if (!v.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email.';
    return '';
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const msg = validate(email);
      if (msg) { setError(msg); return; }

      setError('');
      setStatus('sending');
      // simulate API
      setTimeout(() => {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 4000);
      }, 1200);
    },
    [email, validate]
  );

  return (
    <div>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Subscribe for exclusive offers, seasonal menus, and event invitations.
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 animate-[fade-in_0.3s_ease]">
          <HiCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400 text-sm">Thank you! You're subscribed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-2">
          <div className="flex">
            <div className="relative flex-1">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(validate(e.target.value));
                }}
                onBlur={() => { if (email) setError(validate(email)); }}
                disabled={status === 'sending'}
                placeholder="Your email address"
                className={`
                  w-full bg-white/[0.06] border rounded-l-xl rounded-r-none
                  py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-primary-500/30
                  transition-all duration-300
                  ${error
                    ? 'border-red-400/60 focus:border-red-400'
                    : 'border-white/10 focus:border-primary-500/50'}
                `}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="
                bg-primary-500 hover:bg-primary-600 text-white
                px-5 rounded-r-xl font-semibold text-sm
                flex items-center gap-1.5
                hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)]
                active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              {status === 'sending' ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Subscribe
                  <HiArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* error message */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-out
              ${error ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <p className="text-red-400 text-xs flex items-center gap-1">
              <HiExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </p>
          </div>
        </form>
      )}
    </div>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  FOOTER                                                          ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-gray-300 relative overflow-hidden">

      {/* ── Gold accent line (matches header) ─────────── */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="container-custom pt-14 md:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ═══════════════════════════════════════════
             COLUMN 1 — Brand / Restaurant Info
             ═══════════════════════════════════════════ */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo — mirrors header */}
            <Link to="/" className="group inline-flex items-center gap-3 mb-5">
              <span className="
                flex items-center justify-center
                w-10 h-10 rounded-full border-2 border-primary-500
                text-primary-500 font-accent text-xl font-bold
                group-hover:bg-primary-500 group-hover:text-white
                transition-all duration-300
              ">
                LM
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-2xl font-bold text-white tracking-wide group-hover:text-primary-400 transition-colors duration-300">
                  La&nbsp;<span className="text-gold-gradient">Maison</span>
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.35em] text-gray-500 font-body mt-[2px]">
                  Fine Dining &amp; Bar
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Experience the art of fine dining — exquisite dishes crafted from the
              freshest ingredients by world-class chefs in an unforgettable atmosphere.
            </p>

            {/* Contact details */}
            <ul className="space-y-3 text-sm">
              <li className="footer-info-row">
                <HiOutlineLocationMarker className="text-primary-500 text-lg flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Gourmet+Avenue,+New+York,+NY+10001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  123 Gourmet Avenue, Culinary District, NY 10001
                </a>
              </li>
              <li className="footer-info-row">
                <HiOutlinePhone className="text-primary-500 text-lg flex-shrink-0" />
                <a href="tel:+12125551234" className="hover:text-primary-400 transition-colors">
                  (212) 555-1234
                </a>
              </li>
              <li className="footer-info-row">
                <HiOutlineMail className="text-primary-500 text-lg flex-shrink-0" />
                <a href="mailto:hello@lamaison.com" className="hover:text-primary-400 transition-colors">
                  hello@lamaison.com
                </a>
              </li>
            </ul>
          </div>

          {/* ═══════════════════════════════════════════
             COLUMN 2 — Quick Links
             ═══════════════════════════════════════════ */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="footer-link group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-500 transition-colors duration-300 flex-shrink-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* hours mini-section */}
            <h4 className="footer-heading mt-8">Hours</h4>
            <ul className="space-y-1.5 text-sm">
              {hours.map((h) => (
                <li key={h.days} className="flex items-center gap-2">
                  <HiOutlineClock className="text-primary-500/50 w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-gray-400">
                    <span className="text-gray-300 font-medium">{h.days}</span>
                    {' · '}
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ═══════════════════════════════════════════
             COLUMN 3 — Social Media
             ═══════════════════════════════════════════ */}
          <div>
            <h4 className="footer-heading">Follow Us</h4>
            <p className="text-gray-400 text-sm mb-4">
              Stay connected for behind-the-scenes, events, and culinary inspiration.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-card group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors duration-300" />
                  <span className="text-[0.65rem] text-gray-500 group-hover:text-gray-300 transition-colors duration-300 mt-1">
                    {label}
                  </span>
                </a>
              ))}
            </div>

            {/* legal links */}
            <h4 className="footer-heading mt-8">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="footer-link group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-500 transition-colors duration-300 flex-shrink-0" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ═══════════════════════════════════════════
             COLUMN 4 — Newsletter
             ═══════════════════════════════════════════ */}
          <div>
            <h4 className="footer-heading">Newsletter</h4>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {currentYear} La Maison Fine Dining & Bar. All rights reserved.
            <span className="hidden sm:inline">
              {' '}Crafted with passion in New York City.
            </span>
          </p>

          <div className="flex items-center gap-4">
            {/* mini social row for mobile convenience */}
            <div className="flex items-center gap-2">
              {socialLinks.slice(0, 4).map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-7 h-7 rounded-full flex items-center justify-center
                    text-gray-500 hover:text-primary-400 hover:bg-white/5
                    transition-all duration-300
                  "
                >
                  <Icon className="w-3 h-3" />
                </a>
              ))}
            </div>

            <span className="w-px h-4 bg-white/10 hidden md:block" />

            {/* back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="
                text-xs text-gray-500 hover:text-primary-400
                flex items-center gap-1
                transition-colors duration-300
              "
            >
              Back to top
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Decorative background glow ────────────────── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/[0.03] rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
};

export default Footer;
