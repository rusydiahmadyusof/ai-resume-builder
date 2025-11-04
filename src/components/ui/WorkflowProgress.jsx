import { useLocation } from 'react-router-dom'
import React from 'react'

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md p-4 sm:p-6 mb-6">
      <div className="flex items-center w-full overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <React.Fragment key={step.path}>
              <div className="flex flex-col items-center flex-1 min-w-0 relative z-10">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all flex-shrink-0 relative
                    ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
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
                    mt-2 text-xs font-medium text-center whitespace-nowrap px-1
                    ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1 min-w-[20px] max-w-[80px] hidden sm:block -mt-5
                    ${isCompleted ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default WorkflowProgress

