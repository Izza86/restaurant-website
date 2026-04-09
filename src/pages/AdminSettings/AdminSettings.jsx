import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getSettings,
  updateSettings,
  DEFAULT_SETTINGS,
} from '../../services/firestoreService';
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlineChat,
  HiOutlineInformationCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  PASSWORD GATE  (same pattern as AdminMenu)                      ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const PasswordGate = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminPw = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPw) {
      setError('VITE_ADMIN_PASSWORD is not set in your .env file.');
      return;
    }

    if (password === adminPw) {
      onAuth(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10 w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <HiOutlineLockClosed className="w-7 h-7 text-primary-600" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-center text-dark mb-1">
          Admin Settings
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter the admin password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              className="form-input pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPw ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-center">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  FIELD CONFIG — describes every editable field                   ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const FIELD_SECTIONS = [
  {
    title: 'Contact Information',
    icon: HiOutlinePhone,
    fields: [
      { key: 'phone',    label: 'Phone Number 1',      type: 'text', placeholder: '04 570 1603',         icon: HiOutlinePhone },
      { key: 'phoneTel', label: 'Phone 1 (tel: format)', type: 'text', placeholder: '+97145701603',       icon: HiOutlinePhone },
      { key: 'phone2',   label: 'Phone Number 2',      type: 'text', placeholder: '052 384 0692',        icon: HiOutlinePhone },
      { key: 'phone2Tel',label: 'Phone 2 (tel: format)', type: 'text', placeholder: '+971523840692',      icon: HiOutlinePhone },
      { key: 'email',    label: 'Email Address',        type: 'email', placeholder: 'email@example.com',  icon: HiOutlineMail },
    ],
  },
  {
    title: 'Address & Map',
    icon: HiOutlineLocationMarker,
    fields: [
      { key: 'address',  label: 'Street Address', type: 'text',     placeholder: '4th St - Al Murar',    icon: HiOutlineLocationMarker },
      { key: 'city',     label: 'City / Country', type: 'text',     placeholder: 'Dubai, UAE',            icon: HiOutlineGlobe },
      { key: 'mapsLink', label: 'Google Maps Link', type: 'url',    placeholder: 'https://goo.gl/maps/…', icon: HiOutlineLocationMarker },
      { key: 'mapsEmbed',label: 'Google Maps Embed URL', type: 'url', placeholder: 'https://maps.google.com/maps?…', icon: HiOutlineGlobe },
    ],
  },
  {
    title: 'WhatsApp',
    icon: FaWhatsapp,
    fields: [
      { key: 'whatsappNumber',  label: 'WhatsApp Number (with country code, no +)', type: 'text', placeholder: '971523840692', icon: FaWhatsapp },
      { key: 'whatsappMessage', label: 'Default WhatsApp Message', type: 'text', placeholder: "Hi! I'd like to make an inquiry…", icon: HiOutlineChat },
    ],
  },
  {
    title: 'Social Media Links',
    icon: HiOutlineGlobe,
    fields: [
      { key: 'facebook',  label: 'Facebook URL',  type: 'url', placeholder: 'https://facebook.com/yourpage',  icon: FaFacebookF },
      { key: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/yourpage', icon: FaInstagram },
      { key: 'tiktok',    label: 'TikTok URL',    type: 'url', placeholder: 'https://tiktok.com/@yourpage',   icon: FaTiktok },
      { key: 'twitter',   label: 'Twitter / X URL', type: 'url', placeholder: 'https://twitter.com/yourpage', icon: FaTwitter },
    ],
  },
  {
    title: 'Working Hours',
    icon: HiOutlineClock,
    fields: [
      { key: 'hours', label: 'Working Hours Text', type: 'text', placeholder: 'Open 24/7', icon: HiOutlineClock },
    ],
  },
  {
    title: 'About / Description',
    icon: HiOutlineInformationCircle,
    fields: [
      { key: 'aboutText', label: 'Restaurant Description', type: 'textarea', placeholder: 'A short description for SEO & about section…', icon: HiOutlineInformationCircle },
    ],
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ADMIN SETTINGS PAGE                                             ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const AdminSettings = () => {
  const [authed, setAuthed] = useState(false);
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);   // { type: 'success'|'error', message }
  const [dirty, setDirty] = useState(false);

  /* ── Load settings from Firebase on mount ──────────────────── */
  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
      setDirty(false);
    } catch {
      setToast({ type: 'error', message: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadSettings();
  }, [authed]);

  /* ── Auto-dismiss toast ────────────────────────────────────── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Handle field change ───────────────────────────────────── */
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  /* ── Save settings to Firebase ─────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      setToast({ type: 'success', message: 'Settings saved successfully!' });
      setDirty(false);
    } catch (err) {
      setToast({ type: 'error', message: `Save failed: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  /* ── Reset to defaults ─────────────────────────────────────── */
  const handleReset = () => {
    if (!window.confirm('Reset all settings to default values? Unsaved changes will be lost.')) return;
    setSettings({ ...DEFAULT_SETTINGS });
    setDirty(true);
  };

  /* ── Password gate ─────────────────────────────────────────── */
  if (!authed) return <PasswordGate onAuth={setAuthed} />;

  /* ── Loading state ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/menu"
              className="text-gray-400 hover:text-gray-700 transition-colors"
              title="Back to Menu Manager"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading text-lg sm:text-xl font-bold text-dark">
              Restaurant Settings
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/menu"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Menu Manager
            </Link>
            <Link
              to="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              title="Reset to defaults"
            >
              <HiOutlineRefresh className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <HiOutlineSave className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Toast notification ───────────────────────────────── */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {toast.type === 'success'
              ? <HiOutlineCheckCircle className="w-5 h-5" />
              : <HiOutlineExclamationCircle className="w-5 h-5" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* ── Settings form ────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {FIELD_SECTIONS.map((section) => {
          const SectionIcon = section.icon;
          return (
            <section
              key={section.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* section header */}
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
                <SectionIcon className="w-5 h-5 text-primary-500" />
                <h2 className="font-heading font-semibold text-gray-800">
                  {section.title}
                </h2>
              </div>

              {/* fields */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.fields.map((field) => {
                  const FieldIcon = field.icon;
                  const isTextarea = field.type === 'textarea';
                  const isFullWidth = isTextarea || field.key === 'mapsEmbed' || field.key === 'mapsLink' || field.key === 'whatsappMessage';

                  return (
                    <div
                      key={field.key}
                      className={isFullWidth ? 'md:col-span-2' : ''}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <span className="inline-flex items-center gap-1.5">
                          <FieldIcon className="w-3.5 h-3.5 text-gray-400" />
                          {field.label}
                        </span>
                      </label>

                      {isTextarea ? (
                        <textarea
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className="form-input text-sm w-full resize-y"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="form-input text-sm w-full"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ── Bottom save button (mobile friendly) ─────────── */}
        <div className="flex justify-end pb-10">
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="btn-primary text-sm py-2.5 px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <HiOutlineSave className="w-4 h-4" />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
