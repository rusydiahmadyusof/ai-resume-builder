import PropTypes from 'prop-types'
import Button from './Button'

function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction, 
  className = '' 
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="mx-auto text-4xl mb-4" aria-hidden="true">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
}

EmptyState.defaultProps = {
  icon: null,
  title: null,
  message: null,
  actionLabel: null,
  onAction: null,
  className: '',
}

export default EmptyState

