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
   ║  FALLBACK MENU (if Firebase not connected)                       ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const FALLBACK_ITEMS = [
  { id: 'f1', name: 'Truffle Bruschetta', price: 16, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80', available: true },
  { id: 'f2', name: 'French Onion Soup', price: 14, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', available: true },
  { id: 'f3', name: 'Filet Mignon', price: 48, category: 'Main Courses', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80', available: true },
  { id: 'f4', name: 'Pan-Seared Salmon', price: 36, category: 'Main Courses', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80', available: true },
  { id: 'f5', name: 'Crème Brûlée', price: 14, category: 'Desserts', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80', available: true },
  { id: 'f6', name: 'Tiramisu', price: 13, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', available: true },
];

const CATEGORY_ORDER = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];


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
                            ${(Number(item.price) || 0).toFixed(2)}
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
              <span className="font-heading text-lg font-bold ml-3">${cartTotal.toFixed(2)}</span>
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
                        <p className="text-primary-500 text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
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
                  <span className="font-heading text-2xl font-bold text-primary-500">${cartTotal.toFixed(2)}</span>
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
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold text-dark mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary-500">${cartTotal.toFixed(2)}</span>
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
                  <>Place Order — ${cartTotal.toFixed(2)}</>
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
