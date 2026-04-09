import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@components';
import { getMenuItems, addOrder } from '../../services/firestoreService';
import {
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineHome,
  HiArrowRight,
} from 'react-icons/hi';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  FALLBACK MENU — full 155-item real menu (if Firebase empty)     ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const FALLBACK_ITEMS = [
  /* ── Aaresh Special ─────────────────────────────────── */
  { id: 'f1',  name: 'Kabab Masala',       price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', available: true },
  { id: 'f2',  name: 'Sarson Ka Saag',     price: 10, priceDisplay: '10/15', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f3',  name: 'Butter Chicken',     price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f4',  name: 'Chicken Achari',     price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f5',  name: 'Egg / Chicken Noodles', price: 10, priceDisplay: '10/12', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f6',  name: 'Tikha Masala',       price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f7',  name: 'Chapli Kabab',       price: 12, priceDisplay: '12',    category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', available: true },
  { id: 'f8',  name: 'Rosh',               price: 25, priceDisplay: '25/40', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f9',  name: 'Halwa Puri',         price: 7,  priceDisplay: '07',    category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f10', name: 'Soup',               price: 5,  priceDisplay: '05/10', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', available: true },
  { id: 'f11', name: 'Fish Fry',           price: 22, priceDisplay: '22',    category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', available: true },
  { id: 'f12', name: 'Tawa Qeema',         price: 15, priceDisplay: '15/22', category: 'Aaresh Special', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },

  /* ── Regular Menu ───────────────────────────────────── */
  { id: 'f13', name: 'Paya',               price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f14', name: 'Nihari',             price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f15', name: 'Alu Ghosht',         price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f16', name: 'Haleem',             price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f17', name: 'Kadhi Pakora',       price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f18', name: 'Chana',              price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f19', name: 'Murg Chana',         price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f20', name: 'Egg Chana',          price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f21', name: 'Kofta Chana',        price: 7,  priceDisplay: '07',       category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f22', name: 'Kofta Masala',       price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f23', name: 'Brain Masala',       price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f24', name: 'Qeema',              price: 7,  priceDisplay: '07/10/15', category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f25', name: 'Mutton Korma',       price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f26', name: 'Chicken Korma',      price: 10, priceDisplay: '10/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f27', name: 'Omlet',              price: 3,  priceDisplay: '03/05',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', available: true },
  { id: 'f28', name: 'Cheese Omlet',       price: 8,  priceDisplay: '08/15',    category: 'Regular Menu', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', available: true },

  /* ── Special Karahi ─────────────────────────────────── */
  { id: 'f29', name: 'Chicken Karahi',         price: 20, priceDisplay: '20/35',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f30', name: 'Chicken Handi',          price: 25, priceDisplay: '25/35',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f31', name: 'Chicken White Handi',    price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f32', name: 'Chicken BBQ Karahi',     price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', available: true },
  { id: 'f33', name: 'Chicken Peshawri',       price: 25, priceDisplay: '25/35',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f34', name: 'Chicken Jalfrezi',       price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f35', name: 'Mutton Karahi',          price: 37, priceDisplay: '37/52',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f36', name: 'Mutton Handi',           price: 37, priceDisplay: '37/52',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f37', name: 'Mutton Peshawari',       price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f38', name: 'Mutton White Pepper',    price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f39', name: 'Mutton Black Pepper',    price: 35, priceDisplay: '35/48',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },
  { id: 'f40', name: 'Beef Karahi',            price: 30, priceDisplay: '30/45',  category: 'Special Karahi', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },

  /* ── Special Daal ───────────────────────────────────── */
  { id: 'f41', name: 'Daal',               price: 5,  priceDisplay: '05/07/12', category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f42', name: 'Daal Makhani',       price: 10, priceDisplay: '10/15',    category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f43', name: 'Daal Shahi',         price: 10, priceDisplay: '10/15',    category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f44', name: 'Daal Chicken',       price: 10, priceDisplay: '10/15',    category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f45', name: 'Daal Achaari',       price: 8,  priceDisplay: '08/15',    category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f46', name: 'Daal Mutton',        price: 15, priceDisplay: '15/20',    category: 'Special Daal', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },

  /* ── Veg Menu ───────────────────────────────────────── */
  { id: 'f47', name: 'Vegetables',          price: 5,  priceDisplay: '05/08/15', category: 'Veg Menu', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f48', name: 'Veg with Chicken',    price: 7,  priceDisplay: '07/10/15', category: 'Veg Menu', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', available: true },
  { id: 'f49', name: 'Veg with Mutton',     price: 10, priceDisplay: '10/15/18', category: 'Veg Menu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', available: true },

  /* ── Biryani / Pulao ────────────────────────────────── */
  { id: 'f50', name: 'Chicken Biryani',        price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', available: true },
  { id: 'f51', name: 'Mutton Biryani',         price: 15, priceDisplay: '15/20', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', available: true },
  { id: 'f52', name: 'Chicken Pulao',          price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', available: true },
  { id: 'f53', name: 'Mutton Pulao',           price: 15, priceDisplay: '15/20', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', available: true },
  { id: 'f54', name: 'Daal Chawal',            price: 8,  priceDisplay: '08/14', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', available: true },
  { id: 'f55', name: 'Veg Fried Rice',         price: 10, priceDisplay: '10/15', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f56', name: 'Chicken Fried Rice',     price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f57', name: 'Afghani Rice',           price: 10, priceDisplay: '10/15', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', available: true },
  { id: 'f58', name: 'Fish Pulao',             price: 30, priceDisplay: '30',    category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', available: true },
  { id: 'f59', name: 'Quarter BBQ Rice',       price: 15, priceDisplay: '15/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f60', name: 'Chicken Makina W. Rice', price: 18, priceDisplay: '18/38', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f61', name: 'Chicken BBQ W. Rice',    price: 25, priceDisplay: '25/45', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f62', name: 'Kabab Rice',             price: 12, priceDisplay: '12/18', category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', available: true },
  { id: 'f63', name: 'Fish Rice',              price: 28, priceDisplay: '28',    category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', available: true },
  { id: 'f64', name: 'Quarter Makina W. Rice', price: 15, priceDisplay: '15',    category: 'Biryani / Pulao', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },

  /* ── BBQ & Grill ────────────────────────────────────── */
  { id: 'f65',  name: 'Makina Chicken W. Fries (Half)', description: 'Garlic + Hummus + Bread', price: 13, priceDisplay: '13/25', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f66',  name: 'Makina Chicken Combo', description: 'Cold Drink + Garlic + Hummus + Bread', price: 27, priceDisplay: '27', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f67',  name: 'Chicken Charcoal',    description: 'Fries + Garlic + Hummus + Bread', price: 18, priceDisplay: '18/30', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f68',  name: 'Green Chilli Charcoal', description: 'Fries + Garlic + Hummus + Bread', price: 20, priceDisplay: '20/35', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f69',  name: 'Black Pepper Charcoal', description: 'Fries + Garlic + Hummus + Bread', price: 20, priceDisplay: '20/35', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f70',  name: 'Mix Charcoal W. Fries', price: 20, priceDisplay: '20/32', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },
  { id: 'f71',  name: 'Malai Boti W. Fries (4 PCS)', price: 12, priceDisplay: '12', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', available: true },
  { id: 'f72',  name: 'Tikha Boti W. Fries (4 PCS)', price: 10, priceDisplay: '10', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', available: true },
  { id: 'f73',  name: 'Tikka Piece W. Fries', price: 12, priceDisplay: '12', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&q=80', available: true },
  { id: 'f74',  name: 'Kabab W. Fries (2 PCS)', price: 22, priceDisplay: '22', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', available: true },
  { id: 'f75',  name: 'BBQ Mix Platter',      price: 35, priceDisplay: '35/65/110', category: 'BBQ & Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', available: true },

  /* ── Chinese & Sea Food ─────────────────────────────── */
  { id: 'f76',  name: 'Veg Manchurian',       price: 15, priceDisplay: '15', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f77',  name: 'Gobi Manchurian',      price: 15, priceDisplay: '15', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f78',  name: 'Paneer Manchurian',    price: 16, priceDisplay: '16', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f79',  name: 'Mutton Manchurian',    price: 25, priceDisplay: '25', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f80',  name: 'Chicken Manchurian',   price: 17, priceDisplay: '17', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f81',  name: 'Chilli Chicken',       price: 17, priceDisplay: '17', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', available: true },
  { id: 'f82',  name: 'Fish Chilli',          description: 'Normal / Spicy', price: 20, priceDisplay: '20', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', available: true },
  { id: 'f83',  name: 'Prawn Manchurian',     description: 'Normal / Spicy', price: 21, priceDisplay: '21', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', available: true },
  { id: 'f84',  name: 'Prawn Chilli',         description: 'Normal / Spicy', price: 22, priceDisplay: '22', category: 'Chinese & Sea Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80', available: true },

  /* ── Shawarma & Rolls ───────────────────────────────── */
  { id: 'f85',  name: 'Shawarma (Normal / Spicy)', price: 6,  priceDisplay: '06', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },
  { id: 'f86',  name: 'Shawarma Plate',        price: 15, priceDisplay: '15', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },
  { id: 'f87',  name: 'Arabic Shawarma',       price: 10, priceDisplay: '10', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },
  { id: 'f88',  name: 'Hassan Mathar',         price: 8,  priceDisplay: '08', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },
  { id: 'f89',  name: 'Shawarma with Hummus',  price: 10, priceDisplay: '10', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },
  { id: 'f90',  name: 'Paratha Roll',          price: 5,  priceDisplay: '05', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },
  { id: 'f91',  name: 'Zinger Shawarma',       price: 10, priceDisplay: '10', category: 'Shawarma & Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', available: true },

  /* ── Burgers & Sandwiches ───────────────────────────── */
  { id: 'f92',  name: 'Chicken Burger',    price: 8,  priceDisplay: '08/12', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
  { id: 'f93',  name: 'Beef Burger',       price: 12, priceDisplay: '12/15', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
  { id: 'f94',  name: 'Zinger Burger',     price: 14, priceDisplay: '14/20', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
  { id: 'f95',  name: 'Fish Burger',       price: 15, priceDisplay: '15/20', category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
  { id: 'f96',  name: 'Hot Dog Burger',    price: 8,  priceDisplay: '08',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
  { id: 'f97',  name: 'Veg Burger',        price: 7,  priceDisplay: '07',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
  { id: 'f98',  name: 'Chicken Club',      price: 15, priceDisplay: '15',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', available: true },
  { id: 'f99',  name: 'Beef Club',         price: 15, priceDisplay: '15',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', available: true },
  { id: 'f100', name: 'Zinger Club',       price: 18, priceDisplay: '18',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', available: true },
  { id: 'f101', name: 'Hot Dog Club',      price: 12, priceDisplay: '12',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', available: true },
  { id: 'f102', name: 'Egg Club',          price: 10, priceDisplay: '10',    category: 'Burgers & Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80', available: true },

  /* ── Snacks & Salads ────────────────────────────────── */
  { id: 'f103', name: 'Samosa',               price: 3,  priceDisplay: '03',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', available: true },
  { id: 'f104', name: 'Pakora',               price: 5,  priceDisplay: '05',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', available: true },
  { id: 'f105', name: 'Chana Chaat',          price: 7,  priceDisplay: '07/10', category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', available: true },
  { id: 'f106', name: 'Samosa Chaat',         price: 10, priceDisplay: '10/15', category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', available: true },
  { id: 'f107', name: 'Fruit Chaat',          price: 10, priceDisplay: '10',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', available: true },
  { id: 'f108', name: 'Sweet Kheer',          price: 7,  priceDisplay: '07',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80', available: true },
  { id: 'f109', name: 'Afghani Slice Salad',  price: 8,  priceDisplay: '08',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', available: true },
  { id: 'f110', name: 'Greek Salad',          price: 12, priceDisplay: '12',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', available: true },
  { id: 'f111', name: 'Arugula Salad',        price: 10, priceDisplay: '10',    category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', available: true },
  { id: 'f112', name: 'Yogurt Cucumber Salad', price: 10, priceDisplay: '10',   category: 'Snacks & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', available: true },

  /* ── Roti & Paratha ─────────────────────────────────── */
  { id: 'f113', name: 'Saada Roti',            price: 1,    priceDisplay: '01',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f114', name: 'Tawa Roti',             price: 1.5,  priceDisplay: '1.50', category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f115', name: 'Naan',                  price: 3,    priceDisplay: '03',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f116', name: 'Saada Paratha',         price: 2,    priceDisplay: '02',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f117', name: 'Aloo Paratha',          price: 3,    priceDisplay: '03',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f118', name: 'Qeema Paratha',         price: 8,    priceDisplay: '08',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f119', name: 'Quetta Paratha',        price: 3,    priceDisplay: '03',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f120', name: 'Tandoori Paratha',      price: 3,    priceDisplay: '03',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f121', name: 'Chicken Paratha',       price: 7,    priceDisplay: '07',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },
  { id: 'f122', name: 'Chicken Cheese Paratha', price: 8,   priceDisplay: '08',   category: 'Roti & Paratha', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', available: true },

  /* ── Beverages ──────────────────────────────────────── */
  { id: 'f123', name: 'Karak Tea',          price: 1,    priceDisplay: '01',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', available: true },
  { id: 'f124', name: 'Fresh Milk Tea',     price: 3,    priceDisplay: '03',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', available: true },
  { id: 'f125', name: 'Mint Tea',           price: 2,    priceDisplay: '02',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', available: true },
  { id: 'f126', name: 'Black Coffee',       price: 1.5,  priceDisplay: '1.50',  category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', available: true },
  { id: 'f127', name: 'Coffee with Milk',   price: 3,    priceDisplay: '03',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', available: true },
  { id: 'f128', name: 'Cold Drink 1.5L',    price: 6,    priceDisplay: '06',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', available: true },
  { id: 'f129', name: 'Cane Cold Drink',    price: 2,    priceDisplay: '02',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', available: true },
  { id: 'f130', name: 'Water Bottle Small', price: 1,    priceDisplay: '01',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', available: true },
  { id: 'f131', name: 'Water Bottle 1.5L',  price: 2,    priceDisplay: '02',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', available: true },
  { id: 'f132', name: 'Laban',              price: 1,    priceDisplay: '01',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', available: true },
  { id: 'f133', name: 'Pineapple Juice',    price: 7,    priceDisplay: '07/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f134', name: 'Orange Juice',       price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f135', name: 'Mango Juice',        price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f136', name: 'Grape Juice',        price: 8,    priceDisplay: '08/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f137', name: 'Watermelon Juice',   price: 7,    priceDisplay: '07/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f138', name: 'Avocado Juice',      price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f139', name: 'Apple Juice',        price: 9,    priceDisplay: '09/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f140', name: 'Banana Juice',       price: 7,    priceDisplay: '07/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f141', name: 'Mint Margarita',     price: 10,   priceDisplay: '10/12', category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f142', name: 'Special Juice',      price: 12,   priceDisplay: '12',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f143', name: 'Cocktail',           price: 7,    priceDisplay: '07',    category: 'Beverages', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', available: true },
  { id: 'f144', name: 'Special Lassi',      price: 5,    priceDisplay: '05/10', category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=400&q=80', available: true },

  /* ── Meals & Combos ─────────────────────────────────── */
  { id: 'f145', name: 'Snacks Meal',        description: '2 PCS Chicken + Garlic + 1 Bun + Mayonnaise', price: 10, priceDisplay: '10', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', available: true },
  { id: 'f146', name: 'Dinner Meal',        description: '2 PCS Chicken Fried + Garlic + 1 Bun + Fries + Mayonnaise', price: 15, priceDisplay: '15/20', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', available: true },
  { id: 'f147', name: 'Aresh Special Meal',  description: '4 PCS Chicken Fried + Garlic + 2 Bun + Cold Drink + Mayonnaise', price: 30, priceDisplay: '30', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', available: true },
  { id: 'f148', name: 'Family Meal',        description: '6 PCS Fried Chicken + Garlic + 3 Bun + Fries + Cold Drink + Mayonnaise', price: 50, priceDisplay: '50', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', available: true },
  { id: 'f149', name: 'Party Meal',         description: '10 PCS Chicken + Garlic + 10 Bun + Cold Drink + Fries + Mayonnaise', price: 90, priceDisplay: '90', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', available: true },
  { id: 'f150', name: 'Simple Fries',       price: 5,  priceDisplay: '05/10',  category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', available: true },
  { id: 'f151', name: 'Fries W. Hummus',    price: 10, priceDisplay: '10/15',  category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', available: true },
  { id: 'f152', name: 'Fries W. Cheese',    price: 10, priceDisplay: '10/15',  category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', available: true },
  { id: 'f153', name: 'Fries W. Cold Drink', price: 7, priceDisplay: '07/15', category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', available: true },
  { id: 'f154', name: 'White Cream Pasta',  price: 22, priceDisplay: '22',    category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', available: true },
  { id: 'f155', name: 'Red Sauce Pasta',    price: 15, priceDisplay: '15',    category: 'Meals & Combos', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', available: true },
];

const CATEGORY_ORDER = [
  'Aaresh Special', 'Regular Menu', 'Special Karahi', 'Special Daal',
  'Veg Menu', 'Biryani / Pulao', 'BBQ & Grill', 'Chinese & Sea Food',
  'Shawarma & Rolls', 'Burgers & Sandwiches', 'Snacks & Salads',
  'Roti & Paratha', 'Beverages', 'Meals & Combos',
];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ORDER PAGE                                                      ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const OrderPage = () => {
  /* ── Menu data ──────────────────────────────────────── */
  const [menuItems, setMenuItems] = useState(FALLBACK_ITEMS);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await getMenuItems();
        if (!cancelled && items.length > 0) {
          setMenuItems(items.filter(i => i.available !== false));
        }
      } catch { /* fallback items used */ }
      finally { if (!cancelled) setMenuLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Cart state ─────────────────────────────────────── */
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  /* ── Checkout form ──────────────────────────────────── */
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState('pickup');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // order ID
  const [formErrors, setFormErrors] = useState({});

  /* ── Group menu by category ─────────────────────────── */
  const grouped = useMemo(() => {
    const map = {};
    menuItems.forEach((item) => {
      const cat = item.category || 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return CATEGORY_ORDER
      .filter((c) => map[c])
      .map((c) => ({ category: c, items: map[c] }))
      .concat(
        Object.keys(map)
          .filter((c) => !CATEGORY_ORDER.includes(c))
          .map((c) => ({ category: c, items: map[c] }))
      );
  }, [menuItems]);

  /* ── Cart helpers ───────────────────────────────────── */
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: Number(item.price) || 0, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, quantity: c.quantity + delta } : c)
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const cartTotal = useMemo(() => cart.reduce((sum, c) => sum + c.price * c.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + c.quantity, 0), [cart]);

  /* ── Checkout ───────────────────────────────────────── */
  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    if (orderType === 'delivery' && !form.address.trim()) errors.address = 'Delivery address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderId = await addOrder({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        orderType,
        address: form.address,
        items: cart,
        total: cartTotal,
        notes: form.notes,
      });
      setOrderSuccess(orderId);
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to place order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getCartQty = (id) => cart.find((c) => c.id === id)?.quantity || 0;

  /* ── Success state ──────────────────────────────────── */
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-light to-white px-4">
        <SEO title="Order Placed" />
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-dark mb-3">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-2">Your order has been received and is being reviewed.</p>
          <p className="text-xs text-gray-400 mb-6 bg-gray-50 px-4 py-2 rounded-lg inline-block">
            Order ID: <span className="font-mono font-medium text-dark">{orderSuccess}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            We'll start preparing your order shortly. Thank you for choosing us!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
              <HiOutlineHome className="w-4 h-4" /> Back to Home
            </Link>
            <button onClick={() => { setOrderSuccess(null); setForm({ name: '', phone: '', email: '', address: '', notes: '' }); }}
              className="btn-outline text-sm px-6 py-2.5">
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Order Online" description="Order delicious food online for pickup or delivery." />

      {/* Header */}
      <div className="bg-charcoal text-white py-5 px-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/" className="font-heading text-xl font-bold hover:text-primary-400 transition-colors">
              ← Back
            </Link>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-primary-500 text-charcoal px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 hover:bg-primary-400 transition-colors"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menu grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-dark mb-2">Order Online</h1>
        <p className="text-gray-400 text-sm mb-8">Select items to add to your cart, then proceed to checkout.</p>

        {menuLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <svg className="w-6 h-6 animate-spin mr-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading menu…
          </div>
        ) : (
          grouped.map(({ category, items }) => (
            <div key={category} className="mb-10">
              <h2 className="font-heading text-xl font-bold text-dark mb-4 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const qty = getCartQty(item.id);
                  return (
                    <div key={item.id}
                      className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all
                        ${qty > 0 ? 'border-primary-300 ring-1 ring-primary-200' : 'border-gray-200'}`}>
                      {(item.image || item.imageUrl) && (
                        <img src={item.image || item.imageUrl} alt={item.name}
                          className="w-full h-40 object-cover" loading="lazy" />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-dark text-sm">{item.name}</h3>
                          <span className="font-bold text-primary-500 text-sm whitespace-nowrap">
                            {item.priceDisplay || (Number(item.price) || 0)} Dhs
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                        )}

                        {qty === 0 ? (
                          <button onClick={() => addToCart(item)}
                            className="w-full bg-primary-50 text-primary-600 border border-primary-200 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors flex items-center justify-center gap-1.5">
                            <HiOutlinePlus className="w-4 h-4" /> Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-primary-50 rounded-lg px-3 py-1.5 border border-primary-200">
                            <button onClick={() => updateQty(item.id, -1)}
                              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                              <HiOutlineMinus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-dark text-sm">{qty}</span>
                            <button onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                              <HiOutlinePlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating cart bar (mobile) */}
      {cartCount > 0 && !showCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal text-white p-4 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-sm">{cartCount} items</span>
              <span className="font-heading text-lg font-bold ml-3">{cartTotal.toFixed(0)} Dhs</span>
            </div>
            <button onClick={() => setShowCart(true)}
              className="bg-primary-500 text-charcoal px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2 hover:bg-primary-400 transition-colors">
              View Cart <HiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
         CART SIDEBAR
         ═══════════════════════════════════════════════ */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCart(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading text-lg font-bold text-dark">Your Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <HiOutlineShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark text-sm truncate">{item.name}</p>
                        <p className="text-primary-500 text-sm font-bold">{(item.price * item.quantity).toFixed(0)} Dhs</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <HiOutlineMinus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600">
                          <HiOutlinePlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-dark">Total</span>
                  <span className="font-heading text-2xl font-bold text-primary-500">{cartTotal.toFixed(0)} Dhs</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true); }}
                  className="btn-primary w-full text-center text-sm py-3 inline-flex items-center justify-center gap-2">
                  Proceed to Checkout <HiArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════
         CHECKOUT MODAL
         ═══════════════════════════════════════════════ */}
      {showCheckout && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCheckout(false)} />
          <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white z-50 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-dark">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Order type toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <div className="flex gap-2">
                  {[
                    { val: 'pickup', label: 'Pickup', icon: HiOutlineHome },
                    { val: 'delivery', label: 'Delivery', icon: HiOutlineTruck },
                  ].map((t) => (
                    <button key={t.val} onClick={() => setOrderType(t.val)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2
                        ${orderType === t.val
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                      <t.icon className="w-4 h-4" />{t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.name}
                    onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(fe => ({ ...fe, name: '' })); }}
                    placeholder="Your full name" className={`form-input pl-10 ${formErrors.name ? 'border-red-400' : ''}`} />
                </div>
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={form.phone}
                    onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value })); setFormErrors(fe => ({ ...fe, phone: '' })); }}
                    placeholder="03XX XXXXXXX" className={`form-input pl-10 ${formErrors.phone ? 'border-red-400' : ''}`} />
                </div>
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400">(optional)</span></label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com" className="form-input pl-10" />
                </div>
              </div>

              {/* Address (delivery only) */}
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <div className="relative">
                    <HiOutlineLocationMarker className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea value={form.address}
                      onChange={(e) => { setForm(f => ({ ...f, address: e.target.value })); setFormErrors(fe => ({ ...fe, address: '' })); }}
                      placeholder="Full delivery address" rows={2}
                      className={`form-input pl-10 resize-none ${formErrors.address ? 'border-red-400' : ''}`} />
                  </div>
                  {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions <span className="text-gray-400">(optional)</span></label>
                <textarea value={form.notes}
                  onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any special requests…" rows={2} className="form-input resize-none" />
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-dark mb-2">Order Summary</h3>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toFixed(0)} Dhs</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold text-dark mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary-500">{cartTotal.toFixed(0)} Dhs</span>
                </div>
              </div>

              {/* Submit error */}
              {formErrors.submit && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
                  {formErrors.submit}
                </div>
              )}

              {/* Payment note */}
              <div className="bg-blue-50 text-blue-700 text-xs px-4 py-3 rounded-lg border border-blue-200">
                💰 Payment will be collected on {orderType === 'delivery' ? 'delivery' : 'pickup'}. Cash & card accepted.
              </div>

              <button onClick={handleSubmitOrder} disabled={submitting}
                className="btn-primary w-full text-center py-3 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait">
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order…
                  </>
                ) : (
                  <>Place Order — {cartTotal.toFixed(0)} Dhs</>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
