import { useState } from 'react'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { validateDateRange, validateDateNotFuture, validateDateNotTooOld } from '../../utils/dateValidation'
import { validateWorkExperience } from '../../utils/validation'

function WorkExperienceForm({ experiences, onAdd, onUpdate, onRemove }) {
  const [dateErrors, setDateErrors] = useState({})

  const handleAdd = () => {
    onAdd()
  }

  const validateDates = (id, startDate, endDate, current) => {
    const errors = {}
    
    // Validate start date
    if (startDate) {
      const futureCheck = validateDateNotFuture(startDate)
      if (!futureCheck.valid) {
        errors[`${id}-start`] = futureCheck.error
      }
      
      const oldCheck = validateDateNotTooOld(startDate)
      if (!oldCheck.valid) {
        errors[`${id}-start`] = oldCheck.error
      }
    }

    // Validate end date if not current
    if (!current && endDate) {
      const futureCheck = validateDateNotFuture(endDate)
      if (!futureCheck.valid) {
        errors[`${id}-end`] = futureCheck.error
      }
      
      const oldCheck = validateDateNotTooOld(endDate)
      if (!oldCheck.valid) {
        errors[`${id}-end`] = oldCheck.error
      }

      // Validate date range
      if (startDate) {
        const rangeCheck = validateDateRange(startDate, endDate)
        if (!rangeCheck.valid) {
          errors[`${id}-end`] = rangeCheck.error
        }
      }
    }

    setDateErrors((prev) => ({
      ...prev,
      [`${id}-start`]: errors[`${id}-start`],
      [`${id}-end`]: errors[`${id}-end`],
    }))

    return Object.keys(errors).length === 0
  }

  const handleUpdate = (id, field, value) => {
    onUpdate(id, { [field]: value })
    
    // Validate dates if date fields changed
    if (field === 'startDate' || field === 'endDate' || field === 'current') {
      const exp = experiences.find((e) => e.id === id)
      if (exp) {
        const updatedExp = { ...exp, [field]: value }
        validateDates(
          id,
          updatedExp.startDate,
          updatedExp.endDate,
          updatedExp.current
        )
      }
    }
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
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
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
                value={exp.company || ''}
                onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                placeholder="Company Name"
                required
                error={(() => {
                  const validation = validateWorkExperience(exp)
                  return validation.errors.company
                })()}
              />
              <Input
                label="Position/Title *"
                value={exp.position || ''}
                onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                placeholder="Job Title"
                required
                error={(() => {
                  const validation = validateWorkExperience(exp)
                  return validation.errors.position
                })()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Start Date *"
                  type="month"
                  value={exp.startDate || ''}
                  onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                  error={dateErrors[`${exp.id}-start`]}
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => handleUpdate(exp.id, 'current', e.target.checked)}
                    className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                    aria-label="Currently working at this position"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Currently working here</span>
                </label>
                {!exp.current && (
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                    error={dateErrors[`${exp.id}-end`]}
                  />
                )}
              </div>
            </div>

            <Textarea
              label="Responsibilities & Achievements"
              rows={4}
              value={exp.responsibilities || ''}
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

