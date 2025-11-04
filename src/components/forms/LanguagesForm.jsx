import Input from '../ui/Input'
import Card from '../ui/Card'
import Button from '../ui/Button'

const proficiencyLevels = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

function LanguagesForm({ languages, onAdd, onUpdate, onRemove }) {
  const handleAdd = () => {
    onAdd()
  }

  const handleUpdate = (id, field, value) => {
    onUpdate(id, { [field]: value })
  }

  const handleRemove = (id) => {
    onRemove(id)
  }

  return (
    <Card title="Languages">
      <div className="space-y-6">
        {languages.map((lang, index) => (
          <div
            key={lang.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                Language #{index + 1}
              </h4>
              {languages.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemove(lang.id)}
                  type="button"
                  className="w-full sm:w-auto text-sm"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Language *"
                value={lang.name || ''}
                onChange={(e) => handleUpdate(lang.id, 'name', e.target.value)}
                placeholder="English, Spanish, French, etc."
                required
              />
              <div>
                <label htmlFor={`proficiency-${lang.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proficiency Level *
                </label>
                <select
                  id={`proficiency-${lang.id}`}
                  value={lang.proficiency || ''}
                  onChange={(e) => handleUpdate(lang.id, 'proficiency', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                >
                  <option value="">Select proficiency</option>
                  {proficiencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={handleAdd}
          type="button"
          className="w-full"
        >
          + Add Language
        </Button>
      </div>
    </Card>
  )
}

export default LanguagesForm

