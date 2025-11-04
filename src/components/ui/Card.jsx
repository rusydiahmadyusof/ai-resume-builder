function Card({ children, className = '', title }) {
  return (
    <div className={`bg-white text-gray-900 rounded-lg shadow-md p-4 sm:p-6 ${className}`}>
      {title && (
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}

export default Card

