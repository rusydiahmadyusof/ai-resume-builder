import { Link } from 'react-router-dom'

function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center space-x-2">
            {item.path ? (
              <Link
                to={item.path}
                className="hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-gray-900 font-medium' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs

