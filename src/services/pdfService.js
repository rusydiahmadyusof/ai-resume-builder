import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const pdfService = {
  /**
   * Generate PDF from resume HTML element
   * @param {HTMLElement} element - The resume container element
   * @param {string} filename - Name for the downloaded PDF file
   * @param {Object} options - Optional PDF generation options
   * @returns {Promise<boolean>} Success status
   */
  generatePDF: async (element, filename = 'resume.pdf', options = {}) => {
    const {
      quality = 2, // 1 = low, 2 = medium, 3 = high
      format = 'a4', // 'a4' or 'letter'
      orientation = 'portrait', // 'portrait' or 'landscape'
      metadata = {},
    } = options
    try {
      if (!element) {
        throw new Error('Resume element not found')
      }

      // Show loading indicator
      const loadingOverlay = document.createElement('div')
      loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-size: 18px;
      `
      loadingOverlay.innerHTML = `
        <div style="text-align: center;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Generating PDF...</p>
        </div>
      `
      document.body.appendChild(loadingOverlay)

      // Configure html2canvas options with quality settings
      const scaleMap = { 1: 1.5, 2: 2, 3: 3 } // Low, Medium, High
      const canvasScale = scaleMap[quality] || 2
      
      const canvas = await html2canvas(element, {
        scale: canvasScale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure images are loaded in cloned document
          const images = clonedDoc.querySelectorAll('img')
          images.forEach((img) => {
            if (!img.complete) {
              img.style.display = 'none'
            }
          })
        },
      })

      // Remove loading overlay
      document.body.removeChild(loadingOverlay)

      // Calculate PDF dimensions based on format
      const formatDimensions = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
      }
      const dimensions = formatDimensions[format] || formatDimensions.a4
      const imgWidth = dimensions.width
      const pageHeight = dimensions.height
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const heightLeft = imgHeight

      // Convert canvas to image with quality based on scale
      const imageQuality = quality === 3 ? 1.0 : quality === 2 ? 0.95 : 0.85
      const imgData = canvas.toDataURL('image/png', imageQuality)

      // Create PDF with orientation
      const pdf = new jsPDF(orientation, 'mm', format)
      
      // Set PDF metadata
      if (metadata.title) pdf.setProperties({ title: metadata.title })
      if (metadata.author) pdf.setProperties({ author: metadata.author })
      if (metadata.subject) pdf.setProperties({ subject: metadata.subject })
      pdf.setProperties({
        creator: 'AI Resume Builder',
        producer: 'AI Resume Builder',
      })
      let heightLeftForImg = heightLeft
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeftForImg -= pageHeight

      // Add additional pages if needed
      while (heightLeftForImg >= 0) {
        position = heightLeftForImg - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeftForImg -= pageHeight
      }

      // Save PDF
      pdf.save(filename)

      return true
    } catch (error) {
      console.error('Error generating PDF:', error)
      
      // Remove loading overlay if it exists
      const overlay = document.querySelector('div[style*="position: fixed"]')
      if (overlay) {
        document.body.removeChild(overlay)
      }

      throw new Error(`Failed to generate PDF: ${error.message}`)
    }
  },

  /**
   * Generate PDF with custom options
   * @param {HTMLElement} element - The resume container element
   * @param {Object} options - PDF generation options
   * @returns {Promise<boolean>} Success status
   */
  generatePDFWithOptions: async (element, options = {}) => {
    const {
      filename = 'resume.pdf',
      format = 'a4',
      orientation = 'portrait',
      quality = 2,
    } = options

    try {
      if (!element) {
        throw new Error('Resume element not found')
      }

      // Show loading indicator
      const loadingOverlay = document.createElement('div')
      loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-size: 18px;
      `
      loadingOverlay.innerHTML = `
        <div style="text-align: center;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Generating PDF...</p>
        </div>
      `
      document.body.appendChild(loadingOverlay)

      // Configure html2canvas with custom options
      const canvas = await html2canvas(element, {
        scale: quality,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      // Remove loading overlay
      document.body.removeChild(loadingOverlay)

      // Calculate PDF dimensions based on format
      const formatDimensions = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
      }

      const dimensions = formatDimensions[format] || formatDimensions.a4
      const imgWidth = dimensions.width
      const pageHeight = dimensions.height
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const heightLeft = imgHeight

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0)

      // Create PDF
      const pdf = new jsPDF(orientation, 'mm', format)
      let heightLeftForImg = heightLeft
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeftForImg -= pageHeight

      // Add additional pages if needed
      while (heightLeftForImg >= 0) {
        position = heightLeftForImg - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeftForImg -= pageHeight
      }

      // Save PDF
      pdf.save(filename)

      return true
    } catch (error) {
      console.error('Error generating PDF:', error)
      
      // Remove loading overlay if it exists
      const overlay = document.querySelector('div[style*="position: fixed"]')
      if (overlay) {
        document.body.removeChild(overlay)
      }

      throw new Error(`Failed to generate PDF: ${error.message}`)
    }
  },
}

