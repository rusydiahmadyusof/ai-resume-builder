import { useState, useEffect } from 'react'
import { setLanguage, getCurrentLanguage, languages, initI18n } from '../../i18n'
import Button from './Button'

function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Initialize i18n
    initI18n()

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.locale)
    }

    window.addEventListener('languagechange', handleLanguageChange)

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange)
    }
  }, [])

  const handleLanguageSelect = async (locale) => {
    const success = await setLanguage(locale)
    if (success) {
      setCurrentLang(locale)
      setIsOpen(false)
      // Note: For full i18n support, components would need to use the t() function
      // For now, we'll reload to apply changes. In a production app, you'd use
      // React Context or state management to trigger re-renders.
      window.location.reload()
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-2">🌐</span>
        {languages[currentLang] || 'English'}
        <svg
          className={`ml-2 w-4 h-4 inline transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
            role="menu"
            aria-label="Language selection menu"
          >
            <div className="py-1">
              {Object.entries(languages).map(([locale, name]) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageSelect(locale)}
                  role="menuitem"
                  aria-label={`Select ${name} language`}
                  aria-checked={currentLang === locale}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    currentLang === locale
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {name}
                  {currentLang === locale && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSelector

