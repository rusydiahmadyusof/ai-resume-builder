import { useState, useMemo } from 'react'
import Card from './Card'
import { atsService } from '../../services/atsService'

function AnalyticsDashboard({ resumeData, jobData, generatedContent }) {
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
      summary: resumeData.personalInfo?.summary?.length || 0,
      workExperience: resumeData.workExperience?.reduce((sum, exp) => 
        sum + (exp.responsibilities?.length || 0), 0) || 0,
      education: resumeData.education?.reduce((sum, edu) => 
        sum + (edu.field?.length || 0), 0) || 0,
    }

    // Industry benchmarks
    const benchmarks = {
      summary: { ideal: 150, max: 300 },
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
    return (
      <Card title="Analytics Dashboard">
        <p className="text-sm text-gray-600">
          Enter a job description to view resume analytics.
        </p>
      </Card>
    )
  }

  return (
    <Card title="Resume Analytics">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'keywords'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Keywords
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'sections'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sections
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.ats.score}
                </div>
                <div className="text-sm text-gray-600">ATS Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.completeness.percentage}%
                </div>
                <div className="text-sm text-gray-600">Completeness</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Score Breakdown</h4>
              {Object.entries(analytics.ats.sections).map(([key, section]) => (
                <div key={key} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="font-medium">
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
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
              <h4 className="font-semibold text-gray-900 mb-2">
                Keyword Density: {analytics.keywordDensity.percentage.toFixed(1)}%
              </h4>
              <div className="text-xs text-gray-600 mb-2">
                Ideal range: 2-5%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    analytics.keywordDensity.percentage >= 2 && analytics.keywordDensity.percentage <= 5
                      ? 'bg-green-600'
                      : analytics.keywordDensity.percentage > 5
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{
                    width: `${Math.min(100, (analytics.keywordDensity.percentage / 5) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Top Keywords Found ({analytics.keywordDensity.matched.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {analytics.keywordDensity.matched.slice(0, 15).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
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
                <div key={section} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-medium ${
                      status === 'good' ? 'text-green-600' :
                      status === 'short' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {length} chars
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Ideal: {benchmark.ideal}-{benchmark.max} characters
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        status === 'good' ? 'bg-green-600' :
                        status === 'short' ? 'bg-yellow-600' : 'bg-red-600'
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
    </Card>
  )
}

function buildResumeText(resumeData, generatedContent) {
  const parts = []

  if (generatedContent?.summary || resumeData.personalInfo?.summary) {
    parts.push(generatedContent?.summary || resumeData.personalInfo.summary)
  }

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
  const total = 7

  if (resumeData.personalInfo?.name) completed++
  if (resumeData.personalInfo?.email) completed++
  if (resumeData.personalInfo?.summary) completed++
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

export default AnalyticsDashboard

