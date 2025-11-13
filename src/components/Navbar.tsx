import { useState, useEffect } from 'react';
import StaggeredMenu from './StaggeredMenu';
import { smoothScrollToElement } from '../utils/animations';

interface NavbarProps {
  onNavigate: (page: 'home' | 'quote') => void;
  currentPage: 'home' | 'quote';
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isWhiteBackground, setIsWhiteBackground] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (currentPage !== 'home') {
      setIsWhiteBackground(true);
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Track if user has scrolled
      setIsScrolled(scrollPosition > 50);
      
      const heroSection = document.querySelector('section.min-h-screen');
      // Update selector to match the new dual carousel section
      const secondSection = document.querySelector('section.h-\\[90vh\\]') || 
                           document.querySelector('section.md\\:h-\\[95vh\\]');
      
      if (!heroSection) {
        setIsWhiteBackground(true);
        return;
      }

      const heroRect = heroSection.getBoundingClientRect();
      const heroBottom = heroRect.bottom;
      
      // Check if second section exists and get its bottom
      let secondBottom = heroBottom;
      if (secondSection) {
        const secondRect = secondSection.getBoundingClientRect();
        secondBottom = secondRect.bottom;
      }
      
      // If we've scrolled past both hero and second (dual carousel) section, we're on white background
      // Add a small threshold to account for transitions
      const threshold = 50;
      setIsWhiteBackground(secondBottom < threshold);
    };

    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if this is a white background section
            const section = entry.target as HTMLElement;
            const isWhite = section.classList.contains('bg-white') || 
                           section.classList.contains('bg-[#FAF9F7]') ||
                           section.classList.contains('bg-[#FDFBF7]');
            if (isWhite) {
              setIsWhiteBackground(true);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px 0px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    // Also listen to scroll for immediate updates
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [currentPage]);

  const menuItems = [
    { 
      label: 'Home', 
      ariaLabel: 'Go to home page', 
      onClick: () => onNavigate('home')
    },
    { 
      label: 'Categories', 
      ariaLabel: 'View categories', 
      onClick: () => {
        if (currentPage === 'home') {
          document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          onNavigate('home');
          setTimeout(() => {
            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    },
    { 
      label: 'Get Quote', 
      ariaLabel: 'Get a quote', 
      onClick: () => {
        onNavigate('quote');
        // Scroll to hero section after navigation
        setTimeout(() => {
          smoothScrollToElement('quote-hero');
        }, 100);
      }
    },
    { 
      label: 'Contact', 
      ariaLabel: 'Contact us', 
      onClick: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  // Menu button color: brown when menu is open OR on white background, white otherwise
  const defaultMenuColor = isWhiteBackground ? '#C06014' : '#fff';
  const openMenuColor = '#C06014'; // Always brown when open

  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      displaySocials={false}
      displayItemNumbering={true}
      menuButtonColor={defaultMenuColor}
      openMenuButtonColor={openMenuColor}
      changeMenuColorOnOpen={true}
      colors={['#1A1A1A', '#2A2A2A']}
      accentColor="#C06014"
      isFixed={true}
      onLogoClick={() => onNavigate('home')}
    />
  );
}
