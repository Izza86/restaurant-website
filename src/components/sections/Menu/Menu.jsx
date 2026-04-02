import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../common/SectionHeader';
import { useScrollReveal } from '../../../hooks';
import { getMenuItems as fetchMenuItemsFromFirestore } from '../../../services/firestoreService';
import {
  HiOutlineSearch,
  HiOutlineX,
  HiHeart,
  HiOutlineHeart,
  HiOutlineFire,
  HiOutlineRefresh,
} from 'react-icons/hi';

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DIETARY ICONS — small SVG badges rendered next to each item    ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const dietaryConfig = {
  vegan:       { label: 'Vegan',       emoji: '🌱', color: 'bg-green-100 text-green-700 border-green-300' },
  vegetarian:  { label: 'Vegetarian',  emoji: '🥬', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  glutenFree:  { label: 'Gluten-Free', emoji: '🌾', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  spicy:       { label: 'Spicy',       emoji: '🌶️', color: 'bg-red-50 text-red-700 border-red-300' },
};

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  CATEGORIES                                                      ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const categories = [
  { key: 'All',          label: 'All',          icon: '🍽️' },
  { key: 'Appetizers',   label: 'Appetizers',   icon: '🥗' },
  { key: 'Main Courses', label: 'Main Courses', icon: '🥩' },
  { key: 'Desserts',     label: 'Desserts',     icon: '🍰' },
  { key: 'Beverages',    label: 'Beverages',    icon: '🍷' },
];

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  MENU DATA — 24 curated items (local fallback)                   ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const fallbackMenuItems = [
  /* ── Appetizers (6) ─────────────────────────────────── */
  {
    id: 1,
    name: 'Truffle Bruschetta',
    description: 'Toasted sourdough topped with black truffle, ricotta, and honey drizzle.',
    price: 16,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80',
    popular: true,
    dietary: ['vegetarian'],
  },
  {
    id: 2,
    name: 'Lobster Bisque',
    description: 'Creamy lobster soup finished with cognac and fresh tarragon.',
    price: 19,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    popular: false,
    dietary: ['glutenFree'],
  },
  {
    id: 3,
    name: 'Tuna Tartare',
    description: 'Sashimi-grade tuna with avocado, sesame, ponzu, and crispy wonton.',
    price: 22,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&q=80',
    popular: true,
    dietary: ['glutenFree'],
  },
  {
    id: 4,
    name: 'Burrata Caprese',
    description: 'Creamy burrata with heirloom tomatoes, basil oil, and aged balsamic.',
    price: 18,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80',
    popular: false,
    dietary: ['vegetarian', 'glutenFree'],
  },
  {
    id: 5,
    name: 'Spicy Thai Shrimp',
    description: 'Tiger prawns in lemongrass-chili broth with Thai basil and lime.',
    price: 20,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&q=80',
    popular: false,
    dietary: ['spicy', 'glutenFree'],
  },
  {
    id: 6,
    name: 'Roasted Beetroot Salad',
    description: 'Golden and ruby beets with goat cheese, candied walnuts, and arugula.',
    price: 15,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    popular: false,
    dietary: ['vegetarian', 'glutenFree'],
  },

  /* ── Main Courses (8) ───────────────────────────────── */
  {
    id: 7,
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon with lemon beurre blanc, asparagus, and fingerling potatoes.',
    price: 34,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
    popular: true,
    dietary: ['glutenFree'],
  },
  {
    id: 8,
    name: 'Wagyu Beef Tenderloin',
    description: 'A5 Wagyu with red wine jus, roasted garlic mash, and seasonal vegetables.',
    price: 58,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
    popular: true,
    dietary: ['glutenFree'],
  },
  {
    id: 9,
    name: 'Wild Mushroom Risotto',
    description: 'Arborio rice with porcini, chanterelles, parmesan, and white truffle oil.',
    price: 28,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80',
    popular: false,
    dietary: ['vegetarian', 'glutenFree'],
  },
  {
    id: 10,
    name: 'Herb-Crusted Rack of Lamb',
    description: 'New Zealand lamb with rosemary jus, ratatouille, and gratin dauphinois.',
    price: 46,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    popular: true,
    dietary: ['glutenFree'],
  },
  {
    id: 11,
    name: 'Spicy Szechuan Duck',
    description: 'Crispy duck breast with Szechuan glaze, bok choy, and jasmine rice.',
    price: 38,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&q=80',
    popular: false,
    dietary: ['spicy'],
  },
  {
    id: 12,
    name: 'Mediterranean Sea Bass',
    description: 'Whole roasted branzino with olives, capers, cherry tomatoes, and saffron.',
    price: 36,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
    popular: false,
    dietary: ['glutenFree'],
  },
  {
    id: 13,
    name: 'Vegan Buddha Bowl',
    description: 'Quinoa, roasted sweet potato, avocado, chickpeas, tahini, and pickled veg.',
    price: 24,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    popular: false,
    dietary: ['vegan', 'glutenFree'],
  },
  {
    id: 14,
    name: 'Truffle Pasta Carbonara',
    description: 'Fresh tagliatelle with guanciale, pecorino, egg yolk, and black truffle.',
    price: 32,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    popular: true,
    dietary: [],
  },

  /* ── Desserts (6) ───────────────────────────────────── */
  {
    id: 15,
    name: 'Crème Brûlée',
    description: 'Classic vanilla bean custard with caramelised sugar and fresh berries.',
    price: 14,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80',
    popular: true,
    dietary: ['vegetarian', 'glutenFree'],
  },
  {
    id: 16,
    name: 'Chocolate Lava Cake',
    description: 'Rich Valrhona chocolate with a molten centre, served with vanilla gelato.',
    price: 16,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
    popular: true,
    dietary: ['vegetarian'],
  },
  {
    id: 17,
    name: 'Tiramisu',
    description: 'Classic Italian layered mascarpone, espresso-soaked ladyfingers, and cocoa.',
    price: 15,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
    popular: false,
    dietary: ['vegetarian'],
  },
  {
    id: 18,
    name: 'Panna Cotta',
    description: 'Silky vanilla panna cotta with passion fruit coulis and mango.',
    price: 13,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    popular: false,
    dietary: ['vegetarian', 'glutenFree'],
  },
  {
    id: 19,
    name: 'Pistachio Soufflé',
    description: 'Light and airy pistachio soufflé with crème anglaise.',
    price: 17,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80',
    popular: false,
    dietary: ['vegetarian'],
  },
  {
    id: 20,
    name: 'Mango Sorbet Trio',
    description: 'Three artisan sorbets — mango, raspberry, and lemon — with tuile wafer.',
    price: 12,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80',
    popular: false,
    dietary: ['vegan', 'glutenFree'],
  },

  /* ── Beverages (4) ──────────────────────────────────── */
  {
    id: 21,
    name: 'Signature Old Fashioned',
    description: 'Bourbon, Demerara syrup, Angostura bitters, and a flamed orange twist.',
    price: 18,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80',
    popular: true,
    dietary: ['vegan', 'glutenFree'],
  },
  {
    id: 22,
    name: 'Espresso Martini',
    description: 'Vodka, fresh espresso, Kahlúa, and vanilla bean with a coffee-rim finish.',
    price: 17,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
    popular: true,
    dietary: ['vegan'],
  },
  {
    id: 23,
    name: 'Lavender Lemonade',
    description: 'House-made lemonade infused with Provençal lavender and sparkling water.',
    price: 9,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    popular: false,
    dietary: ['vegan', 'glutenFree'],
  },
  {
    id: 24,
    name: 'Sommelier\'s Red Selection',
    description: 'Rotating premium red wine chosen by our Master Sommelier. Ask for pairing.',
    price: 22,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    popular: false,
    dietary: ['vegan', 'glutenFree'],
  },
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DIETARY TAG BADGE                                               ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const DietaryBadge = ({ tag }) => {
  const cfg = dietaryConfig[tag];
  if (!cfg) return null;
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        text-[0.65rem] font-semibold border
        ${cfg.color}
      `}
      title={cfg.label}
    >
      <span className="text-xs">{cfg.emoji}</span>
      {cfg.label}
    </span>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  MENU CARD                                                       ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const MenuCard = ({ item, isFav, onToggleFav, index }) => (
  <div
    className="group menu-card menu-card-enter flex flex-col"
    style={{ animationDelay: `${(index % 6) * 0.08}s` }}
  >
    {/* ── Image ────────────────────────────────────────── */}
    <div className="relative overflow-hidden h-52 sm:h-48 lg:h-52">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-700"
        loading="lazy"
      />

      {/* overlay on hover — shows description */}
      <div className="
        absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
        flex flex-col justify-end p-4
      ">
        <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>

      {/* popular badge */}
      {item.popular && <span className="popular-badge">Popular</span>}

      {/* favourite heart */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(item.id); }}
        aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        className={`
          absolute top-3 left-3 z-10
          w-9 h-9 rounded-full flex items-center justify-center
          backdrop-blur-md transition-all duration-300
          ${isFav
            ? 'bg-red-500/90 text-white shadow-lg scale-110'
            : 'bg-white/20 text-white hover:bg-white/40'}
          hover:scale-125 active:scale-95
        `}
      >
        {isFav ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
      </button>

      {/* category pill */}
      <span className="
        absolute bottom-3 left-3
        text-[0.6rem] uppercase tracking-wider font-bold
        bg-charcoal/70 backdrop-blur-sm text-white
        px-2.5 py-1 rounded-full
        opacity-0 group-hover:opacity-100
        translate-y-2 group-hover:translate-y-0
        transition-all duration-300
      ">
        {item.category}
      </span>
    </div>

    {/* ── Details ──────────────────────────────────────── */}
    <div className="flex flex-col flex-1 p-5">
      {/* name + price */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-heading text-lg font-semibold text-dark leading-snug group-hover:text-primary-700 transition-colors duration-300">
          {item.name}
        </h3>
        <span className="price-tag whitespace-nowrap">${item.price}</span>
      </div>

      {/* description (visible on non-hover / mobile) */}
      <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2 lg:group-hover:opacity-60 transition-opacity duration-300">
        {item.description}
      </p>

      {/* spacer to push tags to bottom */}
      <div className="mt-auto" />

      {/* dietary tags */}
      {item.dietary.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
          {item.dietary.map((tag) => (
            <DietaryBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  </div>
);


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  NORMALIZE — coerce Firestore docs into the local item shape     ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const normalizeMenuItem = (doc) => ({
  id:          doc.id ?? doc._id ?? Math.random(),
  name:        doc.name        || 'Untitled Dish',
  description: doc.description || '',
  price:       typeof doc.price === 'number' ? doc.price : Number(doc.price) || 0,
  category:    doc.category    || 'Main Courses',
  image:       doc.image       || doc.imageUrl || '',
  popular:     Boolean(doc.popular ?? doc.isFeatured ?? false),
  dietary:     Array.isArray(doc.dietary)
                 ? doc.dietary
                 : Array.isArray(doc.dietaryTags)
                   ? doc.dietaryTags
                   : [],
});


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  MENU SECTION — main exported component                         ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const MenuSection = ({ limit }) => {
  /* ── state ──────────────────────────────────────────── */
  const [menuItems, setMenuItems] = useState(fallbackMenuItems);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('la-maison-favs')) || []; }
    catch { return []; }
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef(null);
  const searchRef = useRef(null);
  const revealRef = useScrollReveal();

  /* ── fetch menu items from Realtime Database ─────────── */
  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        setMenuLoading(true);
        setMenuError(null);
        const raw = await fetchMenuItemsFromFirestore();

        if (!cancelled && raw.length > 0) {
          const dbItems = raw.map(normalizeMenuItem);
          // Categories that already have items in the database
          const dbCategories = new Set(dbItems.map((i) => i.category));
          // Keep fallback items for categories NOT yet in the database
          const keptFallback = fallbackMenuItems.filter(
            (i) => !dbCategories.has(i.category)
          );
          setMenuItems([...dbItems, ...keptFallback]);
        }
        // If DB is empty, keep fallbackMenuItems (initial state)
      } catch (err) {
        console.warn('[Menu] Database unavailable, using local data:', err.message);
        if (!cancelled) {
          setMenuError('Using offline menu. Showing cached items.');
          setMenuItems(fallbackMenuItems);
        }
      } finally {
        if (!cancelled) setMenuLoading(false);
      }
    }

    loadMenu();
    return () => { cancelled = true; };
  }, []);

  /* ── persist favourites ─────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('la-maison-favs', JSON.stringify(favourites));
  }, [favourites]);

  const toggleFav = useCallback((id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  /* ── filtering ──────────────────────────────────────── */
  const filtered = useMemo(() => {
    let items = menuItems;

    // category
    if (activeCategory !== 'All') {
      items = items.filter((i) => i.category === activeCategory);
    }

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.dietary.some((d) => dietaryConfig[d]?.label.toLowerCase().includes(q))
      );
    }

    return items;
  }, [menuItems, activeCategory, searchQuery]);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  /* ── category switch with smooth transition ─────────── */
  const handleCategoryChange = useCallback((key) => {
    if (key === activeCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(key);
      setIsTransitioning(false);
    }, 250);
  }, [activeCategory]);

  /* ── clear search ───────────────────────────────────── */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchRef.current?.focus();
  }, []);

  /* ── result count label ─────────────────────────────── */
  const resultLabel = useMemo(() => {
    if (searchQuery.trim()) {
      return `${displayed.length} result${displayed.length !== 1 ? 's' : ''} for "${searchQuery}"`;
    }
    return null;
  }, [displayed.length, searchQuery]);

  return (
    <section id="menu" className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeader
          title="Our Menu"
          subtitle="Carefully curated dishes that blend traditional flavours with modern culinary artistry."
        />

        {/* ════════════════════════════════════════════════════════
           CONTROLS — Search + Category Filters
           ════════════════════════════════════════════════════════ */}
        {!limit && (
          <div className="mb-10 space-y-6">
            {/* search bar */}
            <div className="max-w-md mx-auto relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients, dietary…"
                className="form-input pl-12 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                  aria-label="Clear search"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* category pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`category-badge inline-flex items-center gap-1.5 ${
                    activeCategory === key ? 'category-badge-active' : ''
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* result count */}
            {resultLabel && (
              <p className="text-center text-sm text-gray-400 italic">
                {resultLabel}
              </p>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
           MENU GRID
           ════════════════════════════════════════════════════════ */}
        {/* Loading skeleton */}
        {menuLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: limit || 6 }).map((_, i) => (
              <div key={i} className="menu-card animate-pulse flex flex-col">
                <div className="h-52 sm:h-48 lg:h-52 bg-gray-200 rounded-t-xl" />
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-5 bg-gray-200 rounded w-14" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-4/5" />
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <div className="h-5 bg-gray-100 rounded-full w-16" />
                    <div className="h-5 bg-gray-100 rounded-full w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offline/error notice */}
        {menuError && !menuLoading && (
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl py-3 px-5 max-w-lg mx-auto">
            <HiOutlineRefresh className="w-4 h-4 flex-shrink-0" />
            {menuError}
          </div>
        )}

        {!menuLoading && (<>
        <div
          ref={(node) => {
            gridRef.current = node;
            // combine with revealRef
            if (typeof revealRef === 'function') revealRef(node);
            else if (revealRef) revealRef.current = node;
          }}
          className={`
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7
            transition-opacity duration-300
            ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
          `}
          style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
        >
          {displayed.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              index={index}
              isFav={favourites.includes(item.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>

        {/* ── empty state ─────────────────────────────────── */}
        {displayed.length === 0 && (
          <div className="text-center py-20">
            <HiOutlineFire className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading text-xl text-gray-400 mb-2">No dishes found</p>
            <p className="text-sm text-gray-400 mb-6">
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="btn-outline text-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── "View Full Menu" link on home page ──────────── */}
        {limit && displayed.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
              View Full Menu
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  );
};

export { fallbackMenuItems, categories };
export default MenuSection;
