/**
 * Calculate completion progress for resume data
 */

/**
 * Check if personal info is complete
 */
const isPersonalInfoComplete = (personalInfo) => {
  return !!(
    personalInfo.name &&
    personalInfo.email &&
    personalInfo.phone
  )
}

/**
 * Check if work experience is complete
 */
const isWorkExperienceComplete = (workExperience) => {
  if (!workExperience || workExperience.length === 0) return false
  
  return workExperience.some((exp) => 
    exp.company && 
    exp.position && 
    exp.startDate
  )
}

/**
 * Check if education is complete
 */
const isEducationComplete = (education) => {
  if (!education || education.length === 0) return false
  
  return education.some((edu) => 
    edu.institution && 
    edu.degree
  )
}

/**
 * Check if skills are complete
 */
const isSkillsComplete = (skills) => {
  return skills && skills.length > 0
}

/**
 * Check if job application is complete
 */
const isJobApplicationComplete = (jobApplication) => {
  return !!(
    jobApplication.jobTitle &&
    jobApplication.jobDescription
  )
}

/**
 * Calculate overall completion percentage
 */
export const calculateProgress = (resumeData) => {
  const sections = {
    personalInfo: isPersonalInfoComplete(resumeData.personalInfo || {}),
    workExperience: isWorkExperienceComplete(resumeData.workExperience || []),
    education: isEducationComplete(resumeData.education || []),
    skills: isSkillsComplete(resumeData.skills || []),
    jobApplication: isJobApplicationComplete(resumeData.jobApplication || {}),
  }

  const completedCount = Object.values(sections).filter(Boolean).length
  const totalSections = Object.keys(sections).length
  const percentage = Math.round((completedCount / totalSections) * 100)

  return {
    sections,
    completedCount,
    totalSections,
    percentage,
  }
}

/**
 * Get completion status for each step
 */
export const getStepCompletionStatus = (resumeData, stepNumber) => {
  switch (stepNumber) {
    case 1: // Personal Info
      return isPersonalInfoComplete(resumeData.personalInfo || {})
    case 2: // Work Experience
      return isWorkExperienceComplete(resumeData.workExperience || [])
    case 3: // Education
      return isEducationComplete(resumeData.education || [])
    case 4: // Skills
      return isSkillsComplete(resumeData.skills || [])
    case 5: // Certifications (optional)
      return true // Always consider optional sections as complete
    case 6: // Languages (optional)
      return true // Always consider optional sections as complete
    case 7: // Job Application
      return isJobApplicationComplete(resumeData.jobApplication || {})
    default:
      return false
  }
}

