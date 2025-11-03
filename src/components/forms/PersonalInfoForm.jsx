import { useForm } from 'react-hook-form'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'

function PersonalInfoForm({ data, onUpdate }) {
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
    <Card title="Personal Information">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Email *"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
          />
          <Input
            label="Address"
            {...register('address')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            {...register('linkedin')}
          />
          <Input
            label="GitHub"
            type="url"
            placeholder="https://github.com/username"
            {...register('github')}
          />
          <Input
            label="Portfolio"
            type="url"
            placeholder="https://yourportfolio.com"
            {...register('portfolio')}
          />
        </div>

        <Textarea
          label="Professional Summary"
          rows={4}
          placeholder="Brief summary of your professional background and key achievements..."
          {...register('summary')}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Save Personal Information
        </button>
      </form>
    </Card>
  )
}

export default PersonalInfoForm

