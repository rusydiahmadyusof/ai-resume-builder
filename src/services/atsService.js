/**
 * ATS (Applicant Tracking System) Optimization Service
 * Analyzes resume content for ATS compatibility and provides scoring
 */

export const atsService = {
  /**
   * Analyze resume for ATS compatibility
   * @param {Object} resumeData - Complete resume data
   * @param {Object} jobData - Job application data
   * @returns {Object} ATS analysis results
   */
  analyzeResume: (resumeData, jobData) => {
    const analysis = {
      score: 0,
      maxScore: 100,
      sections: {},
      suggestions: [],
      keywordMatch: {},
      missingSkills: [],
      formattingIssues: [],
    }

    // Calculate keyword match score (30 points)
    const keywordScore = calculateKeywordMatch(resumeData, jobData)
    analysis.sections.keywordMatch = keywordScore
    analysis.keywordMatch = keywordScore.details

    // Calculate skills match score (25 points)
    const skillsScore = calculateSkillsMatch(resumeData, jobData)
    analysis.sections.skillsMatch = skillsScore

    // Calculate completeness score (20 points)
    const completenessScore = calculateCompleteness(resumeData)
    analysis.sections.completeness = completenessScore

    // Calculate formatting score (15 points)
    const formattingScore = checkFormatting(resumeData)
    analysis.sections.formatting = formattingScore
    analysis.formattingIssues = formattingScore.issues

    // Calculate structure score (10 points)
    const structureScore = checkStructure(resumeData)
    analysis.sections.structure = structureScore

    // Calculate total score
    analysis.score = Math.round(
      keywordScore.score +
      skillsScore.score +
      completenessScore.score +
      formattingScore.score +
      structureScore.score
    )

    // Generate suggestions
    analysis.suggestions = generateSuggestions(analysis)

    // Find missing skills
    analysis.missingSkills = findMissingSkills(resumeData, jobData)

    return analysis
  },

  /**
   * Get ATS score color (for UI display)
   * @param {number} score - ATS score (0-100)
   * @returns {string} Color class name
   */
  getScoreColor: (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  },

  /**
   * Get ATS score label
   * @param {number} score - ATS score (0-100)
   * @returns {string} Label
   */
  getScoreLabel: (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  },
}

/**
 * Calculate keyword match between resume and job description
 */
function calculateKeywordMatch(resumeData, jobData) {
  if (!jobData.jobDescription) {
    return { score: 0, maxScore: 30, details: {}, message: 'No job description provided' }
  }

  const jobText = (jobData.jobTitle + ' ' + jobData.jobDescription).toLowerCase()
  const resumeText = buildResumeText(resumeData).toLowerCase()

  // Extract important keywords from job description
  const jobKeywords = extractKeywords(jobText)
  const resumeKeywords = extractKeywords(resumeText)

  // Calculate match percentage
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeKeywords.includes(keyword)
  )

  const matchPercentage = (matchedKeywords.length / jobKeywords.length) * 100
  const score = Math.min(30, (matchPercentage / 100) * 30)

  return {
    score: Math.round(score),
    maxScore: 30,
    matchPercentage: Math.round(matchPercentage),
    matchedKeywords: matchedKeywords.slice(0, 10),
    missingKeywords: jobKeywords.filter(k => !matchedKeywords.includes(k)).slice(0, 10),
    details: {
      totalKeywords: jobKeywords.length,
      matched: matchedKeywords.length,
      missing: jobKeywords.length - matchedKeywords.length,
    },
  }
}

/**
 * Calculate skills match score
 */
function calculateSkillsMatch(resumeData, jobData) {
  if (!jobData.jobDescription || !resumeData.skills || resumeData.skills.length === 0) {
    return { score: 0, maxScore: 25, message: 'No skills or job description provided' }
  }

  const jobText = jobData.jobDescription.toLowerCase()
  const resumeSkills = resumeData.skills.map(s => s.toLowerCase())

  // Extract technical skills from job description
  const jobSkills = extractTechnicalSkills(jobText)
  const matchedSkills = jobSkills.filter(skill => 
    resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
  )

  const matchPercentage = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 100 
    : 0
  const score = Math.min(25, (matchPercentage / 100) * 25)

  return {
    score: Math.round(score),
    maxScore: 25,
    matchPercentage: Math.round(matchPercentage),
    matchedSkills: matchedSkills.slice(0, 10),
    missingSkills: jobSkills.filter(s => !matchedSkills.includes(s)).slice(0, 10),
  }
}

