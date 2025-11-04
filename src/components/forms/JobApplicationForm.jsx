import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Toast from '../ui/Toast'
import { jobExtractionService } from '../../services/jobExtractionService'
import { groqService } from '../../services/groqService'

function JobApplicationForm({ data, onUpdate }) {
  const [jobUrl, setJobUrl] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState(null)
  const [extractionSuccess, setExtractionSuccess] = useState(false)
  const [toast, setToast] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: data,
  })

  const handleExtractFromURL = async () => {
    // Validate URL
    const validation = jobExtractionService.validateURL(jobUrl)
    if (!validation.valid) {
      setExtractionError(validation.error)
      setExtractionSuccess(false)
      return
    }

    setIsExtracting(true)
    setExtractionError(null)
    setExtractionSuccess(false)

    try {
      // Step 1: Fetch HTML from URL
      const html = await jobExtractionService.fetchJobPageHTML(jobUrl)
      
      // Step 2: Clean HTML
      const cleanedHTML = jobExtractionService.cleanHTML(html)
      
      // Step 3: Use AI to extract job information
      const result = await groqService.extractJobInfoFromHTML(cleanedHTML)

      if (result.success && result.data) {
        const extractedData = result.data
        
        // Pre-fill form fields (only if empty or if user wants to overwrite)
        if (extractedData.jobTitle) {
          setValue('jobTitle', extractedData.jobTitle)
        }
        if (extractedData.jobDescription) {
          setValue('jobDescription', extractedData.jobDescription)
        }

        setExtractionSuccess(true)
        setExtractionError(null)
        setToast({ message: 'Job information extracted successfully! Please review the fields below.', type: 'success' })
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setExtractionSuccess(false)
        }, 5000)
      } else {
        setExtractionError(
          result.error || 
          'Could not extract job information. Please try copying the job description manually.'
        )
      }
    } catch (error) {
      console.error('Error extracting from URL:', error)
      setExtractionError(
        error.message || 
        'Failed to extract job information. This may be due to CORS restrictions or the site blocking automated access. Please try copying the job description manually.'
      )
    } finally {
      setIsExtracting(false)
    }
  }

  const onSubmit = (formData) => {
    onUpdate(formData)
  }

  return (
    <Card title="Job Application Details">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* URL Extraction Section */}
        <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <label htmlFor="job-url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Extract from Job URL (Optional)
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Enter a job posting URL to automatically extract the job title and description. 
            Works best for sites that allow sharing. Some sites (like JobStreet, Indeed) may require manual entry due to restrictions.
          </p>
          <div className="flex gap-2">
            <input
              id="job-url-input"
              type="url"
              value={jobUrl}
              onChange={(e) => {
                setJobUrl(e.target.value)
                setExtractionError(null)
                setExtractionSuccess(false)
              }}
              placeholder="https://jobstreet.com/job/... or https://indeed.com/viewjob?..."
              disabled={isExtracting}
              aria-label="Job posting URL"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            <Button
              type="button"
              onClick={handleExtractFromURL}
              disabled={isExtracting || !jobUrl.trim()}
              className="whitespace-nowrap"
            >
              {isExtracting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin" aria-hidden="true">⏳</span>
                  Extracting...
                </span>
              ) : (
                'Extract'
              )}
            </Button>
          </div>
          {isExtracting && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400" role="status" aria-live="polite">
              <span className="animate-spin" aria-hidden="true">⏳</span>
              <span>Fetching and extracting job information...</span>
            </div>
          )}
          {extractionSuccess && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded" role="alert">
              ✓ Job information extracted successfully! Please review the fields below.
            </div>
          )}
          {extractionError && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded" role="alert">
              ⚠ {extractionError}
            </div>
          )}
        </div>

        <Input
          label="Job Title *"
          {...register('jobTitle', { required: 'Job title is required' })}
          error={errors.jobTitle?.message}
          placeholder="e.g., Senior Software Engineer"
        />

        <Textarea
          label="Job Description *"
          rows={8}
          {...register('jobDescription', {
            required: 'Job description is required',
          })}
          error={errors.jobDescription?.message}
          placeholder="Paste the job description here. The AI will use this to tailor your resume..."
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
        >
          Save Job Application Details
        </Button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </Card>
  )
}

export default JobApplicationForm

