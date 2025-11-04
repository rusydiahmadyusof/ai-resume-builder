import { templateService } from '../../services/templateService'

function TemplateSelector({ selectedTemplate, onSelect }) {
  const templates = templateService.getAllTemplates()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choose a Template
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={`
              p-4 border-2 rounded-lg text-left transition-all touch-manipulation active:scale-[0.98]
              ${
                selectedTemplate === template.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 active:bg-gray-100'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="ml-2">
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
        ))}
      </div>
    </div>
  )
}

export default TemplateSelector

