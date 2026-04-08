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
  { key: 'All',                    label: 'All',                    icon: '🍽️' },
  { key: 'Aaresh Special',         label: 'Aaresh Special',         icon: '⭐' },
  { key: 'Regular Menu',           label: 'Regular Menu',           icon: '🍛' },
  { key: 'Special Karahi',         label: 'Special Karahi',         icon: '🥘' },
  { key: 'Special Daal',           label: 'Special Daal',           icon: '🫕' },
  { key: 'Veg Menu',               label: 'Veg Menu',               icon: '🥬' },
  { key: 'Biryani / Pulao',        label: 'Biryani / Pulao',        icon: '🍚' },
  { key: 'BBQ & Grill',            label: 'BBQ & Grill',            icon: '🔥' },
  { key: 'Chinese & Sea Food',     label: 'Chinese & Sea Food',     icon: '🥡' },
  { key: 'Shawarma & Rolls',       label: 'Shawarma & Rolls',       icon: '🌯' },
  { key: 'Burgers & Sandwiches',   label: 'Burgers & Sandwiches',   icon: '🍔' },
  { key: 'Snacks & Salads',        label: 'Snacks & Salads',        icon: '🥗' },
  { key: 'Roti & Paratha',         label: 'Roti & Paratha',         icon: '🫓' },
  { key: 'Beverages',              label: 'Beverages',              icon: '🥤' },
  { key: 'Meals & Combos',         label: 'Meals & Combos',         icon: '🍱' },
];

