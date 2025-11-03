import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import Builder from './routes/Builder'
import Preview from './routes/Preview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

