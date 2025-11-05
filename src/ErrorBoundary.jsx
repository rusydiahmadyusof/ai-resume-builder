import React from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(),
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Store error info for display
    this.setState({
      errorInfo: errorInfo.componentStack || errorInfo,
    })

    // Optionally send to error reporting service
    // this.logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleClearStorage = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      alert('Storage cleared. Please reload the page.')
      window.location.reload()
    } catch (error) {
      console.error('Error clearing storage:', error)
      alert('Failed to clear storage. Please try reloading the page manually.')
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state
      const isDevelopment = import.meta.env.DEV

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl p-6 sm:p-8">
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            {/* Error Details (Show in production too, but simpler) */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">Error Details:</h3>
                <pre className="text-xs text-red-800 dark:text-red-300 overflow-auto max-h-48">
                  {error.toString()}
                  {isDevelopment && error.stack && `\n\n${error.stack}`}
                </pre>
                {isDevelopment && errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-700 dark:text-red-400 cursor-pointer hover:text-red-900 dark:hover:text-red-300">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-red-800 dark:text-red-300 overflow-auto max-h-32 mt-2">
                      {typeof errorInfo === 'string' ? errorInfo : JSON.stringify(errorInfo, null, 2)}
                    </pre>
                  </details>
                )}
                {errorId && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">Error ID: {errorId}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg"
              >
                Try Again
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                >
                  Go to Home
                </Link>
                <button
                  onClick={this.handleReload}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reload Page
                </button>
              </div>

              <button
                onClick={this.handleClearStorage}
                className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm border border-red-200 dark:border-red-800"
              >
                Clear Storage & Reload (if data is corrupted)
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                If this problem persists, please try clearing your browser cache or{' '}
                <a
                  href="https://github.com/rusydiahmadyusof/ai-resume-builder/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline"
                >
                  report the issue
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

