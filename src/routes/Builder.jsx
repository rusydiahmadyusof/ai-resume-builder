import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeData } from '../hooks/useResumeData'
import Stepper from '../components/ui/Stepper'
import Button from '../components/ui/Button'
import Toast from '../components/ui/Toast'
import PersonalInfoForm from '../components/forms/PersonalInfoForm'
import WorkExperienceForm from '../components/forms/WorkExperienceForm'
import EducationForm from '../components/forms/EducationForm'
import SkillsForm from '../components/forms/SkillsForm'
import CertificationsForm from '../components/forms/CertificationsForm'
import LanguagesForm from '../components/forms/LanguagesForm'
import JobApplicationForm from '../components/forms/JobApplicationForm'

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
  const [currentStep, setCurrentStep] = useState(1)
  const [toast, setToast] = useState(null)
  const {
    resumeData,
    isLoaded,
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber)
  }

  const handleGenerateResume = () => {
    // Basic validation
    if (!resumeData.personalInfo.name) {
      setToast({ message: 'Please fill in your name first', type: 'error' })
      setCurrentStep(1)
      return
    }
    if (resumeData.workExperience.length === 0 || !resumeData.workExperience[0].company) {
      setToast({ message: 'Please add at least one work experience', type: 'error' })
      setCurrentStep(2)
      return
    }
    if (!resumeData.jobApplication.jobTitle || !resumeData.jobApplication.jobDescription) {
      setToast({ message: 'Please fill in job application details', type: 'error' })
      setCurrentStep(7)
      return
    }
    // Navigate to preview page
    navigate('/preview')
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Build Your Resume
          </h1>
          <p className="text-gray-600">
            Fill in your details step by step. Your progress is automatically saved.
          </p>
        </div>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="mb-6">{renderStepContent()}</div>

        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleGenerateResume} variant="primary">
              Generate Resume
            </Button>
          )}
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

export default Builder
