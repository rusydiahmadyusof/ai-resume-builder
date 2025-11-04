import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeData } from '../hooks/useResumeData'
import { groqService } from '../services/groqService'
import { pdfService } from '../services/pdfService'
import { recommendTemplate } from '../utils/templateRecommendation'
import ResumePreview from '../components/resume/ResumePreview'
import TemplateSelector from '../components/resume/TemplateSelector'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Toast from '../components/ui/Toast'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import WorkflowProgress from '../components/ui/WorkflowProgress'
import PreviewControls from '../components/ui/PreviewControls'
import PreviewStats from '../components/ui/PreviewStats'
import PDFOptions from '../components/ui/PDFOptions'
import KeyboardShortcuts from '../components/ui/KeyboardShortcuts'
import ATSAnalysis from '../components/ui/ATSAnalysis'
import CoverLetterOptions from '../components/coverletter/CoverLetterOptions'
import CoverLetterPreview from '../components/coverletter/CoverLetterPreview'
import ResumeComparison from '../components/ui/ResumeComparison'
import AnalyticsDashboard from '../components/ui/AnalyticsDashboard'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { versionService } from '../services/versionService'

function Preview() {
  const navigate = useNavigate()
  const resumeRef = useRef(null)
  const { resumeData, isLoaded } = useResumeData()
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [error, setError] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [coverLetter, setCoverLetter] = useState(null)
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)
  const [savedVersions, setSavedVersions] = useState([])

  // Calculate recommended template based on job title and description
  const recommendedTemplate = useMemo(() => {
    if (!resumeData.jobApplication?.jobTitle && !resumeData.jobApplication?.jobDescription) {
      return null
    }
    return recommendTemplate(
      resumeData.jobApplication.jobTitle || '',
      resumeData.jobApplication.jobDescription || ''
    )
  }, [resumeData.jobApplication?.jobTitle, resumeData.jobApplication?.jobDescription])

  // Set recommended template as default if available (only once)
  useEffect(() => {
    if (recommendedTemplate && selectedTemplate === 'modern') {
      setSelectedTemplate(recommendedTemplate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedTemplate])

  useEffect(() => {
    // Check if we have minimal data to generate resume
    if (isLoaded && (!resumeData.personalInfo.name || !resumeData.jobApplication.jobTitle)) {
      // Redirect to builder if data is incomplete
      navigate('/builder')
    }
  }, [isLoaded, resumeData, navigate])

  // Load saved versions
  useEffect(() => {
    if (isLoaded) {
      const versions = versionService.getAllVersions()
      setSavedVersions(versions)
    }
  }, [isLoaded])

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

  const handleDownloadPDF = async (options = {}) => {
    if (!resumeRef.current) {
      setError('Resume element not found')
      return
    }

    setIsGeneratingPDF(true)
    setError(null)

    try {
      const personalName = resumeData.personalInfo.name || 'Resume'
      const jobTitle = resumeData.jobApplication?.jobTitle || ''
      const filename = jobTitle
        ? `${personalName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}_Resume.pdf`
        : `${personalName.replace(/\s+/g, '_')}_Resume.pdf`
      
      const pdfOptions = {
        quality: options.quality || 2,
        format: options.format || 'a4',
        orientation: options.orientation || 'portrait',
        metadata: {
          title: `${personalName} - Resume`,
          author: personalName,
          subject: jobTitle || 'Resume',
        },
      }
      
      await pdfService.generatePDF(resumeRef.current, filename, pdfOptions)
    } catch (err) {
      setError(err.message || 'Failed to generate PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFullScreen = () => {
    if (!resumeRef.current) return

    if (!isFullScreen) {
      if (resumeRef.current.requestFullscreen) {
        resumeRef.current.requestFullscreen()
      } else if (resumeRef.current.webkitRequestFullscreen) {
        resumeRef.current.webkitRequestFullscreen()
      } else if (resumeRef.current.msRequestFullscreen) {
        resumeRef.current.msRequestFullscreen()
      }
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullScreen(false)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  const handleGenerateCoverLetter = async (options) => {
    if (!resumeData.jobApplication.jobTitle || !resumeData.jobApplication.jobDescription) {
      setError('Please provide job title and description to generate a cover letter.')
      return
    }

    setIsGeneratingCoverLetter(true)
    setError(null)

    try {
      const result = await groqService.generateCoverLetter(
        resumeData.personalInfo,
        resumeData.jobApplication,
        options
      )

      if (result.success) {
        setCoverLetter(result.data.coverLetter)
      } else {
        setError(result.error || 'Failed to generate cover letter')
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating the cover letter')
    } finally {
      setIsGeneratingCoverLetter(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Keyboard shortcuts for Preview page
  const shortcuts = {
    'ctrl+p': () => handlePrint(),
    'ctrl+f': () => handleFullScreen(),
    'ctrl+=': () => handleZoomIn(),
    'ctrl+-': () => handleZoomOut(),
    'ctrl+0': () => handleResetZoom(),
    'ctrl+d': () => handleDownloadPDF(),
    'ctrl+?': () => {
      // Toggle shortcuts help - handled by KeyboardShortcuts component
    },
  }

  useKeyboardShortcuts(shortcuts, [zoomLevel, isFullScreen])

  const shortcutList = [
    { keys: 'Ctrl+P', description: 'Print Preview', context: 'Open print dialog' },
    { keys: 'Ctrl+F', description: 'Toggle Fullscreen', context: 'Enter/exit fullscreen mode' },
    { keys: 'Ctrl++', description: 'Zoom In', context: 'Increase preview zoom' },
    { keys: 'Ctrl+-', description: 'Zoom Out', context: 'Decrease preview zoom' },
    { keys: 'Ctrl+0', description: 'Reset Zoom', context: 'Reset zoom to 100%' },
    { keys: 'Ctrl+D', description: 'Download PDF', context: 'Generate and download PDF' },
    { keys: 'Ctrl+?', description: 'Show Shortcuts', context: 'Open keyboard shortcuts help' },
  ]

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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Build Resume', path: '/builder' },
            { label: 'Preview', path: null },
          ]}
        />
        <WorkflowProgress />
        
        <div className="mb-6 space-y-4">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Resume Preview
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Review your AI-generated resume and choose a template
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/builder')}
                className="w-full sm:w-auto"
              >
                ← Edit Resume
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
                recommendedTemplate={recommendedTemplate}
              />
            </Card>

            <PreviewStats
              resumeData={resumeData}
              generatedContent={generatedContent}
            />

            <ATSAnalysis
              resumeData={resumeData}
              jobData={resumeData.jobApplication}
            />

            <PDFOptions
              onDownload={handleDownloadPDF}
              isGenerating={isGeneratingPDF}
            />

            <CoverLetterOptions
              onGenerate={handleGenerateCoverLetter}
              isGenerating={isGeneratingCoverLetter}
            />

            {coverLetter && (
              <CoverLetterPreview
                coverLetter={coverLetter}
                personalInfo={resumeData.personalInfo}
                jobTitle={resumeData.jobApplication?.jobTitle}
              />
            )}

            <AnalyticsDashboard
              resumeData={resumeData}
              jobData={resumeData.jobApplication}
              generatedContent={generatedContent}
            />

            {savedVersions.length >= 2 && (
              <ResumeComparison
                versions={savedVersions}
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
              />
            )}

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
            <PreviewControls
              onPrint={handlePrint}
              onFullScreen={handleFullScreen}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
              zoomLevel={zoomLevel}
            />
            <div
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 overflow-x-auto transition-transform duration-200"
              ref={resumeRef}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                width: `${100 / zoomLevel}%`,
              }}
            >
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

        <KeyboardShortcuts shortcuts={shortcutList} />
      </div>
    </div>
  )
}

export default Preview
