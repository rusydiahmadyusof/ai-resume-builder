import { useState, useEffect } from 'react'
import { versionService } from '../../services/versionService'
import Button from './Button'
import Card from './Card'

function VersionManager({ resumeData, onRestore }) {
  const [versions, setVersions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newVersionName, setNewVersionName] = useState('')

  useEffect(() => {
    loadVersions()
  }, [])

  const loadVersions = () => {
    const allVersions = versionService.getAllVersions()
    setVersions(allVersions)
  }

  const handleSaveVersion = () => {
    const result = versionService.saveVersion(resumeData, newVersionName || null)
    if (result.success) {
      setShowSaveDialog(false)
      setNewVersionName('')
      loadVersions()
    }
  }

  const handleRestore = (versionId) => {
    const result = versionService.restoreVersion(versionId)
    if (result.success && result.data) {
      onRestore(result.data)
      loadVersions()
    }
  }

  const handleDelete = (versionId) => {
    if (window.confirm('Are you sure you want to delete this version?')) {
      versionService.deleteVersion(versionId)
      loadVersions()
    }
  }

  const handleStartRename = (version) => {
    setEditingId(version.id)
    setEditName(version.name)
  }

  const handleSaveRename = (versionId) => {
    versionService.renameVersion(versionId, editName)
    setEditingId(null)
    setEditName('')
    loadVersions()
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditName('')
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card title="Resume Versions">
      <div className="space-y-4">
        <Button
          onClick={() => setShowSaveDialog(true)}
          className="w-full"
        >
          Save Current Version
        </Button>

        {showSaveDialog && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version Name (optional)
            </label>
            <input
              type="text"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              placeholder="e.g., Software Engineer Resume"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveVersion}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowSaveDialog(false)
                  setNewVersionName('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {versions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No saved versions yet. Save your current resume to create a version.
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.map((version) => (
              <div
                key={version.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingId === version.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {version.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(version.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {editingId === version.id ? (
                      <>
                        <button
                          onClick={() => handleSaveRename(version.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Save"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 text-gray-600 hover:text-gray-700"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRestore(version.id)}
                          className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                          title="Restore"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handleStartRename(version)}
                          className="p-1 text-gray-600 hover:text-gray-700"
                          title="Rename"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(version.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default VersionManager

