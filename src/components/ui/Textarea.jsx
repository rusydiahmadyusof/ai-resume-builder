import { forwardRef, useId, memo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const Textarea = memo(forwardRef(({ label, error, className = '', value, onChange, rows = 4, ...props }, ref) => {
  const generatedId = useId()
  const id = props.id || generatedId
  const errorId = error ? `${id}-error` : undefined
  const textareaRef = useRef(null)

  // Handle ref forwarding (supports both direct ref and react-hook-form register)
  const setRef = (element) => {
    textareaRef.current = element
    // Forward ref to parent (works with forwardRef and react-hook-form register)
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref && typeof ref === 'object') {
      ref.current = element
    }
  }

  // Get the current value (from props or from ref for uncontrolled components)
  const currentValue = value !== undefined ? value : (textareaRef.current?.value || '')

  // Auto-resize functionality
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    
    // Calculate the new height based on scrollHeight
    // 24px per row (approximate line height) as minimum
    const newHeight = Math.max(textarea.scrollHeight, rows * 24)
    textarea.style.height = `${newHeight}px`
  }, [currentValue, rows])

  const handleChange = (e) => {
    // Auto-resize on change
    const textarea = e.target
    textarea.style.height = 'auto'
    const newHeight = Math.max(textarea.scrollHeight, rows * 24)
    textarea.style.height = `${newHeight}px`

    // Call original onChange if provided (works with react-hook-form's register)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={setRef}
        id={id}
        value={value}
        onChange={handleChange}
        rows={rows}
        className={`w-full px-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical text-base sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden ${
          error 
            ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
            : 'border-gray-300 dark:border-gray-600'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        style={{ minHeight: `${rows * 24}px` }}
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
  value: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.number,
}

Textarea.defaultProps = {
  label: null,
  error: null,
  className: '',
  id: null,
  value: undefined,
  onChange: undefined,
  rows: 4,
}

export default Textarea
