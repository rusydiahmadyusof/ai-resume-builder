/**
 * Simple i18n implementation for multi-language support
 */

const translations = {}

// Available languages
export const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
}

// Default language
export const defaultLanguage = 'en'

// Current language
let currentLanguage = defaultLanguage

// Load translations
async function loadTranslations(locale) {
  if (translations[locale]) {
    return translations[locale]
  }

  try {
    const module = await import(`./locales/${locale}.json`)
    translations[locale] = module.default || module
    return translations[locale]
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}:`, error)
    // Fallback to English
    if (locale !== defaultLanguage) {
      return loadTranslations(defaultLanguage)
    }
    return {}
  }
}

// Initialize
export async function initI18n(locale = null) {
  const savedLocale = localStorage.getItem('app_language') || locale || defaultLanguage
  currentLanguage = savedLocale
  await loadTranslations(currentLanguage)
  return currentLanguage
}

// Get current language
export function getCurrentLanguage() {
  return currentLanguage
}

// Set language
export async function setLanguage(locale) {
  if (!languages[locale]) {
    console.warn(`Language ${locale} not supported`)
    return false
  }

  await loadTranslations(locale)
  currentLanguage = locale
  localStorage.setItem('app_language', locale)
  
  // Trigger language change event
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { locale } }))
  
  return true
}

// Translate function
export function t(key, params = {}) {
  const keys = key.split('.')
  let value = translations[currentLanguage] || {}
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English if key not found
      if (currentLanguage !== defaultLanguage) {
        value = translations[defaultLanguage] || {}
        for (const k2 of keys) {
          value = value?.[k2]
          if (value === undefined) return key // Return key if not found
        }
      } else {
        return key // Return key if not found
      }
      break
    }
  }

  // Replace parameters in string
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match
    })
  }

  return value || key
}

// Get all translations for a namespace
export function getNamespace(namespace) {
  const keys = namespace.split('.')
  let value = translations[currentLanguage] || {}
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) return {}
  }
  
  return value || {}
}

// Export t as default
export default t

