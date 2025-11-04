/**
 * Service for extracting job information from URLs
 * Handles CORS restrictions and HTML fetching
 */

// List of CORS proxy services to try as fallbacks
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
]

export const jobExtractionService = {
  /**
   * Fetch HTML content from a job posting URL
   * Tries direct fetch first, then falls back to CORS proxies
   * @param {string} url - Job posting URL
   * @returns {Promise<string>} HTML content
   */
  fetchJobPageHTML: async (url) => {
    // Validate URL
    if (!url || !url.trim()) {
      throw new Error('Please provide a valid URL')
    }

    let parsedUrl
    try {
      parsedUrl = new URL(url.trim())
    } catch (error) {
      throw new Error('Invalid URL format. Please provide a valid URL (e.g., https://...)')
    }

    // Ensure HTTPS
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new Error('URL must start with http:// or https://')
    }

    // Try direct fetch first (works for some sites)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        mode: 'cors',
      })

      if (response.ok) {
        const html = await response.text()
        if (html && html.length > 100) {
          return html
        }
      }
    } catch (directError) {
      console.log('Direct fetch failed, trying CORS proxy...', directError.message)
    }

    // Try CORS proxies as fallback
    for (const proxy of CORS_PROXIES) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url)
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          mode: 'cors',
        })

        if (response.ok) {
          const html = await response.text()
          if (html && html.length > 100) {
            // Some proxies return JSON, check for that
            if (html.startsWith('{')) {
              try {
                const json = JSON.parse(html)
                return json.contents || json.content || html
              } catch (e) {
                // Not JSON, continue
              }
            }
            return html
          }
        }
      } catch (proxyError) {
        console.log(`Proxy ${proxy} failed:`, proxyError.message)
        continue
      }
    }

    throw new Error(
      'Unable to fetch the job posting. This may be due to:\n' +
      '1. CORS restrictions (common for JobStreet, Indeed)\n' +
      '2. The site blocking automated access\n' +
      '3. Network connectivity issues\n\n' +
      'Please try copying the job description manually.'
    )
  },

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {Object} Validation result
   */
  validateURL: (url) => {
    if (!url || !url.trim()) {
      return { valid: false, error: 'Please enter a URL' }
    }

    try {
      const parsedUrl = new URL(url.trim())
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        return { valid: false, error: 'URL must start with http:// or https://' }
      }
      return { valid: true }
    } catch (error) {
      return { valid: false, error: 'Invalid URL format. Please provide a valid URL (e.g., https://jobstreet.com/...)' }
    }
  },

  /**
   * Clean HTML content for AI processing
   * Removes scripts, styles, and excessive whitespace
   * @param {string} html - Raw HTML
   * @returns {string} Cleaned HTML
   */
  cleanHTML: (html) => {
    if (!html) return ''

    // Remove script and style elements
    let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    // Remove comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')

    // Extract text from common job posting elements
    // Look for job title (usually in h1, h2, or meta tags)
    // Look for job description (usually in div, section, or article with specific classes)
    
    // Limit size to avoid token limits (keep first 10000 chars)
    if (cleaned.length > 10000) {
      cleaned = cleaned.substring(0, 10000) + '...'
    }

    return cleaned
  },
}

