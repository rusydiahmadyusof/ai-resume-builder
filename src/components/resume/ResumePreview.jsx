import ResumeHeader from './ResumeHeader'
import ResumeSection from './ResumeSection'
import '../../templates/modern.css'
import '../../templates/classic.css'
import '../../templates/creative.css'
import '../../templates/minimalist.css'

function ResumePreview({ resumeData, selectedTemplate = 'modern', generatedContent }) {

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

  return (
    <div className={`${templateClass} resume-container`}>
      <ResumeHeader personalInfo={displayData.personalInfo} />

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
    </div>
  )
}

export default ResumePreview

