import { useState } from 'react'
import Button from './Button'

function ShareButton({ resumeUrl, resumeTitle }) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    try {
      if (navigator.share) {
        await navigator.share({
          title: resumeTitle || 'My Resume',
          text: 'Check out my resume created with AI Resume Builder',
          url: resumeUrl || window.location.href,
        })
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(resumeUrl || window.location.href)
        alert('Resume link copied to clipboard!')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(resumeUrl || window.location.href)
          alert('Resume link copied to clipboard!')
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError)
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      variant="outline"
      className="w-full"
      aria-label="Share resume"
    >
      {isSharing ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Sharing...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Resume
        </>
      )}
    </Button>
  )
}

export default ShareButton

