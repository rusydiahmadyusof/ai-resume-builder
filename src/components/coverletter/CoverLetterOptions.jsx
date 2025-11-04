import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

function CoverLetterOptions({ onGenerate, isGenerating }) {
  const [options, setOptions] = useState({
    tone: 'professional',
    length: 'medium',
    style: 'standard',
  })

  const handleGenerate = () => {
    onGenerate(options)
  }

  return (
    <Card title="Cover Letter Options">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tone
          </label>
          <select
            value={options.tone}
            onChange={(e) => setOptions({ ...options, tone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isGenerating}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Length
          </label>
          <select
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isGenerating}
          >
            <option value="short">Short (200-300 words)</option>
            <option value="medium">Medium (300-500 words)</option>
            <option value="long">Long (500-700 words)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style
          </label>
          <select
            value={options.style}
            onChange={(e) => setOptions({ ...options, style: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isGenerating}
          >
            <option value="standard">Standard Paragraphs</option>
            <option value="narrative">Narrative Story</option>
            <option value="bullet-points">Bullet Points</option>
          </select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
        </Button>
      </div>
    </Card>
  )
}

export default CoverLetterOptions

