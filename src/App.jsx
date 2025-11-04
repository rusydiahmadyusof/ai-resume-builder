import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import Builder from './routes/Builder'
import Preview from './routes/Preview'

function App() {
  try {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
        </Routes>
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

