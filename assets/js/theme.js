/**
 * Theme Toggle Module
 * Handles theme switching with system preference detection and localStorage persistence
 */

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark';

/**
 * Detect system theme preference
 * @returns {string} 'dark' or 'light'
 */
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Get saved theme preference or detect from system
 * @returns {string} 'dark' or 'light'
 */
function getSavedTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    return savedTheme;
  }
  const systemTheme = getSystemTheme();
  localStorage.setItem(STORAGE_KEY, systemTheme);
  return systemTheme;
}

/**
 * Apply theme to document
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  const html = document.documentElement;
  html.classList.toggle(DARK_CLASS, theme === 'dark');
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle(DARK_CLASS);
  const isDark = html.classList.contains(DARK_CLASS);
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}

/**
 * Listen for system theme changes
 */
function listenForSystemThemeChanges() {
  if (!window.matchMedia) return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Initialize theme toggle functionality
 * @param {HTMLElement} toggleButton - The theme toggle button element
 */
export function initThemeToggle(toggleButton) {
  // Apply saved or detected theme
  const theme = getSavedTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  listenForSystemThemeChanges();
  
  // Setup toggle button click handler
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
  }
}
