import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@components';
import ErrorBoundary from './components/common/ErrorBoundary';

/* ── Lazy-loaded pages (code-split per route) ─────────────────────── */
const HomePage         = lazy(() => import('./pages/Home'));
const MenuPage         = lazy(() => import('./pages/Menu'));
const AboutPage        = lazy(() => import('./pages/About'));
const ReservationsPage = lazy(() => import('./pages/Reservations'));
const ContactPage      = lazy(() => import('./pages/Contact'));
const NotFoundPage     = lazy(() => import('./pages/NotFound'));
const AdminMenuPage       = lazy(() => import('./pages/AdminMenu'));
const AdminDashboardPage  = lazy(() => import('./pages/AdminDashboard'));
const OrderPage            = lazy(() => import('./pages/Order'));

/* ── Page loading spinner ─────────────────────────────────────────── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-gray-400 font-body tracking-wide">Loading…</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   APP — root component
   BrowserRouter enables SPA navigation (no full page reload).
   All routes are nested inside <Layout> so header/footer
   persist across pages while only the page content swaps.
   ═══════════════════════════════════════════════════════════ */
const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin routes — outside Layout (no header/footer) */}
            <Route path="admin/menu"      element={<AdminMenuPage />} />
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />

            {/* Order page — outside Layout (own header) */}
            <Route path="order" element={<OrderPage />} />

            {/* Layout wrapper — renders Header, Footer, PageTransition */}
            <Route element={<Layout />}>
              {/* ── Page routes ─────────────────────────────── */}
              <Route index                element={<HomePage />} />
              <Route path="menu"          element={<MenuPage />} />
              <Route path="about"         element={<AboutPage />} />
              <Route path="reservations"  element={<ReservationsPage />} />
              <Route path="contact"       element={<ContactPage />} />

              {/* ── 404 catch-all ──────────────────────────── */}
              <Route path="*"             element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
