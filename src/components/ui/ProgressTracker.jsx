import { calculateProgress, getStepCompletionStatus } from '../../utils/progressTracking'

function ProgressTracker({ resumeData, steps }) {
  const progress = calculateProgress(resumeData)

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Completion Progress</h3>
        <span className="text-2xl font-bold text-indigo-600">{progress.percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>

      {/* Step Completion Status */}
      <div className="space-y-2">
        {steps.map((stepName, index) => {
          const stepNumber = index + 1
          const isComplete = getStepCompletionStatus(resumeData, stepNumber)
          
          return (
            <div key={stepNumber} className="flex items-center gap-2 text-sm">
              {isComplete ? (
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-300 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className={isComplete ? 'text-gray-700' : 'text-gray-400'}>
                {stepName}
              </span>
            </div>
          )
        })}
      </div>

      {/* Completion Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {progress.completedCount} of {progress.totalSections} required sections completed
        </p>
      </div>
    </div>
  )
}

export default ProgressTracker

