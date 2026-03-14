/**
 * Internationalization (i18n) Module
 * Handles language detection, translation loading, and language switching
 */

const STORAGE_KEY = 'lang';
const TRANSLATIONS_PATH = '/assets/i18n/translations.json';
const I18N_ATTRIBUTE = 'data-i18n';

/**
 * Detect language from browser settings
 * @returns {string} 'zh' or 'en'
 */
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang && browserLang.toLowerCase().startsWith('zh')) {
    return 'zh';
  }
  return 'en';
}

/**
 * Get saved language or detect from browser
 * @returns {string} 'zh' or 'en'
 */
function getSavedLanguage() {
  const savedLang = localStorage.getItem(STORAGE_KEY);
  if (savedLang) {
    return savedLang;
  }
  const detectedLang = detectBrowserLanguage();
  localStorage.setItem(STORAGE_KEY, detectedLang);
  return detectedLang;
}

/**
 * Load translations from JSON file
 * @returns {Promise<Object>} Translations object
 */
async function loadTranslations() {
  try {
    const response = await fetch(TRANSLATIONS_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load translations: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
}

/**
 * Update page language
 * @param {Object} translations - Translations object
 * @param {string} lang - Language code ('zh' or 'en')
 */
function updateLanguage(translations, lang) {
  const elements = document.querySelectorAll(`[${I18N_ATTRIBUTE}]`);
  elements.forEach(el => {
    const key = el.getAttribute(I18N_ATTRIBUTE);
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.setAttribute('lang', lang);
}

/**
 * Toggle between languages
 * @param {Object} translations - Translations object
 * @param {string} currentLang - Current language code
 * @returns {string} New language code
 */
function toggleLanguage(translations, currentLang) {
  const newLang = currentLang === 'en' ? 'zh' : 'en';
  localStorage.setItem(STORAGE_KEY, newLang);
  updateLanguage(translations, newLang);
  return newLang;
}

/**
 * Initialize i18n functionality
 * @param {HTMLElement} toggleButton - The language toggle button element
 */
export async function initI18n(toggleButton) {
  // Load translations
  const translations = await loadTranslations();
  
  // Get and apply saved or detected language
  const lang = getSavedLanguage();
  updateLanguage(translations, lang);
  
  // Setup toggle button
  if (toggleButton) {
    let currentLang = lang;
    
    // Update toggle button text
    const updateToggleText = () => {
      const span = toggleButton.querySelector('span');
      if (span) {
        span.textContent = currentLang === 'en' ? '中文' : 'English';
      }
    };
    updateToggleText();
    
    // Setup click handler
    toggleButton.addEventListener('click', () => {
      currentLang = toggleLanguage(translations, currentLang);
      updateToggleText();
    });
  }
}
