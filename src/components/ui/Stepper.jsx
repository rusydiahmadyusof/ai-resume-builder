import PropTypes from 'prop-types'
import React from 'react'

function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Scrollable horizontal stepper */}
      <div className="block sm:hidden overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex items-center gap-3 min-w-max">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = onStepClick && (isCompleted || isActive)

            return (
              <div key={index} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(stepNumber)}
                    disabled={!isClickable}
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all touch-manipulation
                      ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                      }
                      ${isClickable ? 'active:scale-95' : 'cursor-not-allowed'}
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
                      <span className="text-sm font-semibold">{stepNumber}</span>
                    )}
                  </button>
                  <span
                    className={`
                      mt-1 text-[10px] font-medium text-center max-w-[60px] truncate
                      ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}
                    `}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-4 h-0.5
                      ${isCompleted ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isClickable = onStepClick && (isCompleted || isActive)

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1 min-w-0 relative">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 relative z-10
                    ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-not-allowed'}
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
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
                </button>
                <span
                  className={`
                    mt-2 text-xs font-medium text-center px-1 whitespace-nowrap
                    ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}
                  `}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1 min-w-[20px] max-w-[80px] -mt-5
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

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
}

Stepper.defaultProps = {
  onStepClick: null,
}

export default Stepper

