import { useState, useCallback, useRef } from 'react';
import SectionHeader from '../../common/SectionHeader';
import { useScrollReveal } from '../../../hooks';
import { addContactMessage as saveContactToFirestore } from '../../../services/firestoreService';
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlineExternalLink,
  HiCheck,
  HiExclamationCircle,
} from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  RESTAURANT INFO                                                 ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const RESTAURANT = {
  name: 'La Maison Fine Dining & Bar',
  address: '123 Gourmet Avenue, Culinary District',
  city: 'New York, NY 10001',
  phone: '(212) 555-1234',
  phoneTel: '+12125551234',
  email: 'hello@lamaison.com',
  mapsQuery: '123+Gourmet+Avenue,+New+York,+NY+10001',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2!2d-73.99!3d40.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzI0LjAiTiA3M8KwNTknMjQuMCJX!5e0!3m2!1sen!2sus!4v1',
};

const HOURS = [
  { day: 'Monday',    open: '11:00 AM', close: '10:00 PM' },
  { day: 'Tuesday',   open: '11:00 AM', close: '10:00 PM' },
  { day: 'Wednesday', open: '11:00 AM', close: '10:00 PM' },
  { day: 'Thursday',  open: '11:00 AM', close: '10:00 PM' },
  { day: 'Friday',    open: '11:00 AM', close: '11:00 PM' },
  { day: 'Saturday',  open: '10:00 AM', close: '11:00 PM' },
  { day: 'Sunday',    open: '10:00 AM', close: '9:00 PM'  },
];

const SOCIALS = [
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaTwitter,   href: 'https://twitter.com',   label: 'Twitter' },
];

