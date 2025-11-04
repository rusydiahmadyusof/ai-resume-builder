import { useEffect } from 'react'

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * @param {Array} dependencies - Dependencies array for the effect
 */
export const useKeyboardShortcuts = (shortcuts, dependencies = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return
      }

      // Build key string
      const keyParts = []
      if (event.ctrlKey || event.metaKey) keyParts.push('ctrl')
      if (event.shiftKey) keyParts.push('shift')
      if (event.altKey) keyParts.push('alt')
      keyParts.push(event.key.toLowerCase())

      const keyString = keyParts.join('+')

      // Check if this shortcut is registered
      if (shortcuts[keyString]) {
        event.preventDefault()
        shortcuts[keyString](event)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcuts, ...dependencies])
}

/**
 * Common keyboard shortcuts for the application
 */
export const commonShortcuts = {
  'ctrl+s': (e) => {
    // Save - handled by auto-save
    e.preventDefault()
  },
  'ctrl+p': (e) => {
    // Print
    e.preventDefault()
    window.print()
  },
  'ctrl+/': (e) => {
    // Show help
    e.preventDefault()
    // Could trigger help modal
  },
}

