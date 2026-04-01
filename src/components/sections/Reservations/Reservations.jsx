import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import SectionHeader from '../../common/SectionHeader';
import { addReservation as saveReservationToFirestore } from '../../../services/firestoreService';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChatAlt2,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  AVAILABLE TIME SLOTS                                            ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const timeSlots = [
  { value: '11:00', label: '11:00 AM', period: 'Lunch' },
  { value: '11:30', label: '11:30 AM', period: 'Lunch' },
  { value: '12:00', label: '12:00 PM', period: 'Lunch' },
  { value: '12:30', label: '12:30 PM', period: 'Lunch' },
  { value: '13:00', label: '1:00 PM',  period: 'Lunch' },
  { value: '13:30', label: '1:30 PM',  period: 'Lunch' },
  { value: '17:00', label: '5:00 PM',  period: 'Dinner' },
  { value: '17:30', label: '5:30 PM',  period: 'Dinner' },
  { value: '18:00', label: '6:00 PM',  period: 'Dinner' },
  { value: '18:30', label: '6:30 PM',  period: 'Dinner' },
  { value: '19:00', label: '7:00 PM',  period: 'Dinner' },
  { value: '19:30', label: '7:30 PM',  period: 'Dinner' },
  { value: '20:00', label: '8:00 PM',  period: 'Dinner' },
  { value: '20:30', label: '8:30 PM',  period: 'Dinner' },
  { value: '21:00', label: '9:00 PM',  period: 'Dinner' },
];

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  INITIAL FORM STATE                                              ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  specialRequests: '',
};

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  VALIDATION HELPERS                                              ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const validators = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(v.trim())) return 'Name contains invalid characters';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address';
    return '';
  },
  phone: (v) => {
    if (!v.trim()) return 'Phone number is required';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number';
    return '';
  },
  date: (v) => {
    if (!v) return 'Please select a reservation date';
    const selected = new Date(v + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return 'Date cannot be in the past';
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (selected > maxDate) return 'Reservations can be made up to 3 months ahead';
    return '';
  },
  time: (v) => {
    if (!v) return 'Please select a reservation time';
    return '';
  },
  guests: (v) => {
    if (!v) return 'Please select party size';
    return '';
  },
};

