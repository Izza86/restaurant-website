import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../../common/ScrollToTop';
import PageTransition from '../../common/PageTransition';
import WhatsAppButton from '../../common/WhatsAppButton';

const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Layout;