/**
 * Calculate resume completeness score
 */
function calculateCompleteness(resumeData) {
  let score = 0
  const maxScore = 20
  const checks = []

  // Personal info (3 points)
  if (resumeData.personalInfo?.name) {
    score += 1
    checks.push({ item: 'Name', status: 'complete' })
  } else {
    checks.push({ item: 'Name', status: 'missing' })
  }
  if (resumeData.personalInfo?.email) {
    score += 1
    checks.push({ item: 'Email', status: 'complete' })
  } else {
    checks.push({ item: 'Email', status: 'missing' })
  }

  // Work experience (5 points)
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    const hasComplete = resumeData.workExperience.some(exp => 
      exp.company && exp.position && exp.responsibilities
    )
    if (hasComplete) {
      score += 5
      checks.push({ item: 'Work Experience', status: 'complete' })
    } else {
      score += 2
      checks.push({ item: 'Work Experience', status: 'partial' })
    }
  } else {
    checks.push({ item: 'Work Experience', status: 'missing' })
  }

  // Education (3 points)
  if (resumeData.education && resumeData.education.length > 0) {
    const hasComplete = resumeData.education.some(edu => 
      edu.institution && edu.degree
    )
    if (hasComplete) {
      score += 3
      checks.push({ item: 'Education', status: 'complete' })
    } else {
      score += 1
      checks.push({ item: 'Education', status: 'partial' })
    }
  } else {
    checks.push({ item: 'Education', status: 'missing' })
  }

  // Skills (3 points)
  if (resumeData.skills && resumeData.skills.length >= 5) {
    score += 3
    checks.push({ item: 'Skills (5+)', status: 'complete' })
  } else if (resumeData.skills && resumeData.skills.length > 0) {
    score += 1
    checks.push({ item: 'Skills', status: 'partial' })
  } else {
    checks.push({ item: 'Skills', status: 'missing' })
  }

  // Additional sections (3 points)
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    score += 1
    checks.push({ item: 'Certifications', status: 'complete' })
  }
  if (resumeData.languages && resumeData.languages.length > 0) {
    score += 1
    checks.push({ item: 'Languages', status: 'complete' })
  }
  if (resumeData.personalInfo?.linkedin || resumeData.personalInfo?.github || resumeData.personalInfo?.portfolio) {
    score += 1
    checks.push({ item: 'Online Profiles', status: 'complete' })
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    checks,
    percentage: Math.round((score / maxScore) * 100),
  }
}

/**
 * Check formatting issues
 */
function checkFormatting(resumeData) {
  const issues = []
  let score = 15

  // Check for consistent date formatting
  const workExp = resumeData.workExperience || []
  const hasInconsistentDates = workExp.some(exp => {
    if (!exp.startDate) return true
    return false
  })
  if (hasInconsistentDates) {
    issues.push({ type: 'dates', message: 'Some work experience entries have missing dates' })
    score -= 2
  }

  // Check for empty sections
  const emptySections = []
  if (workExp.length === 0) {
    emptySections.push('Work Experience')
  }
  if (emptySections.length > 0) {
    issues.push({ 
      type: 'empty', 
      message: `Missing sections: ${emptySections.join(', ')}` 
    })
    score -= 3
  }

  // Check for very long descriptions
  const longDescriptions = workExp.filter(exp => 
    exp.responsibilities && exp.responsibilities.length > 500
  )
  if (longDescriptions.length > 0) {
    issues.push({ 
      type: 'length', 
      message: 'Some work experience descriptions are too long (recommended: <500 chars)' 
    })
    score -= 1
  }

  return {
    score: Math.max(0, score),
    maxScore: 15,
    issues,
  }
}

/**
 * Check resume structure
 */
function checkStructure(resumeData) {
  let score = 10

  // Check if resume has logical flow
  const hasWorkExp = resumeData.workExperience && resumeData.workExperience.length > 0
  const hasEducation = resumeData.education && resumeData.education.length > 0
  const hasSkills = resumeData.skills && resumeData.skills.length > 0

  if (!hasWorkExp) score -= 3
  if (!hasEducation) score -= 2
  if (!hasSkills) score -= 2

  return {
    score: Math.max(0, score),
    maxScore: 10,
    message: score >= 8 ? 'Good structure' : 'Resume structure could be improved',
  }
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(analysis) {
  const suggestions = []

  if (analysis.sections.keywordMatch.matchPercentage < 60) {
    suggestions.push({
      priority: 'high',
      category: 'keywords',
      message: `Only ${analysis.sections.keywordMatch.matchPercentage}% of job keywords matched. Add more relevant keywords from the job description.`,
    })
  }

  if (analysis.sections.skillsMatch.matchPercentage < 50) {
    suggestions.push({
      priority: 'high',
      category: 'skills',
      message: `Only ${analysis.sections.skillsMatch.matchPercentage}% of required skills matched. Consider adding missing skills.`,
    })
  }

  if (analysis.sections.completeness.percentage < 80) {
    suggestions.push({
      priority: 'medium',
      category: 'completeness',
      message: `Resume is ${analysis.sections.completeness.percentage}% complete. Fill in missing sections to improve your score.`,
    })
  }

  if (analysis.formattingIssues.length > 0) {
    suggestions.push({
      priority: 'medium',
      category: 'formatting',
      message: `Found ${analysis.formattingIssues.length} formatting issue(s). Fix these to improve ATS compatibility.`,
    })
  }

  if (analysis.missingSkills.length > 0) {
    suggestions.push({
      priority: 'medium',
      category: 'skills',
      message: `Consider adding these skills mentioned in the job description: ${analysis.missingSkills.slice(0, 5).join(', ')}`,
    })
  }

  return suggestions
}

/**
 * Find missing skills from job description
 */
function findMissingSkills(resumeData, jobData) {
  if (!jobData.jobDescription || !resumeData.skills) return []

  const jobText = jobData.jobDescription.toLowerCase()
  const resumeSkills = resumeData.skills.map(s => s.toLowerCase())
  const jobSkills = extractTechnicalSkills(jobText)

  return jobSkills.filter(skill => 
    !resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
  )
}

/**
 * Build complete resume text for analysis
 */
function buildResumeText(resumeData) {
  const parts = []

  if (resumeData.workExperience) {
    resumeData.workExperience.forEach(exp => {
      if (exp.position) parts.push(exp.position)
      if (exp.company) parts.push(exp.company)
      if (exp.responsibilities) parts.push(exp.responsibilities)
    })
  }

  if (resumeData.education) {
    resumeData.education.forEach(edu => {
      if (edu.degree) parts.push(edu.degree)
      if (edu.institution) parts.push(edu.institution)
      if (edu.field) parts.push(edu.field)
    })
  }

  if (resumeData.skills) {
    parts.push(resumeData.skills.join(' '))
  }

  return parts.join(' ')
}

/**
 * Extract keywords from text
 */
function extractKeywords(text) {
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
    'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all',
    'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'now', 'then', 'well', 'also', 'back', 'get', 'make', 'take',
  ])

  // Extract words (2+ characters, alphanumeric)
  const words = text.match(/\b[a-z]{2,}\b/gi) || []
  
  // Filter and count
  const wordCount = {}
  words.forEach(word => {
    const lower = word.toLowerCase()
    if (!stopWords.has(lower) && lower.length >= 3) {
      wordCount[lower] = (wordCount[lower] || 0) + 1
    }
  })

  // Return top keywords (appearing 2+ times)
  return Object.entries(wordCount)
    .filter(([_, count]) => count >= 2)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 30)
    .map(([word]) => word)
}

/**
 * Extract technical skills from job description
 */
function extractTechnicalSkills(text) {
  // Common technical skills keywords
  const skillPatterns = [
    /\b(javascript|js|typescript|ts|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin)\b/gi,
    /\b(react|vue|angular|node\.?js|express|django|flask|spring|laravel|rails)\b/gi,
    /\b(html|css|sass|less|bootstrap|tailwind)\b/gi,
    /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch)\b/gi,
    /\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd)\b/gi,
    /\b(git|github|gitlab|bitbucket|agile|scrum|jira)\b/gi,
    /\b(machine learning|ml|ai|deep learning|tensorflow|pytorch)\b/gi,
    /\b(rest api|graphql|microservices|api design)\b/gi,
  ]

  const skills = new Set()
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => {
        skills.add(match.toLowerCase())
      })
    }
  })

  // Also look for explicit skill mentions (capitalized technical terms)
  const capitalized = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)
  if (capitalized) {
    capitalized.forEach(term => {
      if (term.length >= 3 && term.length <= 20) {
        skills.add(term.toLowerCase())
      }
    })
  }

  return Array.from(skills)
}

