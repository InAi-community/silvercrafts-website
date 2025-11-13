import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import QuotationPage from './pages/QuotationPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'quote'>('home');

  const handleNavigate = (page: 'home' | 'quote') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top when page changes or on reload
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      {currentPage === 'home' ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : (
        <QuotationPage onNavigate={handleNavigate} />
      )}
      <Footer />
    </div>
  );
}

export default App;
