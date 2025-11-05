import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import Button from '../ui/Button'

function JobApplicationForm({ data, onUpdate }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: data,
  })

  // Watch form values and auto-save on change
  const jobTitle = watch('jobTitle')
  const jobDescription = watch('jobDescription')
  
  // Auto-save when values change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((jobTitle && jobTitle.trim()) || (jobDescription && jobDescription.trim())) {
        onUpdate({
          jobTitle: jobTitle || '',
          jobDescription: jobDescription || '',
        })
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitle, jobDescription])

  const onSubmit = (formData) => {
    onUpdate(formData)
  }

  return (
    <Card title="Job Application Details">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Job Title *"
          {...register('jobTitle', { required: 'Job title is required' })}
          error={errors.jobTitle?.message}
          placeholder="e.g., Senior Software Engineer"
        />

        <Textarea
          label="Job Description *"
          rows={8}
          {...register('jobDescription', {
            required: 'Job description is required',
          })}
          error={errors.jobDescription?.message}
          placeholder="Paste the job description here. The AI will use this to tailor your resume..."
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
        >
          Save Job Application Details
        </Button>
      </form>
    </Card>
  )
}

export default JobApplicationForm

