# AI Resume Builder

A zero-cost web application that helps users create AI-generated, tailored resumes by combining personal details with job application information.

## Features

- 🤖 **AI-Powered Content Generation**: Uses Groq API (free tier) to tailor resume content to specific job descriptions
- 🎨 **Multiple Professional Templates**: Choose from 4 beautiful resume templates (Modern, Classic, Creative, Minimalist)
- 📝 **Comprehensive Form System**: Multi-step form collecting personal info, work experience, education, skills, certifications, and languages
- 📄 **PDF Export**: Download your resume as a professional PDF
- 💾 **Local Storage**: All data saved locally in your browser - complete privacy
- 🎯 **Job Targeting**: Optimize your resume for specific job applications
- ✨ **Modern UI/UX**: Beautiful, responsive design with smooth animations

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

1. **Fill in Personal Information**: Start by entering your name, contact details, and professional summary
2. **Add Work Experience**: Enter your work history with detailed responsibilities
3. **Add Education**: Include your educational background
4. **Add Skills**: List your relevant skills
5. **Add Certifications & Languages**: Include any certifications and language proficiencies
6. **Enter Job Application Details**: Provide the job title and description you're applying for
7. **Generate AI Resume**: Click "Generate AI Resume" to get tailored content
8. **Choose Template**: Select from available resume templates
9. **Download PDF**: Export your resume as a PDF

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
The app uses Groq's LLM to:
- Generate tailored professional summaries
- Optimize work experience descriptions
- Match skills to job requirements
- Use relevant keywords from job descriptions

### Resume Templates
- **Modern**: Clean and contemporary design with bold sections
- **Classic**: Traditional professional layout with elegant typography
- **Creative**: Eye-catching design perfect for creative industries
- **Minimalist**: Simple and focused design with plenty of white space

### Data Privacy
All data is stored locally in your browser using localStorage. No data is sent to external servers except for AI content generation (Groq API).

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

