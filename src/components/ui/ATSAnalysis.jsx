import { useState, useEffect } from 'react'
import Card from './Card'
import Button from './Button'
import { atsService } from '../../services/atsService'

function ATSAnalysis({ resumeData, jobData }) {
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (resumeData && jobData?.jobDescription) {
      analyzeResume()
    }
  }, [resumeData, jobData])

  const analyzeResume = () => {
    setIsAnalyzing(true)
    // Simulate async analysis (in real implementation, this could be async)
    setTimeout(() => {
      const result = atsService.analyzeResume(resumeData, jobData || {})
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 500)
  }

  if (!jobData?.jobDescription) {
    return (
      <Card title="ATS Analysis">
        <p className="text-sm text-gray-600">
          Enter a job description to analyze your resume's ATS compatibility.
        </p>
      </Card>
    )
  }

  if (isAnalyzing) {
    return (
      <Card title="ATS Analysis">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Analyzing resume...</span>
        </div>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card title="ATS Analysis">
        <Button onClick={analyzeResume} className="w-full">
          Analyze Resume
        </Button>
      </Card>
    )
  }

  const scoreColor = atsService.getScoreColor(analysis.score)
  const scoreLabel = atsService.getScoreLabel(analysis.score)

  return (
    <Card title="ATS Compatibility Analysis">
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${scoreColor} mb-2`}>
            {analysis.score}/{analysis.maxScore}
          </div>
          <div className={`text-lg font-semibold ${scoreColor}`}>
            {scoreLabel}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className={`h-2 rounded-full ${
                analysis.score >= 80
                  ? 'bg-green-600'
                  : analysis.score >= 60
                  ? 'bg-yellow-600'
                  : analysis.score >= 40
                  ? 'bg-orange-600'
                  : 'bg-red-600'
              }`}
              style={{ width: `${analysis.score}%` }}
            ></div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
          {Object.entries(analysis.sections).map(([key, section]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {section.score}/{section.maxScore}
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{
                      width: `${(section.score / section.maxScore) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Keyword Match */}
        {analysis.keywordMatch && analysis.keywordMatch.matchedKeywords && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Keyword Match ({analysis.keywordMatch.matchPercentage}%)
            </h4>
            <div className="text-xs text-gray-600 mb-2">
              Matched: {analysis.keywordMatch.matched} of {analysis.keywordMatch.totalKeywords}
            </div>
            {analysis.keywordMatch.matchedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {analysis.keywordMatch.matchedKeywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            {analysis.keywordMatch.missingKeywords &&
              analysis.keywordMatch.missingKeywords.length > 0 && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Missing keywords:</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordMatch.missingKeywords.slice(0, 5).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Suggestions */}
        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Improvement Suggestions</h4>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-sm ${
                    suggestion.priority === 'high'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div className="font-medium mb-1 capitalize">{suggestion.category}</div>
                  <div className="text-gray-700">{suggestion.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {analysis.missingSkills && analysis.missingSkills.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Consider Adding These Skills</h4>
            <div className="flex flex-wrap gap-1">
              {analysis.missingSkills.slice(0, 8).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button onClick={analyzeResume} variant="outline" className="w-full">
          Re-analyze
        </Button>
      </div>
    </Card>
  )
}

export default ATSAnalysis

