/**
 * Utility functions for date formatting
 */

/**
 * Convert various date formats to yyyy-MM format (required for HTML5 month input)
 * @param {string} dateString - Date string in various formats (e.g., "2013", "12/2020", "06/2019", "2020-12", "2020-12-01")
 * @returns {string} Date in yyyy-MM format or empty string if invalid
 */
export function formatDateToMonth(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return ''
  }

  const trimmed = dateString.trim()
  if (!trimmed || trimmed.toLowerCase() === 'present' || trimmed.toLowerCase() === 'current') {
    return ''
  }

  // Handle formats like "2013" (year only)
  if (/^\d{4}$/.test(trimmed)) {
    const year = parseInt(trimmed, 10)
    if (year >= 1900 && year <= 2100) {
      return `${trimmed}-01` // Default to January
    }
    return ''
  }

  // Handle formats like "12/2020" or "06/2019" (MM/yyyy)
  const mmSlashYyyy = /^(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (mmSlashYyyy) {
    const month = mmSlashYyyy[1].padStart(2, '0')
    const year = mmSlashYyyy[2]
    const monthNum = parseInt(month, 10)
    if (monthNum >= 1 && monthNum <= 12) {
      return `${year}-${month}`
    }
  }

  // Handle formats like "2020/12" (yyyy/MM)
  const yyyySlashMm = /^(\d{4})\/(\d{1,2})$/.exec(trimmed)
  if (yyyySlashMm) {
    const year = yyyySlashMm[1]
    const month = yyyySlashMm[2].padStart(2, '0')
    const monthNum = parseInt(month, 10)
    if (monthNum >= 1 && monthNum <= 12) {
      return `${year}-${month}`
    }
  }

  // Handle formats like "2020-12" or "2020-12-01" (already in correct format or with day)
  const yyyyMmDd = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(trimmed)
  if (yyyyMmDd) {
    const year = yyyyMmDd[1]
    const month = yyyyMmDd[2].padStart(2, '0')
    const monthNum = parseInt(month, 10)
    if (monthNum >= 1 && monthNum <= 12) {
      return `${year}-${month}`
    }
  }

  // Try to parse as a full date string
  try {
    const date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    }
  } catch (e) {
    // Invalid date
  }

  return ''
}

/**
 * Format date for display
 * @param {string} dateString - Date in yyyy-MM format
 * @returns {string} Formatted date string (e.g., "December 2020")
 */
export function formatMonthForDisplay(dateString) {
  if (!dateString || !/^\d{4}-\d{2}$/.test(dateString)) {
    return dateString || ''
  }

  const [year, month] = dateString.split('-')
  const monthNum = parseInt(month, 10) - 1
  const date = new Date(parseInt(year, 10), monthNum, 1)
  
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

