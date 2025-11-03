function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isClickable = onStepClick && (isCompleted || isActive)

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
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
                    mt-2 text-xs font-medium text-center
                    ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                  `}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2
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

export default Stepper

