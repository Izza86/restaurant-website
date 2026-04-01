import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMenuItems,
  addOrUpdateMenuItem,
  deleteMenuItem,
} from '../../services/firestoreService';
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineX,
  HiOutlineStar,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  CATEGORY OPTIONS                                                ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const CATEGORY_OPTIONS = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  EMPTY FORM STATE                                                ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Appetizers',
  image: '',
  dietaryTags: '',
  isFeatured: false,
  available: true,
  sortOrder: '0',
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  PASSWORD GATE                                                   ║
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

    if (!adminPw) {
      setError('VITE_ADMIN_PASSWORD is not set in your .env file.');
      return;
    }

    if (password === adminPw) {
      onAuth(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10 w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <HiOutlineLockClosed className="w-7 h-7 text-primary-600" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-center text-dark mb-1">
          Admin Access
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter the admin password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              className="form-input pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPw ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-center">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ITEM FORM — add / edit a menu item                              ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const ItemForm = ({ form, setForm, onSubmit, onCancel, saving, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const inputCls = 'form-input text-sm';

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading text-lg font-bold text-dark flex items-center gap-2">
          {isEditing ? (
            <><HiOutlinePencilAlt className="w-5 h-5 text-primary-500" /> Edit Item</>
          ) : (
            <><HiOutlinePlus className="w-5 h-5 text-primary-500" /> Add New Item</>
          )}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Row 1 — name + category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Truffle Bruschetta"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputCls}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 — description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="A short description of the dish…"
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Row 3 — price + sortOrder + image */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Price ($) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="16"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Sort Order</label>
          <input
            name="sortOrder"
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={handleChange}
            placeholder="0"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://…"
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 4 — dietaryTags */}
      <div>
        <label className={labelCls}>
          Dietary Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
        </label>
        <input
          name="dietaryTags"
          value={form.dietaryTags}
          onChange={handleChange}
          placeholder="vegan, glutenFree, spicy"
          className={inputCls}
        />
      </div>

      {/* Row 5 — checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 accent-primary-500 rounded"
          />
          <span className="text-sm text-gray-700">Featured / Popular</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="w-4 h-4 accent-primary-500 rounded"
          />
          <span className="text-sm text-gray-700">Available</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-wait"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : isEditing ? 'Update Item' : 'Add Item'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};


/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  ADMIN MENU PAGE — main component                               ║
   ╚═══════════════════════════════════════════════════════════════════╝ */
const AdminMenu = () => {
  /* ── auth ───────────────────────────────────────────── */
  const [authed, setAuthed] = useState(false);

  /* ── data ───────────────────────────────────────────── */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── form ───────────────────────────────────────────── */
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const formRef = useRef(null);

  /* ── fetch items ────────────────────────────────────── */
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchItems();
  }, [authed, fetchItems]);

  /* ── toast auto-dismiss ─────────────────────────────── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── form helpers ───────────────────────────────────── */
  const parseDietaryTags = (raw) =>
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const buildPayload = () => ({
    name:        form.name,
    description: form.description,
    category:    form.category,
    price:       form.price,
    image:       form.image,
    dietaryTags: parseDietaryTags(form.dietaryTags),
    isFeatured:  form.isFeatured,
    available:   form.available,
    sortOrder:   form.sortOrder,
  });

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      setToast({ type: 'error', msg: 'Item name is required.' });
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setToast({ type: 'error', msg: 'A valid price is required.' });
      return;
    }

    setSaving(true);
    try {
      await addOrUpdateMenuItem(editingId, buildPayload());
      setToast({
        type: 'success',
        msg: editingId ? `"${form.name}" updated.` : `"${form.name}" added.`,
      });
      setForm(emptyForm);
      setEditingId(null);
      await fetchItems();
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  }, [form, editingId, fetchItems]);

  const handleEdit = useCallback((item) => {
    setEditingId(item.id);
    setForm({
      name:        item.name        || '',
      description: item.description || '',
      price:       String(item.price ?? ''),
      category:    item.category    || 'Appetizers',
      image:       item.image       || item.imageUrl || '',
      dietaryTags: (item.dietaryTags || item.dietary || []).join(', '),
      isFeatured:  Boolean(item.isFeatured ?? item.popular ?? false),
      available:   item.available !== false,
      sortOrder:   String(item.sortOrder ?? 0),
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleDelete = useCallback(async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    try {
      await deleteMenuItem(item.id);
      setToast({ type: 'success', msg: `"${item.name}" deleted.` });
      if (editingId === item.id) {
        setForm(emptyForm);
        setEditingId(null);
      }
      await fetchItems();
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Delete failed.' });
    }
  }, [editingId, fetchItems]);

  const handleCancel = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
  }, []);

  /* ── password gate ──────────────────────────────────── */
  if (!authed) return <PasswordGate onAuth={setAuthed} />;

  /* ── authenticated view ─────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Warning Banner ────────────────────────────── */}
      <div className="bg-amber-500 text-amber-950 text-sm text-center py-2.5 px-4 font-medium">
        ⚠️ Admin page is for development only — secure or remove before production.
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark">
              Menu Manager
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Add, edit, or remove dishes from Firestore.
            </p>
          </div>
          <button
            onClick={fetchItems}
            disabled={loading}
            className="btn-outline inline-flex items-center gap-2 text-sm self-start"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* ── Toast ───────────────────────────────────── */}
        {toast && (
          <div
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
              animate-[fade-in_0.3s_ease] transition-opacity
              ${toast.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'}
            `}
          >
            {toast.type === 'success'
              ? <HiOutlineCheckCircle className="w-5 h-5 flex-shrink-0" />
              : <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.msg}
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-current opacity-60 hover:opacity-100"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Item Form ───────────────────────────────── */}
        <div ref={formRef}>
          <ItemForm
            form={form}
            setForm={setForm}
            onSubmit={handleSave}
            onCancel={handleCancel}
            saving={saving}
            isEditing={!!editingId}
          />
        </div>

        {/* ── Items Table / List ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-dark">
              Menu Items
              {!loading && (
                <span className="text-gray-400 font-normal text-sm ml-2">
                  ({items.length})
                </span>
              )}
            </h2>
          </div>

          {/* loading */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading menu items…
            </div>
          )}

          {/* error */}
          {error && !loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
              <HiOutlineExclamationCircle className="w-10 h-10 text-red-300" />
              <p className="text-red-500 text-sm">{error}</p>
              <button onClick={fetchItems} className="btn-outline text-sm">
                Retry
              </button>
            </div>
          )}

          {/* empty */}
          {!loading && !error && items.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="font-heading text-lg mb-1">No items yet</p>
              <p className="text-sm">Add your first menu item above.</p>
            </div>
          )}

          {/* table */}
          {!loading && !error && items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-3 font-semibold">Item</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Category</th>
                    <th className="text-right px-4 py-3 font-semibold">Price</th>
                    <th className="text-center px-4 py-3 font-semibold hidden sm:table-cell">Featured</th>
                    <th className="text-center px-4 py-3 font-semibold hidden sm:table-cell">Available</th>
                    <th className="text-right px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className={`
                        hover:bg-gray-50/80 transition-colors
                        ${editingId === item.id ? 'bg-primary-50/40 ring-1 ring-inset ring-primary-200' : ''}
                      `}
                    >
                      {/* name + image thumbnail */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {(item.image || item.imageUrl) && (
                            <img
                              src={item.image || item.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-dark truncate max-w-[200px]">
                              {item.name || 'Untitled'}
                            </p>
                            {(item.dietaryTags?.length > 0 || item.dietary?.length > 0) && (
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                {(item.dietaryTags || item.dietary || []).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* category */}
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        {item.category || '—'}
                      </td>

                      {/* price */}
                      <td className="px-4 py-3 text-right font-medium text-dark">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price ?? '—'}
                      </td>

                      {/* featured */}
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        {(item.isFeatured || item.popular) ? (
                          <HiOutlineStar className="w-4 h-4 text-primary-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* available */}
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        {item.available !== false ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                        )}
                      </td>

                      {/* actions */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(item)}
                            className="
                              p-2 rounded-lg text-gray-400 hover:text-primary-600
                              hover:bg-primary-50 transition-colors
                            "
                            title="Edit"
                          >
                            <HiOutlinePencilAlt className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="
                              p-2 rounded-lg text-gray-400 hover:text-red-600
                              hover:bg-red-50 transition-colors
                            "
                            title="Delete"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
