/**
 * Comprehensive validation utilities for resume data
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return { valid: true, error: null }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  
  return { valid: true, error: null }
}

/**
 * Validate phone number format
 */
export const validatePhone = (phone) => {
  if (!phone) return { valid: true, error: null }
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
  
  // Check if it's all digits and reasonable length (7-15 digits)
  if (!/^\d+$/.test(cleaned) || cleaned.length < 7 || cleaned.length > 15) {
    return { valid: false, error: 'Please enter a valid phone number (7-15 digits)' }
  }
  
  return { valid: true, error: null }
}

/**
 * Validate URL format
 */
export const validateURL = (url, fieldName = 'URL') => {
  if (!url) return { valid: true, error: null }
  
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return { valid: false, error: `${fieldName} must start with http:// or https://` }
    }
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` }
  }
}

/**
 * Validate text length
 */
export const validateLength = (text, minLength = 0, maxLength = Infinity, fieldName = 'Field') => {
  if (!text) {
    if (minLength > 0) {
      return { valid: false, error: `${fieldName} is required` }
    }
    return { valid: true, error: null }
  }
  
  const length = text.trim().length
  
  if (length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` }
  }
  
  if (length > maxLength) {
    return { valid: false, error: `${fieldName} must not exceed ${maxLength} characters` }
  }
  
  return { valid: true, error: null }
}

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldName} is required` }
  }
  return { valid: true, error: null }
}

/**
 * Validate name format
 */
export const validateName = (name) => {
  if (!name) return { valid: false, error: 'Name is required' }
  
  const trimmed = name.trim()
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must not exceed 100 characters' }
  }
  
  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-'\.]+$/.test(trimmed)) {
    return { valid: false, error: 'Name contains invalid characters' }
  }
  
  return { valid: true, error: null }
}

/**
 * Validate summary text
 */
export const validateSummary = (summary) => {
  if (!summary) return { valid: true, error: null }
  
  const length = summary.trim().length
  if (length < 10) {
    return { valid: false, error: 'Summary must be at least 10 characters' }
  }
  
  if (length > 500) {
    return { valid: false, error: 'Summary must not exceed 500 characters' }
  }
  
  return { valid: true, error: null }
}

/**
 * Validate skills array
 */
export const validateSkills = (skills) => {
  if (!skills || !Array.isArray(skills)) {
    return { valid: false, error: 'Skills must be an array' }
  }
  
  if (skills.length === 0) {
    return { valid: true, error: null } // Skills are optional
  }
  
  // Check for empty or invalid skill entries
  const invalidSkills = skills.filter(skill => !skill || !skill.trim())
  if (invalidSkills.length > 0) {
    return { valid: false, error: 'Please remove empty skill entries' }
  }
  
  // Check for duplicate skills
  const uniqueSkills = new Set(skills.map(s => s.toLowerCase().trim()))
  if (uniqueSkills.size !== skills.length) {
    return { valid: false, error: 'Duplicate skills found. Please remove duplicates.' }
  }
  
  return { valid: true, error: null }
}

/**
 * Comprehensive validation for personal info
 */
export const validatePersonalInfo = (personalInfo) => {
  const errors = {}
  
  // Name validation
  const nameValidation = validateName(personalInfo.name)
  if (!nameValidation.valid) {
    errors.name = nameValidation.error
  }
  
  // Email validation
  if (personalInfo.email) {
    const emailValidation = validateEmail(personalInfo.email)
    if (!emailValidation.valid) {
      errors.email = emailValidation.error
    }
  }
  
  // Phone validation
  if (personalInfo.phone) {
    const phoneValidation = validatePhone(personalInfo.phone)
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.error
    }
  }
  
  // URL validations
  if (personalInfo.linkedin) {
    const linkedinValidation = validateURL(personalInfo.linkedin, 'LinkedIn URL')
    if (!linkedinValidation.valid) {
      errors.linkedin = linkedinValidation.error
    }
  }
  
  if (personalInfo.github) {
    const githubValidation = validateURL(personalInfo.github, 'GitHub URL')
    if (!githubValidation.valid) {
      errors.github = githubValidation.error
    }
  }
  
  if (personalInfo.portfolio) {
    const portfolioValidation = validateURL(personalInfo.portfolio, 'Portfolio URL')
    if (!portfolioValidation.valid) {
      errors.portfolio = portfolioValidation.error
    }
  }
  
  // Summary validation
  if (personalInfo.summary) {
    const summaryValidation = validateSummary(personalInfo.summary)
    if (!summaryValidation.valid) {
      errors.summary = summaryValidation.error
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate work experience entry
 */
export const validateWorkExperience = (experience) => {
  const errors = {}
  
  if (!experience.company || !experience.company.trim()) {
    errors.company = 'Company name is required'
  }
  
  if (!experience.position || !experience.position.trim()) {
    errors.position = 'Position is required'
  }
  
  if (!experience.startDate) {
    errors.startDate = 'Start date is required'
  }
  
  if (!experience.current && !experience.endDate) {
    errors.endDate = 'End date is required when not currently working'
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate education entry
 */
export const validateEducation = (education) => {
  const errors = {}
  
  if (!education.institution || !education.institution.trim()) {
    errors.institution = 'Institution name is required'
  }
  
  if (!education.degree || !education.degree.trim()) {
    errors.degree = 'Degree is required'
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate job application data
 */
export const validateJobApplication = (jobApplication) => {
  const errors = {}
  
  if (!jobApplication.jobTitle || !jobApplication.jobTitle.trim()) {
    errors.jobTitle = 'Job title is required'
  } else {
    const titleValidation = validateLength(jobApplication.jobTitle, 3, 100, 'Job title')
    if (!titleValidation.valid) {
      errors.jobTitle = titleValidation.error
    }
  }
  
  if (!jobApplication.jobDescription || !jobApplication.jobDescription.trim()) {
    errors.jobDescription = 'Job description is required'
  } else {
    const descValidation = validateLength(jobApplication.jobDescription, 50, 5000, 'Job description')
    if (!descValidation.valid) {
      errors.jobDescription = descValidation.error
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

