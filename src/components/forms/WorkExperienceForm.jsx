import { useForm } from 'react-hook-form'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import Button from '../ui/Button'

function WorkExperienceForm({ experiences, onAdd, onUpdate, onRemove }) {
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
    <Card title="Work Experience">
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                Experience #{index + 1}
              </h4>
              {experiences.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemove(exp.id)}
                  type="button"
                  className="w-full sm:w-auto text-sm"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company *"
                value={exp.company}
                onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                placeholder="Company Name"
              />
              <Input
                label="Position/Title *"
                value={exp.position}
                onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                placeholder="Job Title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="month"
                value={exp.startDate}
                onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
              />
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => handleUpdate(exp.id, 'current', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Currently working here</span>
                </label>
                {!exp.current && (
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                  />
                )}
              </div>
            </div>

            <Textarea
              label="Responsibilities & Achievements"
              rows={4}
              value={exp.responsibilities}
              onChange={(e) => handleUpdate(exp.id, 'responsibilities', e.target.value)}
              placeholder="Describe your key responsibilities and achievements..."
            />
          </div>
        ))}

        <Button
          variant="outline"
          onClick={handleAdd}
          type="button"
          className="w-full"
        >
          + Add Work Experience
        </Button>
      </div>
    </Card>
  )
}

export default WorkExperienceForm

