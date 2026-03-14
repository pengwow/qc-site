/**
 * Main Entry Point
 * Initializes all frontend modules
 */

import { initThemeToggle } from './theme.js';
import { initI18n } from './i18n.js';
import { initMobileMenu } from './mobile-menu.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initScrollAnimations } from './scroll-animations.js';

/**
 * Initialize all frontend functionality
 */
function init() {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Initialize theme toggle
  const themeToggle = document.getElementById('themeToggle');
  initThemeToggle(themeToggle);
  
  // Initialize i18n
  const langToggle = document.getElementById('langToggle');
  initI18n(langToggle);
  
  // Initialize mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  initMobileMenu(mobileMenuBtn, mobileMenu);
  
  // Initialize smooth scroll
  initSmoothScroll();
  
  // Initialize scroll animations
  initScrollAnimations();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
