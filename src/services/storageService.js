const STORAGE_KEY = 'resume_data'

export const storageService = {
  // Save resume data to localStorage
  saveResumeData: (data) => {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(STORAGE_KEY, serialized)
      return { success: true, error: null }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      
      // Check if it's a quota exceeded error
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        // Calculate data size
        const dataSize = new Blob([serialized]).size
        const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2)
        
        return {
          success: false,
          error: {
            type: 'QUOTA_EXCEEDED',
            message: `Storage quota exceeded. Your resume data is ${dataSizeMB}MB, which exceeds the browser's storage limit.`,
            suggestions: [
              'Try exporting your resume data and clearing old data',
              'Remove large files like photos to free up space',
              'Clear browser cache and try again',
            ],
          },
        }
      }
      
      // Other errors
      return {
        success: false,
        error: {
          type: 'UNKNOWN',
          message: error.message || 'Failed to save data to localStorage',
        },
      }
    }
  },

  // Load resume data from localStorage
  loadResumeData: () => {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY)
      if (serialized === null) {
        return null
      }
      return JSON.parse(serialized)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  },

  // Clear resume data from localStorage
  clearResumeData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },
}

