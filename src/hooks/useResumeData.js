import { useState, useEffect } from 'react'
import { storageService } from '../services/storageService'
import { cleanEmptyEntries, hasResumeData } from '../utils/resumeHelpers'

const initialResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
    instagram: '',
    facebook: '',
    youtube: '',
    website: '',
    photo: '',
  },
  workExperience: [
    {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: '',
    },
  ],
  education: [
    {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    },
  ],
  skills: [],
  certifications: [],
  languages: [],
  jobApplication: {
    jobTitle: '',
    jobDescription: '',
  },
}

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState(initialResumeData)
  const [isLoaded, setIsLoaded] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle', 'saving', 'saved', 'error'
  const [lastSaved, setLastSaved] = useState(null)
  const [storageError, setStorageError] = useState(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = storageService.loadResumeData()
    if (savedData) {
      // Clean empty entries when loading
      const cleanedData = cleanEmptyEntries(savedData)
      setResumeData(cleanedData)
      // Save cleaned data back if it was modified
      if (hasResumeData(cleanedData)) {
        storageService.saveResumeData(cleanedData)
      }
    }
    setIsLoaded(true)
  }, [])

  // Update resume data and save to localStorage
  const updateResumeData = (section, data) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        [section]: data,
      }
      
      // Clean empty entries if we have meaningful data
      const cleaned = hasResumeData(updated) ? cleanEmptyEntries(updated) : updated
      
      // Set saving status
      setSaveStatus('saving')
      
      // Save to localStorage
      const result = storageService.saveResumeData(cleaned)
      
      // Handle result (could be boolean or object with success/error)
      const success = typeof result === 'boolean' ? result : (result.success !== false)
      
      // Update status based on result
      if (success) {
        setSaveStatus('saved')
        setLastSaved(Date.now())
        setStorageError(null)
        // Clear saved status after 3 seconds
        setTimeout(() => {
          setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev))
        }, 3000)
      } else {
        setSaveStatus('error')
        // Handle error details if available
        if (typeof result === 'object' && result.error) {
          setStorageError(result.error)
          // Clear error after 10 seconds
          setTimeout(() => {
            setStorageError(null)
            setSaveStatus('idle')
          }, 10000)
        } else {
          // Clear error status after 5 seconds
          setTimeout(() => {
            setSaveStatus((prev) => (prev === 'error' ? 'idle' : prev))
          }, 5000)
        }
      }
      
      return cleaned
    })
  }

  // Update personal info
  const updatePersonalInfo = (data) => {
    updateResumeData('personalInfo', { ...resumeData.personalInfo, ...data })
  }

  // Add work experience
  const addWorkExperience = (initialData = null) => {
    setResumeData((prev) => {
      // Generate unique ID using timestamp + random suffix to avoid collisions
      const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9)
      
      const newExp = {
        id: uniqueId,
        company: initialData?.company || '',
        position: initialData?.position || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        current: initialData?.current || false,
        responsibilities: initialData?.responsibilities || '',
      }
      
      // Ensure workExperience is an array
      const currentWorkExperience = Array.isArray(prev.workExperience) ? prev.workExperience : []
      
      const updated = {
        ...prev,
        workExperience: [...currentWorkExperience, newExp],
      }
      
      // Don't clean empty entries when adding a new entry - allow user to fill it in
      // The cleaning will happen on next save/update
      const cleaned = updated
      
      // Save to localStorage
      try {
        localStorage.setItem('resumeData', JSON.stringify(cleaned))
        setSaveStatus('saved')
        setLastSaved(Date.now())
        setStorageError(null)
        setTimeout(() => {
          setSaveStatus((status) => (status === 'saved' ? 'idle' : status))
        }, 3000)
      } catch (error) {
        console.error('Error saving resume data:', error)
        setSaveStatus('error')
        if (error.name === 'QuotaExceededError') {
          setStorageError({
            type: 'QUOTA_EXCEEDED',
            message: 'Storage quota exceeded. Please clear some data.',
            suggestions: [
              'Clear browser storage',
              'Export and delete old versions',
              'Remove unused resume data',
            ],
          })
        } else {
          setStorageError({
            type: 'UNKNOWN',
            message: error.message || 'Failed to save data',
          })
        }
        setTimeout(() => {
          setSaveStatus((status) => (status === 'error' ? 'idle' : status))
        }, 5000)
      }
      
      return cleaned
    })
  }

  // Update work experience
  const updateWorkExperience = (id, data) => {
    const updated = resumeData.workExperience.map((exp) =>
      exp.id === id ? { ...exp, ...data } : exp
    )
    updateResumeData('workExperience', updated)
  }

  // Remove work experience
  const removeWorkExperience = (id) => {
    const updated = resumeData.workExperience.filter((exp) => exp.id !== id)
    updateResumeData('workExperience', updated)
  }

  // Add education
  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    }
    updateResumeData('education', [...resumeData.education, newEdu])
  }

  // Update education
  const updateEducation = (id, data) => {
    const updated = resumeData.education.map((edu) =>
      edu.id === id ? { ...edu, ...data } : edu
    )
    updateResumeData('education', updated)
  }

  // Remove education
  const removeEducation = (id) => {
    const updated = resumeData.education.filter((edu) => edu.id !== id)
    updateResumeData('education', updated)
  }

  // Update skills
  const updateSkills = (skills) => {
    updateResumeData('skills', skills)
  }

  // Add certification
  const addCertification = () => {
    setResumeData((prev) => {
      // Generate unique ID using timestamp + random suffix to avoid collisions
      const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9)
      
      const newCert = {
        id: uniqueId,
        name: '',
        issuer: '',
        date: '',
        url: '',
      }
      
      // Ensure certifications is an array
      const currentCertifications = Array.isArray(prev.certifications) ? prev.certifications : []
      
      const updated = {
        ...prev,
        certifications: [...currentCertifications, newCert],
      }
      
      // Don't clean empty entries when adding a new entry - allow user to fill it in
      // The cleaning will happen on next save/update
      const cleaned = updated
      
      // Save to localStorage
      try {
        localStorage.setItem('resumeData', JSON.stringify(cleaned))
        setSaveStatus('saved')
        setLastSaved(Date.now())
        setStorageError(null)
        setTimeout(() => {
          setSaveStatus((status) => (status === 'saved' ? 'idle' : status))
        }, 3000)
      } catch (error) {
        console.error('Error saving resume data:', error)
        setSaveStatus('error')
        if (error.name === 'QuotaExceededError') {
          setStorageError({
            type: 'QUOTA_EXCEEDED',
            message: 'Storage quota exceeded. Please clear some data.',
            suggestions: [
              'Clear browser storage',
              'Export and delete old versions',
              'Remove unused resume data',
            ],
          })
        } else {
          setStorageError({
            type: 'UNKNOWN',
            message: error.message || 'Failed to save data',
          })
        }
        setTimeout(() => {
          setSaveStatus((status) => (status === 'error' ? 'idle' : status))
        }, 5000)
      }
      
      return cleaned
    })
  }

  // Update certification
  const updateCertification = (id, data) => {
    const currentCertifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : []
    const updated = currentCertifications.map((cert) =>
      cert.id === id ? { ...cert, ...data } : cert
    )
    updateResumeData('certifications', updated)
  }

  // Remove certification
  const removeCertification = (id) => {
    const currentCertifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : []
    const updated = currentCertifications.filter((cert) => cert.id !== id)
    updateResumeData('certifications', updated)
  }

  // Add language
  const addLanguage = () => {
    setResumeData((prev) => {
      // Generate unique ID using timestamp + random suffix to avoid collisions
      const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9)
      
      const newLang = {
        id: uniqueId,
        name: '',
        proficiency: 'Native',
      }
      
      // Ensure languages is an array
      const currentLanguages = Array.isArray(prev.languages) ? prev.languages : []
      
      const updated = {
        ...prev,
        languages: [...currentLanguages, newLang],
      }
      
      // Don't clean empty entries when adding a new entry - allow user to fill it in
      // The cleaning will happen on next save/update
      const cleaned = updated
      
      // Save to localStorage
      try {
        localStorage.setItem('resumeData', JSON.stringify(cleaned))
        setSaveStatus('saved')
        setLastSaved(Date.now())
        setStorageError(null)
        setTimeout(() => {
          setSaveStatus((status) => (status === 'saved' ? 'idle' : status))
        }, 3000)
      } catch (error) {
        console.error('Error saving resume data:', error)
        setSaveStatus('error')
        if (error.name === 'QuotaExceededError') {
          setStorageError({
            type: 'QUOTA_EXCEEDED',
            message: 'Storage quota exceeded. Please clear some data.',
            suggestions: [
              'Clear browser storage',
              'Export and delete old versions',
              'Remove unused resume data',
            ],
          })
        } else {
          setStorageError({
            type: 'UNKNOWN',
            message: error.message || 'Failed to save data',
          })
        }
        setTimeout(() => {
          setSaveStatus((status) => (status === 'error' ? 'idle' : status))
        }, 5000)
      }
      
      return cleaned
    })
  }

  // Update language
  const updateLanguage = (id, data) => {
    const currentLanguages = Array.isArray(resumeData.languages) ? resumeData.languages : []
    const updated = currentLanguages.map((lang) =>
      lang.id === id ? { ...lang, ...data } : lang
    )
    updateResumeData('languages', updated)
  }

  // Remove language
  const removeLanguage = (id) => {
    const currentLanguages = Array.isArray(resumeData.languages) ? resumeData.languages : []
    const updated = currentLanguages.filter((lang) => lang.id !== id)
    updateResumeData('languages', updated)
  }

  // Update job application
  const updateJobApplication = (data) => {
    updateResumeData('jobApplication', { ...resumeData.jobApplication, ...data })
  }

  // Reset all data
  const resetResumeData = () => {
    setResumeData(initialResumeData)
    storageService.clearResumeData()
  }

  // Clear storage error manually
  const clearStorageError = () => {
    setStorageError(null)
  }

  // Restore resume data from version
  const restoreResumeData = (data) => {
    setResumeData(data)
    storageService.saveResumeData(data)
  }

  return {
    resumeData,
    isLoaded,
    saveStatus,
    lastSaved,
    storageError,
    clearStorageError,
    restoreResumeData,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    updateJobApplication,
    resetResumeData,
  }
}

