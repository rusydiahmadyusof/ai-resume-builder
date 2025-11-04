import { useState } from 'react'
import { exportImportService } from '../../services/exportImportService'
import Button from './Button'
import Card from './Card'
import Toast from './Toast'

function ExportImport({ resumeData, onImport }) {
  const [toast, setToast] = useState(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleExportJSON = () => {
    const result = exportImportService.exportToJSON(resumeData)
    if (result.success) {
      setToast({ message: 'Resume data exported successfully!', type: 'success' })
    } else {
      setToast({ message: `Export failed: ${result.error}`, type: 'error' })
    }
  }

  const handleExportText = () => {
    const result = exportImportService.exportToText(resumeData)
    if (result.success) {
      setToast({ message: 'Resume exported as text file!', type: 'success' })
    } else {
      setToast({ message: `Export failed: ${result.error}`, type: 'error' })
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      setToast({ message: 'Please select a JSON file', type: 'error' })
      return
    }

    setIsImporting(true)
    setToast(null)

    try {
      const result = await exportImportService.importFromJSON(file)
      
      if (result.success) {
        onImport(result.data)
        setToast({ message: 'Resume data imported successfully!', type: 'success' })
      } else {
        setToast({ message: `Import failed: ${result.error}`, type: 'error' })
      }
    } catch (error) {
      setToast({ message: `Import failed: ${error.message}`, type: 'error' })
    } finally {
      setIsImporting(false)
      e.target.value = '' // Reset file input
    }
  }

  return (
    <>
      <Card title="Export / Import Resume">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Export</h4>
            <div className="space-y-2">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="w-full"
              >
                Export as JSON
              </Button>
              <Button
                onClick={handleExportText}
                variant="outline"
                className="w-full"
              >
                Export as Text
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Import</h4>
            <p className="text-xs text-gray-600 mb-2">
              Import resume data from a previously exported JSON file.
            </p>
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer disabled:opacity-50"
              />
            </label>
            {isImporting && (
              <p className="text-xs text-indigo-600 mt-2">Importing...</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              💡 Tip: Export your resume data regularly as a backup. You can import it later to restore your data.
            </p>
          </div>
        </div>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </>
  )
}

export default ExportImport

