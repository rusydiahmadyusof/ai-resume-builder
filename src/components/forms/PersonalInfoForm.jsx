import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import Toast from '../ui/Toast'
import { pdfParserService } from '../../services/pdfParserService'
import { groqService } from '../../services/groqService'
import { validateEmail, validatePhone, validateURL, validateName, validateSummary } from '../../utils/validation'

function PersonalInfoForm({ data, onUpdate }) {
  const [photoPreview, setPhotoPreview] = useState(data?.photo || '')
  const [isParsingPDF, setIsParsingPDF] = useState(false)
  const [pdfError, setPdfError] = useState(null)
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
    watch,
  } = useForm({
    defaultValues: data,
  })

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

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate PDF
    const validation = pdfParserService.validatePDF(file)
    if (!validation.valid) {
      setPdfError(validation.error)
      return
    }

    setIsParsingPDF(true)
    setPdfError(null)

    try {
      // Extract text from PDF
      const pdfText = await pdfParserService.extractTextFromPDF(file)
      
      if (!pdfText || pdfText.trim().length === 0) {
        setPdfError('No text could be extracted from the PDF. The PDF might be image-based or corrupted.')
        return
      }
      
      console.log('Extracted PDF text length:', pdfText.length)
      
      // Use AI to extract personal information
      const result = await groqService.extractPersonalInfoFromPDF(pdfText)
      
      console.log('AI extraction result:', result)

      if (result.success && result.data) {
        // Pre-fill form with extracted data
        const extractedData = result.data
        const currentValues = watch()
        
        // Build updated form data - merge extracted data with current values
        const updatedData = {
          ...currentValues,
          // Only update fields that are not empty in extracted data
          // Override existing values if they're empty, otherwise keep existing
          name: extractedData.name && extractedData.name.trim() ? extractedData.name : (currentValues.name || ''),
          email: extractedData.email && extractedData.email.trim() ? extractedData.email : (currentValues.email || ''),
          phone: extractedData.phone && extractedData.phone.trim() ? extractedData.phone : (currentValues.phone || ''),
          address: extractedData.address && extractedData.address.trim() ? extractedData.address : (currentValues.address || ''),
          linkedin: extractedData.linkedin && extractedData.linkedin.trim() ? extractedData.linkedin : (currentValues.linkedin || ''),
          github: extractedData.github && extractedData.github.trim() ? extractedData.github : (currentValues.github || ''),
          portfolio: extractedData.portfolio && extractedData.portfolio.trim() ? extractedData.portfolio : (currentValues.portfolio || ''),
          summary: extractedData.summary && extractedData.summary.trim() ? extractedData.summary : (currentValues.summary || ''),
        }
        
        // Set all values at once
        Object.keys(updatedData).forEach(key => {
          if (updatedData[key] !== undefined) {
            setValue(key, updatedData[key], { shouldValidate: false, shouldDirty: true })
          }
        })
        
        // Trigger form update to save to localStorage
        onUpdate(updatedData)

        // Show success message with details
        const extractedFields = Object.entries(extractedData)
          .filter(([_, value]) => value && value.trim())
          .map(([key]) => key)
          .join(', ')
        
        setToast({ 
          message: extractedFields 
            ? `Extracted information: ${extractedFields}. Please review and update the fields.`
            : 'Personal information extracted successfully! Please review and update the fields.', 
          type: 'success' 
        })
      } else {
        setPdfError(result.error || 'Failed to extract information from PDF')
      }
    } catch (error) {
      console.error('Error parsing PDF:', error)
      setPdfError(error.message || 'Failed to process PDF')
    } finally {
      setIsParsingPDF(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const onSubmit = (formData) => {
    onUpdate(formData)
  }

  return (
    <Card title="Personal Information">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* PDF Upload Section */}
        <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            Upload Existing Resume (PDF) - Optional
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Upload your existing resume PDF to automatically extract and fill in your personal information.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              disabled={isParsingPDF}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer disabled:opacity-50"
            />
          </div>
          {isParsingPDF && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <span className="animate-spin">⏳</span>
              <span>Extracting information from PDF...</span>
            </div>
          )}
          {pdfError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {pdfError}
            </div>
          )}
        </div>

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

        <Textarea
          label="Professional Summary"
          rows={4}
          placeholder="Brief summary of your professional background and key achievements..."
          {...register('summary', {
            validate: (value) => {
              if (!value) return true
              const result = validateSummary(value)
              return result.valid || result.error
            },
            maxLength: {
              value: 500,
              message: 'Summary must not exceed 500 characters',
            },
          })}
          error={errors.summary?.message}
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

