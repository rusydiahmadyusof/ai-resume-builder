import { forwardRef, useId, memo } from 'react'
import PropTypes from 'prop-types'

const Textarea = memo(forwardRef(({ label, error, className = '', ...props }, ref) => {
  const generatedId = useId()
  const id = props.id || generatedId
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full px-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical text-base sm:text-sm text-gray-900 dark:text-gray-100 ${
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

Textarea.displayName = 'Textarea'

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
}

Textarea.defaultProps = {
  label: null,
  error: null,
  className: '',
  id: null,
}

export default Textarea
