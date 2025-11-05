import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { storageService } from '../services/storageService'
import { hasResumeData, isResumeComplete } from '../utils/resumeHelpers'
import ResumeStatusIndicator from '../components/ui/ResumeStatusIndicator'
import Button from '../components/ui/Button'

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            AI Resume Builder
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
            Create professional, AI-tailored resumes in minutes
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Zero cost. Powered by AI. Designed for your success.
          </p>
        </div>

        {isLoaded && hasData && (
          <div className="mb-8 animate-fade-in">
            <ResumeStatusIndicator resumeData={resumeData} />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {hasData ? (
            <>
              <Link
                to="/builder"
                className="inline-block bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {isComplete ? 'Edit Resume' : 'Continue Building'}
              </Link>
              {isComplete && (
                <Link
                  to="/preview"
                  className="inline-block bg-green-600 dark:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  View My Resume
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/builder"
                className="inline-block bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
              <Link
                to="/preview"
                className="inline-block border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                View Example
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md dark:shadow-lg">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tailor your resume to any job description using AI</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md dark:shadow-lg">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Multiple Templates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose from professional, modern designs</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md dark:shadow-lg">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Free Forever</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">No costs, no credit card required</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

