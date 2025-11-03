import { useForm } from 'react-hook-form'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'

function JobApplicationForm({ data, onUpdate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  })

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

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Save Job Application Details
        </button>
      </form>
    </Card>
  )
}

export default JobApplicationForm

