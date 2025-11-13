import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import QuotationPage from './pages/QuotationPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'quote'>('home');

  const handleNavigate = (page: 'home' | 'quote') => {
    setCurrentPage(page);
    // Don't scroll here - let individual page handlers manage scrolling
  };

  // Scroll to top only when navigating to home page
  useEffect(() => {
    if (currentPage === 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}
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
