import { useState, useEffect, useRef } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { groqService } from '../../services/groqService'

function SkillsForm({ skills, onUpdate, workExperience = [] }) {
  const [skillInput, setSkillInput] = useState('')
  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [recommendationError, setRecommendationError] = useState(null)
  const lastWorkExpRef = useRef('')

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

  // Fetch skill recommendations when work experience changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!workExperience || workExperience.length === 0) {
        setRecommendedSkills([])
        return
      }

      // Check if work experience has meaningful data (company, position, or responsibilities)
      const hasValidExperience = workExperience.some(exp => {
        const hasCompany = exp.company && exp.company.trim().length > 0
        const hasPosition = exp.position && exp.position.trim().length > 0
        const hasResponsibilities = exp.responsibilities && exp.responsibilities.trim().length > 10
        return hasCompany || hasPosition || hasResponsibilities
      })

      if (!hasValidExperience) {
        setRecommendedSkills([])
        return
      }

      setIsLoadingRecommendations(true)
      setRecommendationError(null)

      try {
        const result = await groqService.recommendSkillsFromExperience(workExperience)
        if (result.success && result.data && result.data.length > 0) {
          setRecommendedSkills(result.data)
        } else {
          setRecommendedSkills([])
          if (result.error) {
            setRecommendationError(result.error)
          }
        }
      } catch (error) {
        console.error('Error fetching skill recommendations:', error)
        setRecommendationError('Failed to load recommendations')
        setRecommendedSkills([])
      } finally {
        setIsLoadingRecommendations(false)
      }
    }

    // Only fetch if work experience has actually changed
    const currentWorkExp = JSON.stringify(workExperience)
    if (currentWorkExp !== lastWorkExpRef.current) {
      fetchRecommendations()
      lastWorkExpRef.current = currentWorkExp
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workExperience])

  // Filter out already added skills from recommendations
  useEffect(() => {
    setRecommendedSkills(prev => 
      prev.filter(skill => 
        !skills.some(existingSkill => 
          existingSkill.toLowerCase() === skill.toLowerCase()
        )
      )
    )
  }, [skills])

  const handleAddRecommendedSkill = (skill) => {
    if (skill && skill.trim() && !skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      onUpdate([...skills, skill.trim()])
    }
  }

  const handleAddAllRecommended = () => {
    const newSkills = recommendedSkills
      .filter(skill => 
        skill && skill.trim() && 
        !skills.some(existingSkill => existingSkill.toLowerCase() === skill.toLowerCase())
      )
      .map(skill => skill.trim())
    
    if (newSkills.length > 0) {
      onUpdate([...skills, ...newSkills])
    }
  }

  return (
    <Card title="Skills">
      <div className="space-y-4">
        {/* Recommended Skills Section */}
        {(isLoadingRecommendations || recommendedSkills.length > 0 || recommendationError) && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                🤖 AI Recommended Skills
              </h3>
              {recommendedSkills.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddAllRecommended}
                  className="text-xs px-2 py-1 h-auto"
                  disabled={recommendedSkills.length === 0}
                >
                  Add All
                </Button>
              )}
            </div>
            {isLoadingRecommendations && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="animate-spin inline-block mr-2">⏳</span>
                Analyzing your work experience to recommend skills...
              </p>
            )}
            {recommendationError && !isLoadingRecommendations && (
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠ {recommendationError}
              </p>
            )}
            {recommendedSkills.length > 0 && !isLoadingRecommendations && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Based on your work experience and responsibilities:
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendedSkills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddRecommendedSkill(skill)}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                      title={`Add ${skill}`}
                    >
                      {skill}
                      <span className="ml-2 text-blue-600 dark:text-blue-300">+</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Skill Input */}
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

        {/* Current Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Skills:</h4>
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
          </div>
        )}

        {skills.length === 0 && recommendedSkills.length === 0 && !isLoadingRecommendations && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No skills added yet. Add your skills above or wait for AI recommendations based on your work experience.
          </p>
        )}
      </div>
    </Card>
  )
}

export default SkillsForm

