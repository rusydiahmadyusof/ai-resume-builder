import { useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { pdfService } from '../../services/pdfService'

function CoverLetterPreview({ coverLetter, personalInfo, jobTitle }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const coverLetterRef = useState(null)

  const handleDownloadPDF = async () => {
    if (!coverLetterRef.current) {
      return
    }

    setIsGeneratingPDF(true)
    try {
      const filename = `${personalInfo?.name?.replace(/\s+/g, '_') || 'CoverLetter'}_${jobTitle?.replace(/\s+/g, '_') || 'CoverLetter'}.pdf`
      await pdfService.generatePDF(coverLetterRef.current, filename, {
        quality: 2,
        format: 'a4',
        orientation: 'portrait',
        metadata: {
          title: `${personalInfo?.name || 'Cover Letter'} - Cover Letter`,
          author: personalInfo?.name || 'Applicant',
          subject: jobTitle || 'Cover Letter',
        },
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!coverLetter) {
    return null
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Cover Letter Preview</h3>
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          variant="outline"
          className="text-sm"
        >
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>

      <div
        ref={coverLetterRef}
        className="bg-white p-6 border border-gray-200 rounded-lg prose prose-sm max-w-none"
        style={{
          fontFamily: 'Georgia, serif',
          lineHeight: '1.8',
          fontSize: '12pt',
        }}
      >
        <div className="mb-6">
          {personalInfo?.name && (
            <div className="font-semibold">{personalInfo.name}</div>
          )}
          {(personalInfo?.email || personalInfo?.phone || personalInfo?.address) && (
            <div className="text-sm text-gray-600 mt-1">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && personalInfo.phone && <span> • </span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && (
                <>
                  {(personalInfo.email || personalInfo.phone) && <span> • </span>}
                  <span>{personalInfo.address}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="whitespace-pre-wrap text-gray-800">{coverLetter}</div>
      </div>
    </Card>
  )
}

export default CoverLetterPreview

