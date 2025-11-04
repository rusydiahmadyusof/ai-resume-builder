import { useLocation } from 'react-router-dom'

function WorkflowProgress() {
  const location = useLocation()

  const steps = [
    { path: '/', label: 'Home', number: 1 },
    { path: '/builder', label: 'Build Resume', number: 2 },
    { path: '/preview', label: 'Preview & Download', number: 3 },
  ]

  const getCurrentStep = () => {
    const currentPath = location.pathname
    return steps.findIndex((step) => step.path === currentPath) + 1
  }

  const currentStep = getCurrentStep()

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={step.path} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-[80px] sm:min-w-0">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all flex-shrink-0
                    ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
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
                    stepNumber
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium text-center whitespace-nowrap
                    ${
                      isActive
                        ? 'text-indigo-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 hidden sm:block
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkflowProgress

