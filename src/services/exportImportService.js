/**
 * Export/Import service for resume data
 */

export const exportImportService = {
  /**
   * Export resume data as JSON file
   * @param {Object} resumeData - Resume data to export
   * @param {string} filename - Optional filename
   */
  exportToJSON: (resumeData, filename = null) => {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `resume_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      return { success: true }
    } catch (error) {
      console.error('Error exporting data:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Import resume data from JSON file
   * @param {File} file - JSON file to import
   * @returns {Promise<Object>} Import result
   */
  importFromJSON: async (file) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate data structure
      const validation = exportImportService.validateResumeData(data)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || 'Invalid resume data format',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error('Error importing data:', error)
      return {
        success: false,
        error: error.message || 'Failed to parse JSON file',
      }
    }
  },

  /**
   * Validate resume data structure
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result
   */
  validateResumeData: (data) => {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid data format' }
    }

    // Check for required top-level keys
    const requiredKeys = ['personalInfo', 'workExperience', 'education', 'skills', 'certifications', 'languages', 'jobApplication']
    const missingKeys = requiredKeys.filter(key => !(key in data))
    
    if (missingKeys.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missingKeys.join(', ')}`,
      }
    }

    // Validate personalInfo structure
    if (!data.personalInfo || typeof data.personalInfo !== 'object') {
      return { valid: false, error: 'Invalid personalInfo structure' }
    }

    // Validate arrays
    const arrayFields = ['workExperience', 'education', 'skills', 'certifications', 'languages']
    for (const field of arrayFields) {
      if (!Array.isArray(data[field])) {
        return { valid: false, error: `Invalid ${field} structure (must be array)` }
      }
    }

    // Validate jobApplication
    if (!data.jobApplication || typeof data.jobApplication !== 'object') {
      return { valid: false, error: 'Invalid jobApplication structure' }
    }

    return { valid: true }
  },

  /**
   * Export resume data as text (readable format)
   * @param {Object} resumeData - Resume data to export
   */
  exportToText: (resumeData) => {
    try {
      let text = 'RESUME DATA EXPORT\n'
      text += '='.repeat(50) + '\n\n'
      
      // Personal Info
      text += 'PERSONAL INFORMATION\n'
      text += '-'.repeat(50) + '\n'
      if (resumeData.personalInfo) {
        const pi = resumeData.personalInfo
        text += `Name: ${pi.name || 'N/A'}\n`
        text += `Email: ${pi.email || 'N/A'}\n`
        text += `Phone: ${pi.phone || 'N/A'}\n`
        text += `Address: ${pi.address || 'N/A'}\n`
        text += `LinkedIn: ${pi.linkedin || 'N/A'}\n`
        text += `GitHub: ${pi.github || 'N/A'}\n`
        text += `Portfolio: ${pi.portfolio || 'N/A'}\n`
        text += `Summary: ${pi.summary || 'N/A'}\n`
      }
      text += '\n'

      // Work Experience
      text += 'WORK EXPERIENCE\n'
      text += '-'.repeat(50) + '\n'
      if (resumeData.workExperience && resumeData.workExperience.length > 0) {
        resumeData.workExperience.forEach((exp, index) => {
          text += `\n${index + 1}. ${exp.position || 'N/A'} at ${exp.company || 'N/A'}\n`
          text += `   Period: ${exp.startDate || 'N/A'} - ${exp.current ? 'Present' : exp.endDate || 'N/A'}\n`
          text += `   Responsibilities: ${exp.responsibilities || 'N/A'}\n`
        })
      }
      text += '\n'

      // Education
      text += 'EDUCATION\n'
      text += '-'.repeat(50) + '\n'
      if (resumeData.education && resumeData.education.length > 0) {
        resumeData.education.forEach((edu, index) => {
          text += `\n${index + 1}. ${edu.degree || 'N/A'} in ${edu.field || 'N/A'}\n`
          text += `   Institution: ${edu.institution || 'N/A'}\n`
          text += `   Period: ${edu.startDate || 'N/A'} - ${edu.current ? 'Present' : edu.endDate || 'N/A'}\n`
        })
      }
      text += '\n'

      // Skills
      text += 'SKILLS\n'
      text += '-'.repeat(50) + '\n'
      if (resumeData.skills && resumeData.skills.length > 0) {
        text += resumeData.skills.join(', ') + '\n'
      }
      text += '\n'

      // Export as file
      const dataBlob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `resume_text_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error exporting to text:', error)
      return { success: false, error: error.message }
    }
  },
}

