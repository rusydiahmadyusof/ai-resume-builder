import * as pdfjsLib from 'pdfjs-dist'
// Import worker as a URL using Vite's ?url suffix
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Set worker source for pdf.js
if (typeof window !== 'undefined') {
  // Use the worker URL that Vite bundles
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
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