const validateAll = (data) => {
  const errs = {};
  Object.keys(validators).forEach((key) => {
    const msg = validators[key](data[key]);
    if (msg) errs[key] = msg;
  });
  return errs;
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  FORM FIELD WRAPPER — label, icon, error message                 ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const Field = ({ label, icon: Icon, error, touched, children, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-300 mb-1.5 tracking-wide">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none
            transition-colors duration-300
            ${error && touched ? 'text-red-400' : 'text-primary-500'}
          `}
        />
      )}
      {children}
    </div>
    {/* error message */}
    <div
      className={`
        overflow-hidden transition-all duration-300 ease-out
        ${error && touched ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0 mt-0'}
      `}
    >
      <p className="flex items-center gap-1 text-red-400 text-xs">
        <HiOutlineExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {error}
      </p>
    </div>
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  LOADING SPINNER                                                 ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const Spinner = () => (
  <svg
    className="animate-spin w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  SUCCESS OVERLAY                                                 ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const SuccessOverlay = ({ data, onReset }) => (
  <div className="
    absolute inset-0 z-20 flex flex-col items-center justify-center
    bg-dark-light/95 backdrop-blur-md rounded-3xl
    animate-[fade-in_0.5s_ease-out_forwards]
    p-8 text-center
  ">
    {/* animated checkmark */}
    <div className="
      w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400
      flex items-center justify-center mb-6
      animate-[scale-pop_0.5s_ease-out_forwards]
    ">
      <HiOutlineCheckCircle className="w-10 h-10 text-green-400" />
    </div>

    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
      Reservation Confirmed!
    </h3>
    <p className="text-gray-400 mb-6 max-w-md">
      Thank you, <span className="text-primary-400 font-semibold">{data.name}</span>.
      Your table has been reserved. A confirmation will be sent to{' '}
      <span className="text-primary-400 font-semibold">{data.email}</span>.
    </p>

    {/* booking summary */}
    <div className="
      bg-dark/50 border border-gray-700/50 rounded-2xl p-5 mb-8
      grid grid-cols-2 sm:grid-cols-3 gap-4 text-left max-w-md w-full
    ">
      {[
        { icon: HiOutlineCalendar, label: 'Date', value: new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
        { icon: HiOutlineClock, label: 'Time', value: timeSlots.find((t) => t.value === data.time)?.label || data.time },
        { icon: HiOutlineUserGroup, label: 'Guests', value: `${data.guests} ${data.guests === '1' ? 'Guest' : 'Guests'}` },
      ].map(({ icon: Ic, label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <Ic className="w-5 h-5 text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-wider text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
          </div>
        </div>
      ))}
    </div>

    <button
      onClick={onReset}
      className="
        inline-flex items-center gap-2
        text-primary-400 hover:text-primary-300
        font-semibold text-sm uppercase tracking-wider
        transition-colors duration-300
      "
    >
      <HiOutlineRefresh className="w-4 h-4" />
      Make Another Reservation
    </button>
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  RESERVATIONS — main component                                   ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const Reservations = () => {
  /* ── state ──────────────────────────────────────────── */
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [status, setStatus]     = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [serverError, setServerError] = useState('');
  const [confirmedData, setConfirmedData] = useState(null);
  const formRef = useRef(null);

  /* ── derived ────────────────────────────────────────── */
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  /* ── handlers ───────────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // live-validate touched fields
    setErrors((prev) => {
      if (!touched[name]) return prev;
      const msg = validators[name]?.(value) || '';
      return { ...prev, [name]: msg };
    });
    // clear server error on any change
    if (serverError) setServerError('');
  }, [touched, serverError]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validators[name]?.(value) || '';
    setErrors((prev) => ({ ...prev, [name]: msg }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // touch all fields
    const allTouched = {};
    Object.keys(initialForm).forEach((k) => { allTouched[k] = true; });
    setTouched(allTouched);

    // validate
    const validationErrors = validateAll(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // focus first error field
      const firstKey = Object.keys(validationErrors)[0];
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    // Save to Firestore
    setStatus('submitting');
    setServerError('');

    try {
      await saveReservationToFirestore(formData);

      setConfirmedData({ ...formData });
      setStatus('success');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, [formData]);

  const handleReset = useCallback(() => {
    setFormData(initialForm);
    setErrors({});
    setTouched({});
    setStatus('idle');
    setServerError('');
    setConfirmedData(null);
  }, []);

  /* ── character count for special requests ───────────── */
  const requestsMax = 300;
  const requestsLeft = requestsMax - formData.specialRequests.length;

  /* ── input class builder ────────────────────────────── */
  const inputCls = (name) => `
    form-input-dark pl-12
    ${errors[name] && touched[name] ? '!border-red-400/70 !ring-red-400/20' : ''}
  `;

  const selectCls = (name) => `
    form-input-dark pl-12 appearance-none cursor-pointer
    ${errors[name] && touched[name] ? '!border-red-400/70 !ring-red-400/20' : ''}
  `;

  /* ── is form submittable ────────────────────────────── */
  const isSubmitting = status === 'submitting';

  return (
    <section
      id="reservations"
      className="section-padding bg-dark text-white relative overflow-hidden"
    >
      {/* ── Decorative background blobs ───────────────── */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-burgundy rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeader
          title="Reserve a Table"
          subtitle="Book your dining experience and let us prepare something truly special for you."
          light
        />

        {/* ═══════════════════════════════════════════════════
           FORM CARD
           ═══════════════════════════════════════════════════ */}
        <div className="relative max-w-3xl mx-auto">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="
              relative bg-dark-light/50 backdrop-blur-sm rounded-3xl
              p-6 sm:p-8 md:p-12
              shadow-2xl border border-gray-700/50
              transition-all duration-500
            "
          >
            {/* ── form header ─────────────────────────────── */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <HiOutlineCalendar className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Book Your Table
                </h3>
                <p className="text-xs text-gray-500">All fields marked are required</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* ── Full Name ─────────────────────────────── */}
              <Field
                label="Full Name *"
                icon={HiOutlineUser}
                error={errors.name}
                touched={touched.name}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isSubmitting}
                  className={inputCls('name')}
                />
              </Field>

              {/* ── Email ─────────────────────────────────── */}
              <Field
                label="Email Address *"
                icon={HiOutlineMail}
                error={errors.email}
                touched={touched.email}
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={inputCls('email')}
                />
              </Field>

              {/* ── Phone ─────────────────────────────────── */}
              <Field
                label="Phone Number *"
                icon={HiOutlinePhone}
                error={errors.phone}
                touched={touched.phone}
              >
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  className={inputCls('phone')}
                />
              </Field>

              {/* ── Party Size ────────────────────────────── */}
              <Field
                label="Party Size *"
                icon={HiOutlineUserGroup}
                error={errors.guests}
                touched={touched.guests}
              >
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={selectCls('guests')}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={String(n)}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                  <option value="9+">9+ Guests — Private Dining</option>
                </select>
                {/* custom dropdown arrow */}
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Field>

              {/* ── Date ──────────────────────────────────── */}
              <Field
                label="Reservation Date *"
                icon={HiOutlineCalendar}
                error={errors.date}
                touched={touched.date}
              >
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={today}
                  max={maxDate}
                  disabled={isSubmitting}
                  className={`${inputCls('date')} calendar-dark`}
                />
              </Field>

              {/* ── Time ──────────────────────────────────── */}
              <Field
                label="Reservation Time *"
                icon={HiOutlineClock}
                error={errors.time}
                touched={touched.time}
              >
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={selectCls('time')}
                >
                  <option value="">Select a time</option>
                  <optgroup label="🌤  Lunch Service">
                    {timeSlots.filter((t) => t.period === 'Lunch').map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🌙  Dinner Service">
                    {timeSlots.filter((t) => t.period === 'Dinner').map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </optgroup>
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Field>

              {/* ── Special Requests ──────────────────────── */}
              <Field
                label="Special Requests"
                icon={HiOutlineChatAlt2}
                error={null}
                touched={false}
                className="md:col-span-2"
              >
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Allergies, celebrations, seating preferences, dietary needs…"
                  rows={3}
                  maxLength={requestsMax}
                  disabled={isSubmitting}
                  className="form-input-dark pl-12 resize-none"
                />
                <p className={`text-xs mt-1 text-right ${requestsLeft < 30 ? 'text-amber-400' : 'text-gray-600'}`}>
                  {requestsLeft} characters remaining
                </p>
              </Field>
            </div>

            {/* ── server error banner ─────────────────────── */}
            <div
              className={`
                overflow-hidden transition-all duration-400 ease-out
                ${serverError ? 'max-h-24 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}
              `}
            >
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <HiOutlineExclamationCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-300 text-sm font-semibold">Submission Failed</p>
                  <p className="text-red-400/80 text-xs">{serverError}</p>
                </div>
              </div>
            </div>

            {/* ── submit button ────────────────────────────── */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  group relative inline-flex items-center justify-center gap-2.5
                  min-w-[220px] px-10 py-4 rounded-full
                  font-bold text-sm sm:text-base uppercase tracking-wider
                  transition-all duration-400 overflow-hidden
                  ${isSubmitting
                    ? 'bg-primary-700 text-white/70 cursor-wait'
                    : 'bg-primary-500 text-charcoal hover:bg-primary-400 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(212,175,55,0.45)] active:translate-y-0 active:scale-[0.97]'}
                  shadow-[0_0_24px_rgba(212,175,55,0.3)]
                `}
              >
                {/* shimmer */}
                {!isSubmitting && (
                  <span className="
                    absolute inset-0 -translate-x-full
                    bg-gradient-to-r from-transparent via-white/25 to-transparent
                    group-hover:translate-x-full transition-transform duration-700
                  " />
                )}

                {isSubmitting ? (
                  <>
                    <Spinner />
                    <span className="relative z-10">Confirming…</span>
                  </>
                ) : (
                  <>
                    <HiOutlineCalendar className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Reserve Now</span>
                  </>
                )}
              </button>

              <p className="text-gray-600 text-xs mt-4">
                By reserving you agree to our cancellation policy.
                Free cancellation up to 24 hours before your booking.
              </p>
            </div>
          </form>

          {/* ── success overlay ────────────────────────── */}
          {status === 'success' && confirmedData && (
            <SuccessOverlay data={confirmedData} onReset={handleReset} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Reservations;
