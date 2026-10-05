import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import NoEncontradoPage from './pages/NoEncontradoPage.jsx'

function App() {
  return (
    <div className="app">
      <Navbar perfil={null} />
      <main className="app-contenido container">
        <Routes>
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App