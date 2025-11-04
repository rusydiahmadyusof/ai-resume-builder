import { forwardRef } from 'react'

const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => {
  const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full px-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical text-base sm:text-sm ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