const TODAY_INDEX = new Date().getDay(); // 0 = Sun
const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon–Sun


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  VALIDATORS                                                      ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const validators = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(v)) return 'Name contains invalid characters.';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email.';
    return '';
  },
  subject: (v) => {
    if (!v.trim()) return 'Subject is required.';
    if (v.trim().length < 3) return 'Subject must be at least 3 characters.';
    return '';
  },
  message: (v) => {
    if (!v.trim()) return 'Message is required.';
    if (v.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

const MAX_MESSAGE = 500;


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  CONTACT INFO CARD — single info row                             ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const InfoCard = ({ icon: Icon, label, children }) => (
  <div className="contact-info-card group">
    <div
      className="
        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
        bg-primary-100 group-hover:bg-primary-500
        transition-colors duration-300
      "
    >
      <Icon className="text-2xl text-primary-500 group-hover:text-white transition-colors duration-300" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
        {label}
      </p>
      {children}
    </div>
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  FORM FIELD WRAPPER                                              ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const Field = ({ id, label, error, touched, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} <span className="text-red-400">*</span>
    </label>
    {children}
    <div
      className={`
        overflow-hidden transition-all duration-300 ease-out
        ${error && touched ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0 mt-0'}
      `}
    >
      <p className="text-red-500 text-xs flex items-center gap-1">
        <HiExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {error}
      </p>
    </div>
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  CONTACT SECTION — main component                                ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const ContactSection = () => {
  /* ── form state ─────────────────────────────────────── */
  const emptyForm = { name: '', email: '', subject: '', message: '' };
  const [formData, setFormData]   = useState(emptyForm);
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [status, setStatus]       = useState('idle'); // idle | sending | success | error
  const formRef = useRef(null);
  const revealRef = useScrollReveal();

  /* ── handlers ───────────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  }, [touched]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  }, []);

  const validateAll = useCallback(() => {
    const next = {};
    let valid = true;
    for (const key of Object.keys(validators)) {
      const msg = validators[key](formData[key]);
      next[key] = msg;
      if (msg) valid = false;
    }
    setErrors(next);
    setTouched({ name: true, email: true, subject: true, message: true });
    return valid;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateAll()) {
        // focus first field with error
        const firstErr = Object.keys(validators).find(
          (k) => validators[k](formData[k])
        );
        if (firstErr) {
          formRef.current?.querySelector(`[name="${firstErr}"]`)?.focus();
        }
        return;
      }

      setStatus('sending');
      try {
        await saveContactToFirestore(formData);
        setStatus('success');
        setFormData(emptyForm);
        setErrors({});
        setTouched({});
      } catch (err) {
        console.error('[Contact] Submit error:', err);
        setStatus('error');
      }
    },
    [validateAll, formData]
  );

  const resetForm = useCallback(() => {
    setStatus('idle');
    setFormData(emptyForm);
    setErrors({});
    setTouched({});
  }, []);

  /* ── input class helper ─────────────────────────────── */
  const inputCls = (field) =>
    `form-input ${errors[field] && touched[field] ? '!border-red-400 !ring-red-200/40' : ''}`;

  /* ── character count ────────────────────────────────── */
  const msgLen = formData.message.length;
  const msgRemaining = MAX_MESSAGE - msgLen;

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeader
          title="Get in Touch"
          subtitle="We'd love to hear from you. Reach out for reservations, events, or just to say hello."
        />

        <div ref={revealRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

          {/* ══════════════════════════════════════════════
             LEFT COLUMN — info + hours + map + socials
             ══════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-8 fade-in-left">

            {/* ── Restaurant Name & Contact Cards ────── */}
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-bold text-dark mb-1">
                {RESTAURANT.name}
              </h3>

              {/* Address */}
              <InfoCard icon={HiOutlineLocationMarker} label="Visit Us">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${RESTAURANT.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 transition-colors leading-snug group/link"
                >
                  {RESTAURANT.address}
                  <br />
                  {RESTAURANT.city}
                  <HiOutlineExternalLink className="inline ml-1 w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </InfoCard>

              {/* Phone */}
              <InfoCard icon={HiOutlinePhone} label="Call Us">
                <a
                  href={`tel:${RESTAURANT.phoneTel}`}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  {RESTAURANT.phone}
                </a>
              </InfoCard>

              {/* Email */}
              <InfoCard icon={HiOutlineMail} label="Email Us">
                <a
                  href={`mailto:${RESTAURANT.email}`}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {RESTAURANT.email}
                </a>
              </InfoCard>
            </div>

            {/* ── Hours of Operation ─────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-charcoal">
                <HiOutlineClock className="text-primary-400 text-lg" />
                <h4 className="font-heading text-sm font-semibold text-white tracking-wide uppercase">
                  Hours of Operation
                </h4>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                      Day
                    </th>
                    <th className="text-left px-5 py-2.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                      Opening
                    </th>
                    <th className="text-left px-5 py-2.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                      Closing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dayOrder.map((dayIdx) => {
                    const h = HOURS[dayIdx];
                    const isToday = dayIdx === ((TODAY_INDEX + 6) % 7); // align: Mon=0
                    // fix: JS getDay: 0=Sun → map to HOURS index
                    const isCurrentDay = (dayIdx === 6 && TODAY_INDEX === 0) ||
                                         (dayIdx === TODAY_INDEX - 1);
                    return (
                      <tr
                        key={h.day}
                        className={`
                          border-b border-gray-50 last:border-0
                          transition-colors duration-200
                          ${isCurrentDay
                            ? 'bg-primary-50/60 font-semibold'
                            : 'hover:bg-gray-50'}
                        `}
                      >
                        <td className="px-5 py-2.5 text-gray-700 flex items-center gap-2">
                          {isCurrentDay && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                          )}
                          {h.day}
                        </td>
                        <td className="px-5 py-2.5 text-gray-600">{h.open}</td>
                        <td className="px-5 py-2.5 text-gray-600">{h.close}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Google Map Embed ────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 contact-map-wrapper">
              <iframe
                title="La Maison restaurant location"
                src={RESTAURANT.mapsEmbed}
                className="w-full h-56 md:h-64 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* ── Social Media ───────────────────────── */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="social-icon"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
             RIGHT COLUMN — contact form
             ══════════════════════════════════════════════ */}
          <div className="lg:col-span-7 fade-in-right">
            <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-md border border-gray-100 relative overflow-hidden">
              {/* decorative gold corner */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary-100/40 rounded-full blur-2xl pointer-events-none" />

              <h3 className="font-heading text-xl font-bold text-dark mb-1">
                Send Us a Message
              </h3>
              <p className="text-gray-400 text-sm mb-7">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              {/* ── Success overlay ─────────────────── */}
              {status === 'success' && (
                <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center px-8 text-center animate-[fade-in_0.4s_ease]">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-[scale-pop_0.5s_ease]">
                    <HiCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-heading text-xl font-bold text-dark mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    Thank you for reaching out. Our team will respond to your inquiry shortly.
                  </p>
                  <button onClick={resetForm} className="btn-outline text-sm py-2.5 px-6">
                    Send Another Message
                  </button>
                </div>
              )}

              {/* ── Server error banner ─────────────── */}
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-[fade-in_0.3s_ease]">
                  <HiExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-sm">
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}

              {/* ── Form ────────────────────────────── */}
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field id="name" label="Full Name" error={errors.name} touched={touched.name}>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={status === 'sending'}
                      className={inputCls('name')}
                      placeholder="John Doe"
                    />
                  </Field>

                  <Field id="email" label="Email Address" error={errors.email} touched={touched.email}>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={status === 'sending'}
                      className={inputCls('email')}
                      placeholder="john@example.com"
                    />
                  </Field>
                </div>

                {/* Subject */}
                <Field id="subject" label="Subject" error={errors.subject} touched={touched.subject}>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={status === 'sending'}
                    className={inputCls('subject')}
                    placeholder="Reservation inquiry, event booking, feedback…"
                  />
                </Field>

                {/* Message */}
                <Field id="message" label="Message" error={errors.message} touched={touched.message}>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={status === 'sending'}
                    maxLength={MAX_MESSAGE}
                    rows={5}
                    className={`${inputCls('message')} resize-none`}
                    placeholder="Tell us how we can help…"
                  />
                  <div className="flex justify-end mt-1">
                    <span
                      className={`text-xs transition-colors ${
                        msgRemaining < 50
                          ? msgRemaining < 20
                            ? 'text-red-500'
                            : 'text-amber-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {msgRemaining} / {MAX_MESSAGE}
                    </span>
                  </div>
                </Field>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="
                    btn-primary w-full text-center
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-2
                  "
                >
                  {status === 'sending' ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