/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  MENU DATA — full real menu (local fallback)                     ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const fallbackMenuItems = [
  /* ── Aaresh Special ─────────────────────────────────── */
  { id: 1,  name: 'Kabab Masala',       description: '', price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 2,  name: 'Sarson Ka Saag',     description: '', price: 10, priceDisplay: '10/15', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 3,  name: 'Butter Chicken',     description: '', price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: true,  dietary: [] },
  { id: 4,  name: 'Chicken Achari',     description: '', price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 5,  name: 'Egg / Chicken Noodles', description: '', price: 10, priceDisplay: '10/12', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: [] },
  { id: 6,  name: 'Tikha Masala',       description: '', price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 7,  name: 'Chapli Kabab',       description: '', price: 12, priceDisplay: '12',    category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 8,  name: 'Rosh',               description: '', price: 25, priceDisplay: '25/40', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: [] },
  { id: 9,  name: 'Halwa Puri',         description: '', price: 7,  priceDisplay: '07',    category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 10, name: 'Soup',               description: '', price: 5,  priceDisplay: '05/10', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', popular: false, dietary: [] },
  { id: 11, name: 'Fish Fry',           description: '', price: 22, priceDisplay: '22',    category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', popular: false, dietary: [] },
  { id: 12, name: 'Tawa Qeema',         description: '', price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: false, dietary: ['spicy'] },

  /* ── Regular Menu ───────────────────────────────────── */
  { id: 13, name: 'Paya',               description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 14, name: 'Nihari',             description: '', price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 15, name: 'Alu Ghosht',         description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: [] },
  { id: 16, name: 'Haleem',             description: '', price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 17, name: 'Kadhi Pakora',       description: '', price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 18, name: 'Chana',              description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 19, name: 'Murg Chana',         description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: [] },
  { id: 20, name: 'Egg Chana',          description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: [] },
  { id: 21, name: 'Kofta Chana',        description: '', price: 7,  priceDisplay: '07',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: [] },
  { id: 22, name: 'Kofta Masala',       description: '', price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 23, name: 'Brain Masala',       description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 24, name: 'Qeema',              description: '', price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 25, name: 'Mutton Korma',       description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: [] },
  { id: 26, name: 'Chicken Korma',      description: '', price: 10, priceDisplay: '10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: [] },
  { id: 27, name: 'Omlet',              description: '', price: 3,  priceDisplay: '03/05', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', popular: false, dietary: [] },
  { id: 28, name: 'Cheese Omlet',       description: '', price: 8,  priceDisplay: '08/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', popular: false, dietary: [] },

  /* ── Special Karahi ─────────────────────────────────── */
  { id: 29, name: 'Chicken Karahi',         description: '', price: 20, priceDisplay: '20/35',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 30, name: 'Chicken Handi',          description: '', price: 25, priceDisplay: '25/35',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 31, name: 'Chicken White Handi',    description: '', price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: [] },
  { id: 32, name: 'Chicken BBQ Karahi',     description: '', price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 33, name: 'Chicken Peshawri',       description: '', price: 25, priceDisplay: '25/35',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 34, name: 'Chicken Jalfrezi',       description: '', price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 35, name: 'Mutton Karahi',          description: '', price: 37, priceDisplay: '37/52',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 36, name: 'Mutton Handi',           description: '', price: 37, priceDisplay: '37/52',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 37, name: 'Mutton Peshawari',       description: '', price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 38, name: 'Mutton White Pepper',    description: '', price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: [] },
  { id: 39, name: 'Mutton Black Pepper',    description: '', price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 40, name: 'Beef Karahi',            description: '', price: 30, priceDisplay: '30/45',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: ['spicy'] },

  /* ── Special Daal ───────────────────────────────────── */
  { id: 41, name: 'Daal',               description: '', price: 5,  priceDisplay: '05/07/12', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: true,  dietary: ['vegetarian'] },
  { id: 42, name: 'Daal Makhani',       description: '', price: 10, priceDisplay: '10/15', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: true,  dietary: ['vegetarian'] },
  { id: 43, name: 'Daal Shahi',         description: '', price: 10, priceDisplay: '10/15', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 44, name: 'Daal Chicken',       description: '', price: 10, priceDisplay: '10/15', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: [] },
  { id: 45, name: 'Daal Achaari',       description: '', price: 8,  priceDisplay: '08/15', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['spicy','vegetarian'] },
  { id: 46, name: 'Daal Mutton',        description: '', price: 15, priceDisplay: '15/20', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: [] },

  /* ── Veg Menu ───────────────────────────────────────── */
  { id: 47, name: 'Vegetables',          description: '', price: 5,  priceDisplay: '05/08/15', category: 'Veg Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 48, name: 'Veg with Chicken',    description: '', price: 7,  priceDisplay: '07/10/15', category: 'Veg Menu', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', popular: false, dietary: [] },
  { id: 49, name: 'Veg with Mutton',     description: '', price: 10, priceDisplay: '10/15/18', category: 'Veg Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', popular: false, dietary: [] },

  /* ── Biryani / Pulao ────────────────────────────────── */
  { id: 50, name: 'Chicken Biryani',        description: '', price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 51, name: 'Mutton Biryani',         description: '', price: 15, priceDisplay: '15/20', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 52, name: 'Chicken Pulao',          description: '', price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', popular: false, dietary: [] },
  { id: 53, name: 'Mutton Pulao',           description: '', price: 15, priceDisplay: '15/20', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', popular: false, dietary: [] },
  { id: 54, name: 'Daal Chawal',            description: '', price: 8,  priceDisplay: '08/14', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 55, name: 'Veg Fried Rice',         description: '', price: 10, priceDisplay: '10/15', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 56, name: 'Chicken Fried Rice',     description: '', price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: [] },
  { id: 57, name: 'Afghani Rice',           description: '', price: 10, priceDisplay: '10/15', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', popular: false, dietary: [] },
  { id: 58, name: 'Fish Pulao',             description: '', price: 30, priceDisplay: '30',    category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', popular: false, dietary: [] },
  { id: 59, name: 'Quarter BBQ Rice',       description: '', price: 15, priceDisplay: '15/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: [] },
  { id: 60, name: 'Chicken Makina W. Rice', description: '', price: 18, priceDisplay: '18/38', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: [] },
  { id: 61, name: 'Chicken BBQ W. Rice',    description: '', price: 25, priceDisplay: '25/45', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: true,  dietary: [] },
  { id: 62, name: 'Kabab Rice',             description: '', price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', popular: false, dietary: [] },
  { id: 63, name: 'Fish Rice',              description: '', price: 28, priceDisplay: '28',    category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', popular: false, dietary: [] },
  { id: 64, name: 'Quarter Makina W. Rice', description: '', price: 15, priceDisplay: '15',    category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: [] },

  /* ── BBQ & Grill ────────────────────────────────────── */
  { id: 65,  name: 'Makina Chicken W. Fries (Half)', description: 'Garlic + Hummus + Bread', price: 13, priceDisplay: '13/25', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: true, dietary: [] },
  { id: 66,  name: 'Makina Chicken Combo',           description: 'Cold Drink + Garlic + Hummus + Bread', price: 27, priceDisplay: '27', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: [] },
  { id: 67,  name: 'Chicken Charcoal',    description: 'Fries + Garlic + Hummus + Bread', price: 18, priceDisplay: '18/30', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: true,  dietary: [] },
  { id: 68,  name: 'Green Chilli Charcoal', description: 'Fries + Garlic + Hummus + Bread', price: 20, priceDisplay: '20/35', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 69,  name: 'Black Pepper Charcoal', description: 'Fries + Garlic + Hummus + Bread', price: 20, priceDisplay: '20/35', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 70,  name: 'Mix Charcoal W. Fries', description: '', price: 20, priceDisplay: '20/32', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: false, dietary: [] },
  { id: 71,  name: 'Malai Boti W. Fries (4 PCS)', description: '', price: 12, priceDisplay: '12', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', popular: false, dietary: [] },
  { id: 72,  name: 'Tikha Boti W. Fries (4 PCS)', description: '', price: 10, priceDisplay: '10', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 73,  name: 'Tikka Piece W. Fries', description: '', price: 12, priceDisplay: '12', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', popular: false, dietary: [] },
  { id: 74,  name: 'Kabab W. Fries (2 PCS)', description: '', price: 22, priceDisplay: '22', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', popular: false, dietary: [] },
  { id: 75,  name: 'BBQ Mix Platter',      description: '', price: 35, priceDisplay: '35/65/110', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', popular: true,  dietary: [] },

  /* ── Chinese & Sea Food ─────────────────────────────── */
  { id: 76,  name: 'Veg Manchurian',       description: '', price: 15, priceDisplay: '15', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 77,  name: 'Gobi Manchurian',      description: '', price: 15, priceDisplay: '15', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 78,  name: 'Paneer Manchurian',    description: '', price: 16, priceDisplay: '16', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 79,  name: 'Mutton Manchurian',    description: '', price: 25, priceDisplay: '25', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: [] },
  { id: 80,  name: 'Chicken Manchurian',   description: '', price: 17, priceDisplay: '17', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: true,  dietary: [] },
  { id: 81,  name: 'Chilli Chicken',       description: '', price: 17, priceDisplay: '17', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 82,  name: 'Fish Chilli',          description: 'Normal / Spicy', price: 20, priceDisplay: '20', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', popular: false, dietary: [] },
  { id: 83,  name: 'Prawn Manchurian',     description: 'Normal / Spicy', price: 21, priceDisplay: '21', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', popular: false, dietary: [] },
  { id: 84,  name: 'Prawn Chilli',         description: 'Normal / Spicy', price: 22, priceDisplay: '22', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', popular: false, dietary: [] },

  /* ── Shawarma & Rolls ───────────────────────────────── */
  { id: 85,  name: 'Shawarma (Normal / Spicy)', description: '', price: 6,  priceDisplay: '06', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: true,  dietary: [] },
  { id: 86,  name: 'Shawarma Plate',        description: '', price: 15, priceDisplay: '15', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: false, dietary: [] },
  { id: 87,  name: 'Arabic Shawarma',       description: '', price: 10, priceDisplay: '10', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: false, dietary: [] },
  { id: 88,  name: 'Hassan Mathar',         description: '', price: 8,  priceDisplay: '08', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: false, dietary: [] },
  { id: 89,  name: 'Shawarma with Hummus',  description: '', price: 10, priceDisplay: '10', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: false, dietary: [] },
  { id: 90,  name: 'Paratha Roll',          description: '', price: 5,  priceDisplay: '05', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: false, dietary: [] },
  { id: 91,  name: 'Zinger Shawarma',       description: '', price: 10, priceDisplay: '10', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', popular: false, dietary: [] },

  /* ── Burgers & Sandwiches ───────────────────────────── */
  { id: 92,  name: 'Chicken Burger',    description: '', price: 8,  priceDisplay: '08/12', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', popular: true,  dietary: [] },
  { id: 93,  name: 'Beef Burger',       description: '', price: 12, priceDisplay: '12/15', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', popular: false, dietary: [] },
  { id: 94,  name: 'Zinger Burger',     description: '', price: 14, priceDisplay: '14/20', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', popular: true,  dietary: ['spicy'] },
  { id: 95,  name: 'Fish Burger',       description: '', price: 15, priceDisplay: '15/20', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', popular: false, dietary: [] },
  { id: 96,  name: 'Hot Dog Burger',    description: '', price: 8,  priceDisplay: '08',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', popular: false, dietary: [] },
  { id: 97,  name: 'Veg Burger',        description: '', price: 7,  priceDisplay: '07',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 98,  name: 'Chicken Club',      description: '', price: 15, priceDisplay: '15',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', popular: false, dietary: [] },
  { id: 99,  name: 'Beef Club',         description: '', price: 15, priceDisplay: '15',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', popular: false, dietary: [] },
  { id: 100, name: 'Zinger Club',       description: '', price: 18, priceDisplay: '18',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', popular: false, dietary: ['spicy'] },
  { id: 101, name: 'Hot Dog Club',      description: '', price: 12, priceDisplay: '12',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', popular: false, dietary: [] },
  { id: 102, name: 'Egg Club',          description: '', price: 10, priceDisplay: '10',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', popular: false, dietary: [] },

  /* ── Snacks & Salads ────────────────────────────────── */
  { id: 103, name: 'Samosa',               description: '', price: 3,  priceDisplay: '03',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 104, name: 'Pakora',               description: '', price: 5,  priceDisplay: '05',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 105, name: 'Chana Chaat',          description: '', price: 7,  priceDisplay: '07/10', category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 106, name: 'Samosa Chaat',         description: '', price: 10, priceDisplay: '10/15', category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 107, name: 'Fruit Chaat',          description: '', price: 10, priceDisplay: '10',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 108, name: 'Sweet Kheer',          description: '', price: 7,  priceDisplay: '07',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 109, name: 'Afghani Slice Salad',  description: '', price: 8,  priceDisplay: '08',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 110, name: 'Greek Salad',          description: '', price: 12, priceDisplay: '12',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 111, name: 'Arugula Salad',        description: '', price: 10, priceDisplay: '10',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 112, name: 'Yogurt Cucumber Salad', description: '', price: 10, priceDisplay: '10',   category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', popular: false, dietary: ['vegetarian'] },

  /* ── Roti & Paratha ─────────────────────────────────── */
  { id: 113, name: 'Saada Roti',            description: '', price: 1,    priceDisplay: '01',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 114, name: 'Tawa Roti',             description: '', price: 1.5,  priceDisplay: '1.50', category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 115, name: 'Naan',                  description: '', price: 3,    priceDisplay: '03',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: true,  dietary: ['vegetarian'] },
  { id: 116, name: 'Saada Paratha',         description: '', price: 2,    priceDisplay: '02',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 117, name: 'Aloo Paratha',          description: '', price: 3,    priceDisplay: '03',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 118, name: 'Qeema Paratha',         description: '', price: 8,    priceDisplay: '08',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: [] },
  { id: 119, name: 'Quetta Paratha',        description: '', price: 3,    priceDisplay: '03',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 120, name: 'Tandoori Paratha',      description: '', price: 3,    priceDisplay: '03',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 121, name: 'Chicken Paratha',       description: '', price: 7,    priceDisplay: '07',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: [] },
  { id: 122, name: 'Chicken Cheese Paratha', description: '', price: 8,   priceDisplay: '08',  category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', popular: false, dietary: [] },

  /* ── Beverages ──────────────────────────────────────── */
  { id: 123, name: 'Karak Tea',          description: '', price: 1,    priceDisplay: '01',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', popular: true,  dietary: ['vegetarian'] },
  { id: 124, name: 'Fresh Milk Tea',     description: '', price: 3,    priceDisplay: '03',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 125, name: 'Mint Tea',           description: '', price: 2,    priceDisplay: '02',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 126, name: 'Black Coffee',       description: '', price: 1.5,  priceDisplay: '1.50',  category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 127, name: 'Coffee with Milk',   description: '', price: 3,    priceDisplay: '03',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 128, name: 'Cold Drink 1.5L',    description: '', price: 6,    priceDisplay: '06',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 129, name: 'Cane Cold Drink',    description: '', price: 2,    priceDisplay: '02',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 130, name: 'Water Bottle Small', description: '', price: 1,    priceDisplay: '01',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 131, name: 'Water Bottle 1.5L',  description: '', price: 2,    priceDisplay: '02',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 132, name: 'Laban',              description: '', price: 1,    priceDisplay: '01',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 133, name: 'Pineapple Juice',    description: '', price: 7,    priceDisplay: '07/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 134, name: 'Orange Juice',       description: '', price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 135, name: 'Mango Juice',        description: '', price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: true,  dietary: ['vegetarian'] },
  { id: 136, name: 'Grape Juice',        description: '', price: 8,    priceDisplay: '08/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 137, name: 'Watermelon Juice',   description: '', price: 7,    priceDisplay: '07/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 138, name: 'Avocado Juice',      description: '', price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 139, name: 'Apple Juice',        description: '', price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 140, name: 'Banana Juice',       description: '', price: 7,    priceDisplay: '07/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 141, name: 'Mint Margarita',     description: '', price: 10,   priceDisplay: '10/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: true,  dietary: ['vegetarian'] },
  { id: 142, name: 'Special Juice',      description: '', price: 12,   priceDisplay: '12',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 143, name: 'Cocktail',           description: '', price: 7,    priceDisplay: '07',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 144, name: 'Special Lassi',      description: '', price: 5,    priceDisplay: '05/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', popular: false, dietary: ['vegetarian'] },

  /* ── Meals & Combos ─────────────────────────────────── */
  { id: 145, name: 'Snacks Meal',        description: '2 PCS Chicken + Garlic + 1 Bun + Mayonnaise', price: 10, priceDisplay: '10', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', popular: false, dietary: [] },
  { id: 146, name: 'Dinner Meal',        description: '2 PCS Chicken Fried + Garlic + 1 Bun + Fries + Mayonnaise', price: 15, priceDisplay: '15/20', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', popular: true, dietary: [] },
  { id: 147, name: 'Aresh Special Meal',  description: '4 PCS Chicken Fried + Garlic + 2 Bun + Cold Drink + Mayonnaise', price: 30, priceDisplay: '30', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', popular: true,  dietary: [] },
  { id: 148, name: 'Family Meal',        description: '6 PCS Fried Chicken + Garlic + 3 Bun + Fries + Cold Drink + Mayonnaise', price: 50, priceDisplay: '50', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', popular: true,  dietary: [] },
  { id: 149, name: 'Party Meal',         description: '10 PCS Chicken + Garlic + 10 Bun + Cold Drink + Fries + Mayonnaise', price: 90, priceDisplay: '90', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', popular: false, dietary: [] },
  { id: 150, name: 'Simple Fries',       description: '', price: 5,  priceDisplay: '05/10',  category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 151, name: 'Fries W. Hummus',    description: '', price: 10, priceDisplay: '10/15',  category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 152, name: 'Fries W. Cheese',    description: '', price: 10, priceDisplay: '10/15',  category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 153, name: 'Fries W. Cold Drink', description: '', price: 7, priceDisplay: '07/15', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 154, name: 'White Cream Pasta',  description: '', price: 22, priceDisplay: '22',    category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', popular: false, dietary: ['vegetarian'] },
  { id: 155, name: 'Red Sauce Pasta',    description: '', price: 15, priceDisplay: '15',    category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', popular: false, dietary: ['vegetarian'] },
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
        <span className="price-tag whitespace-nowrap">{item.priceDisplay || item.price} Dhs</span>
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
  priceDisplay: doc.priceDisplay || String(doc.price || ''),
  category:    doc.category    || 'Regular Menu',
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
    try { return JSON.parse(localStorage.getItem('aresh-favs')) || []; }
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
    localStorage.setItem('aresh-favs', JSON.stringify(favourites));
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
