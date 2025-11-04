import { lazy, Suspense } from 'react'
import ResumeHeader from './ResumeHeader'
import ResumeSection from './ResumeSection'

// Lazy load template CSS files for better performance
const loadTemplateCSS = (templateName) => {
  try {
    return require(`../../templates/${templateName}.css`)
  } catch {
    return null
  }
}

// Preload commonly used templates
import '../../templates/modern.css'
import '../../templates/classic.css'
import '../../templates/professional.css'

function ResumePreview({ resumeData, selectedTemplate = 'modern', generatedContent }) {
  // Dynamically load template CSS if not already loaded
  React.useEffect(() => {
    const templateMap = {
      modern: () => import('../../templates/modern.css'),
      classic: () => import('../../templates/classic.css'),
      creative: () => import('../../templates/creative.css'),
      minimalist: () => import('../../templates/minimalist.css'),
      professional: () => import('../../templates/professional.css'),
      tech: () => import('../../templates/tech.css'),
      executive: () => import('../../templates/executive.css'),
      academic: () => import('../../templates/academic.css'),
      bold: () => import('../../templates/bold.css'),
      elegant: () => import('../../templates/elegant.css'),
      contemporary: () => import('../../templates/contemporary.css'),
      traditional: () => import('../../templates/traditional.css'),
      business: () => import('../../templates/business.css'),
      clean: () => import('../../templates/clean.css'),
      sidebar: () => import('../../templates/sidebar.css'),
      twocolumn: () => import('../../templates/twocolumn.css'),
      compact: () => import('../../templates/compact.css'),
      executivesummary: () => import('../../templates/executivesummary.css'),
      techstack: () => import('../../templates/techstack.css'),
      minimalcolor: () => import('../../templates/minimalcolor.css'),
    }

    const loader = templateMap[selectedTemplate]
    if (loader) {
      loader().catch(() => {
        // Fallback to modern if template fails to load
        console.warn(`Failed to load template: ${selectedTemplate}`)
      })
    }
  }, [selectedTemplate])

  // Use generated content if available, otherwise use original data
  const displayData = {
    personalInfo: resumeData.personalInfo,
    workExperience: generatedContent?.workExperience || resumeData.workExperience,
    education: resumeData.education,
    skills: generatedContent?.skills || resumeData.skills,
    certifications: resumeData.certifications,
    languages: resumeData.languages,
    summary: generatedContent?.summary || resumeData.personalInfo.summary,
  }

  const templateClass = `resume-${selectedTemplate}`
  const isSidebarTemplate = selectedTemplate === 'sidebar'

  return (
    <div className={`${templateClass} resume-container overflow-x-auto`}>
      <ResumeHeader personalInfo={displayData.personalInfo} />

      {isSidebarTemplate ? (
        <>
          <div className="resume-sidebar-content">
            {displayData.summary && (
              <ResumeSection title="Summary">
                <div className="summary">{displayData.summary}</div>
              </ResumeSection>
            )}

            {displayData.skills.length > 0 && (
              <ResumeSection title="Skills">
                <div className="skills-list">
                  {displayData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </ResumeSection>
            )}

            {displayData.certifications.length > 0 && (
              <ResumeSection title="Certifications">
                {displayData.certifications.map((cert, index) => (
                  <div key={cert.id || index} className="certification-item">
                    <strong>{cert.name || 'Certification'}</strong>
                    {cert.issuer && ` - ${cert.issuer}`}
                    {cert.date && ` (${cert.date})`}
                  </div>
                ))}
              </ResumeSection>
            )}

            {displayData.languages.length > 0 && (
              <ResumeSection title="Languages">
                {displayData.languages.map((lang, index) => (
                  <div key={lang.id || index} className="language-item">
                    <strong>{lang.name || 'Language'}</strong> - {lang.proficiency || 'Proficiency'}
                  </div>
                ))}
              </ResumeSection>
            )}
          </div>

          <div className="resume-body">
            {displayData.workExperience.length > 0 && (
              <ResumeSection title="Work Experience">
                {displayData.workExperience.map((exp, index) => (
                  <div key={exp.id || index} className="experience-item">
                    <h3>{exp.position || 'Position'}</h3>
                    <div className="company">{exp.company || 'Company'}</div>
                    <div className="date">
                      {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
                    </div>
                    {exp.responsibilities && (
                      <div className="responsibilities">{exp.responsibilities}</div>
                    )}
                  </div>
                ))}
              </ResumeSection>
            )}

            {displayData.education.length > 0 && (
              <ResumeSection title="Education">
                {displayData.education.map((edu, index) => (
                  <div key={edu.id || index} className="education-item">
                    <h3>{edu.degree || 'Degree'}</h3>
                    <div className="institution">{edu.institution || 'Institution'}</div>
                    {edu.field && <div className="field">{edu.field}</div>}
                    <div className="date">
                      {edu.startDate || 'Start'} - {edu.current ? 'Present' : edu.endDate || 'End'}
                    </div>
                  </div>
                ))}
              </ResumeSection>
            )}
          </div>
        </>
      ) : (
        <div className="resume-body">
        {displayData.summary && (
          <ResumeSection title="Professional Summary">
            <div className="summary">{displayData.summary}</div>
          </ResumeSection>
        )}

        {displayData.workExperience.length > 0 && (
          <ResumeSection title="Work Experience">
            {displayData.workExperience.map((exp, index) => (
              <div key={exp.id || index} className="experience-item">
                <h3>{exp.position || 'Position'}</h3>
                <div className="company">{exp.company || 'Company'}</div>
                <div className="date">
                  {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
                </div>
                {exp.responsibilities && (
                  <div className="responsibilities">{exp.responsibilities}</div>
                )}
              </div>
            ))}
          </ResumeSection>
        )}

        {displayData.education.length > 0 && (
          <ResumeSection title="Education">
            {displayData.education.map((edu, index) => (
              <div key={edu.id || index} className="education-item">
                <h3>{edu.degree || 'Degree'}</h3>
                <div className="institution">{edu.institution || 'Institution'}</div>
                {edu.field && <div className="field">{edu.field}</div>}
                <div className="date">
                  {edu.startDate || 'Start'} - {edu.current ? 'Present' : edu.endDate || 'End'}
                </div>
              </div>
            ))}
          </ResumeSection>
        )}

        {displayData.skills.length > 0 && (
          <ResumeSection title="Skills">
            <div className="skills-list">
              {displayData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </ResumeSection>
        )}

        {displayData.certifications.length > 0 && (
          <ResumeSection title="Certifications">
            {displayData.certifications.map((cert, index) => (
              <div key={cert.id || index} className="certification-item">
                <strong>{cert.name || 'Certification'}</strong>
                {cert.issuer && ` - ${cert.issuer}`}
                {cert.date && ` (${cert.date})`}
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2">
                    View
                  </a>
                )}
              </div>
            ))}
          </ResumeSection>
        )}

        {displayData.languages.length > 0 && (
          <ResumeSection title="Languages">
            {displayData.languages.map((lang, index) => (
              <div key={lang.id || index} className="language-item">
                <strong>{lang.name || 'Language'}</strong> - {lang.proficiency || 'Proficiency'}
              </div>
            ))}
          </ResumeSection>
        )}
        </div>
      )}
    </div>
  )
}

export default ResumePreview

