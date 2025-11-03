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
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">
                Language #{index + 1}
              </h4>
              {languages.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemove(lang.id)}
                  type="button"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Language *"
                value={lang.name}
                onChange={(e) => handleUpdate(lang.id, 'name', e.target.value)}
                placeholder="English, Spanish, French, etc."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level *
                </label>
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleUpdate(lang.id, 'proficiency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
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

