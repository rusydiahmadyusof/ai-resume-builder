import { useState } from 'react'
import { templateService } from '../../services/templateService'

// Template categories and icons
const templateCategories = {
  professional: { name: 'Professional', icon: '💼', color: 'blue' },
  creative: { name: 'Creative', icon: '🎨', color: 'purple' },
  modern: { name: 'Modern', icon: '✨', color: 'indigo' },
  classic: { name: 'Classic', icon: '📄', color: 'gray' },
}

const getTemplateCategory = (templateId) => {
  if (['professional', 'business', 'executive', 'executivesummary'].includes(templateId)) {
    return 'professional'
  }
  if (['creative', 'bold', 'tech', 'techstack'].includes(templateId)) {
    return 'creative'
  }
  if (['modern', 'contemporary', 'clean', 'minimalist', 'minimalcolor'].includes(templateId)) {
    return 'modern'
  }
  return 'classic'
}

function TemplateSelector({ selectedTemplate, onSelect, recommendedTemplate }) {
  const templates = templateService.getAllTemplates()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter templates by category and search
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || getTemplateCategory(template.id) === selectedCategory
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Choose Template
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select a design that matches your style
          </p>
        </div>
        {recommendedTemplate && (
          <div className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
            <span>⭐</span>
            <span className="hidden sm:inline">Recommended</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {Object.entries(templateCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
              selectedCategory === key
                ? `bg-indigo-600 dark:bg-indigo-500 text-white`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No templates found. Try a different search.
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const isRecommended = recommendedTemplate === template.id
            const isSelected = selectedTemplate === template.id
            const category = getTemplateCategory(template.id)
            const categoryInfo = templateCategories[category] || templateCategories.classic

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelect(template.id)}
                aria-label={`Select ${template.name} template${isRecommended ? ' (Recommended)' : ''}`}
                aria-pressed={isSelected}
                className={`
                  group relative p-3 border-2 rounded-lg text-left transition-all touch-manipulation
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
                  ${isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                    : isRecommended
                    ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20 hover:border-yellow-500 dark:hover:border-yellow-400 hover:shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm active:scale-[0.98]'
                  }
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full p-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Recommended Badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute top-2 right-2 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 rounded-full p-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}

                {/* Template Preview */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-lg sm:text-xl flex-shrink-0">{categoryInfo.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                          {template.name}
                        </h4>
                        {isRecommended && (
                          <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {template.description}
                  </p>
                </div>

                {/* Hover Effect */}
                {!isSelected && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/20 group-hover:to-indigo-50/10 dark:from-indigo-900/0 dark:to-indigo-900/0 dark:group-hover:from-indigo-900/10 dark:group-hover:to-indigo-900/5 transition-all pointer-events-none" />
                )}
              </button>
            )
          })
        )}
      </div>

      {/* Results Count */}
      {filteredTemplates.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  )
}

export default TemplateSelector
