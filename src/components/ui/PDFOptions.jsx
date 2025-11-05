import { useState } from 'react'
import Button from './Button'

function PDFOptions({ onDownload, isGenerating }) {
  const [options, setOptions] = useState({
    quality: 2, // 1 = low, 2 = medium, 3 = high
    format: 'a4',
    orientation: 'portrait',
    showAdvanced: false,
  })

  const handleDownload = () => {
    onDownload(options)
  }

  return (
    <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality
          </label>
          <select
            value={options.quality}
            onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isGenerating}
          >
            <option value={1}>Low (Smaller file, faster)</option>
            <option value={2}>Medium (Balanced)</option>
            <option value={3}>High (Best quality, larger file)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Format
          </label>
          <select
            value={options.format}
            onChange={(e) => setOptions({ ...options, format: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isGenerating}
          >
            <option value="a4">A4 (International)</option>
            <option value="letter">Letter (US)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Orientation
          </label>
          <select
            value={options.orientation}
            onChange={(e) => setOptions({ ...options, orientation: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isGenerating}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating PDF...' : 'Download PDF'}
        </Button>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: High quality produces the best results but may take longer to generate.
        </div>
      </div>
  )
}

export default PDFOptions

