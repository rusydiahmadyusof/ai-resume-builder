import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { storageService } from '../services/storageService'
import { hasResumeData, isResumeComplete } from '../utils/resumeHelpers'
import ResumeStatusIndicator from '../components/ui/ResumeStatusIndicator'

function Home() {
  const [resumeData, setResumeData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedData = storageService.loadResumeData()
    setResumeData(savedData)
    setIsLoaded(true)
  }, [])

  const hasData = resumeData && hasResumeData(resumeData)
  const isComplete = resumeData && isResumeComplete(resumeData)

  const coreFeatures = [
    {
      icon: '🤖',
      title: 'AI-Powered Content',
      description: 'Tailor your resume to any job description using Groq AI (Llama 3.3 70B)',
    },
    {
      icon: '🎨',
      title: '20 Professional Templates',
      description: 'Choose from modern, ATS-friendly designs with smart recommendations',
    },
    {
      icon: '📄',
      title: 'Enhanced PDF Export',
      description: 'Download with quality, format, and orientation options',
    },
    {
      icon: '🎯',
      title: 'ATS Optimization',
      description: 'Optimize your resume to pass Applicant Tracking Systems',
    },
  ]

  const advancedFeatures = [
    {
      icon: '📝',
      title: 'Cover Letter Generation',
      description: 'AI-generated cover letters tailored to your job applications',
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Track completion status across all form sections',
    },
    {
      icon: '🔍',
      title: 'Preview Controls',
      description: 'Zoom, fullscreen, print preview, and statistics',
    },
    {
      icon: '⌨️',
      title: 'Keyboard Shortcuts',
      description: 'Navigate faster with convenient keyboard shortcuts',
    },
    {
      icon: '✅',
      title: 'Smart Validation',
      description: 'Comprehensive validation for email, phone, URLs, dates, and more',
    },
    {
      icon: '💾',
      title: 'Auto-Save',
      description: 'Automatic saving with visual indicators - never lose your work',
    },
    {
      icon: '📸',
      title: 'Headshot Support',
      description: 'Upload and display professional photos in your resume',
    },
    {
      icon: '🔒',
      title: 'Complete Privacy',
      description: 'All data stored locally in your browser - zero external tracking',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              AI Resume Builder
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-200 mb-4 font-medium">
              Create professional, AI-tailored resumes in minutes
            </p>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Zero cost. Powered by AI. Designed for your success.
            </p>
          </div>

          {isLoaded && hasData && (
            <div className="mb-8 animate-fade-in">
              <ResumeStatusIndicator resumeData={resumeData} />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12">
            {hasData ? (
              <>
                <Link
                  to="/builder"
                  className="inline-block bg-indigo-600 dark:bg-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-center min-h-[44px] flex items-center justify-center touch-manipulation"
                >
                  {isComplete ? 'Edit Resume' : 'Continue Building'}
                </Link>
                {isComplete && (
                  <Link
                    to="/preview"
                    className="inline-block bg-green-600 dark:bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-center min-h-[44px] flex items-center justify-center touch-manipulation"
                  >
                    View My Resume
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/builder"
                  className="inline-block bg-indigo-600 dark:bg-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-center min-h-[44px] flex items-center justify-center touch-manipulation"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/preview"
                  className="inline-block border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-center min-h-[44px] flex items-center justify-center touch-manipulation"
                >
                  View Example
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Core Features Section */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
            Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md dark:shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features Section */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            Advanced Features
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg px-4">
            Everything you need to create the perfect resume
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-lg shadow-md dark:shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-200 dark:border-gray-700 mx-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
            Why Choose AI Resume Builder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Fast & Easy
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a professional resume in minutes, not hours. Our intuitive interface guides you through every step.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Completely Free
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No hidden costs, no credit card required. All features are free forever, powered by Groq's free tier.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Job-Specific Optimization
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI tailors your resume content to match specific job descriptions, increasing your chances of getting noticed.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Your Privacy Matters
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All your data stays in your browser. We never store or sell your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto mt-12 sm:mt-16 text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
            Join thousands of job seekers who have created winning resumes with AI Resume Builder
          </p>
          <Link
            to="/builder"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-lg sm:text-xl font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-center min-h-[44px] flex items-center justify-center touch-manipulation mx-auto"
          >
            Start Building Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

