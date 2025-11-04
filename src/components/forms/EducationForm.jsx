import { useState } from 'react'
import Input from '../ui/Input'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { validateDateRange, validateDateNotFuture, validateDateNotTooOld } from '../../utils/dateValidation'
import { validateEducation } from '../../utils/validation'

function EducationForm({ education, onAdd, onUpdate, onRemove }) {
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
      const edu = education.find((e) => e.id === id)
      if (edu) {
        const updatedEdu = { ...edu, [field]: value }
        validateDates(
          id,
          updatedEdu.startDate,
          updatedEdu.endDate,
          updatedEdu.current
        )
      }
    }
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
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                Education #{index + 1}
              </h4>
              {education.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemove(edu.id)}
                  type="button"
                  className="w-full sm:w-auto text-sm"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution *"
                value={edu.institution || ''}
                onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                placeholder="University/School Name"
                required
                error={(() => {
                  const validation = validateEducation(edu)
                  return validation.errors.institution
                })()}
              />
              <Input
                label="Degree *"
                value={edu.degree || ''}
                onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor's, Master's, etc."
                required
                error={(() => {
                  const validation = validateEducation(edu)
                  return validation.errors.degree
                })()}
              />
            </div>

            <Input
              label="Field of Study"
              value={edu.field || ''}
              onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
              placeholder="Computer Science, Business, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Start Date"
                  type="month"
                  value={edu.startDate || ''}
                  onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                  error={dateErrors[`${edu.id}-start`]}
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edu.current || false}
                    onChange={(e) => handleUpdate(edu.id, 'current', e.target.checked)}
                    className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                    aria-label="Currently studying at this institution"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Currently studying</span>
                </label>
                {!edu.current && (
                  <Input
                    label="End Date"
                    type="month"
                    value={edu.endDate || ''}
                    onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                    error={dateErrors[`${edu.id}-end`]}
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

