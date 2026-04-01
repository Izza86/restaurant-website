import { Reservations, ContactSection, SEO } from '@components';

const ContactPage = () => {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with La Maison. Visit us at 123 Gourmet Avenue, call (212) 555-1234, or send us a message."
      />
      {/* Page Banner */}
      <section
        className="relative h-72 md:h-96 flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-3">
            Contact Us
          </h1>
          <p className="text-gray-300 text-lg">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <ContactSection />
      <Reservations />
    </>
  );
};

export default ContactPage;
