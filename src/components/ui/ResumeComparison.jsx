import { useState, useMemo, useCallback, memo } from 'react'
import Card from './Card'
import Button from './Button'
import ResumePreview from '../resume/ResumePreview'
import { getResumeDifferenceSummary, mergeResumes } from '../../utils/resumeComparison'
import { versionService } from '../../services/versionService'
import Toast from './Toast'

function ResumeComparison({ versions, resumeData, selectedTemplate, onMerge }) {
  const [selectedVersions, setSelectedVersions] = useState(
    versions.length >= 2 ? [versions[0].id, versions[1].id] : []
  )
  const [showDifferences, setShowDifferences] = useState(true)
  const [mergeMode, setMergeMode] = useState(false)
  const [mergeOptions, setMergeOptions] = useState({
    preferNew: true,
    mergeArrays: 'combine',
  })
  const [toast, setToast] = useState(null)

  if (versions.length < 2) {
    return (
      <Card title="Resume Comparison">
        <p className="text-sm text-gray-600">
          You need at least 2 saved versions to compare resumes.
        </p>
      </Card>
    )
  }

  const version1 = versions.find(v => v.id === selectedVersions[0])
  const version2 = versions.find(v => v.id === selectedVersions[1])

  const handleVersionSelect = useCallback((index, versionId) => {
    const newSelected = [...selectedVersions]
    newSelected[index] = versionId
    setSelectedVersions(newSelected)
  }, [selectedVersions])

  // Calculate differences
  const differences = useMemo(() => {
    if (!version1?.data || !version2?.data) return null
    return getResumeDifferenceSummary(version1.data, version2.data)
  }, [version1?.data, version2?.data])

  // Handle merge
  const handleMerge = useCallback(() => {
    if (!version1?.data || !version2?.data) return

    const merged = mergeResumes(version1.data, version2.data, mergeOptions)
    
    // Save merged version
    const result = versionService.saveVersion(merged, `Merged: ${version1.name} + ${version2.name}`)
    
    if (result.success) {
      setToast({ type: 'success', message: 'Versions merged successfully! New version saved.' })
      if (onMerge) {
        onMerge(merged)
      }
      setMergeMode(false)
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to merge versions' })
    }
  }, [version1, version2, mergeOptions, onMerge])

  return (
    <Card title="Compare Resume Versions">
      <div className="space-y-4">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Version 1
            </label>
            <select
              value={selectedVersions[0]}
              onChange={(e) => handleVersionSelect(0, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} ({new Date(version.createdAt || version.savedAt || Date.now()).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Version 2
            </label>
            <select
              value={selectedVersions[1]}
              onChange={(e) => handleVersionSelect(1, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} ({new Date(version.createdAt || version.savedAt || Date.now()).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Difference Summary */}
        {differences && showDifferences && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Differences Found: {differences.totalChanges}
              </h4>
              <button
                onClick={() => setShowDifferences(false)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Hide
              </button>
            </div>
            <div className="space-y-1 text-sm">
              {Object.entries(differences.sections).map(([section, changes]) => {
                if (changes.length === 0) return null
                return (
                  <div key={section} className="flex items-center gap-2">
                    <span className="font-medium capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-gray-600 dark:text-gray-400">{changes.length} change(s)</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!showDifferences && (
          <Button
            variant="outline"
            onClick={() => setShowDifferences(true)}
            className="w-full text-sm"
          >
            Show Differences
          </Button>
        )}

        {/* Merge Options */}
        {mergeMode && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Merge Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mergeOptions.preferNew}
                  onChange={(e) => setMergeOptions({ ...mergeOptions, preferNew: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Prefer newer values when conflicts occur
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Array Merge Strategy
                </label>
                <select
                  value={mergeOptions.mergeArrays}
                  onChange={(e) => setMergeOptions({ ...mergeOptions, mergeArrays: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="combine">Combine (avoid duplicates)</option>
                  <option value="replace">Replace (use new array)</option>
                  <option value="merge">Merge (match by ID)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleMerge}
                className="flex-1"
              >
                Merge Versions
              </Button>
              <Button
                variant="outline"
                onClick={() => setMergeMode(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!mergeMode && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMergeMode(true)}
              className="flex-1"
            >
              Merge Versions
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {version1?.name || 'Version 1'}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {version1 && new Date(version1.createdAt || version1.savedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto">
              <ResumePreview
                resumeData={version1?.data || resumeData}
                selectedTemplate={selectedTemplate}
                generatedContent={null}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {version2?.name || 'Version 2'}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {version2 && new Date(version2.createdAt || version2.savedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto">
              <ResumePreview
                resumeData={version2?.data || resumeData}
                selectedTemplate={selectedTemplate}
                generatedContent={null}
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          💡 Tip: Compare different versions to see what changed. Use merge to combine the best parts of both versions.
        </div>
      </div>
    </Card>
  )
}

export default memo(ResumeComparison)

