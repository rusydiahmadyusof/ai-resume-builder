import { useState, useEffect, useRef } from 'react'
import Card from './Card'

function KeyboardShortcuts({ shortcuts = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Focus management and keyboard navigation
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when dialog opens
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
      
      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors z-50"
        title="Keyboard Shortcuts (Ctrl+/)"
        aria-label="Keyboard Shortcuts"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </button>
    )
  }

  return (
    <div 
      ref={dialogRef}
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          setIsOpen(false)
        }
      }}
    >
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 id="keyboard-shortcuts-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Keyboard Shortcuts</h2>
          <button
            ref={closeButtonRef}
            onClick={() => setIsOpen(false)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
            aria-label="Close keyboard shortcuts"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{shortcut.description}</p>
                {shortcut.context && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{shortcut.context}</p>
                )}
              </div>
              <div className="flex gap-1">
                {shortcut.keys.split('+').map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                  >
                    {key === 'ctrl' ? (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') : key.toUpperCase()}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  )
}

export default KeyboardShortcuts

