import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  return (
    <div
      className={`fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 p-4 rounded-lg border shadow-lg animate-slide-in ${bgColors[type]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 active:scale-95 touch-manipulation flex-shrink-0 w-6 h-6 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast

