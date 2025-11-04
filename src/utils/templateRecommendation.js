/**
 * Recommend resume templates based on job title and description
 */
export const recommendTemplate = (jobTitle = '', jobDescription = '') => {
  const text = `${jobTitle} ${jobDescription}`.toLowerCase()
  
  // Tech/Developer roles
  const techKeywords = ['developer', 'engineer', 'programmer', 'software', 'coding', 'python', 'javascript', 'react', 'node', 'api', 'full stack', 'frontend', 'backend', 'devops', 'tech', 'it', 'computer science', 'web developer', 'mobile developer', 'app developer', 'software engineer', 'code', 'programming', 'git', 'github', 'stack', 'framework']
  const techScore = techKeywords.filter(keyword => text.includes(keyword)).length
  
  // Executive/Management roles
  const executiveKeywords = ['executive', 'director', 'manager', 'ceo', 'cto', 'vp', 'vice president', 'leadership', 'strategic', 'c-suite', 'senior executive', 'chief', 'president', 'head of', 'senior director']
  const executiveScore = executiveKeywords.filter(keyword => text.includes(keyword)).length
  
  // Creative/Design roles
  const creativeKeywords = ['designer', 'design', 'creative', 'graphic', 'ui/ux', 'ui ', 'ux ', 'artist', 'marketing', 'brand', 'visual', 'portfolio', 'illustrator', 'photographer', 'video', 'multimedia']
  const creativeScore = creativeKeywords.filter(keyword => text.includes(keyword)).length
  
  // Academic/Research roles
  const academicKeywords = ['professor', 'researcher', 'phd', 'research', 'academic', 'university', 'education', 'scholar', 'thesis', 'publication', 'lecturer', 'doctorate', 'postdoc', 'postdoctoral']
  const academicScore = academicKeywords.filter(keyword => text.includes(keyword)).length
  
  // Business/Corporate roles
  const businessKeywords = ['business', 'corporate', 'finance', 'accounting', 'consultant', 'analyst', 'sales', 'marketing', 'operations', 'banking', 'investment', 'accountant', 'financial analyst']
  const businessScore = businessKeywords.filter(keyword => text.includes(keyword)).length
  
  // Traditional/Formal roles
  const traditionalKeywords = ['legal', 'lawyer', 'attorney', 'compliance', 'regulatory', 'government', 'public sector', 'law', 'legal counsel', 'paralegal']
  const traditionalScore = traditionalKeywords.filter(keyword => text.includes(keyword)).length
  
  // Minimal/Minimalist roles (design, creative, simple)
  const minimalKeywords = ['minimal', 'simple', 'clean', 'modern design', 'product designer', 'industrial design']
  const minimalScore = minimalKeywords.filter(keyword => text.includes(keyword)).length
  
  // Find highest score
  const scores = {
    tech: techScore,
    techstack: techScore,
    executive: executiveScore,
    executivesummary: executiveScore,
    creative: creativeScore,
    academic: academicScore,
    business: businessScore,
    professional: businessScore,
    traditional: traditionalScore,
    minimalist: minimalScore,
    minimalcolor: minimalScore,
  }
  
  // Get top recommendation
  const maxScore = Math.max(...Object.values(scores))
  
  if (maxScore === 0) {
    // Default recommendation - professional for most jobs
    return 'professional'
  }
  
  // Find template with highest score
  const recommended = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0]
  
  // Return specific template based on recommendation
  if (recommended === 'tech' || recommended === 'techstack') {
    // Prefer techstack for developer roles, tech for general tech
    return techScore > 3 ? 'techstack' : 'tech'
  }
  if (recommended === 'executive' || recommended === 'executivesummary') {
    // Prefer executivesummary for C-level, executive for directors/managers
    return executiveScore > 2 ? 'executivesummary' : 'executive'
  }
  if (recommended === 'creative') return 'creative'
  if (recommended === 'academic') return 'academic'
  if (recommended === 'business' || recommended === 'professional') {
    // Prefer professional for general business roles
    return 'professional'
  }
  if (recommended === 'traditional') return 'traditional'
  if (recommended === 'minimalist' || recommended === 'minimalcolor') {
    return 'minimalist'
  }
  
  return 'professional'
}

