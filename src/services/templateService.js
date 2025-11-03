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

