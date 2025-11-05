import Button from './Button'

function PreviewControls({ onPrint, onDownloadPDF, onFullScreen, onZoomIn, onZoomOut, onResetZoom, zoomLevel, isGeneratingPDF }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 flex-wrap">
      <Button
        variant="outline"
        onClick={onPrint}
        className="text-xs px-2 sm:px-3 py-1.5 h-auto"
        title="Print Preview"
      >
        🖨️ Print
      </Button>
      <Button
        variant="outline"
        onClick={onDownloadPDF}
        disabled={isGeneratingPDF}
        className="text-xs px-2 sm:px-3 py-1.5 h-auto"
        title="Download PDF"
      >
        {isGeneratingPDF ? '⏳' : '📥'} PDF
      </Button>
      <Button
        variant="outline"
        onClick={onFullScreen}
        className="text-xs px-2 sm:px-3 py-1.5 h-auto"
        title="Full Screen"
      >
        ⛶
      </Button>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          onClick={onZoomOut}
          className="text-xs px-2 py-1.5 h-auto"
          title="Zoom Out"
        >
          −
        </Button>
        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[45px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Button
          variant="outline"
          onClick={onZoomIn}
          className="text-xs px-2 py-1.5 h-auto"
          title="Zoom In"
        >
          +
        </Button>
      </div>
      <Button
        variant="outline"
        onClick={onResetZoom}
        className="text-xs px-2 sm:px-3 py-1.5 h-auto"
        title="Reset Zoom"
      >
        Reset
      </Button>
    </div>
  )
}

export default PreviewControls

