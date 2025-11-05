import PropTypes from 'prop-types'
import { hasResumeData, getResumeCompletionStatus, getResumeStats } from '../../utils/resumeHelpers'

function ResumeStatusIndicator({ resumeData }) {
  if (!resumeData || !hasResumeData(resumeData)) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">New Resume</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Start building your resume</p>
          </div>
        </div>
      </div>
    )
  }

  const status = getResumeCompletionStatus(resumeData)
  const stats = getResumeStats(resumeData)

  const getStatusColor = () => {
    if (status.isComplete) {
      return 'bg-green-500 dark:bg-green-600'
    } else if (status.percentage >= 50) {
      return 'bg-yellow-500 dark:bg-yellow-600'
    } else {
      return 'bg-blue-500 dark:bg-blue-600'
    }
  }

  const getStatusText = () => {
    if (status.isComplete) {
      return 'Ready for Preview'
    } else if (status.percentage >= 50) {
      return 'In Progress'
    } else {
      return 'Getting Started'
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getStatusText()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {status.percentage}% Complete
              </p>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getStatusColor()}`}
                style={{ width: `${status.percentage}%` }}
              ></div>
            </div>
          </div>
          {(stats.workExperience > 0 || stats.education > 0 || stats.skills > 0) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
              {stats.workExperience > 0 && (
                <span>{stats.workExperience} work experience{stats.workExperience !== 1 ? 's' : ''}</span>
              )}
              {stats.education > 0 && (
                <span>{stats.education} education entry{stats.education !== 1 ? 'ies' : ''}</span>
              )}
              {stats.skills > 0 && (
                <span>{stats.skills} skill{stats.skills !== 1 ? 's' : ''}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ResumeStatusIndicator.propTypes = {
  resumeData: PropTypes.object,
}

ResumeStatusIndicator.defaultProps = {
  resumeData: null,
}

export default ResumeStatusIndicator

