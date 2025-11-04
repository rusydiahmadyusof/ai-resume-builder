# AI Resume Builder

A zero-cost web application that helps users create AI-generated, tailored resumes by combining personal details with job application information.

## Features

### Core Features
- 🤖 **AI-Powered Content Generation**: Uses Groq API (free tier) to tailor resume content to specific job descriptions
- 🎨 **20 Professional Templates**: Choose from 20 beautiful, modern resume templates with smart recommendations based on job type
- 📝 **Comprehensive Form System**: Multi-step form collecting personal info, work experience, education, skills, certifications, and languages
- 📄 **Enhanced PDF Export**: Download your resume as a professional PDF with quality, format, and orientation options
- 💾 **Local Storage**: All data saved locally in your browser - complete privacy with quota handling
- 🎯 **Job Targeting**: Optimize your resume for specific job applications
- ✨ **Modern UI/UX**: Beautiful, responsive design with smooth animations

### Advanced Features
- 📸 **Headshot Photo Support**: Upload and display professional photos in your resume
- 📋 **PDF Resume Import**: Upload your existing resume PDF to automatically extract and pre-fill personal information
- 🔗 **Job URL Extraction**: Automatically extract job title and description from job posting URLs
- 💾 **Resume Versioning**: Save and restore multiple versions of your resume
- 📤 **Export/Import**: Export your resume data as JSON for backup or import to restore
- 🔍 **Preview Controls**: Zoom, fullscreen, print preview, and statistics
- ⌨️ **Keyboard Shortcuts**: Navigate faster with keyboard shortcuts
- ✅ **Data Validation**: Comprehensive validation for email, phone, URLs, dates, and more
- 📊 **Progress Tracking**: Track your completion progress across all form sections
- 💾 **Auto-Save**: Automatic saving with visual indicators
- 🎨 **Template Recommendations**: AI-powered template suggestions based on job description

## Technology Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Routing**: React Router
- **AI**: Groq API (free tier)
- **PDF**: jsPDF + html2canvas
- **Storage**: localStorage API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Groq API key (free, no credit card required)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AIRESUME
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. Get your free Groq API key:
   - Visit [console.groq.com](https://console.groq.com/)
   - Sign up for a free account (no credit card required)
   - Navigate to [API Keys](https://console.groq.com/keys)
   - Create a new API key
   - Copy the key and paste it in your `.env` file

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Quick Start
1. **Fill in Personal Information**: 
   - Enter your name, contact details, and professional summary
   - Optional: Upload your existing resume PDF to auto-fill information
   - Optional: Upload a professional headshot photo
2. **Add Work Experience**: Enter your work history with detailed responsibilities (dates validated automatically)
3. **Add Education**: Include your educational background
4. **Add Skills**: List your relevant skills (duplicates prevented)
5. **Add Certifications & Languages**: Include any certifications and language proficiencies
6. **Enter Job Application Details**: 
   - Option 1: Paste job title and description manually
   - Option 2: Enter job posting URL to auto-extract information
7. **Generate AI Resume**: Click "Generate AI Resume" to get tailored content
8. **Choose Template**: Select from 20 available templates (recommended template highlighted)
9. **Preview & Download**: 
   - Use zoom controls to adjust preview
   - View resume statistics
   - Download PDF with quality and format options

### Advanced Features
- **Version Management**: Save multiple versions and restore as needed
- **Export/Import**: Export your resume data as JSON for backup
- **Keyboard Shortcuts**: Use Ctrl+Arrow keys for navigation, Ctrl+P for print, etc.
- **Progress Tracking**: See completion status for each section

## Project Structure

```
src/
  components/
    forms/          # Form components for data collection
    resume/         # Resume preview and template components
    ui/             # Reusable UI components
  services/         # API and utility services
  templates/        # Resume template CSS files
  hooks/            # Custom React hooks
  routes/           # Page components
```

## Environment Variables

- `VITE_GROQ_API_KEY`: Your Groq API key (required for AI features)

## Features in Detail

### AI Content Generation
The app uses Groq's LLM (Llama 3.3 70B) to:
- Generate tailored professional summaries
- Optimize work experience descriptions
- Match skills to job requirements
- Use relevant keywords from job descriptions
- Extract personal information from uploaded PDF resumes
- Extract job information from job posting URLs
- Recommend the best template based on job type

### Data Privacy & Storage
- All data stored locally in browser localStorage
- Auto-save with visual indicators
- Storage quota handling with helpful error messages
- Export/Import functionality for data portability
- No data sent to external servers except Groq API for AI features

### Resume Templates (20 Available)
- **Modern**: Clean and contemporary design with bold sections
- **Classic**: Traditional professional layout with elegant typography
- **Creative**: Eye-catching design perfect for creative industries
- **Minimalist**: Simple and focused design with plenty of white space
- **Professional**: Corporate business style with structured layout
- **Tech**: Modern tech-focused design with dark theme
- **Executive**: High-level professional with elegant gold accents
- **Academic**: Research and education focused with scholarly style
- **Bold**: Vibrant design with strong colors and dynamic layout
- **Elegant**: Refined typography with sophisticated styling
- **Contemporary**: Modern layout with contemporary aesthetics
- **Traditional**: Classic formal layout for conservative industries
- **Business**: Corporate style optimized for business roles
- **Clean**: Ultra-clean design with maximum readability
- **Sidebar**: Two-column layout with sidebar navigation
- **Two Column**: Balanced two-column professional layout
- **Compact**: Space-efficient design for extensive experience
- **Executive Summary**: Executive-focused with prominent summary
- **Tech Stack**: Technology-focused with skill emphasis
- **Minimal Color**: Minimalist with subtle color accents

All templates support headshot photos and are ATS-friendly with modern, trendy designs.

### Recent Updates
- ✅ **Phase 1 Complete**: Auto-save, date validation, error handling, progress tracking
- ✅ **Phase 2 Complete**: Export/Import, versioning, preview controls, PDF enhancements, keyboard shortcuts, validation improvements
- ✅ **Phase 3 Complete**: ATS optimization, cover letter generation, resume comparison, analytics dashboard, performance optimizations, accessibility improvements, dark mode, social sharing

## Deployment

### Vercel
1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variable `VITE_GROQ_API_KEY`
4. Deploy

### Netlify
1. Push your code to GitHub
2. Create a new site in Netlify
3. Connect your repository
4. Add environment variable `VITE_GROQ_API_KEY`
5. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for developers who want to create professional resumes without breaking the bank.

