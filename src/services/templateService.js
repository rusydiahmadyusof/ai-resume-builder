export const templates = {
  modern: {
    name: 'Modern',
    description: 'Clean and contemporary design with bold sections',
    file: 'modern.css',
  },
  classic: {
    name: 'Classic',
    description: 'Traditional professional layout with elegant typography',
    file: 'classic.css',
  },
  creative: {
    name: 'Creative',
    description: 'Eye-catching design perfect for creative industries',
    file: 'creative.css',
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Simple and focused design with plenty of white space',
    file: 'minimalist.css',
  },
  professional: {
    name: 'Professional',
    description: 'Corporate business style with structured layout',
    file: 'professional.css',
  },
  tech: {
    name: 'Tech',
    description: 'Modern tech-focused design with dark theme',
    file: 'tech.css',
  },
  executive: {
    name: 'Executive',
    description: 'High-level professional with elegant gold accents',
    file: 'executive.css',
  },
  academic: {
    name: 'Academic',
    description: 'Research and education focused with scholarly style',
    file: 'academic.css',
  },
  bold: {
    name: 'Bold',
    description: 'Vibrant design with strong colors and dynamic layout',
    file: 'bold.css',
  },
  elegant: {
    name: 'Elegant',
    description: 'Refined typography with sophisticated styling',
    file: 'elegant.css',
  },
  contemporary: {
    name: 'Contemporary',
    description: 'Modern and sleek with clean lines',
    file: 'contemporary.css',
  },
  traditional: {
    name: 'Traditional',
    description: 'Conservative black and white professional layout',
    file: 'traditional.css',
  },
  business: {
    name: 'Business',
    description: 'Formal corporate style with navy blue theme',
    file: 'business.css',
  },
  clean: {
    name: 'Clean',
    description: 'Minimalist structure with organized sections',
    file: 'clean.css',
  },
  sidebar: {
    name: 'Sidebar',
    description: 'Two-column layout with sidebar navigation',
    file: 'sidebar.css',
  },
  twocolumn: {
    name: 'Two Column',
    description: 'Balanced two-column content layout',
    file: 'twocolumn.css',
  },
  compact: {
    name: 'Compact',
    description: 'Space-efficient design maximizing content density',
    file: 'compact.css',
  },
  executivesummary: {
    name: 'Executive Summary',
    description: 'Emphasizes professional summary with prominent display',
    file: 'executivesummary.css',
  },
  techstack: {
    name: 'Tech Stack',
    description: 'Developer-focused with dark theme and code-style',
    file: 'techstack.css',
  },
  minimalcolor: {
    name: 'Minimal Color',
    description: 'Subtle design with minimal color accents',
    file: 'minimalcolor.css',
  },
}

export const templateService = {
  getTemplate: (templateName) => {
    return templates[templateName] || templates.modern
  },

  getAllTemplates: () => {
    return Object.keys(templates).map((key) => ({
      id: key,
      ...templates[key],
    }))
  },

  getTemplateCSS: (templateName) => {
    return templates[templateName]?.file || 'modern.css'
  },
}

