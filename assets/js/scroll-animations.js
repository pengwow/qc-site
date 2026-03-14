/**
 * Scroll Animations Module
 * Handles intersection observer for scroll-triggered animations
 */

const ANIMATION_CLASS = 'animate-fade-in';

/**
 * Initialize scroll animations
 * @param {string} selector - CSS selector for elements to observe
 */
export function initScrollAnimations(selector = '.feature-card') {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(ANIMATION_CLASS);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => observer.observe(el));
}
