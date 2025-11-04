import PropTypes from 'prop-types'

function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-b-2',
    lg: 'w-12 h-12 border-b-2',
  }

  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Loading">
      <div
        className={`animate-spin rounded-full border-indigo-600 dark:border-indigo-400 ${sizeClasses[size]}`}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
}

LoadingSpinner.defaultProps = {
  size: 'md',
  className: '',
}

export default LoadingSpinner

