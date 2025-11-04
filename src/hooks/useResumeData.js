import { useState, useEffect } from 'react'
import { storageService } from '../services/storageService'

const initialResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    linkedin: '',
    github: '',
    portfolio: '',
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
      setResumeData(savedData)
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
      
      // Set saving status
      setSaveStatus('saving')
      
      // Save to localStorage
      const result = storageService.saveResumeData(updated)
      
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
      
      return updated
    })
  }

  // Update personal info
  const updatePersonalInfo = (data) => {
    updateResumeData('personalInfo', { ...resumeData.personalInfo, ...data })
  }

  // Add work experience
  const addWorkExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: '',
    }
    updateResumeData('workExperience', [...resumeData.workExperience, newExp])
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
    const newCert = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    }
    updateResumeData('certifications', [...resumeData.certifications, newCert])
  }

  // Update certification
  const updateCertification = (id, data) => {
    const updated = resumeData.certifications.map((cert) =>
      cert.id === id ? { ...cert, ...data } : cert
    )
    updateResumeData('certifications', updated)
  }

  // Remove certification
  const removeCertification = (id) => {
    const updated = resumeData.certifications.filter((cert) => cert.id !== id)
    updateResumeData('certifications', updated)
  }

  // Add language
  const addLanguage = () => {
    const newLang = {
      id: Date.now(),
      name: '',
      proficiency: 'Native',
    }
    updateResumeData('languages', [...resumeData.languages, newLang])
  }

  // Update language
  const updateLanguage = (id, data) => {
    const updated = resumeData.languages.map((lang) =>
      lang.id === id ? { ...lang, ...data } : lang
    )
    updateResumeData('languages', updated)
  }

  // Remove language
  const removeLanguage = (id) => {
    const updated = resumeData.languages.filter((lang) => lang.id !== id)
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

