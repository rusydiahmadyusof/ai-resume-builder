import * as pdfjsLib from 'pdfjs-dist'

// Set worker source for pdf.js using CDN
// Alternative: use local worker if CDN doesn't work
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

export const pdfParserService = {
  /**
   * Extract text from PDF file
   * @param {File} file - PDF file
   * @returns {Promise<string>} Extracted text
   */
  extractTextFromPDF: async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }
      
      return fullText.trim()
    } catch (error) {
      console.error('Error extracting text from PDF:', error)
      throw new Error(`Failed to extract text from PDF: ${error.message}`)
    }
  },

  /**
   * Validate PDF file
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validatePDF: (file) => {
    if (!file) {
      return { valid: false, error: 'No file selected' }
    }

    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Please select a PDF file' }
    }

    // Max 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: 'PDF size should be less than 5MB' }
    }

    return { valid: true }
  },
}

