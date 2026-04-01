import { Reservations as ReservationsSection, SEO } from '@components';

const ReservationsPage = () => {
  return (
    <>
      <SEO
        title="Reservations"
        description="Reserve your table at La Maison. Book online for an unforgettable fine dining experience in New York's Culinary District."
      />
      {/* Page Banner */}
      <section
        className="relative h-72 md:h-96 flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center relative z-10">
          <p className="font-accent text-primary-300 tracking-[0.3em] uppercase text-sm mb-3">
            Book Your Experience
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-3">
            Reservations
          </h1>
          <p className="text-gray-300 text-lg max-w-lg mx-auto">
            Reserve your table and let us create something unforgettable
          </p>
        </div>
      </section>

      {/* Reservation Form Section */}
      <ReservationsSection />
    </>
  );
};

export default ReservationsPage;
