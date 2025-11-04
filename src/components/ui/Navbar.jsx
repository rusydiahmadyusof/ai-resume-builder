import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">
              Resume Builder
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`
                px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isActive('/')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }
              `}
            >
              Home
            </Link>
            <Link
              to="/builder"
              className={`
                px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isActive('/builder')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }
              `}
            >
              Builder
            </Link>
            <Link
              to="/preview"
              className={`
                px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isActive('/preview')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }
              `}
            >
              Preview
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive('/')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }
                `}
              >
                Home
              </Link>
              <Link
                to="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive('/builder')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }
                `}
              >
                Builder
              </Link>
              <Link
                to="/preview"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive('/preview')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }
                `}
              >
                Preview
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

