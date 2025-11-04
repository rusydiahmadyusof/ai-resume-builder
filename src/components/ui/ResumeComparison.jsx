import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import ResumePreview from '../resume/ResumePreview'

function ResumeComparison({ versions, resumeData, selectedTemplate }) {
  const [selectedVersions, setSelectedVersions] = useState(
    versions.length >= 2 ? [versions[0].id, versions[1].id] : []
  )

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

  const handleVersionSelect = (index, versionId) => {
    const newSelected = [...selectedVersions]
    newSelected[index] = versionId
    setSelectedVersions(newSelected)
  }

  return (
    <Card title="Compare Resume Versions">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version 1
            </label>
            <select
              value={selectedVersions[0]}
              onChange={(e) => handleVersionSelect(0, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} ({new Date(version.savedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version 2
            </label>
            <select
              value={selectedVersions[1]}
              onChange={(e) => handleVersionSelect(1, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} ({new Date(version.savedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                {version1?.name || 'Version 1'}
              </h4>
              <span className="text-xs text-gray-500">
                {version1 && new Date(version1.savedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
              <ResumePreview
                resumeData={version1?.data || resumeData}
                selectedTemplate={selectedTemplate}
                generatedContent={null}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                {version2?.name || 'Version 2'}
              </h4>
              <span className="text-xs text-gray-500">
                {version2 && new Date(version2.savedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
              <ResumePreview
                resumeData={version2?.data || resumeData}
                selectedTemplate={selectedTemplate}
                generatedContent={null}
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
          💡 Tip: Compare different versions to see what changed and choose the best one.
        </div>
      </div>
    </Card>
  )
}

export default ResumeComparison

