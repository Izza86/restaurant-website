/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  DATABASE SERVICE — CRUD operations for Restaurant               ║
   ║  (Firebase Realtime Database)                                     ║
   ║                                                                   ║
   ║  Paths:                                                           ║
   ║    • /menuItems      → getMenuItems()                            ║
   ║                        addOrUpdateMenuItem(id?, data)             ║
   ║                        deleteMenuItem(id)                         ║
   ║    • /reservations    → addReservation(data), getReservations()   ║
   ║                        updateReservationStatus(id, status)        ║
   ║    • /contactMessages → addContactMessage(data),                 ║
   ║                        getContactMessages(),                      ║
   ║                        markMessageRead(id)                        ║
   ║    • /orders          → addOrder(data), getOrders(),             ║
   ║                        updateOrderStatus(id, status)              ║
   ╚═══════════════════════════════════════════════════════════════════╝ */

import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  serverTimestamp,
} from 'firebase/database';
import { db } from '../firebase/firebaseConfig';


/* ── Helper: snapshot → array ───────────────────────────────────────── */
function snapshotToArray(snapshot) {
  const items = [];
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      items.push({ id: child.key, ...child.val() });
    });
  }
  return items;
}


/* ──────────────────────────────────────────────────────────────────────
   MENU ITEMS — read all items
   ────────────────────────────────────────────────────────────────────── */
export async function getMenuItems() {
  try {
    const snapshot = await get(ref(db, 'menuItems'));
    const items = snapshotToArray(snapshot);
    items.sort((a, b) => {
      const catCompare = (a.category || '').localeCompare(b.category || '');
      if (catCompare !== 0) return catCompare;
      return (a.name || '').localeCompare(b.name || '');
    });
    return items;
  } catch (error) {
    console.error('[dbService] getMenuItems error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   RESERVATIONS — create a new reservation
   ────────────────────────────────────────────────────────────────────── */
export async function addReservation(data) {
  const required = ['name', 'email', 'phone', 'date', 'time', 'guests'];
  for (const field of required) {
    if (!data[field] || !String(data[field]).trim()) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  try {
    const newRef = push(ref(db, 'reservations'));
    await set(newRef, {
      name:            data.name.trim(),
      email:           data.email.trim().toLowerCase(),
      phone:           data.phone.trim(),
      date:            data.date,
      time:            data.time,
      guests:          data.guests,
      specialRequests: data.specialRequests?.trim() || '',
      status:          'pending',
      createdAt:       serverTimestamp(),
    });
    return newRef.key;
  } catch (error) {
    console.error('[dbService] addReservation error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   CONTACT MESSAGES — create a new contact-form submission
   ────────────────────────────────────────────────────────────────────── */
export async function addContactMessage(data) {
  const required = ['name', 'email', 'subject', 'message'];
  for (const field of required) {
    if (!data[field] || !String(data[field]).trim()) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  try {
    const newRef = push(ref(db, 'contactMessages'));
    await set(newRef, {
      name:      data.name.trim(),
      email:     data.email.trim().toLowerCase(),
      subject:   data.subject.trim(),
      message:   data.message.trim(),
      read:      false,
      createdAt: serverTimestamp(),
    });
    return newRef.key;
  } catch (error) {
    console.error('[dbService] addContactMessage error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   MENU ITEMS — create or update
   ────────────────────────────────────────────────────────────────────── */
export async function addOrUpdateMenuItem(id, data) {
  if (!data || !String(data.name || '').trim()) {
    throw new Error('Menu item name is required.');
  }
  const sanitized = {
    name:        String(data.name).trim(),
    description: String(data.description ?? '').trim(),
    category:    String(data.category ?? 'Main Courses').trim(),
    price:       typeof data.price === 'number' ? data.price : Number(data.price) || 0,
    image:       String(data.image ?? '').trim(),
    dietaryTags: Array.isArray(data.dietaryTags) ? data.dietaryTags : [],
    isFeatured:  Boolean(data.isFeatured ?? false),
    available:   Boolean(data.available ?? true),
    sortOrder:   typeof data.sortOrder === 'number' ? data.sortOrder : Number(data.sortOrder) || 0,
    updatedAt:   serverTimestamp(),
  };
  try {
    if (id) {
      await update(ref(db, `menuItems/${id}`), sanitized);
      return id;
    }
    sanitized.createdAt = serverTimestamp();
    const newRef = push(ref(db, 'menuItems'));
    await set(newRef, sanitized);
    return newRef.key;
  } catch (error) {
    console.error('[dbService] addOrUpdateMenuItem error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   MENU ITEMS — delete
   ────────────────────────────────────────────────────────────────────── */
export async function deleteMenuItem(id) {
  if (!id) throw new Error('A database key is required to delete a menu item.');
  try {
    await remove(ref(db, `menuItems/${id}`));
  } catch (error) {
    console.error('[dbService] deleteMenuItem error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   RESERVATIONS — fetch all (admin)
   ────────────────────────────────────────────────────────────────────── */
export async function getReservations() {
  try {
    const snapshot = await get(ref(db, 'reservations'));
    const items = snapshotToArray(snapshot);
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return items;
  } catch (error) {
    console.error('[dbService] getReservations error:', error);
    throw error;
  }
}

export async function updateReservationStatus(id, status) {
  if (!id) throw new Error('Reservation ID is required.');
  try {
    await update(ref(db, `reservations/${id}`), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('[dbService] updateReservationStatus error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   CONTACT MESSAGES — fetch all (admin)
   ────────────────────────────────────────────────────────────────────── */
export async function getContactMessages() {
  try {
    const snapshot = await get(ref(db, 'contactMessages'));
    const items = snapshotToArray(snapshot);
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return items;
  } catch (error) {
    console.error('[dbService] getContactMessages error:', error);
    throw error;
  }
}

export async function markMessageRead(id) {
  if (!id) throw new Error('Message ID is required.');
  try {
    await update(ref(db, `contactMessages/${id}`), { read: true, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('[dbService] markMessageRead error:', error);
    throw error;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   ORDERS — online order system
   ────────────────────────────────────────────────────────────────────── */
export async function addOrder(data) {
  const required = ['customerName', 'customerPhone', 'items'];
  for (const field of required) {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  try {
    const newRef = push(ref(db, 'orders'));
    await set(newRef, {
      customerName:  data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: data.customerEmail?.trim() || '',
      orderType:     data.orderType || 'pickup',
      address:       data.address?.trim() || '',
      items:         data.items,
      total:         Number(data.total) || 0,
      notes:         data.notes?.trim() || '',
      status:        'pending',
      createdAt:     serverTimestamp(),
    });
    return newRef.key;
  } catch (error) {
    console.error('[dbService] addOrder error:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const snapshot = await get(ref(db, 'orders'));
    const items = snapshotToArray(snapshot);
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return items;
  } catch (error) {
    console.error('[dbService] getOrders error:', error);
    throw error;
  }
}

export async function updateOrderStatus(id, status) {
  if (!id) throw new Error('Order ID is required.');
  try {
    await update(ref(db, `orders/${id}`), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('[dbService] updateOrderStatus error:', error);
    throw error;
  }
}
