import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeData } from '../hooks/useResumeData'
import { groqService } from '../services/groqService'
import { pdfService } from '../services/pdfService'
import ResumePreview from '../components/resume/ResumePreview'
import TemplateSelector from '../components/resume/TemplateSelector'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Toast from '../components/ui/Toast'

function Preview() {
  const navigate = useNavigate()
  const resumeRef = useRef(null)
  const { resumeData, isLoaded } = useResumeData()
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if we have minimal data to generate resume
    if (isLoaded && (!resumeData.personalInfo.name || !resumeData.jobApplication.jobTitle)) {
      // Redirect to builder if data is incomplete
      navigate('/builder')
    }
  }, [isLoaded, resumeData, navigate])

  const handleGenerateResume = async () => {
    if (!resumeData.jobApplication.jobTitle || !resumeData.jobApplication.jobDescription) {
      setError('Please provide job title and description to generate a tailored resume.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await groqService.generateResumeContent(
        resumeData,
        resumeData.jobApplication
      )

      if (result.success) {
        setGeneratedContent(result.data)
      } else {
        setError(result.error || 'Failed to generate resume content')
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating the resume')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      setError('Resume element not found')
      return
    }

    setIsGeneratingPDF(true)
    setError(null)

    try {
      const personalName = resumeData.personalInfo.name || 'Resume'
      const filename = `${personalName.replace(/\s+/g, '_')}_Resume.pdf`
      
      await pdfService.generatePDF(resumeRef.current, filename)
    } catch (err) {
      setError(err.message || 'Failed to generate PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Resume Preview
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review your AI-generated resume and choose a template
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/builder')}
              className="w-full sm:w-auto"
            >
              Edit Resume
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isGeneratingPDF}
              className="w-full sm:w-auto"
            >
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            </Card>

            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generate AI Resume
                </h3>
                <p className="text-sm text-gray-600">
                  Use AI to tailor your resume content to the job description.
                </p>
                <Button
                  onClick={handleGenerateResume}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    'Generate AI Resume'
                  )}
                </Button>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                {generatedContent && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">
                      ✓ Resume generated successfully!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 overflow-x-auto" ref={resumeRef}>
              <ResumePreview
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                generatedContent={generatedContent}
              />
            </div>
          </div>
        </div>

        {error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setError(null)}
            duration={5000}
          />
        )}
      </div>
    </div>
  )
}

export default Preview
