import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Resume Builder
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Create professional, AI-tailored resumes in minutes
          </p>
          <p className="text-gray-500 mb-8">
            Zero cost. Powered by AI. Designed for your success.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/builder"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
          <Link
            to="/preview"
            className="inline-block border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all"
          >
            View Example
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">Tailor your resume to any job description using AI</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Templates</h3>
            <p className="text-sm text-gray-600">Choose from professional, modern designs</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Forever</h3>
            <p className="text-sm text-gray-600">No costs, no credit card required</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

