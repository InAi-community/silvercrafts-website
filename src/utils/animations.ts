/**
 * Animation utilities for intersection observer and scroll animations
 */

import { ANIMATION_CONFIG } from '../config/constants';

/**
 * Setup intersection observer for scroll animations
 * @param onIntersect Callback when elements intersect
 * @param options Custom observer options
 */
export function setupIntersectionObserver(
  onIntersect?: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          
          // Animate child elements with staggered delays
          const children = entry.target.querySelectorAll('.animate-on-scroll');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-fade-in-up');
            }, index * 100);
          });
          
          // Custom callback
          if (onIntersect) {
            onIntersect(entry);
          }
        } else {
          // Remove animation class when not visible so it can re-animate
          entry.target.classList.remove('animate-fade-in-up');
        }
      });
    },
    options || {
      threshold: ANIMATION_CONFIG.threshold,
      rootMargin: ANIMATION_CONFIG.rootMargin
    }
  );

  return observer;
}

/**
 * Observe all elements with animate-on-scroll class
 */
export function observeAnimatedElements(observer: IntersectionObserver) {
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));
  
  // Also observe sections for section-level animations
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    if (!section.querySelector('.animate-on-scroll')) {
      section.classList.add('animate-on-scroll');
      observer.observe(section);
    }
  });
  
  return { elements, sections };
}

/**
 * Cleanup observer
 */
export function cleanupObserver(
  observer: IntersectionObserver,
  elements: NodeListOf<Element>,
  sections: NodeListOf<Element>
) {
  elements.forEach((el) => observer.unobserve(el));
  sections.forEach((section) => observer.unobserve(section));
  observer.disconnect();
}

/**
 * Smooth scroll to element
 */
export function smoothScrollToElement(elementId: string, delay: number = 0) {
  const scroll = () => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  if (delay > 0) {
    setTimeout(scroll, delay);
  } else {
    requestAnimationFrame(scroll);
  }
}

