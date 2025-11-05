import { useState } from 'react'
import PropTypes from 'prop-types'

function CollapsibleSection({ title, children, defaultOpen = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

CollapsibleSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
}

CollapsibleSection.defaultProps = {
  defaultOpen: false,
  className: '',
}

export default CollapsibleSection

