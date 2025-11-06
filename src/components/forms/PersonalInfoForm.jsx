import { useForm } from 'react-hook-form'
import { useState, useEffect, useRef } from 'react'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Toast from '../ui/Toast'
import { validateEmail, validatePhone, validateURL, validateName } from '../../utils/validation'

function PersonalInfoForm({ data, onUpdate }) {
  const [photoPreview, setPhotoPreview] = useState(data?.photo || '')
  const [toast, setToast] = useState(null)

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
    reset,
    watch,
  } = useForm({
    defaultValues: data,
    mode: 'onChange', // Enable validation on change
  })

  // Watch all form values for auto-save
  const formValues = watch()


  // Auto-save form data on change (debounced)
  // Use a ref to track if we're currently updating from props to avoid loops
  const isUpdatingFromProps = useRef(false)
  
  useEffect(() => {
    if (data) {
      isUpdatingFromProps.current = true
      reset(data)
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingFromProps.current = false
      }, 100)
    }
  }, [data, reset])

  useEffect(() => {
    // Skip auto-save if we're updating from props
    if (isUpdatingFromProps.current || !formValues || Object.keys(formValues).length === 0) return

    const timer = setTimeout(() => {
      // Only save if there's actual data (not just empty fields)
      const hasData = formValues.name?.trim() || formValues.email?.trim() || formValues.phone?.trim()
      if (hasData) {
        onUpdate(formValues)
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please select an image file', type: 'error' })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'Image size should be less than 2MB', type: 'error' })
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
            {...register('name', {
              required: 'Name is required',
              validate: (value) => {
                const result = validateName(value)
                return result.valid || result.error
              },
            })}
            error={errors.name?.message}
          />
          <Input
            label="Email *"
            type="email"
            {...register('email', {
              required: 'Email is required',
              validate: (value) => {
                const result = validateEmail(value)
                return result.valid || result.error
              },
            })}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            type="tel"
            {...register('phone', {
              validate: (value) => {
                if (!value) return true
                const result = validatePhone(value)
                return result.valid || result.error
              },
            })}
            error={errors.phone?.message}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Address"
            {...register('address', {
              maxLength: {
                value: 200,
                message: 'Address must not exceed 200 characters',
              },
            })}
            error={errors.address?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            {...register('linkedin', {
              validate: (value) => {
                if (!value) return true
                const result = validateURL(value, 'LinkedIn URL')
                return result.valid || result.error
              },
            })}
            error={errors.linkedin?.message}
          />
          <Input
            label="GitHub"
            type="url"
            placeholder="https://github.com/username"
            {...register('github', {
              validate: (value) => {
                if (!value) return true
                const result = validateURL(value, 'GitHub URL')
                return result.valid || result.error
              },
            })}
            error={errors.github?.message}
          />
          <Input
            label="Portfolio"
            type="url"
            placeholder="https://yourportfolio.com"
            {...register('portfolio', {
              validate: (value) => {
                if (!value) return true
                const result = validateURL(value, 'Portfolio URL')
                return result.valid || result.error
              },
            })}
            error={errors.portfolio?.message}
          />
        </div>

        {/* Social Media Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Social Media (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Twitter/X"
              type="url"
              placeholder="https://twitter.com/username or https://x.com/username"
              {...register('twitter', {
                validate: (value) => {
                  if (!value) return true
                  const result = validateURL(value, 'Twitter/X URL')
                  return result.valid || result.error
                },
              })}
              error={errors.twitter?.message}
            />
            <Input
              label="Instagram"
              type="url"
              placeholder="https://instagram.com/username"
              {...register('instagram', {
                validate: (value) => {
                  if (!value) return true
                  const result = validateURL(value, 'Instagram URL')
                  return result.valid || result.error
                },
              })}
              error={errors.instagram?.message}
            />
            <Input
              label="Facebook"
              type="url"
              placeholder="https://facebook.com/username"
              {...register('facebook', {
                validate: (value) => {
                  if (!value) return true
                  const result = validateURL(value, 'Facebook URL')
                  return result.valid || result.error
                },
              })}
              error={errors.facebook?.message}
            />
            <Input
              label="YouTube"
              type="url"
              placeholder="https://youtube.com/@channel or https://youtube.com/c/channel"
              {...register('youtube', {
                validate: (value) => {
                  if (!value) return true
                  const result = validateURL(value, 'YouTube URL')
                  return result.valid || result.error
                },
              })}
              error={errors.youtube?.message}
            />
            <Input
              label="Website/Blog"
              type="url"
              placeholder="https://yourwebsite.com"
              {...register('website', {
                validate: (value) => {
                  if (!value) return true
                  const result = validateURL(value, 'Website URL')
                  return result.valid || result.error
                },
              })}
              error={errors.website?.message}
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-2">
          <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Professional Photo (Optional)
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                />
                <Button
                  type="button"
                  onClick={handleRemovePhoto}
                  variant="danger"
                  className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full flex items-center justify-center text-sm min-h-0"
                  aria-label="Remove photo"
                >
                  ×
                </Button>
              </div>
            )}
            <div className="flex-1">
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                aria-label="Upload professional photo"
                aria-describedby="photo-upload-help"
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-200 file:cursor-pointer"
              />
              <p id="photo-upload-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recommended: Square photo, max 2MB. JPG, PNG, or WebP format.
              </p>
              <input type="hidden" {...register('photo')} />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
        >
          Save Personal Information
        </Button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </Card>
  )
}

export default PersonalInfoForm

