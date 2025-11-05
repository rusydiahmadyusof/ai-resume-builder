import PropTypes from 'prop-types'
import { memo } from 'react'

function Card({ children, className = '', title }) {
  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md dark:shadow-lg p-4 sm:p-5 md:p-6 ${className}`}>
      {title && (
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
}

Card.defaultProps = {
  className: '',
  title: null,
}

export default memo(Card)

