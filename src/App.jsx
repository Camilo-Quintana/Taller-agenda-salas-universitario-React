import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import EspaciosPage from './pages/EspaciosPage.jsx'
import NoEncontradoPage from './pages/NoEncontradoPage.jsx'
import { useReservas } from './hooks/useReservas.js'

function App() {
  const { reservas } = useReservas()
  const { pathname } = useLocation()

  // Cada vez que cambia la ruta, volvemos al inicio de la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <Navbar perfil={null} />
      <main className="app-contenido container">
        <Routes>
          <Route path="/" element={<EspaciosPage reservas={reservas} />} />
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App