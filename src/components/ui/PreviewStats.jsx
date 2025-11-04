function PreviewStats({ resumeData, generatedContent }) {
  const stats = {
    workExperience: resumeData.workExperience?.filter(exp => exp.company && exp.position).length || 0,
    education: resumeData.education?.filter(edu => edu.institution && edu.degree).length || 0,
    skills: resumeData.skills?.length || 0,
    certifications: resumeData.certifications?.filter(cert => cert.name).length || 0,
    languages: resumeData.languages?.filter(lang => lang.name).length || 0,
    hasPhoto: !!resumeData.personalInfo?.photo,
    hasSummary: !!(generatedContent?.summary || resumeData.personalInfo?.summary),
    hasGeneratedContent: !!generatedContent,
  }

  const totalItems = stats.workExperience + stats.education + stats.skills + stats.certifications + stats.languages

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Resume Statistics</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Work Experience:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{stats.workExperience}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Education:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{stats.education}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Skills:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{stats.skills}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Certifications:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{stats.certifications}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Languages:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{stats.languages}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{totalItems}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {stats.hasPhoto && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">Photo</span>
          )}
          {stats.hasSummary && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Summary</span>
          )}
          {stats.hasGeneratedContent && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">AI Generated</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PreviewStats

