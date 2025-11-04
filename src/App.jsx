import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import Home from './routes/Home'
import Builder from './routes/Builder'
import Preview from './routes/Preview'

function App() {
  try {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
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
      </BrowserRouter>
    )
  } catch (error) {
    console.error('Error in App component:', error)
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error in App</h1>
        <p>{error.message}</p>
      </div>
    )
  }
}

export default App

