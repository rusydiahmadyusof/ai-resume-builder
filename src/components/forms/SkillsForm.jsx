import { useState } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'

function SkillsForm({ skills, onUpdate }) {
  const [skillInput, setSkillInput] = useState('')

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      onUpdate([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    onUpdate(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  return (
    <Card title="Skills">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter a skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAddSkill} type="button" className="w-full sm:w-auto">
            Add
          </Button>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  aria-label={`Remove ${skill} skill`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {skills.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No skills added yet. Add your skills above.
          </p>
        )}
      </div>
    </Card>
  )
}

export default SkillsForm

