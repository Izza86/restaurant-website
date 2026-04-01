import { useState, useEffect } from 'react';
import { MenuSection, SEO } from '@components';

const MenuPage = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setLoaded(true)); }, []);

  return (
    <>
      <SEO
        title="Menu"
        description="Explore La Maison's exquisite menu — appetizers, entrées, desserts, and signature cocktails crafted by our Michelin-starred chefs."
      />
      {/* Page Banner */}
      <section
        className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center relative z-10">
          <p
            className={`font-accent text-primary-300 tracking-[0.3em] uppercase text-sm mb-3
              transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '200ms' }}
          >
            Savour Every Bite
          </p>
          <h1
            className={`font-heading text-4xl md:text-6xl font-bold text-white mb-3
              transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '350ms' }}
          >
            Our <span className="text-gold-gradient">Menu</span>
          </h1>
          <p
            className={`text-gray-300 text-lg max-w-md mx-auto
              transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            Discover our carefully crafted culinary offerings
          </p>
        </div>
      </section>

      {/* Full Menu */}
      <MenuSection />
    </>
  );
};

export default MenuPage;
