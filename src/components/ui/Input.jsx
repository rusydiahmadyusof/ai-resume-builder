import { forwardRef, useId, memo } from 'react'
import PropTypes from 'prop-types'

const Input = memo(forwardRef(({ label, error, className = '', ...props }, ref) => {
  const generatedId = useId()
  const id = props.id || generatedId
  const errorId = error ? `${id}-error` : undefined
  const baseClasses = 'w-full px-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`${baseClasses} ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
            : 'border-gray-300 dark:border-gray-600'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}))

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
}

Input.defaultProps = {
  label: null,
  error: null,
  className: '',
  id: null,
}

export default Input
