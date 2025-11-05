import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useResumeData } from '../hooks/useResumeData'
import Stepper from '../components/ui/Stepper'
import Button from '../components/ui/Button'
import Toast from '../components/ui/Toast'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import WorkflowProgress from '../components/ui/WorkflowProgress'
import KeyboardShortcuts from '../components/ui/KeyboardShortcuts'
import AutoSaveIndicator from '../components/ui/AutoSaveIndicator'
import PersonalInfoForm from '../components/forms/PersonalInfoForm'
import WorkExperienceForm from '../components/forms/WorkExperienceForm'
import EducationForm from '../components/forms/EducationForm'
import SkillsForm from '../components/forms/SkillsForm'
import CertificationsForm from '../components/forms/CertificationsForm'
import LanguagesForm from '../components/forms/LanguagesForm'
import JobApplicationForm from '../components/forms/JobApplicationForm'

// Steps for regular navigation (Job Application is optional)
const regularSteps = [
  'Personal Info',
  'Work Experience',
  'Education',
  'Skills',
  'Certifications',
  'Languages',
]

// All steps including Job Application (for AI Resume generation)
const allSteps = [
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
  const [searchParams, setSearchParams] = useSearchParams()
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
    resetResumeData,
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

  // Handle "new=true" query parameter to start a fresh application
  useEffect(() => {
    if (isLoaded && searchParams.get('new') === 'true') {
      resetResumeData()
      setCurrentStep(1)
      localStorage.setItem('lastBuilderStep', '1')
      // Remove the query parameter from URL
      setSearchParams({}, { replace: true })
      setToast({ message: 'Starting a new application', type: 'success', duration: 2000 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, searchParams])

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
    // Use regularSteps for navigation (Job Application is optional)
    const maxStep = regularSteps.length
    if (currentStep < maxStep) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      localStorage.setItem('lastBuilderStep', nextStep.toString())
    } else if (currentStep === maxStep && currentStep < allSteps.length) {
      // Allow navigation to Job Application if user wants, but it's optional
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
    // Job Application is only required for AI Resume generation
    if (!resumeData.jobApplication?.jobTitle?.trim() || !resumeData.jobApplication?.jobDescription?.trim()) {
      setToast({ 
        message: 'Job Title and Job Description are required for AI Resume generation. Please fill them in.', 
        type: 'error',
        duration: 5000
      })
      // Navigate to Job Application step (step 7)
      setCurrentStep(allSteps.length)
      localStorage.setItem('lastBuilderStep', allSteps.length.toString())
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
          />
        )
      case 2:
        return (
          <WorkExperienceForm
            experiences={resumeData.workExperience || []}
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
          <SkillsForm 
            skills={resumeData.skills} 
            onUpdate={updateSkills}
            workExperience={resumeData.workExperience}
          />
        )
      case 5:
        return (
          <CertificationsForm
            certifications={resumeData.certifications || []}
            onAdd={addCertification}
            onUpdate={updateCertification}
            onRemove={removeCertification}
          />
        )
      case 6:
        return (
          <LanguagesForm
            languages={resumeData.languages || []}
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Build Resume', path: null },
          ]}
        />
        <WorkflowProgress />
        
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Build Your Resume
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Fill in your details step by step. Your progress is automatically saved.
                </p>
                <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="hidden sm:flex whitespace-nowrap"
            >
              ← Home
            </Button>
          </div>
        </div>

        <Stepper
          steps={regularSteps}
          currentStep={currentStep <= regularSteps.length ? currentStep : regularSteps.length}
          onStepClick={(stepNumber) => {
            // Only allow clicking on regular steps
            if (stepNumber <= regularSteps.length) {
              handleStepClick(stepNumber)
            }
          }}
        />

        <div className="max-w-3xl mx-auto mb-24 sm:mb-20 pb-4">
          {renderStepContent()}
        </div>

        {/* Floating Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 py-2.5 sm:py-3">
              {/* Previous Button */}
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="w-full sm:w-auto sm:flex-shrink-0 order-2 sm:order-1 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-4 sm:px-4 py-2 touch-manipulation"
              >
                ← Previous
              </Button>

              {/* Right Side Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:flex-shrink-0 order-1 sm:order-2">
                {currentStep < regularSteps.length ? (
                  <Button 
                    onClick={handleNext}
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-4 sm:px-4 py-2 touch-manipulation"
                    disabled={isNavigating}
                  >
                    Next →
                  </Button>
                ) : currentStep === regularSteps.length ? (
                  // Show both options at the last regular step
                  <>
                    <Button 
                      onClick={handleNext}
                      variant="outline"
                      className="w-full sm:w-auto sm:flex-1 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-3 sm:px-4 py-2 touch-manipulation"
                      disabled={isNavigating}
                    >
                      <span className="hidden sm:inline">Add Job Details</span>
                      <span className="sm:hidden">Job Details</span>
                      <span className="hidden md:inline"> →</span>
                    </Button>
                    <Button 
                      onClick={handleGenerateResume} 
                      variant="primary"
                      className="w-full sm:w-auto sm:flex-1 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-3 sm:px-4 py-2 touch-manipulation"
                      disabled={isNavigating}
                    >
                      {isNavigating ? (
                        <>
                          <span className="animate-spin inline-block mr-1">⏳</span>
                          <span className="hidden sm:inline">Generating...</span>
                          <span className="sm:hidden">Generating</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Generate Resume</span>
                          <span className="sm:hidden">Generate</span>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  // At Job Application step, only show Generate Resume
                  <Button 
                    onClick={handleGenerateResume} 
                    variant="primary"
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-4 sm:px-4 py-2 touch-manipulation"
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <>
                        <span className="animate-spin inline-block mr-1">⏳</span>
                        <span className="hidden sm:inline">Generating...</span>
                        <span className="sm:hidden">Generating</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Generate Resume</span>
                        <span className="sm:hidden">Generate</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
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
