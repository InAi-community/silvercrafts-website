'use client'

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'home' | 'quote'>(
    pathname === '/quotation' ? 'quote' : 'home'
  );

  useEffect(() => {
    setCurrentPage(pathname === '/quotation' ? 'quote' : 'home');
  }, [pathname]);

  const handleNavigate = (page: 'home' | 'quote') => {
    setCurrentPage(page);
    if (page === 'home') {
      router.push('/');
      // Scroll to top when navigating to home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }, 0);
    } else {
      router.push('/quotation');
    }
  };

  // Scroll to top only when navigating to home page
  useEffect(() => {
    if (currentPage === 'home' && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentPage, pathname]);

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}
      {children}
      <Footer />
    </div>
  );
}

