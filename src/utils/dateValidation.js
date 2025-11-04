/**
 * Validate date inputs for resume forms
 */

/**
 * Validate that end date is after start date
 * @param {string} startDate - Start date in YYYY-MM format
 * @param {string} endDate - End date in YYYY-MM format
 * @returns {Object} Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { valid: true, error: null }
  }

  const start = new Date(startDate + '-01')
  const end = new Date(endDate + '-01')

  if (end < start) {
    return {
      valid: false,
      error: 'End date must be after start date',
    }
  }

  return { valid: true, error: null }
}

/**
 * Validate that date is not in the future
 * @param {string} date - Date in YYYY-MM format
 * @returns {Object} Validation result
 */
export const validateDateNotFuture = (date) => {
  if (!date) {
    return { valid: true, error: null }
  }

  const inputDate = new Date(date + '-01')
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  if (inputDate > currentMonth) {
    return {
      valid: false,
      error: 'Date cannot be in the future',
    }
  }

  return { valid: true, error: null }
}

/**
 * Validate that date is not too far in the past (e.g., more than 100 years ago)
 * @param {string} date - Date in YYYY-MM format
 * @returns {Object} Validation result
 */
export const validateDateNotTooOld = (date) => {
  if (!date) {
    return { valid: true, error: null }
  }

  const inputDate = new Date(date + '-01')
  const hundredYearsAgo = new Date()
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100)

  if (inputDate < hundredYearsAgo) {
    return {
      valid: false,
      error: 'Date seems too far in the past. Please check your input.',
    }
  }

  return { valid: true, error: null }
}

/**
 * Format date for display (YYYY-MM -> Month YYYY)
 * @param {string} date - Date in YYYY-MM format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const [year, month] = date.split('-')
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

