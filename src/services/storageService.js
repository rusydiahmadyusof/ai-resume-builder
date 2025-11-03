const STORAGE_KEY = 'resume_data'

export const storageService = {
  // Save resume data to localStorage
  saveResumeData: (data) => {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(STORAGE_KEY, serialized)
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
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

