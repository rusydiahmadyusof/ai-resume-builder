/**
 * Resume versioning service
 * Manages multiple versions of resume data
 */

const VERSIONS_KEY = 'resume_versions'
const MAX_VERSIONS = 10 // Keep last 10 versions

export const versionService = {
  /**
   * Save a new version of resume data
   * @param {Object} resumeData - Current resume data
   * @param {string} versionName - Optional name for this version
   * @returns {Object} Version info
   */
  saveVersion: (resumeData, versionName = null) => {
    try {
      const versions = versionService.getAllVersions()
      const timestamp = Date.now()
      
      const version = {
        id: `v${timestamp}`,
        name: versionName || `Version ${new Date(timestamp).toLocaleString()}`,
        data: JSON.parse(JSON.stringify(resumeData)), // Deep copy
        createdAt: timestamp,
        savedAt: timestamp, // Alias for compatibility
        isCurrent: false,
      }

      // Mark all previous versions as not current
      versions.forEach(v => v.isCurrent = false)

      versions.unshift(version) // Add to beginning

      // Keep only last MAX_VERSIONS
      if (versions.length > MAX_VERSIONS) {
        versions.splice(MAX_VERSIONS)
      }

      localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
      return { success: true, version }
    } catch (error) {
      console.error('Error saving version:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Get all saved versions
   * @returns {Array} Array of version objects
   */
  getAllVersions: () => {
    try {
      const serialized = localStorage.getItem(VERSIONS_KEY)
      if (!serialized) return []
      return JSON.parse(serialized)
    } catch (error) {
      console.error('Error loading versions:', error)
      return []
    }
  },

  /**
   * Get a specific version by ID
   * @param {string} versionId - Version ID
   * @returns {Object|null} Version data or null
   */
  getVersion: (versionId) => {
    const versions = versionService.getAllVersions()
    return versions.find(v => v.id === versionId) || null
  },

  /**
   * Restore a version (make it current)
   * @param {string} versionId - Version ID to restore
   * @returns {Object} Restore result
   */
  restoreVersion: (versionId) => {
    try {
      const versions = versionService.getAllVersions()
      const version = versions.find(v => v.id === versionId)
      
      if (!version) {
        return { success: false, error: 'Version not found' }
      }

      // Mark all as not current, then mark this one as current
      versions.forEach(v => v.isCurrent = false)
      version.isCurrent = true

      localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
      
      return { success: true, data: version.data }
    } catch (error) {
      console.error('Error restoring version:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Delete a version
   * @param {string} versionId - Version ID to delete
   * @returns {Object} Delete result
   */
  deleteVersion: (versionId) => {
    try {
      const versions = versionService.getAllVersions()
      const filtered = versions.filter(v => v.id !== versionId)
      
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(filtered))
      return { success: true }
    } catch (error) {
      console.error('Error deleting version:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Rename a version
   * @param {string} versionId - Version ID
   * @param {string} newName - New name
   * @returns {Object} Rename result
   */
  renameVersion: (versionId, newName) => {
    try {
      const versions = versionService.getAllVersions()
      const version = versions.find(v => v.id === versionId)
      
      if (!version) {
        return { success: false, error: 'Version not found' }
      }

      version.name = newName
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
      return { success: true }
    } catch (error) {
      console.error('Error renaming version:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Clear all versions
   * @returns {boolean} Success status
   */
  clearAllVersions: () => {
    try {
      localStorage.removeItem(VERSIONS_KEY)
      return true
    } catch (error) {
      console.error('Error clearing versions:', error)
      return false
    }
  },
}

