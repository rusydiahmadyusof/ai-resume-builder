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
import KeyboardShortcuts from '../components/ui/KeyboardShortcuts'
import CoverLetterPreview from '../components/coverletter/CoverLetterPreview'
import AnalyticsDashboard from '../components/ui/AnalyticsDashboard'
import ResumeAnalytics from '../components/ui/ResumeAnalytics'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

function Preview() {
  const navigate = useNavigate()
  const resumeRef = useRef(null)
  const { resumeData, isLoaded, updateSkills } = useResumeData()
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [error, setError] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [coverLetter, setCoverLetter] = useState(null)
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)
  const [showTemplateSidebar, setShowTemplateSidebar] = useState(false)
  const [successToast, setSuccessToast] = useState(null)

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


  const handleGenerateResume = async () => {
    if (!resumeData.jobApplication.jobTitle || !resumeData.jobApplication.jobDescription) {
      setError('Please provide job title and description to generate a tailored resume.')
      return
    }

    if (!resumeData.workExperience || resumeData.workExperience.length === 0) {
      setError('Please add work experience to generate a resume with professional summary.')
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
        let generatedContent = result.data
        
        // Ensure summary is always included - generate it separately if missing
        if (!generatedContent.summary || generatedContent.summary.trim() === '') {
          console.log('Summary missing from response, generating separately...')
          const summaryResult = await groqService.generateSummary(resumeData, resumeData.jobApplication)
          if (summaryResult.success) {
            const summary = summaryResult.data?.summary || summaryResult.summary || ''
            generatedContent = {
              ...generatedContent,
              summary: summary,
            }
          }
        }
        
        // Ensure skills are generated - always generate from experience to supplement
        let generatedSkills = generatedContent.skills || []
        
        // If skills are missing or we want to supplement, generate from experience
        if (generatedSkills.length === 0 || resumeData.workExperience?.length > 0) {
          console.log('Generating skills from work experience...')
          const skillsResult = await groqService.recommendSkillsFromExperience(resumeData.workExperience)
          if (skillsResult.success && skillsResult.data && skillsResult.data.length > 0) {
            // Merge AI-generated skills with skills from main response
            const aiRecommendedSkills = skillsResult.data
            aiRecommendedSkills.forEach(skill => {
              const skillLower = skill.toLowerCase().trim()
              if (skillLower && !generatedSkills.some(existing => existing.toLowerCase().trim() === skillLower)) {
                generatedSkills.push(skill.trim())
              }
            })
          }
        }
        
        // Merge generated skills with existing skills (remove duplicates, case-insensitive)
        if (generatedSkills.length > 0) {
          const existingSkills = resumeData.skills || []
          
          // Combine and deduplicate skills (case-insensitive)
          const allSkills = [...existingSkills]
          generatedSkills.forEach(skill => {
            const skillLower = skill.toLowerCase().trim()
            if (skillLower && !allSkills.some(existing => existing.toLowerCase().trim() === skillLower)) {
              allSkills.push(skill.trim())
            }
          })
          
          // Limit to maximum 10 skills total
          const limitedSkills = allSkills.slice(0, 10)
          
          // Update resume data with merged skills (limited to 10)
          updateSkills(limitedSkills)
          
          // Update generatedContent to reflect merged skills (limited to 10)
          generatedContent = {
            ...generatedContent,
            skills: limitedSkills,
          }
        }
        
        setGeneratedContent(generatedContent)
        
        // Show floating success toast (short message only)
        setSuccessToast({
          message: '✓ Resume generated successfully!',
          type: 'success',
          duration: 3000
        })
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
      const jobTitle = resumeData.jobApplication?.jobTitle || ''
      const filename = jobTitle
        ? `${personalName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}_Resume.pdf`
        : `${personalName.replace(/\s+/g, '_')}_Resume.pdf`
      
      const pdfOptions = {
        quality: 2,
        format: 'a4',
        orientation: 'portrait',
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
    { keys: 'Ctrl+?', description: 'Show Shortcuts', context: 'Open keyboard shortcuts help' },
  ]

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar - Always Visible */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Title & Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                onClick={() => navigate('/builder')}
                className="hidden sm:flex items-center gap-2 px-2 sm:px-3 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <span>←</span>
                <span className="hidden md:inline">Edit</span>
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  Resume Preview
                </h1>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                onClick={handleGenerateResume}
                disabled={isGenerating}
                className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm min-w-[44px] sm:min-w-0"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span className="hidden lg:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span className="hidden lg:inline">Generate AI</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleGenerateCoverLetter({ tone: 'professional', length: 'medium', style: 'standard' })}
                disabled={isGeneratingCoverLetter}
                variant="outline"
                className="hidden md:flex items-center gap-1.5 px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
              >
                {isGeneratingCoverLetter ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span className="hidden lg:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <span>📝</span>
                    <span className="hidden lg:inline">Cover Letter</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowTemplateSidebar(!showTemplateSidebar)}
                variant="outline"
                className="lg:hidden px-3 h-9 sm:h-10 text-xs sm:text-sm min-w-[44px]"
                aria-label="Toggle template selector"
              >
                <span>{showTemplateSidebar ? '✕' : '🎨'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Analytics - Compact Top Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <ResumeAnalytics
            resumeData={resumeData}
            jobData={resumeData.jobApplication}
            generatedContent={generatedContent}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex gap-4 sm:gap-6 relative">
          {/* Template Selector Sidebar - Desktop: Always visible, Mobile: Drawer */}
          <div className={`
            ${showTemplateSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:sticky top-[112px] sm:top-[128px] left-0 z-40
            w-80 sm:w-96 lg:w-80 xl:w-96
            h-[calc(100vh-112px)] sm:h-[calc(100vh-128px)]
            bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
            overflow-y-auto custom-scrollbar
            transition-transform duration-300 ease-in-out
            lg:block lg:flex-shrink-0
            shadow-lg lg:shadow-none
          `}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Close button for mobile */}
              <div className="flex items-center justify-between lg:hidden mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Templates</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowTemplateSidebar(false)}
                  className="p-2 h-auto"
                  aria-label="Close templates"
                >
                  ✕
                </Button>
              </div>

              <Card className="p-3 sm:p-4">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelect={(template) => {
                    setSelectedTemplate(template)
                    setShowTemplateSidebar(false) // Close on mobile after selection
                  }}
                  recommendedTemplate={recommendedTemplate}
                />
              </Card>

              {/* Cover Letter Preview */}
              {coverLetter && (
                <Card className="p-3 sm:p-4">
                  <CoverLetterPreview
                    coverLetter={coverLetter}
                    personalInfo={resumeData.personalInfo}
                    jobTitle={resumeData.jobApplication?.jobTitle}
                  />
                </Card>
              )}
            </div>
          </div>

          {/* Overlay for mobile drawer */}
          {showTemplateSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setShowTemplateSidebar(false)}
              aria-hidden="true"
            />
          )}

          {/* Resume Preview - Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Action Buttons - Floating */}
            <div className="lg:hidden flex flex-wrap gap-2 mb-4">
              <Button
                onClick={handleGenerateResume}
                disabled={isGenerating}
                className="flex-1 min-h-[44px] text-sm"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🤖</span>
                    Generate AI Resume
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleGenerateCoverLetter({ tone: 'professional', length: 'medium', style: 'standard' })}
                disabled={isGeneratingCoverLetter}
                variant="outline"
                className="flex-1 min-h-[44px] text-sm"
              >
                {isGeneratingCoverLetter ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📝</span>
                    Cover Letter
                  </>
                )}
              </Button>
            </div>

            {/* Resume Preview Container */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg dark:shadow-xl overflow-hidden">
              <div
                className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-auto transition-transform duration-200"
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

            {/* Error Messages */}
            {error && (
              <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Toast Notifications */}
        {error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setError(null)}
            duration={5000}
          />
        )}
        {successToast && (
          <Toast
            message={successToast.message}
            type={successToast.type}
            onClose={() => setSuccessToast(null)}
            duration={successToast.duration || 5000}
          />
        )}

        <KeyboardShortcuts shortcuts={shortcutList} />
      </div>
    </div>
  )
}

export default Preview
