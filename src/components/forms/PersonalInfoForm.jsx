import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'

function PersonalInfoForm({ data, onUpdate }) {
  const [photoPreview, setPhotoPreview] = useState(data?.photo || '')

  useEffect(() => {
    if (data?.photo) {
      setPhotoPreview(data.photo)
    }
  }, [data?.photo])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: data,
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setPhotoPreview(base64String)
      setValue('photo', base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview('')
    setValue('photo', '')
  }

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

        {/* Photo Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Photo (Optional)
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recommended: Square photo, max 2MB. JPG, PNG, or WebP format.
              </p>
              <input type="hidden" {...register('photo')} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Save Personal Information
        </button>
      </form>
    </Card>
  )
}

export default PersonalInfoForm

