/**
 * Mobile Menu Module
 * Handles mobile menu toggle and auto-close behavior
 */

/**
 * Initialize mobile menu functionality
 * @param {HTMLElement} menuButton - The mobile menu toggle button
 * @param {HTMLElement} menu - The mobile menu element
 */
export function initMobileMenu(menuButton, menu) {
  if (!menuButton || !menu) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  // Toggle menu visibility
  menuButton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
  
  // Close menu when clicking a link
  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}
