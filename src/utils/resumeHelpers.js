/**
 * Utility functions for resume data management
 */

/**
 * Check if work experience entry is empty
 */
export const isWorkExperienceEmpty = (exp) => {
  if (!exp || typeof exp !== 'object') return true
  return !(
    (exp.company && exp.company.trim()) ||
    (exp.position && exp.position.trim()) ||
    (exp.responsibilities && exp.responsibilities.trim().length > 10)
  )
}

/**
 * Check if education entry is empty
 */
export const isEducationEmpty = (edu) => {
  if (!edu || typeof edu !== 'object') return true
  return !(
    (edu.institution && edu.institution.trim()) ||
    (edu.degree && edu.degree.trim()) ||
    (edu.field && edu.field.trim())
  )
}

/**
 * Check if certification entry is empty
 */
export const isCertificationEmpty = (cert) => {
  if (!cert || typeof cert !== 'object') return true
  return !(cert.name && cert.name.trim())
}

/**
 * Check if language entry is empty
 */
export const isLanguageEmpty = (lang) => {
  if (!lang || typeof lang !== 'object') return true
  return !(lang.name && lang.name.trim())
}

/**
 * Clean empty entries from arrays while keeping at least one entry if section is empty
 */
export const cleanEmptyEntries = (resumeData) => {
  const cleaned = { ...resumeData }

  // Clean work experience
  if (cleaned.workExperience && Array.isArray(cleaned.workExperience)) {
    const validEntries = cleaned.workExperience.filter((exp) => !isWorkExperienceEmpty(exp))
    cleaned.workExperience = validEntries.length > 0 ? validEntries : cleaned.workExperience.slice(0, 1)
  }

  // Clean education
  if (cleaned.education && Array.isArray(cleaned.education)) {
    const validEntries = cleaned.education.filter((edu) => !isEducationEmpty(edu))
    cleaned.education = validEntries.length > 0 ? validEntries : cleaned.education.slice(0, 1)
  }

  // Clean certifications
  if (cleaned.certifications && Array.isArray(cleaned.certifications)) {
    cleaned.certifications = cleaned.certifications.filter((cert) => !isCertificationEmpty(cert))
  }

  // Clean languages
  if (cleaned.languages && Array.isArray(cleaned.languages)) {
    cleaned.languages = cleaned.languages.filter((lang) => !isLanguageEmpty(lang))
  }

  return cleaned
}

/**
 * Check if resume has any meaningful data (beyond initial empty state)
 */
export const hasResumeData = (resumeData) => {
  if (!resumeData) return false

  // Check personal info
  if (
    resumeData.personalInfo &&
    (resumeData.personalInfo.name?.trim() ||
      resumeData.personalInfo.email?.trim() ||
      resumeData.personalInfo.phone?.trim())
  ) {
    return true
  }

  // Check work experience
  if (
    resumeData.workExperience &&
    Array.isArray(resumeData.workExperience) &&
    resumeData.workExperience.some((exp) => !isWorkExperienceEmpty(exp))
  ) {
    return true
  }

  // Check education
  if (
    resumeData.education &&
    Array.isArray(resumeData.education) &&
    resumeData.education.some((edu) => !isEducationEmpty(edu))
  ) {
    return true
  }

  // Check skills
  if (resumeData.skills && Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
    return true
  }

  // Check certifications
  if (
    resumeData.certifications &&
    Array.isArray(resumeData.certifications) &&
    resumeData.certifications.some((cert) => !isCertificationEmpty(cert))
  ) {
    return true
  }

  // Check languages
  if (
    resumeData.languages &&
    Array.isArray(resumeData.languages) &&
    resumeData.languages.some((lang) => !isLanguageEmpty(lang))
  ) {
    return true
  }

  // Check job application
  if (
    resumeData.jobApplication &&
    (resumeData.jobApplication.jobTitle?.trim() || resumeData.jobApplication.jobDescription?.trim())
  ) {
    return true
  }

  return false
}

/**
 * Calculate resume completion percentage
 */
export const getResumeCompletionStatus = (resumeData) => {
  if (!resumeData) {
    return { percentage: 0, completed: [], missing: [] }
  }

  const checks = {
    personalInfo: false,
    workExperience: false,
    education: false,
    skills: false,
    jobApplication: false,
  }

  const completed = []
  const missing = []

  // Personal Info
  if (
    resumeData.personalInfo?.name?.trim() &&
    resumeData.personalInfo?.email?.trim() &&
    resumeData.personalInfo?.phone?.trim()
  ) {
    checks.personalInfo = true
    completed.push('Personal Info')
  } else {
    missing.push('Personal Info')
  }

  // Work Experience
  if (
    resumeData.workExperience &&
    Array.isArray(resumeData.workExperience) &&
    resumeData.workExperience.some((exp) => !isWorkExperienceEmpty(exp))
  ) {
    checks.workExperience = true
    completed.push('Work Experience')
  } else {
    missing.push('Work Experience')
  }

  // Education
  if (
    resumeData.education &&
    Array.isArray(resumeData.education) &&
    resumeData.education.some((edu) => !isEducationEmpty(edu))
  ) {
    checks.education = true
    completed.push('Education')
  }

  // Skills
  if (resumeData.skills && Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
    checks.skills = true
    completed.push('Skills')
  }

  // Job Application
  if (
    resumeData.jobApplication?.jobTitle?.trim() &&
    resumeData.jobApplication?.jobDescription?.trim()
  ) {
    checks.jobApplication = true
    completed.push('Job Application')
  } else {
    missing.push('Job Application')
  }

  const totalChecks = Object.keys(checks).length
  const completedChecks = Object.values(checks).filter(Boolean).length
  const percentage = Math.round((completedChecks / totalChecks) * 100)

  return {
    percentage,
    completed,
    missing,
    isComplete: checks.personalInfo && checks.workExperience && checks.jobApplication,
  }
}

/**
 * Check if resume is ready for preview (has minimum required data)
 */
export const isResumeComplete = (resumeData) => {
  if (!resumeData) return false

  const status = getResumeCompletionStatus(resumeData)
  return status.isComplete
}

/**
 * Get quick stats summary for resume
 */
export const getResumeStats = (resumeData) => {
  if (!resumeData) {
    return {
      workExperience: 0,
      education: 0,
      skills: 0,
      certifications: 0,
      languages: 0,
    }
  }

  return {
    workExperience:
      resumeData.workExperience?.filter((exp) => !isWorkExperienceEmpty(exp)).length || 0,
    education: resumeData.education?.filter((edu) => !isEducationEmpty(edu)).length || 0,
    skills: resumeData.skills?.length || 0,
    certifications:
      resumeData.certifications?.filter((cert) => !isCertificationEmpty(cert)).length || 0,
    languages: resumeData.languages?.filter((lang) => !isLanguageEmpty(lang)).length || 0,
  }
}

