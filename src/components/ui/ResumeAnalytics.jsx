import { useState, useMemo } from 'react'
import { atsService } from '../../services/atsService'

function ResumeAnalytics({ resumeData, jobData, generatedContent }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const analytics = useMemo(() => {
    if (!jobData?.jobDescription) {
      return null
    }

    const atsAnalysis = atsService.analyzeResume(resumeData, jobData)

    // Calculate keyword density
    const resumeText = buildResumeText(resumeData, generatedContent)
    const jobText = (jobData.jobTitle + ' ' + jobData.jobDescription).toLowerCase()
    const keywords = extractKeywords(jobText)
    const keywordDensity = calculateKeywordDensity(resumeText, keywords)

    // Calculate section lengths
    const sectionLengths = {
      workExperience: resumeData.workExperience?.reduce((sum, exp) => 
        sum + (exp.responsibilities?.length || 0), 0) || 0,
      education: resumeData.education?.reduce((sum, edu) => 
        sum + (edu.field?.length || 0), 0) || 0,
    }

    // Industry benchmarks
    const benchmarks = {
      workExperience: { ideal: 200, max: 500 },
      education: { ideal: 50, max: 150 },
    }

    return {
      ats: atsAnalysis,
      keywordDensity,
      sectionLengths,
      benchmarks,
      completeness: calculateCompleteness(resumeData),
    }
  }, [resumeData, jobData, generatedContent])

  if (!analytics) {
    return null
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-600 dark:bg-green-500'
    if (score >= 60) return 'bg-yellow-600 dark:bg-yellow-500'
    return 'bg-red-600 dark:bg-red-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header - Collapsed View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
              📊 Resume Analytics
            </h3>
          </div>
          
          {/* Key Metrics - Always Visible */}
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            <div className={`px-3 py-1.5 rounded-lg ${getScoreColor(analytics.ats.score)} flex items-center gap-2 min-w-fit`}>
              <span className="text-xs font-medium">ATS Score</span>
              <span className="text-sm sm:text-base font-bold">{analytics.ats.score}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center gap-2 min-w-fit">
              <span className="text-xs font-medium">Completeness</span>
              <span className="text-sm sm:text-base font-bold">{analytics.completeness.percentage}%</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center gap-2 min-w-fit">
              <span className="text-xs font-medium">Keywords</span>
              <span className="text-sm sm:text-base font-bold">{analytics.keywordDensity.matched.length}</span>
            </div>
          </div>
        </div>
        
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'keywords'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Keywords
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'sections'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Sections
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analytics.ats.score}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">ATS Score</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analytics.completeness.percentage}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Completeness</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analytics.keywordDensity.matched.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Keywords Found</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {analytics.keywordDensity.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Keyword Density</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">Score Breakdown</h4>
                {Object.entries(analytics.ats.sections).map(([key, section]) => (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {section.score}/{section.maxScore}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreBgColor((section.score / section.maxScore) * 100)}`}
                        style={{
                          width: `${(section.score / section.maxScore) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
                  Keyword Density: {analytics.keywordDensity.percentage.toFixed(1)}%
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Ideal range: 2-5%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      analytics.keywordDensity.percentage >= 2 && analytics.keywordDensity.percentage <= 5
                        ? 'bg-green-600 dark:bg-green-500'
                        : analytics.keywordDensity.percentage > 5
                        ? 'bg-yellow-600 dark:bg-yellow-500'
                        : 'bg-red-600 dark:bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (analytics.keywordDensity.percentage / 5) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
                  Top Keywords Found ({analytics.keywordDensity.matched.length}/{analytics.keywordDensity.totalKeywords})
                </h4>
                <div className="flex flex-wrap gap-1">
                  {analytics.keywordDensity.matched.slice(0, 20).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              {Object.entries(analytics.sectionLengths).map(([section, length]) => {
                const benchmark = analytics.benchmarks[section]
                const status = length >= benchmark.ideal && length <= benchmark.max
                  ? 'good'
                  : length < benchmark.ideal
                  ? 'short'
                  : 'long'

                return (
                  <div key={section} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize text-sm">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-xs font-medium ${
                        status === 'good' ? 'text-green-600 dark:text-green-400' :
                        status === 'short' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {length} chars
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Ideal: {benchmark.ideal}-{benchmark.max} characters
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          status === 'good' ? 'bg-green-600 dark:bg-green-500' :
                          status === 'short' ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (length / benchmark.max) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper functions (same as AnalyticsDashboard)
function buildResumeText(resumeData, generatedContent) {
  const parts = []

  if (generatedContent?.workExperience || resumeData.workExperience) {
    const workExp = generatedContent?.workExperience || resumeData.workExperience
    workExp.forEach(exp => {
      if (exp.position) parts.push(exp.position)
      if (exp.company) parts.push(exp.company)
      if (exp.responsibilities) parts.push(exp.responsibilities)
    })
  }

  if (resumeData.skills) {
    parts.push(resumeData.skills.join(' '))
  }

  return parts.join(' ').toLowerCase()
}

function extractKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  ])

  const words = text.match(/\b[a-z]{3,}\b/gi) || []
  const wordCount = {}
  
  words.forEach(word => {
    const lower = word.toLowerCase()
    if (!stopWords.has(lower)) {
      wordCount[lower] = (wordCount[lower] || 0) + 1
    }
  })

  return Object.entries(wordCount)
    .filter(([_, count]) => count >= 2)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 30)
    .map(([word]) => word)
}

function calculateKeywordDensity(resumeText, keywords) {
  const resumeWords = resumeText.split(/\s+/).length
  const matchedKeywords = keywords.filter(keyword => 
    resumeText.includes(keyword)
  )

  const keywordOccurrences = matchedKeywords.reduce((sum, keyword) => {
    const regex = new RegExp(keyword, 'gi')
    const matches = resumeText.match(regex)
    return sum + (matches ? matches.length : 0)
  }, 0)

  const percentage = resumeWords > 0 
    ? (keywordOccurrences / resumeWords) * 100 
    : 0

  return {
    percentage,
    matched: matchedKeywords,
    totalKeywords: keywords.length,
    occurrences: keywordOccurrences,
  }
}

function calculateCompleteness(resumeData) {
  let completed = 0
  const total = 6

  if (resumeData.personalInfo?.name) completed++
  if (resumeData.personalInfo?.email) completed++
  if (resumeData.workExperience && resumeData.workExperience.length > 0) completed++
  if (resumeData.education && resumeData.education.length > 0) completed++
  if (resumeData.skills && resumeData.skills.length > 0) completed++
  if (resumeData.jobApplication?.jobTitle) completed++

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  }
}

export default ResumeAnalytics

