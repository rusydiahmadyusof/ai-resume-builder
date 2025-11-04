import PropTypes from 'prop-types'
import Button from './Button'

function ErrorDisplay({ title, message, onRetry, className = '' }) {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">{title}</h3>
          )}
          <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button onClick={onRetry} variant="outline" className="text-sm">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ErrorDisplay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  className: PropTypes.string,
}

ErrorDisplay.defaultProps = {
  title: null,
  onRetry: null,
  className: '',
}

export default ErrorDisplay

