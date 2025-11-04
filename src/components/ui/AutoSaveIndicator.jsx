function AutoSaveIndicator({ status, lastSaved }) {
  if (!status || status === 'idle') {
    return null
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          text: 'Saving...',
          icon: (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          className: 'text-blue-600',
        }
      case 'saved':
        return {
          text: lastSaved ? `Saved ${lastSaved}` : 'Saved',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          className: 'text-green-600',
        }
      case 'error':
        return {
          text: 'Save failed',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          className: 'text-red-600',
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const secondsAgo = Math.floor((Date.now() - timestamp) / 1000)
    if (secondsAgo < 60) return `${secondsAgo}s ago`
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`
    return `${Math.floor(secondsAgo / 3600)}h ago`
  }

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${config.className} transition-opacity duration-300`}
    >
      {config.icon}
      <span>{config.text === `Saved ${lastSaved}` ? `Saved ${formatTime(lastSaved)}` : config.text}</span>
    </div>
  )
}

export default AutoSaveIndicator

