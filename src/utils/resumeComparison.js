/**
 * Utility functions for comparing and merging resume versions
 */

/**
 * Deep comparison of two objects to find differences
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @param {string} path - Current path (for nested objects)
 * @returns {Object} Differences object
 */
export function findDifferences(obj1, obj2, path = '') {
  const differences = {
    added: [],
    removed: [],
    modified: [],
    unchanged: [],
  }

  if (!obj1 && obj2) {
    differences.added.push({ path, value: obj2 })
    return differences
  }

  if (obj1 && !obj2) {
    differences.removed.push({ path, value: obj1 })
    return differences
  }

  if (obj1 === obj2 || (obj1 === null && obj2 === null)) {
    return differences
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      differences.modified.push({
        path,
        oldValue: obj1,
        newValue: obj2,
      })
    }
    return differences
  }

  // Handle arrays
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    const arr1 = Array.isArray(obj1) ? obj1 : []
    const arr2 = Array.isArray(obj2) ? obj2 : []
    const maxLength = Math.max(arr1.length, arr2.length)

    for (let i = 0; i < maxLength; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`
      if (i >= arr1.length) {
        differences.added.push({ path: itemPath, value: arr2[i] })
      } else if (i >= arr2.length) {
        differences.removed.push({ path: itemPath, value: arr1[i] })
      } else {
        const itemDiff = findDifferences(arr1[i], arr2[i], itemPath)
        differences.added.push(...itemDiff.added)
        differences.removed.push(...itemDiff.removed)
        differences.modified.push(...itemDiff.modified)
      }
    }
    return differences
  }

  // Handle objects
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])

  for (const key of allKeys) {
    const itemPath = path ? `${path}.${key}` : key
    const val1 = obj1[key]
    const val2 = obj2[key]

    if (!(key in obj1)) {
      differences.added.push({ path: itemPath, value: val2 })
    } else if (!(key in obj2)) {
      differences.removed.push({ path: itemPath, value: val1 })
    } else {
      const diff = findDifferences(val1, val2, itemPath)
      differences.added.push(...diff.added)
      differences.removed.push(...diff.removed)
      differences.modified.push(...diff.modified)
    }
  }

  return differences
}

/**
 * Get a summary of differences between two resume versions
 * @param {Object} resume1 - First resume data
 * @param {Object} resume2 - Second resume data
 * @returns {Object} Summary of differences
 */
export function getResumeDifferenceSummary(resume1, resume2) {
  const differences = findDifferences(resume1, resume2)
  
  // Group differences by section
  const sections = {
    personalInfo: [],
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    jobApplication: [],
    other: [],
  }

  differences.modified.forEach(diff => {
    const section = diff.path.split('.')[0]
    if (sections[section]) {
      sections[section].push(diff)
    } else {
      sections.other.push(diff)
    }
  })

  differences.added.forEach(diff => {
    const section = diff.path.split('.')[0]
    if (sections[section]) {
      sections[section].push(diff)
    } else {
      sections.other.push(diff)
    }
  })

  differences.removed.forEach(diff => {
    const section = diff.path.split('.')[0]
    if (sections[section]) {
      sections[section].push(diff)
    } else {
      sections.other.push(diff)
    }
  })

  return {
    totalChanges: differences.modified.length + differences.added.length + differences.removed.length,
    sections,
    details: differences,
  }
}

/**
 * Merge two resume versions intelligently
 * @param {Object} baseResume - Base resume (usually the older one)
 * @param {Object} newResume - New resume to merge
 * @param {Object} options - Merge options
 * @returns {Object} Merged resume
 */
export function mergeResumes(baseResume, newResume, options = {}) {
  const {
    preferNew = true, // Prefer new values over old ones
    mergeArrays = 'combine', // 'combine', 'replace', 'merge'
  } = options

  const merged = JSON.parse(JSON.stringify(baseResume))

  function mergeObject(target, source) {
    for (const key in source) {
      if (Array.isArray(source[key])) {
        if (mergeArrays === 'replace') {
          target[key] = JSON.parse(JSON.stringify(source[key]))
        } else if (mergeArrays === 'combine') {
          // Combine arrays, avoiding duplicates
          const existing = target[key] || []
          const newItems = source[key] || []
          const combined = [...existing]
          
          newItems.forEach(item => {
            // Simple duplicate check based on ID or content
            const isDuplicate = combined.some(existingItem => {
              if (item.id && existingItem.id) {
                return item.id === existingItem.id
              }
              // For objects without IDs, do a deep comparison
              return JSON.stringify(item) === JSON.stringify(existingItem)
            })
            
            if (!isDuplicate) {
              combined.push(JSON.parse(JSON.stringify(item)))
            }
          })
          
          target[key] = combined
        } else {
          // Merge strategy: try to match by ID and merge
          target[key] = mergeArray(target[key] || [], source[key] || [])
        }
      } else if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key]) {
          target[key] = {}
        }
        mergeObject(target[key], source[key])
      } else {
        if (preferNew || target[key] === undefined || target[key] === null || target[key] === '') {
          target[key] = source[key]
        }
      }
    }
    return target
  }

  function mergeArray(arr1, arr2) {
    const merged = [...arr1]
    
    arr2.forEach(item2 => {
      if (item2.id) {
        const existingIndex = merged.findIndex(item => item.id === item2.id)
        if (existingIndex >= 0) {
          // Merge existing item
          merged[existingIndex] = mergeObject(merged[existingIndex], item2)
        } else {
          // Add new item
          merged.push(JSON.parse(JSON.stringify(item2)))
        }
      } else {
        // No ID, add as new
        merged.push(JSON.parse(JSON.stringify(item2)))
      }
    })
    
    return merged
  }

  return mergeObject(merged, newResume)
}

/**
 * Highlight differences in text content
 * @param {string} oldText - Old text
 * @param {string} newText - New text
 * @returns {Object} Highlighted segments
 */
export function highlightTextDifferences(oldText, newText) {
  if (!oldText && !newText) return { segments: [] }
  if (!oldText) return { segments: [{ text: newText, type: 'added' }] }
  if (!newText) return { segments: [{ text: oldText, type: 'removed' }] }
  if (oldText === newText) return { segments: [{ text: oldText, type: 'unchanged' }] }

  // Simple word-by-word comparison
  const oldWords = oldText.split(/\s+/)
  const newWords = newText.split(/\s+/)
  const segments = []
  
  let oldIndex = 0
  let newIndex = 0
  
  while (oldIndex < oldWords.length || newIndex < newWords.length) {
    if (oldIndex >= oldWords.length) {
      segments.push({ text: newWords[newIndex], type: 'added' })
      newIndex++
    } else if (newIndex >= newWords.length) {
      segments.push({ text: oldWords[oldIndex], type: 'removed' })
      oldIndex++
    } else if (oldWords[oldIndex] === newWords[newIndex]) {
      segments.push({ text: oldWords[oldIndex], type: 'unchanged' })
      oldIndex++
      newIndex++
    } else {
      // Find next match
      let foundMatch = false
      for (let i = newIndex + 1; i < newWords.length && i < newIndex + 5; i++) {
        if (oldWords[oldIndex] === newWords[i]) {
          // Add words between as added
          for (let j = newIndex; j < i; j++) {
            segments.push({ text: newWords[j], type: 'added' })
          }
          newIndex = i + 1
          oldIndex++
          foundMatch = true
          break
        }
      }
      
      if (!foundMatch) {
        // Check if old word appears later
        let foundOld = false
        for (let i = oldIndex + 1; i < oldWords.length && i < oldIndex + 5; i++) {
          if (oldWords[i] === newWords[newIndex]) {
            // Add words between as removed
            for (let j = oldIndex; j < i; j++) {
              segments.push({ text: oldWords[j], type: 'removed' })
            }
            oldIndex = i + 1
            newIndex++
            foundOld = true
            break
          }
        }
        
        if (!foundOld) {
          // Mark both as different
          segments.push({ text: oldWords[oldIndex], type: 'removed' })
          segments.push({ text: newWords[newIndex], type: 'added' })
          oldIndex++
          newIndex++
        }
      }
    }
  }
  
  return { segments }
}

