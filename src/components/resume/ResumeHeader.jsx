function ResumeHeader({ personalInfo }) {
  const contactItems = []

  if (personalInfo.email) {
    contactItems.push(
      <a key="email" href={`mailto:${personalInfo.email}`}>
        {personalInfo.email}
      </a>
    )
  }

  if (personalInfo.phone) {
    contactItems.push(
      <span key="phone">{personalInfo.phone}</span>
    )
  }

  if (personalInfo.address) {
    contactItems.push(
      <span key="address">{personalInfo.address}</span>
    )
  }

  if (personalInfo.linkedin) {
    contactItems.push(
      <a key="linkedin" href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    )
  }

  if (personalInfo.github) {
    contactItems.push(
      <a key="github" href={personalInfo.github} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    )
  }

  if (personalInfo.portfolio) {
    contactItems.push(
      <a key="portfolio" href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">
        Portfolio
      </a>
    )
  }

  return (
    <div className="resume-header">
      <h1>{personalInfo.name || 'Your Name'}</h1>
      {contactItems.length > 0 && (
        <div className="contact-info">
          {contactItems.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResumeHeader

