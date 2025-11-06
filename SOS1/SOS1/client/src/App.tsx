import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Setup from './pages/Setup'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
