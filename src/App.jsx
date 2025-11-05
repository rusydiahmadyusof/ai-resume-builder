import { Routes, Route } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import Home from './routes/Home'
import Builder from './routes/Builder'
import Preview from './routes/Preview'

function App() {
  try {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error in App component:', error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error in App</h1>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    )
  }
}

export default App

