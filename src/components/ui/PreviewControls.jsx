import { useState } from 'react'
import Button from './Button'

function PreviewControls({ onPrint, onFullScreen, onZoomIn, onZoomOut, onResetZoom, zoomLevel }) {
  const [showControls, setShowControls] = useState(true)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Preview Controls</h3>
        <button
          onClick={() => setShowControls(!showControls)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
        >
          {showControls ? 'Hide' : 'Show'}
        </button>
      </div>

      {showControls && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={onPrint}
            className="text-xs sm:text-sm"
            title="Print Preview"
          >
            🖨️ Print
          </Button>
          <Button
            variant="outline"
            onClick={onFullScreen}
            className="text-xs sm:text-sm"
            title="Full Screen"
          >
            ⛶ Fullscreen
          </Button>
          <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
            <Button
              variant="outline"
              onClick={onZoomOut}
              className="text-xs px-2"
              title="Zoom Out"
            >
              −
            </Button>
            <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="outline"
              onClick={onZoomIn}
              className="text-xs px-2"
              title="Zoom In"
            >
              +
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={onResetZoom}
            className="text-xs sm:text-sm col-span-2 sm:col-span-1"
            title="Reset Zoom"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}

export default PreviewControls

