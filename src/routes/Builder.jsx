import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeData } from '../hooks/useResumeData'
import Stepper from '../components/ui/Stepper'
import Button from '../components/ui/Button'
import Toast from '../components/ui/Toast'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import WorkflowProgress from '../components/ui/WorkflowProgress'
import KeyboardShortcuts from '../components/ui/KeyboardShortcuts'
import AutoSaveIndicator from '../components/ui/AutoSaveIndicator'
import VersionManager from '../components/ui/VersionManager'
import ExportImport from '../components/ui/ExportImport'
import PersonalInfoForm from '../components/forms/PersonalInfoForm'
import WorkExperienceForm from '../components/forms/WorkExperienceForm'
import EducationForm from '../components/forms/EducationForm'
import SkillsForm from '../components/forms/SkillsForm'
import CertificationsForm from '../components/forms/CertificationsForm'
import LanguagesForm from '../components/forms/LanguagesForm'
import JobApplicationForm from '../components/forms/JobApplicationForm'
import { formatDateToMonth } from '../utils/dateFormat'

const steps = [
  'Personal Info',
  'Work Experience',
  'Education',
  'Skills',
  'Certifications',
  'Languages',
  'Job Application',
]

function Builder() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(() => {
    // Load last step from localStorage
    const savedStep = localStorage.getItem('lastBuilderStep')
    return savedStep ? parseInt(savedStep, 10) : 1
  })
  const [toast, setToast] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const {
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
  } = useResumeData()

  // Show storage error as toast
  useEffect(() => {
    if (storageError) {
      let message = storageError.message
      if (storageError.type === 'QUOTA_EXCEEDED' && storageError.suggestions) {
        message += '\n\n' + storageError.suggestions.join('\n')
      }
      setToast({ message, type: 'error', duration: 10000 })
    }
  }, [storageError])

  // Save step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastBuilderStep', currentStep.toString())
  }, [currentStep])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      localStorage.setItem('lastBuilderStep', nextStep.toString())
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      localStorage.setItem('lastBuilderStep', prevStep.toString())
    }
  }

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber)
    // Save current step to localStorage
    localStorage.setItem('lastBuilderStep', stepNumber.toString())
  }

  const handleGenerateResume = async () => {
    // Basic validation
    if (!resumeData.personalInfo.name) {
      setToast({ message: 'Please fill in your name first', type: 'error' })
      setCurrentStep(1)
      localStorage.setItem('lastBuilderStep', '1')
      return
    }
    if (resumeData.workExperience.length === 0 || !resumeData.workExperience[0].company) {
      setToast({ message: 'Please add at least one work experience', type: 'error' })
      setCurrentStep(2)
      localStorage.setItem('lastBuilderStep', '2')
      return
    }
    if (!resumeData.jobApplication?.jobTitle?.trim() || !resumeData.jobApplication?.jobDescription?.trim()) {
      setToast({ 
        message: 'Please fill in job application details. Both Job Title and Job Description are required.', 
        type: 'error',
        duration: 5000
      })
      setCurrentStep(7)
      localStorage.setItem('lastBuilderStep', '7')
      return
    }
    
    // Show loading state and navigate to preview
    setIsNavigating(true)
    setToast({ message: 'Generating your resume...', type: 'success', duration: 2000 })
    
    // Small delay for smooth transition
    setTimeout(() => {
      navigate('/preview')
    }, 500)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onUpdate={updatePersonalInfo}
            onWorkExperienceExtracted={(workExp) => {
              console.log('Raw extracted work experience:', workExp)
              
              // Filter out empty work experience entries and add extracted ones
              const validWorkExp = workExp.filter(exp => {
                if (!exp || typeof exp !== 'object') return false
                // Include if has at least company, position, or meaningful responsibilities
                const hasCompany = exp.company && exp.company.trim().length > 0
                const hasPosition = exp.position && exp.position.trim().length > 0
                const hasResponsibilities = exp.responsibilities && exp.responsibilities.trim().length > 10
                return hasCompany || hasPosition || hasResponsibilities
              })
              
              console.log('Valid work experience entries:', validWorkExp)
              
              if (validWorkExp.length === 0) {
                setToast({ 
                  message: 'No valid work experience found in PDF. Please add manually.', 
                  type: 'info',
                  duration: 4000
                })
                return
              }
              
              // Check if first work experience entry is empty
              const firstExp = resumeData.workExperience[0]
              const firstIsEmpty = firstExp && 
                !firstExp.company?.trim() && 
                !firstExp.position?.trim() && 
                !firstExp.responsibilities?.trim()
              
              // Process extracted entries
              validWorkExp.forEach((exp, index) => {
                setTimeout(() => {
                  // Determine if current based on endDate
                  const endDateStr = (exp.endDate || '').trim()
                  const isCurrent = !endDateStr || 
                    endDateStr.toLowerCase() === 'present' || 
                    endDateStr.toLowerCase() === 'current' ||
                    endDateStr.toLowerCase() === 'now' ||
                    endDateStr.toLowerCase() === 'till date'
                  
                  // Format dates to yyyy-MM format (required for HTML5 month input)
                  const formattedStartDate = formatDateToMonth(exp.startDate || '')
                  const formattedEndDate = isCurrent ? '' : formatDateToMonth(endDateStr)
                  
                  // Format the extracted data to match expected structure
                  const formattedExp = {
                    company: (exp.company || '').trim(),
                    position: (exp.position || '').trim(),
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    current: isCurrent,
                    responsibilities: (exp.responsibilities || '').trim(),
                  }
                  
                  console.log(`Processing work experience ${index + 1}:`, formattedExp)
                  
                  // If first entry is empty and this is the first extracted entry, update it instead of adding
                  if (index === 0 && firstIsEmpty && firstExp) {
                    console.log('Updating first empty work experience entry')
                    updateWorkExperience(firstExp.id, formattedExp)
                  } else {
                    // Add new entry for subsequent ones
                    console.log('Adding new work experience entry')
                    addWorkExperience(formattedExp)
                  }
                }, index * 100) // Stagger updates to avoid conflicts
              })
              
              // Automatically navigate to Work Experience section after a short delay
              setTimeout(() => {
                setCurrentStep(2)
                setToast({ 
                  message: `Extracted ${validWorkExp.length} work experience ${validWorkExp.length === 1 ? 'entry' : 'entries'}. Review and update if needed.`, 
                  type: 'success',
                  duration: 5000
                })
              }, validWorkExp.length * 100 + 200)
            }}
          />
        )
      case 2:
        return (
          <WorkExperienceForm
            experiences={resumeData.workExperience}
            onAdd={addWorkExperience}
            onUpdate={updateWorkExperience}
            onRemove={removeWorkExperience}
          />
        )
      case 3:
        return (
          <EducationForm
            education={resumeData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        )
      case 4:
        return (
          <SkillsForm skills={resumeData.skills} onUpdate={updateSkills} />
        )
      case 5:
        return (
          <CertificationsForm
            certifications={resumeData.certifications}
            onAdd={addCertification}
            onUpdate={updateCertification}
            onRemove={removeCertification}
          />
        )
      case 6:
        return (
          <LanguagesForm
            languages={resumeData.languages}
            onAdd={addLanguage}
            onUpdate={updateLanguage}
            onRemove={removeLanguage}
          />
        )
      case 7:
        return (
          <JobApplicationForm
            data={resumeData.jobApplication}
            onUpdate={updateJobApplication}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Build Resume', path: null },
          ]}
        />
        <WorkflowProgress />
        
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Build Your Resume
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Fill in your details step by step. Your progress is automatically saved.
                </p>
                <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="hidden sm:flex"
            >
              ← Home
            </Button>
          </div>
        </div>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            {renderStepContent()}
          </div>
          <div className="lg:col-span-1 space-y-4">
            <VersionManager
              resumeData={resumeData}
              onRestore={restoreResumeData}
            />
            <ExportImport
              resumeData={resumeData}
              onImport={restoreResumeData}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-4 sticky bottom-0 sm:relative z-10">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button 
              onClick={handleNext}
              className="w-full sm:w-auto order-1 sm:order-2"
              disabled={isNavigating}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleGenerateResume} 
              variant="primary"
              className="w-full sm:w-auto order-1 sm:order-2"
              disabled={isNavigating}
            >
              {isNavigating ? 'Generating...' : 'Generate Resume'}
            </Button>
          )}
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setToast(null)
              if (storageError) {
                clearStorageError()
              }
            }}
            duration={toast.duration || 3000}
          />
        )}
      </div>
    </div>
  )
}

export default Builder
