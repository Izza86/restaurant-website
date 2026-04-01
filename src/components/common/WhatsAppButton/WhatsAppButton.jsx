import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/* ═══════════════════════════════════════════════════════════════════
   WHATSAPP FLOATING BUTTON
   Shown on every page (placed in Layout).
   Update PHONE_NUMBER with the restaurant owner's WhatsApp number.
   ═══════════════════════════════════════════════════════════════════ */

const PHONE_NUMBER = '923001234567'; // ← Replace with real number (country code, no +, no dashes)
const DEFAULT_MESSAGE = "Hi! I'd like to make an inquiry about La Maison.";

const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  /* show after short delay so it doesn't cover the hero CTA */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  /* stop pulse after 10s */
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 12000);
    return () => clearTimeout(t);
  }, []);

  const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-[#25D366] text-white
        flex items-center justify-center
        shadow-[0_4px_20px_rgba(37,211,102,0.4)]
        hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)]
        hover:scale-110 active:scale-95
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
      `}
    >
      {/* pulse ring */}
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      )}
      <FaWhatsapp className="w-7 h-7 relative z-10" />
    </a>
  );
};

export default WhatsAppButton;
