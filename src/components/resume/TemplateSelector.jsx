import { templateService } from '../../services/templateService'

function TemplateSelector({ selectedTemplate, onSelect, recommendedTemplate }) {
  const templates = templateService.getAllTemplates()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choose a Template
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const isRecommended = recommendedTemplate === template.id
          const isSelected = selectedTemplate === template.id
          
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all touch-manipulation active:scale-[0.98] relative
                ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : isRecommended
                    ? 'border-yellow-400 bg-yellow-50 hover:border-yellow-500'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 active:bg-gray-100'
                }
              `}
            >
              {isRecommended && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-gray-900">
                      {template.name}
                    </h4>
                    {isRecommended && (
                      <span className="text-xs text-yellow-700 font-medium bg-yellow-200 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                {isSelected && (
                  <div className="ml-2 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TemplateSelector

