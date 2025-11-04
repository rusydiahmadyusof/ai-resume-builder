/**
 * Accessibility utilities for improved screen reader support and keyboard navigation
 */

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus management utilities
 */
export const focusManager = {
  /**
   * Trap focus within an element
   */
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTab)
    return () => element.removeEventListener('keydown', handleTab)
  },

  /**
   * Restore focus to previous element
   */
  restoreFocus: (previousElement) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  },
}

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0
export const generateId = (prefix = 'id') => {
  return `${prefix}-${++idCounter}`
}

/**
 * Check color contrast ratios
 */
export const checkContrast = (foreground, background) => {
  // Simplified contrast check - in production, use proper color contrast calculation
  // This is a placeholder that should be replaced with actual WCAG contrast calculation
  return {
    ratio: 4.5, // Placeholder
    passes: true,
    level: 'AA',
  }
}

