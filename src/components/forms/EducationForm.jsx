import Input from '../ui/Input'
import Card from '../ui/Card'
import Button from '../ui/Button'

function EducationForm({ education, onAdd, onUpdate, onRemove }) {
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
    <Card title="Education">
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">
                Education #{index + 1}
              </h4>
              {education.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemove(edu.id)}
                  type="button"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution *"
                value={edu.institution}
                onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                placeholder="University/School Name"
              />
              <Input
                label="Degree *"
                value={edu.degree}
                onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor's, Master's, etc."
              />
            </div>

            <Input
              label="Field of Study"
              value={edu.field}
              onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
              placeholder="Computer Science, Business, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={edu.startDate}
                onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
              />
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => handleUpdate(edu.id, 'current', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Currently studying</span>
                </label>
                {!edu.current && (
                  <Input
                    label="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                  />
                )}
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
          + Add Education
        </Button>
      </div>
    </Card>
  )
}

export default EducationForm

