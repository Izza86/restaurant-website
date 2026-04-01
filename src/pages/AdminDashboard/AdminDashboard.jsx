import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getReservations,
  updateReservationStatus,
  getContactMessages,
  markMessageRead,
  getOrders,
  updateOrderStatus,
} from '../../services/firestoreService';
import {
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineX,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineBookOpen,
  HiOutlineHome,
  HiOutlineCheck,
  HiOutlineBan,
  HiOutlineTruck,
} from 'react-icons/hi';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  PASSWORD GATE (same pattern as AdminMenu)                       ║
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
    if (!adminPw) { setError('VITE_ADMIN_PASSWORD is not set in .env'); return; }
    if (password === adminPw) { onAuth(true); }
    else { setError('Incorrect password.'); setPassword(''); inputRef.current?.focus(); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10 w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <HiOutlineLockClosed className="w-7 h-7 text-primary-600" />
          </div>
        </div>
        <h1 className="font-heading text-2xl font-bold text-center text-dark mb-1">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Enter admin password to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input ref={inputRef} type={showPw ? 'text' : 'password'} value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password" className="form-input pr-10" autoComplete="current-password" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
              {showPw ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full text-center">Unlock</button>
        </form>
      </div>
    </div>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  STATUS BADGE                                                    ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const StatusBadge = ({ status }) => {
  const colors = {
    pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed:  'bg-blue-100 text-blue-700 border-blue-200',
    preparing:  'bg-orange-100 text-orange-700 border-orange-200',
    ready:      'bg-green-100 text-green-700 border-green-200',
    completed:  'bg-green-100 text-green-700 border-green-200',
    delivered:  'bg-green-100 text-green-700 border-green-200',
    cancelled:  'bg-red-100 text-red-700 border-red-200',
    'picked-up': 'bg-green-100 text-green-700 border-green-200',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status || 'unknown'}
    </span>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  TIMESTAMP HELPER                                                ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const formatTimestamp = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ADMIN DASHBOARD                                                 ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Data
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Fetch data ──────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [o, r, m] = await Promise.all([
        getOrders().catch(() => []),
        getReservations().catch(() => []),
        getContactMessages().catch(() => []),
      ]);
      setOrders(o);
      setReservations(r);
      setMessages(m);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  /* ── Action handlers ─────────────────────────────────── */
  const handleOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      setToast({ type: 'success', msg: `Order marked as "${status}"` });
    } catch (err) {
      setToast({ type: 'error', msg: err.message });
    }
  };

  const handleReservationStatus = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      setToast({ type: 'success', msg: `Reservation marked as "${status}"` });
    } catch (err) {
      setToast({ type: 'error', msg: err.message });
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      setToast({ type: 'error', msg: err.message });
    }
  };

  /* ── Password gate ───────────────────────────────────── */
  if (!authed) return <PasswordGate onAuth={setAuthed} />;

  /* ── Tab data ────────────────────────────────────────── */
  const tabs = [
    { id: 'orders',       label: 'Orders',       icon: HiOutlineShoppingCart, count: orders.filter(o => o.status === 'pending').length },
    { id: 'reservations', label: 'Reservations',  icon: HiOutlineCalendar,    count: reservations.filter(r => r.status === 'pending').length },
    { id: 'messages',     label: 'Messages',      icon: HiOutlineMail,        count: messages.filter(m => !m.read).length },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-charcoal text-white py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold">Owner Dashboard</h1>
            <p className="text-gray-400 text-xs mt-0.5">Manage orders, reservations & messages</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/menu" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              Menu Manager →
            </Link>
            <button onClick={fetchData} disabled={loading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <HiOutlineRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-0 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
                <p className="font-heading text-3xl font-bold text-dark mt-1">{orders.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <HiOutlineShoppingCart className="w-6 h-6 text-primary-500" />
              </div>
            </div>
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {orders.filter(o => o.status === 'pending').length} pending
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Reservations</p>
                <p className="font-heading text-3xl font-bold text-dark mt-1">{reservations.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <HiOutlineCalendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {reservations.filter(r => r.status === 'pending').length} pending
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Messages</p>
                <p className="font-heading text-3xl font-bold text-dark mt-1">{messages.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <HiOutlineMail className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2 font-medium">
              {messages.filter(m => !m.read).length} unread
            </p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-4 ${
            toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {toast.type === 'success' ? <HiOutlineCheckCircle className="w-5 h-5" /> : <HiOutlineExclamationCircle className="w-5 h-5" />}
            {toast.msg}
            <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100">
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${activeTab === tab.id ? 'bg-primary-500 text-charcoal' : 'bg-red-100 text-red-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <HiOutlineExclamationCircle className="w-10 h-10 text-red-300" />
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchData} className="btn-outline text-sm">Retry</button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
           ORDERS TAB
           ═══════════════════════════════════════════════ */}
        {!loading && !error && activeTab === 'orders' && (
          <div className="space-y-4 pb-12">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <HiOutlineShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-heading text-lg">No orders yet</p>
                <p className="text-sm mt-1">Orders will appear here when customers place them.</p>
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-dark">{order.customerName}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <HiOutlinePhone className="w-3.5 h-3.5" />{order.customerPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineClock className="w-3.5 h-3.5" />{formatTimestamp(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          {order.orderType === 'delivery' ? <HiOutlineTruck className="w-3.5 h-3.5" /> : <HiOutlineHome className="w-3.5 h-3.5" />}
                          {order.orderType}
                        </span>
                      </div>
                      {order.address && <p className="text-xs text-gray-400 mt-1">📍 {order.address}</p>}
                    </div>
                    <p className="font-heading text-xl font-bold text-primary-500">
                      ${(order.total || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Order items */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <table className="w-full text-sm">
                      <tbody>
                        {(order.items || []).map((item, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0">
                            <td className="py-1.5 text-gray-700">{item.name}</td>
                            <td className="py-1.5 text-gray-400 text-right">x{item.quantity}</td>
                            <td className="py-1.5 text-gray-700 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {order.notes && <p className="text-xs text-gray-500 italic mb-4">📝 {order.notes}</p>}

                  {/* Status actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => handleOrderStatus(order.id, 'preparing')}
                          className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-lg font-medium hover:bg-orange-100 transition-colors">
                          🍳 Start Preparing
                        </button>
                        <button onClick={() => handleOrderStatus(order.id, 'cancelled')}
                          className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition-colors">
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => handleOrderStatus(order.id, 'ready')}
                        className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-colors">
                        ✅ Ready for Pickup/Delivery
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button onClick={() => handleOrderStatus(order.id, order.orderType === 'delivery' ? 'delivered' : 'picked-up')}
                        className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-colors">
                        ✅ {order.orderType === 'delivery' ? 'Delivered' : 'Picked Up'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
           RESERVATIONS TAB
           ═══════════════════════════════════════════════ */}
        {!loading && !error && activeTab === 'reservations' && (
          <div className="space-y-4 pb-12">
            {reservations.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <HiOutlineCalendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-heading text-lg">No reservations yet</p>
                <p className="text-sm mt-1">Reservations will appear here when customers book tables.</p>
              </div>
            ) : reservations.map((res) => (
              <div key={res.id} className={`bg-white rounded-xl border shadow-sm p-5 ${!res.status || res.status === 'pending' ? 'border-yellow-200' : 'border-gray-200'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-dark">{res.name}</h3>
                      <StatusBadge status={res.status || 'pending'} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span><HiOutlinePhone className="w-3.5 h-3.5 inline mr-1" />{res.phone}</span>
                      <span>{res.email}</span>
                      <span><HiOutlineClock className="w-3.5 h-3.5 inline mr-1" />{formatTimestamp(res.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg">📅 {res.date}</span>
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg">🕐 {res.time}</span>
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg">👥 {res.guests} guests</span>
                </div>

                {res.specialRequests && (
                  <p className="text-xs text-gray-500 italic mb-3">📝 {res.specialRequests}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {(!res.status || res.status === 'pending') && (
                    <>
                      <button onClick={() => handleReservationStatus(res.id, 'confirmed')}
                        className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-colors">
                        ✅ Confirm
                      </button>
                      <button onClick={() => handleReservationStatus(res.id, 'cancelled')}
                        className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition-colors">
                        ❌ Cancel
                      </button>
                    </>
                  )}
                  {res.status === 'confirmed' && (
                    <button onClick={() => handleReservationStatus(res.id, 'completed')}
                      className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                      ✅ Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
           MESSAGES TAB
           ═══════════════════════════════════════════════ */}
        {!loading && !error && activeTab === 'messages' && (
          <div className="space-y-4 pb-12">
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <HiOutlineMail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-heading text-lg">No messages yet</p>
                <p className="text-sm mt-1">Messages will appear here when visitors use the contact form.</p>
              </div>
            ) : messages.map((msg) => (
              <div key={msg.id}
                className={`bg-white rounded-xl border shadow-sm p-5 cursor-pointer transition-colors
                  ${!msg.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}
                onClick={() => !msg.read && handleMarkRead(msg.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                      <h3 className="font-semibold text-dark">{msg.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span>{msg.email}</span>
                      <span><HiOutlineClock className="w-3.5 h-3.5 inline mr-1" />{formatTimestamp(msg.createdAt)}</span>
                    </div>
                  </div>
                  {!msg.read && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">New</span>
                  )}
                </div>
                <p className="text-sm font-medium text-dark mb-1">{msg.subject}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
