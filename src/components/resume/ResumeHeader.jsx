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

  if (personalInfo.twitter) {
    contactItems.push(
      <a key="twitter" href={personalInfo.twitter} target="_blank" rel="noopener noreferrer">
        Twitter
      </a>
    )
  }

  if (personalInfo.instagram) {
    contactItems.push(
      <a key="instagram" href={personalInfo.instagram} target="_blank" rel="noopener noreferrer">
        Instagram
      </a>
    )
  }

  if (personalInfo.facebook) {
    contactItems.push(
      <a key="facebook" href={personalInfo.facebook} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
    )
  }

  if (personalInfo.youtube) {
    contactItems.push(
      <a key="youtube" href={personalInfo.youtube} target="_blank" rel="noopener noreferrer">
        YouTube
      </a>
    )
  }

  if (personalInfo.website) {
    contactItems.push(
      <a key="website" href={personalInfo.website} target="_blank" rel="noopener noreferrer">
        Website
      </a>
    )
  }

  return (
    <div className="resume-header">
      <div className="resume-header-content">
        <div className="resume-header-text">
          <h1>{personalInfo.name || 'Your Name'}</h1>
          {contactItems.length > 0 && (
            <div className="contact-info">
              {contactItems.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          )}
        </div>
        {personalInfo.photo && (
          <div className="resume-photo">
            <img src={personalInfo.photo} alt={personalInfo.name || 'Profile'} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeHeader

